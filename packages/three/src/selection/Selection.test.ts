import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { InputHost, InputRouter, NavigationBehavior, RaycastPicker, SelectBehavior, SelectionModel, ThreeDocument, ThreeEditor, ThreeView, keymaps, selectionKeymaps, navigationKeymaps } from '@io-gui/three'
import { BoxGeometry, BufferGeometry, LineSegments, Mesh, Object3D, Vector3 } from 'three/webgpu'

type Host = InputHost & {selection: SelectionModel}

function createHost(document: ThreeDocument, selection: SelectionModel): Host {
  const element = window.document.createElement('div') as unknown as Host
  const view = new ThreeView({overscan: 1})
  Object.assign(element, {view, scene: document.scene, selection, getViewCamera: () => view.getCamera(200, 100, document.scene)})
  element.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px'
  window.document.body.appendChild(element)
  return element
}

function box(x: number, name: string) {
  const mesh = new Mesh(new BoxGeometry(1, 1, 1))
  mesh.position.x = x
  mesh.name = name
  return mesh
}

describe('SelectionModel', () => {
  let document: ThreeDocument
  let selection: SelectionModel
  let a: Mesh, b: Mesh

  beforeEach(() => {
    document = new ThreeDocument()
    a = box(0, 'a')
    b = box(2, 'b')
    document.scene.add(a, b)
    selection = new SelectionModel({document})
    document.changeBus.drain()
  })

  afterEach(() => {
    selection.dispose()
    document.dispose()
  })

  it('commits an edit as one version bump and one change', () => {
    selection.edit().add(a.uuid).add(b.uuid).setActive(b.uuid).commit()
    expect(selection.version).toBe(1)
    expect(selection.ids()).toEqual([a.uuid, b.uuid])
    expect(selection.active).toBe(b.uuid)
    expect(selection.getActiveObject()).toBe(b)
    expect(document.changeBus.drain().map(change => change.kind)).toEqual(['selection'])

    expect(selection.edit().add(a.uuid).commit()).toBe(false)
    expect(selection.version).toBe(1)
    expect(document.changeBus.pending).toBe(false)
  })

  it('toggles, removes and clears, keeping active consistent', () => {
    selection.set([a.uuid, b.uuid])
    expect(selection.active).toBe(b.uuid)
    selection.edit().toggle(b.uuid).commit()
    expect(selection.ids()).toEqual([a.uuid])
    expect(selection.active).toBe('')
    selection.clear()
    expect(selection.size).toBe(0)
  })

  it('drops objects removed from the document and ignores missing ones', () => {
    selection.set([a.uuid, b.uuid])
    document.transact(tx => tx.remove(b))
    expect(selection.ids()).toEqual([a.uuid])

    document.scene.remove(a)
    expect(selection.getObjects()).toEqual([])
  })

  it('drops ids of objects removed outside a transaction after the lookup that missed them', async () => {
    selection.set([a.uuid, b.uuid])
    document.scene.remove(b)
    expect(selection.getObjects()).toEqual([a])
    expect(selection.ids()).toEqual([a.uuid, b.uuid])
    await Promise.resolve()
    expect(selection.ids()).toEqual([a.uuid])
    expect(selection.active).toBe('')
  })

  it('is kept per document by the editor', () => {
    const editor = new ThreeEditor({document})
    const first = editor.selection
    expect(first.document).toBe(document)
    first.set([a.uuid])
    const other = new ThreeDocument()
    editor.document = other
    expect(editor.selection.document).toBe(other)
    expect(editor.selection.size).toBe(0)
    editor.document = document
    expect(editor.selection).toBe(first)
    expect(editor.selection.ids()).toEqual([a.uuid])
    editor.dispose()
    other.dispose()
  })
})

