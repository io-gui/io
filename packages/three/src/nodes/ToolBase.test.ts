import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ToolBase, ViewCameras, ThreeApplet } from '@io-gui/three'
import type { IoThreeViewport } from '@io-gui/three'
import { Scene } from 'three/webgpu'

function createViewportStub(width = 200, height = 100): IoThreeViewport {
  const applet = new ThreeApplet({ scene: new Scene() })
  const element = document.createElement('div')
  document.body.appendChild(element)

  const viewport = element as unknown as IoThreeViewport
  viewport.width = width
  viewport.height = height
  viewport.overscan = 1
  viewport.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width,
    height,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect)
  viewport.addEventListener = element.addEventListener.bind(element)
  viewport.removeEventListener = element.removeEventListener.bind(element)
  viewport.setPointerCapture = () => {}
  viewport.releasePointerCapture = () => {}
  viewport.viewCameras = new ViewCameras({
    viewport,
    applet,
    cameraSelect: 'perspective',
  })

  return viewport
}

describe('ToolBase', () => {
  let applet: ThreeApplet
  let tool: ToolBase
  let viewport: IoThreeViewport

  beforeEach(() => {
    applet = new ThreeApplet({ scene: new Scene() })
    tool = new ToolBase({ applet })
    viewport = createViewportStub()
  })

  afterEach(() => {
    tool.unregisterViewport(viewport)
    tool.dispose()
    applet.dispose()
    ;(viewport as unknown as HTMLElement).remove()
  })

  it('registers viewport pointer listeners', () => {
    const addListener = vi.spyOn(viewport, 'addEventListener')
    tool.registerViewport(viewport)

    expect(addListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    expect(addListener).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(addListener).toHaveBeenCalledWith('pointerup', expect.any(Function))
  })

  it('unregisters viewport pointer listeners', () => {
    const removeListener = vi.spyOn(viewport, 'removeEventListener')
    tool.registerViewport(viewport)
    tool.unregisterViewport(viewport)

    expect(removeListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    expect(removeListener).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(removeListener).toHaveBeenCalledWith('pointerup', expect.any(Function))
  })

  it('maps pointer coordinates to normalized device space', () => {
    const pointer3D = tool.pointerTo3D({
      currentTarget: viewport,
      clientX: 100,
      clientY: 50,
      pointerId: 1,
    } as unknown as PointerEvent)

    expect(pointer3D.screen.x).toBeCloseTo(0, 5)
    expect(pointer3D.screen.y).toBeCloseTo(0, 5)
    expect(pointer3D.screenStart.x).toBeCloseTo(0, 5)
    expect(pointer3D.screenStart.y).toBeCloseTo(0, 5)
    expect(pointer3D.screenMovement.x).toBeCloseTo(0, 5)
    expect(pointer3D.screenMovement.y).toBeCloseTo(0, 5)
  })

  it('tracks screen movement between pointer events', () => {
    tool._onPointerDown({
      currentTarget: viewport,
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      stopPropagation: () => {},
      preventDefault: () => {},
    } as unknown as PointerEvent)

    const pointer3D = tool.pointerTo3D({
      currentTarget: viewport,
      clientX: 150,
      clientY: 50,
      pointerId: 1,
    } as unknown as PointerEvent)

    expect(pointer3D.screen.x).toBeCloseTo(0.5, 5)
    expect(pointer3D.screenStart.x).toBeCloseTo(-0.5, 5)
    expect(pointer3D.screenMovement.x).toBeCloseTo(1, 5)
  })
})
