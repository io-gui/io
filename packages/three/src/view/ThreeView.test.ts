import { describe, it, expect, vi } from 'vitest'
import { ThreeView, ViewNavigation } from '@io-gui/three'
import { Box3, BoxGeometry, BufferAttribute, Mesh, OrthographicCamera, PerspectiveCamera, Scene, Vector3 } from 'three/webgpu'

function forwardOf(camera: PerspectiveCamera | OrthographicCamera) {
  return new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
}

describe('ViewNavigation', () => {
  it('starts as a perspective view looking at the origin', () => {
    const nav = new ViewNavigation()
    const position = nav.getPosition(new Vector3())
    expect(nav.projection).toBe('perspective')
    expect(nav.axisView).toBe('free')
    expect(nav.framed).toBe(false)
    const toTarget = nav.target.clone().sub(position).normalize()
    const forward = new Vector3(0, 0, -1).applyQuaternion(nav.rotation)
    expect(forward.dot(toTarget)).toBeCloseTo(1, 5)
  })

  it('switches to orthographic axis views looking along the axis', () => {
    const nav = new ViewNavigation()
    const expected: Record<string, [number, number, number]> = {
      top: [0, -1, 0], bottom: [0, 1, 0], left: [1, 0, 0], right: [-1, 0, 0], front: [0, 0, -1], back: [0, 0, 1],
    }
    for (const axis of ['top', 'bottom', 'left', 'right', 'front', 'back'] as const) {
      nav.setAxisView(axis)
      expect(nav.projection).toBe('orthographic')
      const forward = new Vector3(0, 0, -1).applyQuaternion(nav.rotation)
      expect(forward.toArray().map(v => Math.round(v) + 0)).toEqual(expected[axis])
    }
    nav.setAxisView('free')
    expect(nav.projection).toBe('perspective')
  })

  it('round-trips through JSON', () => {
    const nav = new ViewNavigation()
    nav.setAxisView('front')
    nav.target.set(1, 2, 3)
    nav.distance = 7
    nav.cameraSource = 'abc'
    const copy = new ViewNavigation().applyJSON(JSON.parse(JSON.stringify(nav.toJSON())))
    expect(copy.toJSON()).toEqual(nav.toJSON())
    // Restored data without an explicit `framed` counts as framed, so it is not overwritten by auto-framing.
    expect(new ViewNavigation().applyJSON({distance: 3}).framed).toBe(true)
  })

  it('ignores unused morph target extremes when framing', () => {
    const geometry = new BoxGeometry(2, 2, 2)
    geometry.translate(100, 0, 0)
    const position = geometry.getAttribute('position')
    const morph = position.clone() as BufferAttribute
    for (let i = 0; i < morph.count; i++) morph.setXYZ(i, 0, 0, 0)
    geometry.morphAttributes.position = [morph]
    geometry.morphTargetsRelative = false
    const mesh = new Mesh(geometry)
    mesh.updateMorphTargets()
    mesh.updateMatrixWorld(true)

    const nav = new ViewNavigation()
    nav.frame(mesh)
    expect(nav.target.x).toBeCloseTo(100, 5)
    expect(nav.framed).toBe(true)
  })

  it('frames an empty object without producing NaN', () => {
    const nav = new ViewNavigation()
    nav.frame(new Scene())
    expect(Number.isFinite(nav.distance)).toBe(true)
    expect(nav.distance).toBeGreaterThan(0)
  })
})

