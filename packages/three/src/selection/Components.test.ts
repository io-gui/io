import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ComponentPicker, IdBufferSource, IdComponentPicker, InputHost, InputRouter, SelectBehavior, SelectionModel, ThreeDocument, ThreeEditor, ThreeView, UVComponentPicker, getTopology, keymaps } from '@io-gui/three'
import { BoxGeometry, Mesh, Object3D, PlaneGeometry, Raycaster, Vector2, Vector3 } from 'three/webgpu'

const WIDTH = 200
const HEIGHT = 100

type Host = InputHost & {selection: SelectionModel; editor: ThreeEditor; mode: string; componentPicker: ComponentPicker}

function createHost(editor: ThreeEditor, view: ThreeView, componentPicker: ComponentPicker): Host {
  const element = window.document.createElement('div') as unknown as Host
  Object.defineProperties(element, {
    view: {value: view},
    editor: {value: editor},
    scene: {get: () => editor.document.scene},
    selection: {get: () => editor.selection},
    mode: {get: () => editor.mode},
    componentPicker: {value: componentPicker},
    getViewCamera: {value: () => view.getCamera(WIDTH, HEIGHT, editor.document.scene)},
  })
  element.style.cssText = `position:fixed;left:0;top:0;width:${WIDTH}px;height:${HEIGHT}px`
  window.document.body.appendChild(element)
  return element
}

