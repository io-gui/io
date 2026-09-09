import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ViewCameras, ThreeApplet } from '@io-gui/three'
import type { IoThreeViewport } from '@io-gui/three'
import { Box3, BoxGeometry, BufferAttribute, Mesh, OrthographicCamera, PerspectiveCamera, Scene, Vector3 } from 'three/webgpu'

function createViewCameras(cameraSelect = 'perspective') {
  const scene = new Scene()
  const applet = new ThreeApplet({ scene })
  const element = document.createElement('div')
  document.body.appendChild(element)

  const viewport = element as unknown as IoThreeViewport
  viewport.addEventListener = element.addEventListener.bind(element)
  viewport.removeEventListener = element.removeEventListener.bind(element)

  const viewCameras = new ViewCameras({
    viewport,
    applet,
    cameraSelect,
  })

  return { viewCameras, viewport, applet, scene, element }
}

describe('ViewCameras', () => {
  let viewCameras: ViewCameras
  let applet: ThreeApplet
  let scene: Scene
  let element: HTMLElement

  beforeEach(() => {
    ({ viewCameras, applet, scene, element } = createViewCameras())
  })

  afterEach(() => {
    viewCameras.dispose()
    applet.dispose()
    element.remove()
  })

  it('selects default cameras by name', () => {
    expect(viewCameras.camera.name).toBe('perspective')

    viewCameras.cameraSelect = 'top'
    viewCameras.cameraSelectChangedDebounced()
    expect(viewCameras.camera.name).toBe('top')

    viewCameras.cameraSelect = 'front'
    viewCameras.cameraSelectChangedDebounced()
    expect(viewCameras.camera.name).toBe('front')
  })

  it('restores projection after overscan adjustment', () => {
    const camera = viewCameras.camera as PerspectiveCamera
    const aspectBefore = camera.aspect

    viewCameras.setOverscan(800, 400, 2)
    expect(camera.aspect).toBeCloseTo(2, 5)
    expect(camera.zoom).toBeCloseTo(0.5, 5)

    viewCameras.resetOverscan()
    expect(camera.aspect).toBeCloseTo(aspectBefore, 5)
    expect(camera.zoom).toBeCloseTo(1, 5)
  })

  it('preserves orthographic frustum center during overscan', () => {
    const sceneCamera = new OrthographicCamera(2, 10, 8, 0, 0.1, 1000)
    sceneCamera.name = 'board'
    scene.add(sceneCamera)

    viewCameras.cameraSelect = 'scene:board'
    viewCameras.cameraSelectChangedDebounced()

    const camera = viewCameras.camera as OrthographicCamera
    viewCameras.setOverscan(800, 400, 1)
    expect((camera.left + camera.right) / 2).toBeCloseTo(6, 5)
    expect((camera.top + camera.bottom) / 2).toBeCloseTo(4, 5)

    viewCameras.resetOverscan()
    expect(camera.left).toBeCloseTo(2, 5)
    expect(camera.right).toBeCloseTo(10, 5)
    expect(camera.top).toBeCloseTo(8, 5)
    expect(camera.bottom).toBeCloseTo(0, 5)
  })

  it('frames scene objects for orthographic cameras', () => {
    const mesh = new Mesh(new BoxGeometry(2, 4, 6))
    scene.add(mesh)

    viewCameras.cameraSelect = 'left'
    viewCameras.cameraSelectChangedDebounced()
    viewCameras.frameObjectAll(scene, 1)

    const camera = viewCameras.camera
    expect(camera).toBeInstanceOf(OrthographicCamera)
    expect(camera.position.length()).toBeGreaterThan(0)
  })

  it('disables orbit controls for scene cameras', () => {
    const sceneCamera = new PerspectiveCamera(45, 1, 0.1, 100)
    sceneCamera.name = 'scene-camera'
    scene.add(sceneCamera)

    viewCameras.cameraSelect = 'scene:scene-camera'
    viewCameras.cameraSelectChangedDebounced()

    expect(viewCameras.camera).toBe(sceneCamera)
    expect((viewCameras as any).orbitControls.enabled).toBe(false)
  })

  it('ignores unused morph target extremes when framing', () => {
    // Base mesh far from local origin; absolute morph collapsed to origin.
    // Non-precise geometry.boundingBox unions morph extremes → includes origin.
    const geometry = new BoxGeometry(2, 2, 2)
    geometry.translate(100, 0, 0)
    const position = geometry.getAttribute('position')
    const morph = position.clone() as BufferAttribute
    for (let i = 0; i < morph.count; i++) {
      morph.setXYZ(i, 0, 0, 0)
    }
    geometry.morphAttributes.position = [morph]
    geometry.morphTargetsRelative = false
    geometry.boundingBox = null

    const mesh = new Mesh(geometry)
    mesh.updateMorphTargets()
    scene.add(mesh)
    mesh.updateMatrixWorld(true)

    geometry.computeBoundingBox()
    expect(geometry.boundingBox!.containsPoint(new Vector3(0, 0, 0))).toBe(true)

    const precise = new Box3().setFromObject(mesh, true)
    expect(precise.containsPoint(new Vector3(0, 0, 0))).toBe(false)
    expect(precise.getCenter(new Vector3()).x).toBeCloseTo(100, 5)

    viewCameras.frameObjectAll(mesh, 1)
    const target = (viewCameras as any).orbitControls.target as Vector3
    expect(target.x).toBeCloseTo(100, 5)
    expect(Math.abs(target.x)).toBeGreaterThan(50)
  })

  it('aims optical axis at AABB center for off-center meshes', () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2))
    mesh.position.set(100, 50, -80)
    scene.add(mesh)
    mesh.updateMatrixWorld(true)

    viewCameras.frameObjectAll(mesh, 1)

    const camera = viewCameras.camera as PerspectiveCamera
    const target = (viewCameras as any).orbitControls.target as Vector3
    expect(target.x).toBeCloseTo(100, 5)
    expect(target.y).toBeCloseTo(50, 5)
    expect(target.z).toBeCloseTo(-80, 5)

    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const toCenter = target.clone().sub(camera.position).normalize()
    expect(forward.dot(toCenter)).toBeCloseTo(1, 5)

    const box = new Box3().setFromObject(mesh, true)
    let minDepth = Infinity
    let maxDepth = -Infinity
    const corner = new Vector3()
    for (let i = 0; i < 8; i++) {
      corner.set(
        (i & 1) ? box.max.x : box.min.x,
        (i & 2) ? box.max.y : box.min.y,
        (i & 4) ? box.max.z : box.min.z
      )
      const depth = corner.sub(camera.position).dot(forward)
      minDepth = Math.min(minDepth, depth)
      maxDepth = Math.max(maxDepth, depth)
    }
    expect(camera.near).toBeLessThan(minDepth)
    expect(minDepth).toBeLessThan(maxDepth)
    expect(maxDepth).toBeLessThan(camera.far)
  })
})
