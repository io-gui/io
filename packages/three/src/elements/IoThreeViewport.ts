import { Register, ReactiveElement, ReactiveElementProps, Property, Change, Field, WithBinding } from '@io-gui/core'
import { WebGPURenderer, CanvasTarget, Scene } from 'three/webgpu'
import { ThreeApplet } from '../nodes/ThreeApplet.js'
import { ViewCameras } from '../nodes/ViewCameras.js'
import { ToolBase } from '../nodes/ToolBase.js'
import { DocumentChange, ChangeBus } from '../editor/ChangeBus.js'
import { renderScheduler, getDefaultRenderer, ScheduledView, DirtyReason } from '../render/RenderScheduler.js'

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const viewport = entry.target as IoThreeViewport
    viewport.visible = entry.isIntersecting
    if (entry.isIntersecting) viewport.tag('view')
  })
})

// TODO: Add support for logarithmic depth buffer

export type IoThreeViewportProps = ReactiveElementProps & {
  applet: WithBinding<ThreeApplet>
  overscan?: WithBinding<number>
  clearColor?: WithBinding<number>
  clearAlpha?: WithBinding<number>
  cameraSelect?: WithBinding<string>
  renderer?: WebGPURenderer
  tool?: WithBinding<ToolBase>
}

@Register
export class IoThreeViewport extends ReactiveElement implements ScheduledView {

  public width: number = 0
  public height: number = 0
  public visible: boolean = false

  @Property({type: ThreeApplet, init: null})
  declare applet: ThreeApplet

  @Property({type: Number, value: 1.1})
  declare public overscan: number

  @Property({type: Number, value: 0x000000})
  declare public clearColor: number

  @Property({type: Number, value: 1})
  declare public clearAlpha: number

  @Property({type: String, value: 'perspective'})
  declare cameraSelect: string

  @Property({type: WebGPURenderer})
  declare renderer: WebGPURenderer

  @Property({type: ViewCameras})
  declare viewCameras: ViewCameras

  @Property({type: ToolBase})
  declare tool: ToolBase

  @Field(0)
  declare tabIndex: number

  // Lazy: `ready()` runs inside the base constructor, before class fields are initialized.
  declare private _renderTarget: CanvasTarget | undefined
  get renderTarget(): CanvasTarget {
    if (!this._renderTarget) this._renderTarget = new CanvasTarget(document.createElement('canvas'))
    return this._renderTarget
  }

  public attachSurface() {
    const canvas = this.renderTarget.domElement
    if (canvas.parentElement !== this) {
      this.appendChild(canvas)
    }
  }

  static override get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        border: var(--io_border);
        border-color: transparent;
      }
      :host > canvas {
        position: absolute;
        pointer-events: none;
      }
      :host:focus {
        border: var(--io_border);
        border-color: var(--io_colorWhite);
      }
    `
  }

  static override get Listeners() {
    return {
    }
  }

  constructor(args: IoThreeViewportProps) {
    super({
      ...args,
      renderer: args.renderer ?? getDefaultRenderer(),
    } as ReactiveElementProps)
    this.viewCameras = new ViewCameras({viewport: this, applet: this.bind('applet'), cameraSelect: this.bind('cameraSelect')})
  }

  override ready() {
    this.attachSurface()
  }

  override connectedCallback() {
    super.connectedCallback()
    observer.observe(this)
    this.attachSurface()
    renderScheduler.register(this)
    this.onResized()
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    observer.unobserve(this)
    renderScheduler.unregister(this)
    this.visible = false
  }

  get scene(): Scene | null {
    return this.applet?.scene ?? null
  }

  get changeBus(): ChangeBus | null {
    return this.applet?.changeBus ?? null
  }

  /** Marks this viewport for redraw on the next frame. */
  tag(reason: DirtyReason) {
    renderScheduler.tag(this, reason)
  }

  isRenderable() {
    return this.visible && this.width > 0 && this.height > 0 && !!this.applet?.scene
  }

  getPriority() {
    if (this.matches(':focus-within')) return 2
    if (this.matches(':hover')) return 1
    return 0
  }

  listens(change: DocumentChange) {
    return change.source === this.applet
  }

  onRendererError(error: Error) {
    this.textContent = error.message
  }

  toolChanged(change: Change<ToolBase>) {
    const newTool = change.value
    const oldTool = change.oldValue
    if (oldTool) oldTool.unregisterViewport(this)
    if (newTool) newTool.registerViewport(this)
  }

  onResized() {
    const rect = this.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)
    if (width === this.width && height === this.height) return
    this.width = width
    this.height = height
    this.renderTarget.setSize(width, height)
    this.renderTarget.setPixelRatio(window.devicePixelRatio)
    if (width && height) this.applet?.onResized(width, height, this)
    this.tag('resize')
  }

  appletChanged() {
    this.tag('content')
  }
  appletMutated() {
    this.tag('content')
  }
  viewCamerasMutated() {
    this.tag('view')
  }
  override mutated() {
    this.tag('view')
  }

  /** Called by the RenderScheduler only (ADR-0003). */
  renderView() {
    if (this.applet.isRendererInitialized() === false) {
      void this.applet.onRendererInitialized(this.renderer)
    }

    this.renderer.setCanvasTarget(this.renderTarget)
    this.renderer.setClearColor(this.clearColor, this.clearAlpha)
    this.renderer.setSize(this.width, this.height)
    this.renderer.clear()

    const toneMapping = this.renderer.toneMapping
    const toneMappingExposure = this.renderer.toneMappingExposure

    this.renderer.toneMapping = this.applet.toneMapping
    this.renderer.toneMappingExposure = this.applet.toneMappingExposure

    this.viewCameras.setOverscan(this.width, this.height, this.overscan)
    this.renderer.render(this.applet.scene, this.viewCameras.camera)
    this.viewCameras.resetOverscan()

    this.renderer.toneMapping = toneMapping
    this.renderer.toneMappingExposure = toneMappingExposure
  }

  override dispose() {
    renderScheduler.unregister(this)
    delete (this as Record<string, unknown>).applet
    this.renderTarget.dispose()
    this.viewCameras.dispose()
    if (this.tool) {
      this.tool.unregisterViewport(this)
    }
    super.dispose()
  }
}

export const ioThreeViewport = function(arg0: IoThreeViewportProps) {
  return IoThreeViewport.vConstructor(arg0)
}