describe('ThreeView', () => {
  it('builds a perspective camera aimed at the framed AABB center with the box inside clip planes', () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2))
    mesh.position.set(100, 50, -80)
    mesh.updateMatrixWorld(true)
    const view = new ThreeView()
    view.frame(mesh)

    const camera = view.getCamera(400, 400, null) as PerspectiveCamera
    expect(camera).toBeInstanceOf(PerspectiveCamera)
    expect(view.navigation.target.toArray()).toEqual([100, 50, -80])
    const forward = forwardOf(camera)
    const toCenter = view.navigation.target.clone().sub(camera.position).normalize()
    expect(forward.dot(toCenter)).toBeCloseTo(1, 5)

    const box = new Box3().setFromObject(mesh, true)
    let minDepth = Infinity
    let maxDepth = -Infinity
    const corner = new Vector3()
    for (let i = 0; i < 8; i++) {
      corner.set((i & 1) ? box.max.x : box.min.x, (i & 2) ? box.max.y : box.min.y, (i & 4) ? box.max.z : box.min.z)
      const depth = corner.sub(camera.position).dot(forward)
      minDepth = Math.min(minDepth, depth)
      maxDepth = Math.max(maxDepth, depth)
    }
    expect(camera.near).toBeLessThan(minDepth)
    expect(maxDepth).toBeLessThan(camera.far)
    view.dispose()
  })

  it('applies viewport aspect and overscan without storing them', () => {
    const view = new ThreeView({overscan: 2})
    const wide = view.getCamera(800, 400, null) as PerspectiveCamera
    expect(wide.aspect).toBeCloseTo(2, 5)
    expect(wide.zoom).toBeCloseTo(0.5, 5)
    expect(wide.fov).toBeCloseTo(view.navigation.fov, 5)

    const tall = view.getCamera(400, 800, null) as PerspectiveCamera
    expect(tall.aspect).toBeCloseTo(0.5, 5)
    expect(tall.fov).toBeGreaterThan(view.navigation.fov)
    view.dispose()
  })

  it('frames orthographic axis views', () => {
    const scene = new Scene()
    scene.add(new Mesh(new BoxGeometry(2, 4, 6)))
    scene.updateMatrixWorld(true)
    const view = new ThreeView({overscan: 1})
    view.setAxisView('left')
    view.frame(scene)
    const camera = view.getCamera(400, 400, scene) as OrthographicCamera
    expect(camera).toBeInstanceOf(OrthographicCamera)
    // Box seen from the left is 6 deep (z) by 4 high (y): half extent 3 fits the larger side.
    expect(camera.top).toBeCloseTo(3, 5)
    expect(camera.right).toBeCloseTo(3, 5)
    view.dispose()
  })

  it('looks through scene cameras by uuid without mutating them', () => {
    const scene = new Scene()
    const sceneCamera = new PerspectiveCamera(45, 1.5, 0.1, 100)
    sceneCamera.position.set(1, 2, 3)
    scene.add(sceneCamera)
    scene.updateMatrixWorld(true)
    const before = JSON.stringify(sceneCamera.toJSON())

    const view = new ThreeView({overscan: 2})
    view.setCameraView(`uuid:${sceneCamera.uuid}`)
    const camera = view.getCamera(800, 400, scene) as PerspectiveCamera
    expect(camera).not.toBe(sceneCamera)
    expect(camera.position.toArray()).toEqual([1, 2, 3])
    expect(camera.aspect).toBeCloseTo(2, 5)
    expect(camera.zoom).toBeCloseTo(0.5, 5)
    expect(JSON.stringify(sceneCamera.toJSON())).toBe(before)

    expect(view.getSourceCamera(new Scene())).toBe(null)
    view.dispose()
  })

  it('resolves a named scene camera to its uuid once it is in the scene', () => {
    const scene = new Scene()
    const other = new OrthographicCamera()
    const shot = new PerspectiveCamera()
    shot.name = 'shot'
    scene.add(other, shot)

    const view = new ThreeView().setCameraView('name:shot')
    expect(view.getSourceCamera(new Scene())).toBe(null)
    expect(view.getSourceCamera(scene)).toBe(shot)
    expect(view.navigation.cameraSource).toBe(shot.uuid)
    shot.name = 'renamed'
    expect(view.getSourceCamera(scene)).toBe(shot)

    view.setAxisView('free')
    expect(view.getSourceCamera(scene)).toBe(null)
    view.dispose()
  })

  it('looks through the first scene camera without an id, and uses the free view until one is added', () => {
    const scene = new Scene()
    const view = new ThreeView().setAxisView('top').setCameraView()
    expect(view.getSourceCamera(scene)).toBe(null)
    expect(view.navigation.axisView).toBe('free')
    const first = new OrthographicCamera()
    scene.add(first, new PerspectiveCamera())
    expect(view.getSourceCamera(scene)).toBe(first)
    expect(new ThreeView().setCameraView(null).getSourceCamera(scene)).toBe(first)
    view.dispose()
  })

  it('warns and falls back to the free view for an id without a prefix', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const view = new ThreeView().setAxisView('top')
    view.setCameraView('shot')
    expect(warn).toHaveBeenCalledOnce()
    expect(view.navigation.cameraSource).toBe(null)
    expect(view.navigation.axisView).toBe('free')
    warn.mockRestore()
    view.dispose()
  })

  it('keeps the orthographic scene camera frustum center when fitting', () => {
    const scene = new Scene()
    const board = new OrthographicCamera(2, 10, 8, 0, 0.1, 1000)
    scene.add(board)
    const view = new ThreeView({overscan: 1})
    view.setCameraView(`uuid:${board.uuid}`)
    const camera = view.getCamera(800, 400, scene) as OrthographicCamera
    expect((camera.left + camera.right) / 2).toBeCloseTo(6, 5)
    expect((camera.top + camera.bottom) / 2).toBeCloseTo(4, 5)
    expect(board.left).toBe(2)
    expect(board.right).toBe(10)
    view.dispose()
  })

  it('finds its scene camera without walking the scene on every call', () => {
    const scene = new Scene()
    const camera = new PerspectiveCamera()
    scene.add(new Mesh(new BoxGeometry()), camera)
    const view = new ThreeView().setCameraView(`uuid:${camera.uuid}`)
    const walk = vi.spyOn(scene, 'getObjectByProperty')
    for (let i = 0; i < 5; i++) expect(view.getSourceCamera(scene)).toBe(camera)
    expect(walk).toHaveBeenCalledTimes(1)
    scene.remove(camera)
    for (let i = 0; i < 5; i++) expect(view.getSourceCamera(scene)).toBe(null)
    expect(walk).toHaveBeenCalledTimes(2)
    view.dispose()
  })

  it('measures pick tolerance at the scene, not the orbit distance, through a scene camera', () => {
    const scene = new Scene()
    const camera = new PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 0, 20)
    scene.add(new Mesh(new BoxGeometry()), camera)
    const view = new ThreeView({overscan: 1}).setCameraView(`uuid:${camera.uuid}`)
    view.navigation.distance = 2
    const drawn = view.getCamera(100, 100, scene) as PerspectiveCamera
    expect(view.getWorldPerPixel(100, 100, scene)).toBeCloseTo(2 * 20 * Math.tan(drawn.fov * Math.PI / 360) / drawn.zoom / 100, 5)
    view.dispose()
  })

  it('round-trips through JSON', () => {
    const view = new ThreeView({overscan: 1.5, clearColor: 0x223344, pipeline: 'probe', overlays: {grid: true}, toneMapping: 4, toneMappingExposure: 0.5})
    view.setAxisView('top')
    const copy = new ThreeView().applyJSON(JSON.parse(JSON.stringify(view.toJSON())))
    expect(copy.toJSON()).toEqual(view.toJSON())
    expect(copy.pipeline).toBe('probe')
    expect(copy.toneMapping).toBe(4)
    expect(copy.toneMappingExposure).toBe(0.5)
    expect(copy.isOverlayEnabled('grid', false)).toBe(true)
    view.dispose()
    copy.dispose()
  })
})
