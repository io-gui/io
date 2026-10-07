import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ToolBase, ThreeView, ThreeApplet, InputRouter, NavigationBehavior, Pointer3D } from '@io-gui/three'
import type { IoThreeViewport } from '@io-gui/three'
import { Scene } from 'three/webgpu'

function createViewportStub(width = 200, height = 100): IoThreeViewport {
  const element = document.createElement('div')
  document.body.appendChild(element)

  const viewport = element as unknown as IoThreeViewport
  viewport.width = width
  viewport.height = height
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
  const view = new ThreeView()
  Object.assign(viewport, {view, scene: null, getViewCamera: () => view.getCamera(width, height, null)})
  Object.defineProperty(viewport, 'inputRouter', {value: new InputRouter(viewport)})

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

  it('adds its behavior to the viewport router and removes it again', () => {
    tool.registerViewport(viewport)
    expect(viewport.inputRouter.behaviors).toContain(tool.behavior)
    tool.unregisterViewport(viewport)
    expect(viewport.inputRouter.behaviors).not.toContain(tool.behavior)
  })

  it('receives pointer events through the router, ahead of navigation', () => {
    const calls: string[] = []
    tool.on3DPointerDown = (pointer: Pointer3D) => { calls.push(`down ${pointer.screen.x.toFixed(1)}`) }
    tool.on3DPointerMove = () => { calls.push('move') }
    tool.on3DPointerUp = () => { calls.push('up') }
    tool.on3DPointerHover = () => { calls.push('hover') }
    viewport.inputRouter.add(new NavigationBehavior(viewport))
    tool.registerViewport(viewport)
    const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0, clientX: 100, clientY: 50}
    viewport.dispatchEvent(new PointerEvent('pointermove', init))
    viewport.dispatchEvent(new PointerEvent('pointerdown', init))
    viewport.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: 120}))
    viewport.dispatchEvent(new PointerEvent('pointerup', {...init, clientX: 120}))
    expect(calls).toEqual(['hover', 'down 0.0', 'move', 'up'])
    expect(viewport.inputRouter.captured).toBe(null)
  })

  it('lets navigation have input the tool does not capture', () => {
    const navigation = new NavigationBehavior(viewport)
    viewport.inputRouter.add(navigation)
    tool.capturesInput = (event: PointerEvent | WheelEvent) => event.type === 'pointerdown' && (event as PointerEvent).button === 0
    tool.registerViewport(viewport)
    const distance = viewport.view.navigation.distance
    viewport.dispatchEvent(new WheelEvent('wheel', {bubbles: true, cancelable: true, deltaY: 100}))
    expect(viewport.view.navigation.distance).toBeGreaterThan(distance)
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
