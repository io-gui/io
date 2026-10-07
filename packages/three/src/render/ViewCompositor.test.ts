import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ACESFilmicToneMapping, AgXToneMapping, Mesh, NeutralToneMapping, NoToneMapping, PlaneGeometry, Texture, WebGPURenderer } from 'three/webgpu'
import { DirtyReason, ForwardPipeline, PipelineContext, SelectionModel, ThreeEditor, ThreeView, UVPipeline, ViewCompositor, ViewPipeline, buildUVGeometry, collectUVMeshes, registerPipeline } from '@io-gui/three'

type FakeRenderer = WebGPURenderer & {renders: unknown[]}

function fakeRenderer(): FakeRenderer {
  const renderer = {
    renders: [] as unknown[],
    toneMapping: NoToneMapping,
    toneMappingExposure: 1,
    setRenderTarget() {},
    setClearColor() {},
    clear() {},
    render(scene: unknown) { renderer.renders.push(scene) },
    getPixelRatio: () => 1,
  }
  return renderer as unknown as FakeRenderer
}

class ProbePipeline implements ViewPipeline {
  draws = 0
  toneMapping?: typeof AgXToneMapping
  readonly output = {color: new Texture(), depth: null}
  setSize() {}
  render() { this.draws++ }
  dispose() {}
}

let probe: ProbePipeline | null = null
registerPipeline({id: 'probe', create: () => (probe = new ProbePipeline())})

describe('ViewCompositor', () => {
  let editor: ThreeEditor
  let renderer: FakeRenderer
  let compositor: ViewCompositor
  let view: ThreeView

  function context(reasons: DirtyReason[], width = 100): PipelineContext {
    return {
      renderer, editor, document: editor.document, scene: editor.document.scene, view,
      camera: view.getCamera(width, 50, null), selection: editor.selection,
      width, height: 50, pixelRatio: 1, reasons: new Set(reasons), frame: {frame: 1, delta: 0, time: 0},
    }
  }

  beforeEach(() => {
    editor = new ThreeEditor()
    renderer = fakeRenderer()
    compositor = new ViewCompositor(renderer)
    view = new ThreeView()
  })

  afterEach(() => {
    compositor.dispose()
    view.dispose()
    editor.dispose()
  })

  it('creates the view kind\'s default pipeline, a named one, or forward for unknown ids', () => {
    compositor.syncPipeline(view)
    expect(compositor.pipeline).toBeInstanceOf(ForwardPipeline)
    view.kind = 'uv'
    compositor.syncPipeline(view)
    expect(compositor.pipeline).toBeInstanceOf(UVPipeline)
    view.pipeline = 'probe'
    compositor.syncPipeline(view)
    expect(compositor.pipeline).toBe(probe)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    view.pipeline = 'missing'
    compositor.syncPipeline(view)
    expect(compositor.pipeline).toBeInstanceOf(ForwardPipeline)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('creates overlays from the registry by view kind and flags', () => {
    const ids = () => compositor.overlays.map(overlay => overlay.root.name)
    compositor.syncOverlays(view)
    expect(ids()).toEqual(['SelectionOutlineOverlay', 'CameraFrameOverlay'])
    view.setOverlay('grid', true)
    view.setOverlay('cameraFrame', false)
    compositor.syncOverlays(view)
    expect(ids()).toEqual(['GridOverlay', 'SelectionOutlineOverlay'])
    view.kind = 'uv'
    compositor.syncOverlays(view)
    expect(ids()).toEqual([])
  })

  it('runs the pipeline only for content, view, resize and continuous; overlays alone reuse its output', () => {
    view.pipeline = 'probe'
    compositor.syncPipeline(view)
    compositor.render(context(['overlay']))
    expect(probe!.draws).toBe(1) // first draw has no output yet
    compositor.render(context(['overlay']))
    expect(probe!.draws).toBe(1)
    expect(renderer.renders.filter(scene => scene === compositor.scene).length).toBe(2)
    compositor.render(context(['view']))
    expect(probe!.draws).toBe(2)
    compositor.render(context(['overlay'], 120))
    expect(probe!.draws).toBe(3)
  })

  it('tone-maps with the view override, else the pipeline\'s, else the document\'s', () => {
    view.pipeline = 'probe'
    compositor.syncPipeline(view)
    editor.document.toneMapping = NeutralToneMapping
    compositor.render(context(['content']))
    expect(renderer.toneMapping).toBe(NeutralToneMapping)
    probe!.toneMapping = AgXToneMapping
    compositor.render(context(['content']))
    expect(renderer.toneMapping).toBe(AgXToneMapping)
    view.toneMapping = ACESFilmicToneMapping
    compositor.render(context(['content']))
    expect(renderer.toneMapping).toBe(ACESFilmicToneMapping)
  })

  it('redraws only overlays for selection changes, unless the pipeline says otherwise', () => {
    const source = editor.document
    compositor.syncPipeline(view)
    expect(compositor.listens({kind: 'selection', source})).toBe('overlay')
    expect(compositor.listens({kind: 'transform', source})).toBe('content')
    view.kind = 'uv'
    compositor.syncPipeline(view)
    expect(compositor.listens({kind: 'selection', source})).toBe('content')
    expect(compositor.listens({kind: 'transform', source})).toBe(false)
  })
})

describe('UVPipeline', () => {
  it('builds flat UV layouts of selected meshes and picks them as their meshes', async () => {
    const editor = new ThreeEditor()
    const plane = new Mesh(new PlaneGeometry(1, 1))
    plane.position.set(5, 5, 5)
    editor.document.scene.add(plane)
    expect(collectUVMeshes([editor.document.scene])).toEqual([plane])
    const flat = buildUVGeometry(plane.geometry)
    expect(flat.getAttribute('position').getX(1)).toBe(plane.geometry.getAttribute('uv').getX(1))
    expect(flat.getAttribute('position').getZ(1)).toBe(0)

    const view = new ThreeView({kind: 'uv', overscan: 1})
    view.frameUV()
    expect(view.navigation.axisView).toBe('front')
    expect(view.navigation.target.toArray()).toEqual([0.5, 0.5, 0])
    const selection: SelectionModel = editor.selection
    selection.set([plane.uuid])
    const pipeline = new UVPipeline()
    const renderer = fakeRenderer()
    pipeline.render({
      renderer, editor, document: editor.document, scene: editor.document.scene, view,
      camera: view.getCamera(100, 100, null), selection, width: 100, height: 100, pixelRatio: 1,
      reasons: new Set(['content']), frame: {frame: 1, delta: 0, time: 0},
    })
    expect(renderer.renders).toEqual([pipeline.uvScene])

    const host = document.createElement('div') as unknown as Parameters<UVPipeline['picker']['pick']>[0]
    Object.assign(host, {view, scene: editor.document.scene, getViewCamera: () => view.getCamera(200, 100, null)})
    ;(host as HTMLElement).style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px'
    document.body.appendChild(host)
    expect((await pipeline.picker.pick(host, 100, 50))?.object).toBe(plane)
    expect(await pipeline.picker.pick(host, 10, 50)).toBe(null)
    expect((await pipeline.picker.pickRect(host, {x0: 0, y0: 0, x1: 200, y1: 100})).map(hit => hit.object)).toEqual([plane])
    expect(await pipeline.picker.pickRect(host, {x0: 0, y0: 0, x1: 20, y1: 100})).toEqual([])

    host.remove()
    pipeline.dispose()
    view.dispose()
    editor.dispose()
  })
})
