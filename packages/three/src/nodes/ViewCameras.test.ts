import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ViewCameras, ThreeApplet } from '@io-gui/three'
import type { IoThreeViewport } from '@io-gui/three'
import { BoxGeometry, Mesh, OrthographicCamera, PerspectiveCamera, Scene } from 'three/webgpu'

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
})