/** An ID buffer built by raycasting every pixel: what the GPU pass draws, without a GPU. */
const raycastSource: IdBufferSource = (host, camera, objects, width, height) => {
  const raycaster = new Raycaster()
  const ndc = new Vector2()
  const meshes: Object3D[] = []
  host.scene!.traverseVisible(object => { if ((object as Mesh).isMesh) meshes.push(object) })
  const stride = width * 4
  const data = new Float32Array(stride * height)
  const view = new Vector3()
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ndc.set(((x + 0.5) / width) * 2 - 1, -((y + 0.5) / height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObjects(meshes, false)[0]
      if (!hit) continue
      const slot = objects.indexOf(hit.object) + 1
      const offset = y * stride + x * 4
      data[offset] = slot
      data[offset + 1] = slot ? hit.faceIndex! + 1 : 0
      data[offset + 2] = -view.copy(hit.point).applyMatrix4(camera.matrixWorldInverse).z
      data[offset + 3] = 1
    }
  }
  return Promise.resolve({width, height, stride, data, objects})
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

describe('SelectionModel components', () => {
  let document: ThreeDocument
  let selection: SelectionModel
  let mesh: Mesh

  beforeEach(() => {
    document = new ThreeDocument()
    mesh = new Mesh(new BoxGeometry(1, 1, 1))
    document.scene.add(mesh)
    selection = new SelectionModel({document})
    document.changeBus.drain()
  })

  afterEach(() => {
    selection.dispose()
    document.dispose()
  })

  it('commits component edits as one version bump, copying on write', () => {
    const edit = selection.edit()
    edit.components(mesh.uuid, 'point', 8).add(1).add(2)
    edit.setDomain('point')
    expect(selection.getComponents(mesh.uuid, 'point')).toBe(undefined)
    expect(edit.commit()).toBe(true)
    expect(selection.version).toBe(1)
    expect(selection.domain).toBe('point')
    expect(selection.getComponents(mesh.uuid)!.toArray()).toEqual([1, 2])
    expect(document.changeBus.drain().map(change => change.ids)).toEqual([[mesh.uuid]])

    const before = selection.getComponents(mesh.uuid)!
    const second = selection.edit()
    second.components(mesh.uuid, 'point', 8).add(1)
    expect(second.commit()).toBe(false)
    expect(selection.getComponents(mesh.uuid)).toBe(before)

    selection.edit().components(mesh.uuid, 'point', 8).delete(1)
    expect(before.toArray()).toEqual([1, 2])
  })

  it('replaces sets made for another domain size and drops empty ones', () => {
    const first = selection.edit()
    first.components(mesh.uuid, 'point', 8).add(3)
    first.commit()
    expect(selection.componentIds('point')).toEqual([mesh.uuid])
    const edit = selection.edit()
    expect(edit.components(mesh.uuid, 'point', 4).count()).toBe(0)
    edit.commit()
    expect(selection.componentIds()).toEqual([])
  })

  it('clears components of objects removed from the document', () => {
    const edit = selection.edit().add(mesh.uuid)
    edit.components(mesh.uuid, 'edge', 18).fill()
    edit.commit()
    document.transact(tx => tx.remove(mesh))
    expect(selection.componentIds()).toEqual([])
    expect(selection.size).toBe(0)
  })
})

describe('Component picking and edit mode', () => {
  let editor: ThreeEditor
  let view: ThreeView
  let host: Host
  let router: InputRouter
  let mesh: Mesh
  let picker: IdComponentPicker

  beforeEach(() => {
    editor = new ThreeEditor()
    mesh = new Mesh(new BoxGeometry(1, 1, 1))
    editor.document.scene.add(mesh)
    editor.document.scene.updateMatrixWorld(true)
    view = new ThreeView({overscan: 1})
    view.navigation.setDirection(new Vector3(1, 0.6, 0.8))
    view.frame(mesh, 1.5)
    picker = new IdComponentPicker({source: raycastSource})
    host = createHost(editor, view, picker)
    router = new InputRouter(host)
    router.add(new SelectBehavior(host, keymaps.blender))
    editor.selection.set([mesh.uuid])
  })

  afterEach(() => {
    router.dispose()
    host.remove()
    view.dispose()
    editor.dispose()
  })

  function project(local: Vector3) {
    const point = local.clone().applyMatrix4(mesh.matrixWorld).project(host.getViewCamera())
    return [(point.x + 1) / 2 * WIDTH, (1 - point.y) / 2 * HEIGHT] as [number, number]
  }

  /** The corner pointing away from the camera, hidden behind the box. */
  function hiddenPoint() {
    const topology = getTopology(mesh.geometry, 'mesh')
    for (let p = 0; p < topology.pointCount; p++) {
      const position = new Vector3().fromArray(topology.pointPositions, p * 3)
      if (position.x < 0 && position.y < 0 && position.z < 0) return {index: p, position}
    }
    throw new Error('no hidden corner')
  }

  const key = (code: string, init: KeyboardEventInit = {}) => window.document.body.dispatchEvent(new KeyboardEvent('keydown', {code, bubbles: true, cancelable: true, ...init}))

  it('enters edit mode with Tab and switches select mode with 1 / 2 / 3, converting the selection', () => {
    host.dispatchEvent(new PointerEvent('pointerenter'))
    key('Tab')
    expect(editor.mode).toBe('edit')
    expect(editor.selection.domain).toBe('point')
    expect(editor.operators.lastCommand?.name).toBe('object.editmode_toggle')

    const edit = editor.selection.edit()
    // Every point of the +x side.
    const topology = getTopology(mesh.geometry, 'mesh')
    for (let p = 0; p < topology.pointCount; p++) if (topology.pointPositions[p * 3] > 0) edit.components(mesh.uuid, 'point', topology.pointCount).add(p)
    edit.commit()

    key('Digit3')
    expect(editor.selection.domain).toBe('primitive')
    expect(editor.selection.getComponents(mesh.uuid)!.count()).toBe(2)
    expect(editor.operators.lastCommand).toEqual({name: 'mesh.select_mode', args: {domain: 'primitive'}})
    key('Digit2')
    expect(editor.selection.getComponents(mesh.uuid)!.count()).toBe(5)

    key('Tab')
    expect(editor.mode).toBe('object')
    expect(editor.selection.domain).toBe('object')
    key('Tab')
    expect(editor.selection.domain).toBe('edge')
    host.dispatchEvent(new PointerEvent('pointerleave'))
  })

  it('does not enter edit mode without a selected mesh, letting Tab through', () => {
    editor.selection.clear()
    host.dispatchEvent(new PointerEvent('pointerenter'))
    const event = new KeyboardEvent('keydown', {code: 'Tab', bubbles: true, cancelable: true})
    window.document.body.dispatchEvent(event)
    expect(editor.mode).toBe('object')
    expect(event.defaultPrevented).toBe(false)
    host.dispatchEvent(new PointerEvent('pointerleave'))
  })

  it('picks visible points and skips hidden ones unless x-ray', async () => {
    editor.operators.run('object.editmode_toggle')
    const hidden = hiddenPoint()
    const [hx, hy] = project(hidden.position)
    const hits = await picker.pick(host, hx, hy)
    expect(hits.map(hit => hit.index)).not.toContain(hidden.index)

    const front = new Vector3(0.5, 0.5, 0.5)
    const [fx, fy] = project(front)
    const frontHits = await picker.pick(host, fx + 2, fy)
    expect(frontHits.length).toBe(1)
    expect(frontHits[0]).toMatchObject({uuid: mesh.uuid, domain: 'point', size: 8})

    view.xray = true
    expect((await picker.pick(host, hx, hy)).map(hit => hit.index)).toEqual([hidden.index])

    view.xray = false
    const all = await picker.pickRect(host, {x0: 0, y0: 0, x1: WIDTH, y1: HEIGHT})
    expect(all.length).toBe(7)
    view.xray = true
    expect((await picker.pickRect(host, {x0: 0, y0: 0, x1: WIDTH, y1: HEIGHT})).length).toBe(8)
  })

  it('picks the front face from the ID buffer and edges near the pointer', async () => {
    editor.operators.run('object.editmode_toggle')
    editor.operators.run('mesh.select_mode', {domain: 'primitive'})
    // Center of the +x side.
    const [x, y] = project(new Vector3(0.5, 0.1, 0.1))
    const [hit] = await picker.pick(host, x, y)
    expect(hit.domain).toBe('primitive')
    const topology = getTopology(mesh.geometry, 'mesh')
    for (let k = 0; k < 3; k++) expect(topology.pointPositions[topology.vertexToPoint[topology.corners[hit.index * 3 + k]] * 3]).toBeCloseTo(0.5)
    expect(await picker.pick(host, 2, 2)).toEqual([])

    editor.operators.run('mesh.select_mode', {domain: 'edge'})
    const [ex, ey] = project(new Vector3(0.5, 0.5, 0))
    const [edge] = await picker.pick(host, ex, ey + 1)
    expect(edge.domain).toBe('edge')
    const a = topology.edgePoints[edge.index * 2], b = topology.edgePoints[edge.index * 2 + 1]
    expect(topology.pointPositions[a * 3] + topology.pointPositions[b * 3]).toBeCloseTo(1)
    expect(topology.pointPositions[a * 3 + 1] + topology.pointPositions[b * 3 + 1]).toBeCloseTo(1)
  })

  it('selects components with clicks, Shift toggles, and A / Alt+A select all and none', async () => {
    editor.operators.run('object.editmode_toggle')
    const click = (at: [number, number], options: {shift?: boolean} = {}) => {
      const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0, clientX: at[0], clientY: at[1], shiftKey: options.shift}
      host.dispatchEvent(new PointerEvent('pointerdown', init))
      host.dispatchEvent(new PointerEvent('pointerup', init))
    }
    click(project(new Vector3(0.5, 0.5, 0.5)))
    await flush()
    expect(editor.selection.getComponents(mesh.uuid)!.count()).toBe(1)
    click(project(new Vector3(0.5, -0.5, 0.5)), {shift: true})
    await flush()
    expect(editor.selection.getComponents(mesh.uuid)!.count()).toBe(2)
    click(project(new Vector3(0.5, -0.5, 0.5)), {shift: true})
    await flush()
    expect(editor.selection.getComponents(mesh.uuid)!.count()).toBe(1)
    // Object selection is untouched in edit mode.
    expect(editor.selection.ids()).toEqual([mesh.uuid])

    host.dispatchEvent(new PointerEvent('pointerenter'))
    key('KeyA')
    expect(editor.selection.getComponents(mesh.uuid)!.count()).toBe(8)
    key('KeyA', {altKey: true})
    expect(editor.selection.getComponents(mesh.uuid)).toBe(undefined)
    host.dispatchEvent(new PointerEvent('pointerleave'))

    click([2, 2])
    await flush()
    expect(editor.selection.componentIds()).toEqual([])
  })

  it('reuses the ID buffer until the camera or content changes', async () => {
    let reads = 0
    const counting = new IdComponentPicker({source: (...args) => { reads++; return raycastSource(...args) }})
    editor.operators.run('object.editmode_toggle')
    const at = project(new Vector3(0.5, 0.5, 0.5))
    await counting.pick(host, ...at)
    await counting.pick(host, ...at)
    expect(reads).toBe(1)
    counting.invalidate()
    await counting.pick(host, ...at)
    expect(reads).toBe(2)
    view.navigation.orbit(0.1, 0)
    view.markNavigationChanged()
    await counting.pick(host, ...at)
    expect(reads).toBe(3)
  })
})

