import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { IoThreeViewport, ThreeApplet, ThreeView, ToolBase, renderScheduler, NavigationBehavior, navigationKeymaps } from '@io-gui/three'
import { BoxGeometry, Mesh, PerspectiveCamera, Scene, WebGPURenderer } from 'three/webgpu'

describe('IoThreeViewport', () => {
  let applet: ThreeApplet
  let container: HTMLElement

  beforeEach(() => {
    applet = new ThreeApplet({ scene: new Scene() })
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    applet.dispose()
  })

  it('routes input through its router: tool first, then navigation', () => {
    const tool = new ToolBase({ applet })
    const viewport = new IoThreeViewport({ applet, tool })
    expect(viewport.navigationBehavior).toBeInstanceOf(NavigationBehavior)
    expect(viewport.inputRouter.behaviors).toEqual([tool.behavior, viewport.navigationBehavior])
    viewport.keymap = navigationKeymaps.blender
    expect(viewport.navigationBehavior.keymap).toBe(navigationKeymaps.blender)
    viewport.dispose()
    tool.dispose()
  })

  it('registers tool on assignment and unregisters previous tool', async () => {
    const tool1 = new ToolBase({ applet })
    const tool2 = new ToolBase({ applet })
    const viewport = new IoThreeViewport({ applet, tool: tool1 })
    container.appendChild(viewport as Node)
    await nextFrame()

    const unregisterSpy = vi.spyOn(tool1, 'unregisterViewport')
    const registerSpy = vi.spyOn(tool2, 'registerViewport')

    viewport.tool = tool2
    await nextFrame()

    expect(unregisterSpy).toHaveBeenCalledWith(viewport)
    expect(registerSpy).toHaveBeenCalledWith(viewport)

    tool2.unregisterViewport(viewport)
    viewport.remove()
    tool1.dispose()
    tool2.dispose()
  })

  it('owns a default view, or shows a given one without owning it', () => {
    const own = new IoThreeViewport({ applet })
    expect(own.view).toBeInstanceOf(ThreeView)
    const ownView = own.view
    own.dispose()
    expect(ownView._disposed).toBe(true)

    const view = new ThreeView()
    const shared = new IoThreeViewport({ applet, view })
    expect(shared.view).toBe(view)
    shared.dispose()
    expect(view._disposed).toBeFalsy()
    view.dispose()
  })

  it('maps cameraSelect onto the view', () => {
    const sceneCamera = new PerspectiveCamera()
    sceneCamera.name = 'shot'
    applet.scene.add(sceneCamera)
    const viewport = new IoThreeViewport({ applet, cameraSelect: 'top' })
    expect(viewport.view.navigation.axisView).toBe('top')
    viewport.cameraSelect = 'scene:shot'
    expect(viewport.view.navigation.cameraSource).toBe(sceneCamera.uuid)
    expect(viewport.getViewCamera()).not.toBe(sceneCamera)
    viewport.cameraSelect = 'perspective'
    expect(viewport.view.navigation.cameraSource).toBe(null)
    expect(viewport.view.navigation.axisView).toBe(null)
    viewport.dispose()
  })

  it('switches to a requested scene camera once it is added to the scene', () => {
    const viewport = new IoThreeViewport({ applet, cameraSelect: 'scene' })
    expect(viewport.view.navigation.cameraSource).toBe(null)
    const late = new PerspectiveCamera()
    applet.scene.add(late)
    applet.dispatch('frame-object', {object: applet.scene}, true)
    expect(viewport.view.navigation.cameraSource).toBe(late.uuid)
    viewport.dispose()
  })

  it('frames the scene once for a new view, but keeps a restored view as is', () => {
    applet.scene.add(new Mesh(new BoxGeometry(2, 2, 2)))
    applet.scene.children[0].position.set(10, 0, 0)
    applet.scene.updateMatrixWorld(true)
    const fresh = new IoThreeViewport({ applet })
    expect(fresh.view.navigation.target.x).toBeCloseTo(10, 5)

    const view = new ThreeView().applyJSON({navigation: {target: [1, 2, 3], distance: 5}})
    const restored = new IoThreeViewport({ applet, view, cameraSelect: '' })
    expect(view.navigation.target.toArray()).toEqual([1, 2, 3])
    expect(view.navigation.distance).toBe(5)
    fresh.dispose()
    restored.dispose()
    view.dispose()
  })

  it('keeps navigation when a view moves to a new viewport element', async () => {
    const view = new ThreeView()
    const first = new IoThreeViewport({ applet, view })
    container.appendChild(first as Node)
    view.setAxisView('front')
    view.navigation.target.set(4, 5, 6)
    const before = JSON.stringify(view.toJSON())
    first.remove()
    first.dispose()

    const second = new IoThreeViewport({ applet, view })
    container.appendChild(second as Node)
    await nextFrame()
    expect(JSON.stringify(second.view.toJSON())).toBe(before)
    second.remove()
    second.dispose()
    view.dispose()
  })

  it('tags itself for redraw when its view navigation changes', () => {
    const viewport = new IoThreeViewport({ applet })
    container.appendChild(viewport as Node)
    renderScheduler.step()
    expect(renderScheduler.getTags(viewport).has('view')).toBe(false)
    viewport.view.setAxisView('top')
    expect(renderScheduler.getTags(viewport).has('view')).toBe(true)
    viewport.remove()
    viewport.dispose()
  })

  it('frames objects on the applet frame-object event', () => {
    const viewport = new IoThreeViewport({ applet })
    const mesh = new Mesh(new BoxGeometry(1, 1, 1))
    mesh.position.set(-20, 0, 0)
    mesh.updateMatrixWorld(true)
    applet.dispatch('frame-object', {object: mesh}, true)
    expect(viewport.view.navigation.target.x).toBeCloseTo(-20, 5)
    viewport.dispose()
  })

  it('uses a shared default renderer when none is provided', async () => {
    const viewportA = new IoThreeViewport({ applet })
    const viewportB = new IoThreeViewport({ applet })
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
    const viewport = new IoThreeViewport({ applet, renderer })
    container.appendChild(viewport as Node)
    await nextFrame()

    expect(viewport.renderer).toBe(renderer)

    viewport.remove()
    viewport.dispose()
    renderer.dispose()
  })

  it('registers with the render scheduler while connected', async () => {
    const viewport = new IoThreeViewport({ applet })
    expect(renderScheduler.isRegistered(viewport)).toBe(false)
    container.appendChild(viewport as Node)
    expect(renderScheduler.isRegistered(viewport)).toBe(true)
    expect(renderScheduler.getTags(viewport).has('content')).toBe(true)

    viewport.remove()
    expect(renderScheduler.isRegistered(viewport)).toBe(false)
    viewport.dispose()
  })

  it('listens only to changes from its own applet', () => {
    const other = new ThreeApplet({ scene: new Scene() })
    const viewport = new IoThreeViewport({ applet })
    expect(viewport.changeBus).toBe(applet.changeBus)
    expect(viewport.scene).toBe(applet.scene)
    expect(viewport.listens({kind: 'transform', source: applet})).toBe(true)
    expect(viewport.listens({kind: 'transform', source: other})).toBe(false)
    other.dispose()
    viewport.dispose()
  })

  it('is not renderable while hidden or zero-sized', async () => {
    const viewport = new IoThreeViewport({ applet })
    container.appendChild(viewport as Node)
    await nextFrame()
    // container is display:none, so the viewport has no size and is not intersecting
    expect(viewport.isRenderable()).toBe(false)
    viewport.remove()
    viewport.dispose()
  })
})
