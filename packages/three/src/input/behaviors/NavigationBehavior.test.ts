import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { InputHost, InputRouter, NavigationBehavior, ThreeView, navigationKeymaps } from '@io-gui/three'
import { BoxGeometry, Mesh, PerspectiveCamera, Scene, Spherical, Vector3 } from 'three/webgpu'

function createHost(): InputHost {
  const element = document.createElement('div') as unknown as InputHost
  const view = new ThreeView({overscan: 1})
  const scene = new Scene()
  Object.assign(element, {view, scene, getViewCamera: () => view.getCamera(200, 100, scene)})
  element.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px'
  document.body.appendChild(element)
  return element
}

function drag(host: InputHost, from: [number, number], to: [number, number], options: {button?: number; shift?: boolean; alt?: boolean} = {}) {
  const init = {bubbles: true, cancelable: true, pointerId: 1, button: options.button ?? 0, shiftKey: options.shift, altKey: options.alt, pointerType: 'mouse'}
  host.dispatchEvent(new PointerEvent('pointerdown', {...init, clientX: from[0], clientY: from[1]}))
  host.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: to[0], clientY: to[1]}))
  host.dispatchEvent(new PointerEvent('pointerup', {...init, clientX: to[0], clientY: to[1]}))
}

function theta(view: ThreeView) {
  return new Spherical().setFromVector3(new Vector3(0, 0, 1).applyQuaternion(view.navigation.rotation)).theta
}

describe('NavigationBehavior', () => {
  let host: InputHost
  let router: InputRouter
  let navigation: NavigationBehavior

  beforeEach(() => {
    host = createHost()
    router = new InputRouter(host)
    navigation = new NavigationBehavior(host)
    router.add(navigation)
  })

  afterEach(() => {
    router.dispose()
    host.view.dispose()
    host.remove()
  })

  it('orbits on LMB drag with the default keymap, like OrbitControls', () => {
    const before = theta(host.view)
    const target = host.view.navigation.target.clone()
    drag(host, [100, 50], [120, 50])
    expect(theta(host.view)).toBeCloseTo(before - 2 * Math.PI * 20 / 100, 5)
    expect(host.view.navigation.target.equals(target)).toBe(true)
  })

  it('pans on RMB drag so the scene follows the pointer', () => {
    const view = host.view
    const worldPerPixel = view.getWorldPerPixel(200, 100, host.scene)
    const right = new Vector3(1, 0, 0).applyQuaternion(view.navigation.rotation)
    drag(host, [100, 50], [110, 50], {button: 2})
    expect(view.navigation.target.distanceTo(right.multiplyScalar(-10 * worldPerPixel))).toBeLessThan(1e-9)
  })

  it('zooms on wheel and dollies on MMB drag', () => {
    const distance = host.view.navigation.distance
    host.dispatchEvent(new WheelEvent('wheel', {bubbles: true, cancelable: true, deltaY: 100, clientX: 50, clientY: 50}))
    expect(host.view.navigation.distance).toBeGreaterThan(distance)

    const zoomedOut = host.view.navigation.distance
    drag(host, [100, 50], [100, 20], {button: 1})
    expect(host.view.navigation.distance).toBeLessThan(zoomedOut)
  })

  it('pans instead of orbiting in axis views', () => {
    host.view.setAxisView('top')
    const rotation = host.view.navigation.rotation.clone()
    drag(host, [100, 50], [130, 50])
    expect(host.view.navigation.rotation.equals(rotation)).toBe(true)
    expect(host.view.navigation.target.x).not.toBe(0)
    expect(host.view.navigation.axisView).toBe('top')
  })

  it('follows another keymap preset', () => {
    navigation.keymap = navigationKeymaps.maya
    const before = theta(host.view)
    drag(host, [100, 50], [120, 50])
    expect(theta(host.view)).toBe(before)
    drag(host, [100, 50], [120, 50], {alt: true})
    expect(theta(host.view)).not.toBe(before)
  })

  it('handles axis and frame keys', () => {
    navigation.keymap = navigationKeymaps.blender
    host.dispatchEvent(new PointerEvent('pointerenter'))
    document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'Numpad7', bubbles: true}))
    expect(host.view.navigation.axisView).toBe('top')
    document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'Numpad1', ctrlKey: true, bubbles: true}))
    expect(host.view.navigation.axisView).toBe('back')

    const mesh = new Mesh(new BoxGeometry(1, 1, 1))
    mesh.position.set(5, 0, 0)
    host.scene!.add(mesh)
    host.scene!.updateMatrixWorld(true)
    document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'Home', bubbles: true}))
    expect(host.view.navigation.target.x).toBeCloseTo(5, 5)
    host.dispatchEvent(new PointerEvent('pointerleave'))
  })

  it('does nothing while looking through a scene camera', () => {
    const camera = new PerspectiveCamera()
    host.scene!.add(camera)
    host.view.setCameraView(`uuid:${camera.uuid}`)
    const before = JSON.stringify(host.view.navigation.toJSON())
    drag(host, [100, 50], [150, 50])
    const event = new WheelEvent('wheel', {bubbles: true, cancelable: true, deltaY: 100})
    host.dispatchEvent(event)
    expect(JSON.stringify(host.view.navigation.toJSON())).toBe(before)
    expect(event.defaultPrevented).toBe(false)
  })

  it('pans and pinch-dollies with two touches', () => {
    const touch = {bubbles: true, cancelable: true, pointerType: 'touch', button: 0}
    const nav = host.view.navigation
    host.dispatchEvent(new PointerEvent('pointerdown', {...touch, pointerId: 1, clientX: 80, clientY: 50}))
    host.dispatchEvent(new PointerEvent('pointerdown', {...touch, pointerId: 2, clientX: 120, clientY: 50}))
    const distance = nav.distance
    const rotation = nav.rotation.clone()
    host.dispatchEvent(new PointerEvent('pointermove', {...touch, pointerId: 1, clientX: 60, clientY: 50}))
    host.dispatchEvent(new PointerEvent('pointermove', {...touch, pointerId: 2, clientX: 140, clientY: 50}))
    expect(nav.distance).toBeLessThan(distance)
    expect(nav.rotation.equals(rotation)).toBe(true)
    host.dispatchEvent(new PointerEvent('pointerup', {...touch, pointerId: 1}))
    host.dispatchEvent(new PointerEvent('pointerup', {...touch, pointerId: 2}))
    expect(router.captured).toBe(null)
  })
})
