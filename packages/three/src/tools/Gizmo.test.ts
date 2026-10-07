import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Behavior, BehaviorPriority, GizmoHost, GizmoLayer, InputRouter, ThreeEditor, ThreeView, TranslateGizmoGroup, closestPointOnLine } from '@io-gui/three'
import { Mesh, Ray, Vector3 } from 'three/webgpu'

type Host = GizmoHost & {tags: string[]}

/** 200x100 orthographic front view: x right, y up, about 0.0093 world units per pixel. */
function createHost(editor: ThreeEditor): Host {
  const element = document.createElement('div') as unknown as Host
  const view = new ThreeView({overscan: 1})
  view.setAxisView('front')
  const tags: string[] = []
  Object.assign(element, {
    view, editor, tags, scene: editor.document.scene, selection: editor.selection,
    getViewCamera: () => view.getCamera(200, 100, editor.document.scene),
    tag: (reason: string) => tags.push(reason),
  })
  Object.defineProperty(element, 'inputRouter', {value: new InputRouter(element)})
  element.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px'
  document.body.appendChild(element)
  return element
}

const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0}
function pointer(host: HTMLElement, type: string, x: number, y: number, button = 0) {
  host.dispatchEvent(new PointerEvent(type, {...init, button, clientX: x, clientY: y}))
}

describe('TranslateGizmoGroup and transform.translate', () => {
  let editor: ThreeEditor
  let mesh: Mesh
  let host: Host
  let layer: GizmoLayer
  let group: TranslateGizmoGroup
  let clicks: number

  beforeEach(() => {
    editor = new ThreeEditor()
    mesh = new Mesh()
    editor.document.scene.add(mesh)
    editor.selection.set([mesh.uuid])
    host = createHost(editor)
    layer = new GizmoLayer(host)
    group = new TranslateGizmoGroup()
    layer.setGroups([group])
    host.inputRouter.add(layer)
    clicks = 0
    const clickProbe: Behavior = {priority: BehaviorPriority.fallback, wantsCapture: () => false, begin() {}, update() {}, end() {}, cancel() {},
      click: () => { clicks++; return true }}
    host.inputRouter.add(clickProbe)
  })

  afterEach(() => {
    host.inputRouter.dispose()
    layer.dispose()
    host.view.dispose()
    host.remove()
    editor.dispose()
  })

  /** Pixel position of a world point in the host. */
  function toPixels(x: number, y: number, z = 0) {
    const p = new Vector3(x, y, z).project(host.getViewCamera())
    return [(p.x + 1) / 2 * 200, (1 - p.y) / 2 * 100]
  }

  it('hit-tests arrows and the center in screen space and highlights on hover', () => {
    const ctx = {editor, host, view: host.view, camera: host.getViewCamera(), width: 200, height: 100}
    group.refresh(ctx)
    group.drawPrepare(ctx)
    const [x, y] = toPixels(group.scale * 0.6, 0)
    const [xAxis, yAxis, zAxis, center] = group.gizmos
    expect(xAxis.hitTest(ctx, x, y)).toBeLessThan(1)
    expect(yAxis.hitTest(ctx, x, y)).toBe(Infinity)
    expect(zAxis.hitTest(ctx, x, y)).toBe(Infinity) // points at the viewer
    expect(center.hitTest(ctx, 100, 50)).toBe(0)
    pointer(host, 'pointermove', x, y + 3)
    expect(xAxis.highlight).toBe(true)
    expect(host.tags).toContain('overlay')
    pointer(host, 'pointermove', 20, 20)
    expect(xAxis.highlight).toBe(false)
  })

  it('drags along an arrow as one modal transaction and records the command', () => {
    group.refresh({editor, host, view: host.view, camera: host.getViewCamera(), width: 200, height: 100})
    group.drawPrepare({editor, host, view: host.view, camera: host.getViewCamera(), width: 200, height: 100})
    const [x0, y0] = toPixels(group.scale * 0.6, 0)
    const [x1] = toPixels(group.scale * 0.6 + 0.5, 0)
    pointer(host, 'pointerdown', x0, y0)
    expect(host.inputRouter.isModal).toBe(true)
    pointer(host, 'pointermove', x1, y0 + 20)
    expect(mesh.position.x).toBeCloseTo(0.5, 5)
    expect(mesh.position.y).toBe(0)
    pointer(host, 'pointerup', x1, y0 + 20)
    expect(host.inputRouter.isModal).toBe(false)
    expect(editor.document.history.length).toBe(1)
    expect(editor.operators.lastCommand?.name).toBe('transform.translate')
    expect(editor.operators.lastCommand?.args.axis).toBe('x')
    expect((editor.operators.lastCommand?.args.delta as number[])[0]).toBeCloseTo(0.5, 5)
    expect(clicks).toBe(0)

    // Repeat as a command, without a viewport.
    editor.operators.run('transform.translate', {delta: [0.5, 0, 0]})
    expect(mesh.position.x).toBeCloseTo(1, 5)
  })

  it('moves in the view plane from the center, switches axis with X / Y, cancels with Escape', () => {
    pointer(host, 'pointerdown', 100, 50)
    const [x, y] = toPixels(0.3, 0.2)
    pointer(host, 'pointermove', x, y)
    expect(mesh.position.x).toBeCloseTo(0.3, 5)
    expect(mesh.position.y).toBeCloseTo(0.2, 5)
    host.dispatchEvent(new PointerEvent('pointerenter'))
    document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyY', bubbles: true}))
    expect(mesh.position.x).toBe(0)
    expect(mesh.position.y).toBeCloseTo(0.2, 5)
    document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'Escape', bubbles: true}))
    host.dispatchEvent(new PointerEvent('pointerleave'))
    expect(mesh.position.toArray()).toEqual([0, 0, 0])
    expect(host.inputRouter.isModal).toBe(false)
    expect(editor.document.history.length).toBe(0)
  })

  it('a press on a gizmo without a drag neither moves, records, nor clicks through', () => {
    pointer(host, 'pointerdown', 100, 50)
    pointer(host, 'pointerup', 100, 50)
    expect(editor.document.history.length).toBe(0)
    expect(editor.operators.lastCommand).toBe(null)
    expect(clicks).toBe(0)
    pointer(host, 'pointerdown', 20, 20)
    pointer(host, 'pointerup', 20, 20)
    expect(clicks).toBe(1)
  })

  it('moves children of a selected parent once', () => {
    const child = new Mesh()
    mesh.add(child)
    editor.selection.set([mesh.uuid, child.uuid])
    editor.operators.run('transform.translate', {delta: [1, 0, 0]})
    expect(mesh.position.x).toBe(1)
    expect(child.position.x).toBe(0)
  })

  it('hides when nothing is selected or in other modes', () => {
    const ctx = {editor, host, view: host.view, camera: host.getViewCamera(), width: 200, height: 100}
    expect(group.poll(ctx)).toBe(true)
    editor.mode = 'edit'
    expect(group.poll(ctx)).toBe(false)
    editor.mode = 'object'
    editor.selection.clear()
    expect(group.poll(ctx)).toBe(false)
  })
})

describe('closestPointOnLine', () => {
  it('finds the point on a line nearest to a ray, and rejects parallel rays', () => {
    const out = new Vector3()
    const ray = new Ray(new Vector3(2, 5, 3), new Vector3(0, 0, -1))
    expect(closestPointOnLine(new Vector3(), new Vector3(1, 0, 0), ray, out)).toBe(true)
    expect(out.toArray()).toEqual([2, 0, 0])
    expect(closestPointOnLine(new Vector3(), new Vector3(0, 0, 1), ray, out)).toBe(false)
  })
})