describe('RaycastPicker and SelectBehavior', () => {
  let document: ThreeDocument
  let selection: SelectionModel
  let host: Host
  let router: InputRouter
  let left: Mesh, right: Mesh
  const picker = new RaycastPicker()

  beforeEach(() => {
    document = new ThreeDocument()
    left = box(-2, 'left')
    right = box(2, 'right')
    document.scene.add(left, right)
    document.scene.updateMatrixWorld(true)
    selection = new SelectionModel({document})
    host = createHost(document, selection)
    host.view.frame(document.scene)
    router = new InputRouter(host)
    router.add(new NavigationBehavior(host, keymaps.default))
    router.add(new SelectBehavior(host, keymaps.default))
  })

  afterEach(() => {
    router.dispose()
    host.view.dispose()
    host.remove()
    selection.dispose()
    document.dispose()
  })

  function screenOf(object: Object3D) {
    const point = object.getWorldPosition(new Vector3()).project(host.getViewCamera())
    return [(point.x + 1) / 2 * 200, (1 - point.y) / 2 * 100] as [number, number]
  }

  function click(at: [number, number], options: {shift?: boolean; ctrl?: boolean} = {}) {
    const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0, clientX: at[0], clientY: at[1], shiftKey: options.shift, ctrlKey: options.ctrl}
    host.dispatchEvent(new PointerEvent('pointerdown', init))
    host.dispatchEvent(new PointerEvent('pointerup', init))
  }

  const flush = () => new Promise(resolve => setTimeout(resolve, 0))

  it('picks the nearest visible object under the pointer', async () => {
    expect((await picker.pick(host, ...screenOf(left)))?.object).toBe(left)
    expect(await picker.pick(host, 100, 5)).toBe(null)
    left.visible = false
    expect(await picker.pick(host, ...screenOf(left))).toBe(null)
    left.visible = true
    left.layers.set(3)
    expect(await picker.pick(host, ...screenOf(left))).toBe(null)
    left.layers.set(0)
    left.userData.selectable = false
    expect(await picker.pick(host, ...screenOf(left))).toBe(null)
  })

  it('picks objects where they are now, even if no frame has drawn since they moved', async () => {
    const before = screenOf(left)
    left.position.y += 3
    const point = left.position.clone().project(host.getViewCamera())
    const after: [number, number] = [(point.x + 1) / 2 * 200, (1 - point.y) / 2 * 100]
    expect((await picker.pick(host, ...after))?.object).toBe(left)
    expect((await picker.pick(host, ...before))?.object).not.toBe(left)
  })

  it('hits lines only within a few pixels', async () => {
    const line = new LineSegments(new BufferGeometry().setFromPoints([new Vector3(0, -5, 0), new Vector3(0, 5, 0)]))
    document.scene.add(line)
    document.scene.updateMatrixWorld(true)
    const [x, y] = screenOf(line)
    expect((await picker.pick(host, x + 2, y))?.object).toBe(line)
    expect(await picker.pick(host, x + 15, y)).toBe(null)
  })

  it('picks every object whose projected bounds touch a rectangle', async () => {
    const [lx, ly] = screenOf(left)
    const hits = await picker.pickRect(host, {x0: lx - 5, y0: ly - 5, x1: lx + 5, y1: ly + 5})
    expect(hits.map(hit => hit.object)).toEqual([left])
    const all = await picker.pickRect(host, {x0: 0, y0: 0, x1: 200, y1: 100})
    expect(all.length).toBe(2)
  })

  it('selects on click even though LMB drag orbits (default keymap)', async () => {
    click(screenOf(left))
    await flush()
    expect(selection.ids()).toEqual([left.uuid])
    expect(selection.active).toBe(left.uuid)

    click(screenOf(right), {shift: true})
    await flush()
    expect(selection.ids()).toEqual([left.uuid, right.uuid])

    click(screenOf(left), {ctrl: true})
    await flush()
    expect(selection.ids()).toEqual([right.uuid])

    click([100, 5])
    await flush()
    expect(selection.size).toBe(0)
  })

  it('does not select after a drag', async () => {
    const [x, y] = screenOf(left)
    const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0}
    host.dispatchEvent(new PointerEvent('pointerdown', {...init, clientX: x, clientY: y}))
    host.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: x + 30, clientY: y}))
    host.dispatchEvent(new PointerEvent('pointerup', {...init, clientX: x + 30, clientY: y}))
    await flush()
    expect(selection.size).toBe(0)
  })

  it('box selects with Alt+LMB drag in the default keymap and LMB drag in Blender', async () => {
    const drag = (from: [number, number], to: [number, number], alt = false) => {
      const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0, altKey: alt}
      host.dispatchEvent(new PointerEvent('pointerdown', {...init, clientX: from[0], clientY: from[1]}))
      host.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: to[0], clientY: to[1]}))
      expect(host.querySelector('div')).not.toBe(null)
      host.dispatchEvent(new PointerEvent('pointerup', {...init, clientX: to[0], clientY: to[1]}))
      expect(host.querySelector('div')).toBe(null)
    }
    drag([1, 1], [199, 99], true)
    await flush()
    expect(selection.size).toBe(2)

    for (const behavior of router.behaviors) (behavior as {keymap?: unknown}).keymap = keymaps.blender
    selection.clear()
    const [rx, ry] = screenOf(right)
    drag([rx - 10, ry - 10], [rx + 10, ry + 10])
    await flush()
    expect(selection.ids()).toEqual([right.uuid])
  })

  it('selects all, none and inverts with keys; frames the selection', () => {
    for (const behavior of router.behaviors) (behavior as {keymap?: unknown}).keymap = keymaps.blender
    host.dispatchEvent(new PointerEvent('pointerenter'))
    const key = (code: string, init: KeyboardEventInit = {}) => window.document.body.dispatchEvent(new KeyboardEvent('keydown', {code, bubbles: true, ...init}))
    key('KeyA')
    expect(selection.size).toBe(2)
    key('KeyA', {altKey: true})
    expect(selection.size).toBe(0)
    selection.set([left.uuid])
    key('KeyI', {ctrlKey: true})
    expect(selection.ids()).toEqual([right.uuid])
    key('NumpadDecimal')
    expect(host.view.navigation.target.x).toBeCloseTo(2, 5)
    host.dispatchEvent(new PointerEvent('pointerleave'))
  })
})

