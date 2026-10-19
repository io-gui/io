import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { ThreeViewport, Document, Editor, View, renderScheduler, NavigationBehavior, navigationKeymaps } from '@io-gui/three'
import { BoxGeometry, Mesh, PerspectiveCamera, WebGPURenderer } from 'three/webgpu'

describe('ThreeViewport', () => {
  let editor: Editor
  let container: HTMLElement

  beforeEach(() => {
    editor = new Editor()
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    editor.dispose()
  })

  it('routes input through its router: gizmos (when on), navigation, then selection', () => {
    const viewport = new ThreeViewport({ editor })
    expect(viewport.navigationBehavior).toBeInstanceOf(NavigationBehavior)
    expect(viewport.inputRouter.behaviors).toEqual([viewport.navigationBehavior, viewport.selectBehavior])
    viewport.view.setOverlay('gizmos', true)
    expect(viewport.inputRouter.behaviors).toEqual([viewport.gizmoLayer, viewport.navigationBehavior, viewport.selectBehavior])
    viewport.keymap = navigationKeymaps.blender
    expect(viewport.navigationBehavior.keymap).toBe(navigationKeymaps.blender)
    viewport.dispose()
  })

  it('owns a default view, or shows a given one without owning it', () => {
    const own = new ThreeViewport({ editor })
    expect(own.view).toBeInstanceOf(View)
    const ownView = own.view
    own.dispose()
    expect(ownView._disposed).toBe(true)

    const view = new View()
    const shared = new ThreeViewport({ editor, view })
    expect(shared.view).toBe(view)
    shared.dispose()
    expect(view._disposed).toBeFalsy()
    view.dispose()
  })

  it('switches to a named scene camera once it is added to the scene', () => {
    const viewport = new ThreeViewport({ editor, view: new View().setCameraView('name:late') })
    expect(viewport.view.navigation.cameraSource).toBe(null)
    const late = new PerspectiveCamera()
    late.name = 'late'
    editor.document.scene.add(late)
    viewport.getViewCamera()
    expect(viewport.view.navigation.cameraSource).toBe(late.uuid)
    viewport.view.dispose()
    viewport.dispose()
  })

  it('frames the scene once for a new view, but keeps a restored view as is', () => {
    editor.document.scene.add(new Mesh(new BoxGeometry(2, 2, 2)))
    editor.document.scene.children[0].position.set(10, 0, 0)
    editor.document.scene.updateMatrixWorld(true)
    const fresh = new ThreeViewport({ editor })
    expect(fresh.view.navigation.target.x).toBeCloseTo(10, 5)

    const view = new View().applyJSON({navigation: {target: [1, 2, 3], distance: 5}})
    const restored = new ThreeViewport({ editor, view })
    expect(view.navigation.target.toArray()).toEqual([1, 2, 3])
    expect(view.navigation.distance).toBe(5)
    fresh.dispose()
    restored.dispose()
    view.dispose()
  })

  it('keeps navigation when a view moves to a new viewport element', async () => {
    const view = new View()
    const first = new ThreeViewport({ editor, view })
    container.appendChild(first as Node)
    view.setAxisView('front')
    view.navigation.target.set(4, 5, 6)
    const before = JSON.stringify(view.toJSON())
    first.remove()
    first.dispose()

    const second = new ThreeViewport({ editor, view })
    container.appendChild(second as Node)
    await nextFrame()
    expect(JSON.stringify(second.view.toJSON())).toBe(before)
    second.remove()
    second.dispose()
    view.dispose()
  })

  it('tags itself for redraw when its view navigation changes', () => {
    const viewport = new ThreeViewport({ editor })
    container.appendChild(viewport as Node)
    renderScheduler.step()
    expect(renderScheduler.getTags(viewport).has('view')).toBe(false)
    viewport.view.setAxisView('top')
    expect(renderScheduler.getTags(viewport).has('view')).toBe(true)
    viewport.remove()
    viewport.dispose()
  })

  it('redraws every viewport of a view on camera moves without a reactive mutation', () => {
    const view = new View()
    const a = new ThreeViewport({ editor, view })
    const b = new ThreeViewport({ editor, view })
    container.append(a as Node, b as Node)
    renderScheduler.step()
    let mutations = 0
    const count = () => { mutations++ }
    view.addEventListener('io-mutation', count)
    window.addEventListener('io-mutation', count)
    view.navigation.orbit(0.1, 0)
    view.markNavigationChanged()
    window.removeEventListener('io-mutation', count)
    expect(mutations).toBe(0)
    expect(renderScheduler.getTags(a).has('view')).toBe(true)
    expect(renderScheduler.getTags(b).has('view')).toBe(true)

    a.remove()
    a.dispose()
    renderScheduler.step()
    view.markNavigationChanged()
    expect(renderScheduler.getTags(b).has('view')).toBe(true)
    b.remove()
    b.dispose()
    view.dispose()
  })

  it('frames the document\'s editor frame target, also in a viewport made after it loaded', () => {
    const floor = new Mesh(new BoxGeometry(100, 1, 100))
    floor.position.set(50, 0, 0)
    const model = new Mesh(new BoxGeometry(1, 1, 1))
    model.position.set(-20, 0, 0)
    editor.document.scene.add(floor, model)
    editor.document.scene.updateMatrixWorld(true)
    editor.document.getEditorFrameTarget = () => model
    const viewport = new ThreeViewport({ editor })
    expect(viewport.view.navigation.target.x).toBeCloseTo(-20, 5)
    viewport.dispose()
  })

  it('uses a shared default renderer when none is provided', async () => {
    const viewportA = new ThreeViewport({ editor })
    const viewportB = new ThreeViewport({ editor })
    container.appendChild(viewportA as Node)
    container.appendChild(viewportB as Node)
    await nextFrame()

    expect(viewportA.renderer).toBeInstanceOf(WebGPURenderer)
    expect(viewportB.renderer).toBe(viewportA.renderer)
    expect(viewportA.renderer.backend).toBeTruthy()

    viewportA.remove()
    viewportB.remove()
    viewportA.dispose()
    viewportB.dispose()
  })

  it('uses a custom renderer when provided', async () => {
    const renderer = new WebGPURenderer({antialias: false, alpha: true})
    void renderer.init()
    const viewport = new ThreeViewport({ editor, renderer })
    container.appendChild(viewport as Node)
    await nextFrame()

    expect(viewport.renderer).toBe(renderer)

    viewport.remove()
    viewport.dispose()
    renderer.dispose()
  })

  it('registers with the render scheduler while connected', async () => {
    const viewport = new ThreeViewport({ editor })
    expect(renderScheduler.isRegistered(viewport)).toBe(false)
    container.appendChild(viewport as Node)
    expect(renderScheduler.isRegistered(viewport)).toBe(true)
    expect(renderScheduler.getTags(viewport).has('content')).toBe(true)

    viewport.remove()
    expect(renderScheduler.isRegistered(viewport)).toBe(false)
    viewport.dispose()
  })

  it('listens only to changes from its editor\'s active document', () => {
    const other = new Editor()
    const viewport = new ThreeViewport({ editor })
    expect(viewport.editor).toBe(editor)
    expect(viewport.document).toBe(editor.document)
    expect(viewport.scene).toBe(editor.document.scene)
    expect(viewport.listens({kind: 'transform', source: editor.document})).toBe('content')
    expect(viewport.listens({kind: 'selection', source: editor.document})).toBe('overlay')
    expect(viewport.listens({kind: 'transform', source: other.document})).toBe(false)
    other.dispose()
    viewport.dispose()
  })

  it('rebuilds tool behaviors with the new view when the view is swapped', () => {
    const editor = new Editor()
    const views: View[] = []
    editor.tools.register({id: 'probe', label: 'Probe', viewKinds: ['3d'], modes: ['object'], createBehaviors: ctx => { views.push(ctx.view); return [] }})
    editor.setActiveTool('3d', 'object', 'probe')
    const viewport = new ThreeViewport({ editor })
    const next = new View()
    viewport.view = next
    expect(views.at(-1)).toBe(next)
    viewport.dispose()
    next.dispose()
    editor.dispose()
  })

  it('installs the editor\'s active tool according to the view profile', () => {
    const editor = new Editor()
    const behavior = {priority: 500, wantsCapture: () => false, begin() {}, update() {}, end() {}, cancel() {}}
    let created = 0
    editor.tools.register({id: 'probe', label: 'Probe', viewKinds: ['3d'], modes: ['object'], createBehaviors: () => { created++; return [behavior] }})
    const viewport = new ThreeViewport({ editor, view: new View({overlays: {gizmos: true}}) })
    expect(viewport.inputRouter.behaviors).not.toContain(behavior)

    editor.setActiveTool('3d', 'object', 'probe')
    expect(viewport.inputRouter.behaviors).toContain(behavior)
    expect(created).toBe(1)

    editor.mode = 'edit'
    expect(viewport.inputRouter.behaviors).not.toContain(behavior)
    editor.mode = 'object'
    expect(viewport.inputRouter.behaviors).toContain(behavior)

    viewport.view.profile = 'select'
    expect(viewport.inputRouter.behaviors).toEqual([viewport.navigationBehavior, viewport.selectBehavior])
    viewport.view.profile = 'navigate'
    expect(viewport.inputRouter.behaviors).toEqual([viewport.navigationBehavior])
    viewport.view.profile = 'none'
    expect(viewport.inputRouter.behaviors).toEqual([])
    viewport.view.profile = 'full'
    expect(viewport.inputRouter.behaviors).toEqual([viewport.gizmoLayer, behavior, viewport.navigationBehavior, viewport.selectBehavior])
    viewport.dispose()
    editor.dispose()
  })

  it('shows the new document after a switch and restores each document\'s navigation', () => {
    const editor = new Editor()
    const first = editor.document
    first.scene.add(new Mesh(new BoxGeometry(1, 1, 1)))
    const second = new Document()
    const far = new Mesh(new BoxGeometry(1, 1, 1))
    far.position.set(50, 0, 0)
    second.scene.add(far)
    second.scene.updateMatrixWorld(true)

    const viewport = new ThreeViewport({ editor })
    viewport.view.navigation.target.set(1, 2, 3)
    editor.document = second
    expect(viewport.scene).toBe(second.scene)
    expect(viewport.view.navigation.target.x).toBeCloseTo(50, 5)

    editor.document = first
    expect(viewport.view.navigation.target.toArray()).toEqual([1, 2, 3])
    viewport.dispose()
    editor.dispose()
    second.dispose()
  })

  it('is not renderable while hidden or zero-sized', async () => {
    const viewport = new ThreeViewport({ editor })
    container.appendChild(viewport as Node)
    await nextFrame()
    // container is display:none, so the viewport has no size and is not intersecting
    expect(viewport.isRenderable()).toBe(false)
    viewport.remove()
    viewport.dispose()
  })
})
