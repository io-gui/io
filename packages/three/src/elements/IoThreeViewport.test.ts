import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { IoThreeViewport, ThreeApplet, ToolBase } from '@io-gui/three'
import { Scene, WebGPURenderer } from 'three/webgpu'

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

  it('creates view cameras bound to the viewport', async () => {
    const tool = new ToolBase({ applet })
    const viewport = new IoThreeViewport({ applet, tool })
    container.appendChild(viewport as Node)
    await nextFrame()

    expect(viewport.viewCameras).toBeTruthy()
    expect(viewport.viewCameras.applet).toBe(applet)
    expect(viewport.viewCameras.camera.name).toBe('perspective')

    tool.unregisterViewport(viewport)
    viewport.remove()
    viewport.viewCameras.dispose()
    tool.dispose()
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
    viewportA.viewCameras.dispose()
    viewportB.viewCameras.dispose()
  })

  it('uses a custom renderer when provided', async () => {
    const renderer = new WebGPURenderer({antialias: false, alpha: true})
    void renderer.init()
    const viewport = new IoThreeViewport({ applet, renderer })
    container.appendChild(viewport as Node)
    await nextFrame()

    expect(viewport.renderer).toBe(renderer)

    viewport.remove()
    viewport.viewCameras.dispose()
    renderer.dispose()
  })
})