describe('Router clicks', () => {
  it('offers clicks after a capture ends, but not after drags or multi-touch', () => {
    const host = createHost(new ThreeDocument(), null as unknown as SelectionModel)
    const router = new InputRouter(host)
    const clicks: number[] = []
    router.add({priority: 300, wantsCapture: () => true, begin() {}, update() {}, end() {}, cancel() {}})
    router.add({priority: 100, wantsCapture: () => false, begin() {}, update() {}, end() {}, cancel() {}, click: event => { clicks.push(event.button); return true }})
    const init = {bubbles: true, cancelable: true, button: 0}
    host.dispatchEvent(new PointerEvent('pointerdown', {...init, pointerId: 1, clientX: 10, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointerup', {...init, pointerId: 1, clientX: 12, clientY: 11}))
    expect(clicks).toEqual([0])

    host.dispatchEvent(new PointerEvent('pointerdown', {...init, pointerId: 1, clientX: 10, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointerup', {...init, pointerId: 1, clientX: 40, clientY: 10}))
    expect(clicks).toEqual([0])

    host.dispatchEvent(new PointerEvent('pointerdown', {...init, pointerId: 1, clientX: 10, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointerdown', {...init, pointerId: 2, clientX: 50, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointerup', {...init, pointerId: 2, clientX: 50, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointerup', {...init, pointerId: 1, clientX: 10, clientY: 10}))
    expect(clicks).toEqual([0])
    router.dispose()
    host.view.dispose()
    host.remove()
  })

  it('ships combined presets without conflicts', () => {
    for (const keymap of [...Object.values(keymaps), ...Object.values(selectionKeymaps), ...Object.values(navigationKeymaps)]) {
      expect(keymap.findConflicts()).toEqual([])
    }
  })
})