describe('UV component picking', () => {
  let editor: ThreeEditor
  let view: ThreeView
  let host: Host
  let mesh: Mesh
  const picker = new UVComponentPicker()

  beforeEach(() => {
    editor = new ThreeEditor()
    // 2x1 segments: 6 points, 4 triangles, UVs spanning 0..1.
    mesh = new Mesh(new PlaneGeometry(2, 1, 2, 1))
    editor.document.scene.add(mesh)
    view = new ThreeView({kind: 'uv'})
    host = createHost(editor, view, picker)
    view.frameUV(1)
    editor.selection.set([mesh.uuid])
    editor.operators.run('object.editmode_toggle')
  })

  afterEach(() => {
    host.remove()
    view.dispose()
    editor.dispose()
  })

  function uvToScreen(u: number, v: number) {
    const point = new Vector3(u, v, 0).project(host.getViewCamera())
    return [(point.x + 1) / 2 * WIDTH, (1 - point.y) / 2 * HEIGHT] as [number, number]
  }

  it('shows only faces selected in 3D and stores corners without uvSync', async () => {
    expect(picker.domain(host)).toBe('corner')
    expect(await picker.pick(host, ...uvToScreen(0.5, 1))).toEqual([])

    const topology = getTopology(mesh.geometry, 'mesh')
    const edit = editor.selection.edit()
    edit.components(mesh.uuid, 'primitive', topology.primitiveCount).fill()
    edit.setDomain('primitive').commit()
    editor.operators.run('mesh.select_mode', {domain: 'point'})

    // The middle top UV vertex is shared by three corners (two triangles on the left, one on the right).
    const hits = await picker.pick(host, ...uvToScreen(0.5, 1))
    expect(hits.length).toBeGreaterThan(1)
    expect(new Set(hits.map(hit => topology.corners[hit.index])).size).toBe(1)
    expect(hits.every(hit => hit.domain === 'corner' && hit.size === topology.cornerCount)).toBe(true)

    editor.operators.run('mesh.select_mode', {domain: 'primitive'})
    const face = await picker.pick(host, ...uvToScreen(0.2, 0.2))
    expect(face.length).toBe(3)
    expect(new Set(face.map(hit => Math.floor(hit.index / 3))).size).toBe(1)
  })

  it('maps picks to mesh domains with uvSync', async () => {
    editor.selection.uvSync = true
    expect(picker.domain(host)).toBe('point')
    const [hit] = await picker.pick(host, ...uvToScreen(0.5, 1))
    expect(hit).toMatchObject({domain: 'point', size: 6})
    editor.operators.run('mesh.select_mode', {domain: 'edge'})
    const [edge] = await picker.pick(host, ...uvToScreen(0.25, 1))
    expect(edge).toMatchObject({domain: 'edge'})
    const rect = await picker.pickRect(host, {x0: 0, y0: 0, x1: WIDTH, y1: HEIGHT})
    expect(new Set(rect.map(r => r.index)).size).toBe(getTopology(mesh.geometry, 'mesh').edgeCount)
  })
})
