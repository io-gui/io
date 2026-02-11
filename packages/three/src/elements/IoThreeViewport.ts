import { Register, IoElement, IoElementProps, ReactiveProperty, ReactivityType, Change, Property, WithBinding } from '@io-gui/core'
import { WebGPURenderer, CanvasTarget, NeutralToneMapping } from 'three/webgpu'
import WebGPU from 'three/addons/capabilities/WebGPU.js'
import { ThreeApplet } from '../nodes/ThreeApplet.js'
import { ViewCameras } from '../nodes/ViewCameras.js'
import { ToolBase } from '../nodes/ToolBase.js'

if ( WebGPU.isAvailable() === false ) {
  throw new Error( 'No WebGPU support' )
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    (entry.target as IoThreeViewport).visible = entry.isIntersecting
  })
})

// TODO: Add support for logarithmic depth buffer
// TODO: Add support for unique renderer instances per viewport
const _renderer = new WebGPURenderer({antialias: false, alpha: true})
_renderer.toneMapping = NeutralToneMapping
_renderer.setPixelRatio(window.devicePixelRatio)
_renderer.shadowMap.enabled = true
void _renderer.init()

export type IoThreeViewportProps = IoElementProps & {
  overscan?: WithBinding<number>
  clearColor?: WithBinding<number>
  clearAlpha?: WithBinding<number>
  applet: WithBinding<ThreeApplet>
  cameraSelect?: WithBinding<string>
  renderer?: WebGPURenderer
  tool?: WithBinding<ToolBase>
}

@Register
export class IoThreeViewport extends IoElement {

  public width: number = 0
  public height: number = 0
  public visible: boolean = false

  @ReactiveProperty({type: Number, value: 1.1})
  declare public overscan: number

  @ReactiveProperty({type: Number, value: 0x000000})
  declare public clearColor: number

  @ReactiveProperty({type: Number, value: 1})
  declare public clearAlpha: number

  @ReactiveProperty({type: String, value: 'throttled'})
  declare reactivity: ReactivityType

  @ReactiveProperty({type: ThreeApplet, init: null})
  declare applet: ThreeApplet

  @ReactiveProperty({type: String, value: 'perspective'})
  declare cameraSelect: string

  @ReactiveProperty({type: WebGPURenderer, value: _renderer})
  declare renderer: WebGPURenderer

  @ReactiveProperty({type: ViewCameras})
  declare viewCameras: ViewCameras

  @ReactiveProperty({type: ToolBase})
  declare tool: ToolBase

  @Property(0)
  declare tabIndex: number

  declare private renderTarget: CanvasTarget

  static get Style() {
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

  static get Listeners() {
    return {
      'three-applet-needs-render': 'onAppletNeedsRender',
    }
  }

  constructor(args: IoThreeViewportProps) {
    super(args)
    this.viewCameras = new ViewCameras({viewport: this, applet: this.bind('applet'), cameraSelect: this.bind('cameraSelect')})
    this.debounce(this.renderViewportDebounced)
  }

  init() {
    this.renderTarget = new CanvasTarget(document.createElement('canvas'))
    this.appendChild(this.renderTarget.domElement)
  }

  connectedCallback() {
    super.connectedCallback()
    observer.observe(this)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    observer.unobserve(this)
    // TODO: Visibility observe
    this.visible = false
  }

  toolChanged(change: Change<ToolBase>) {
    const newTool = change.value
    const oldTool = change.oldValue
    if (oldTool) oldTool.unregisterViewport(this)
    if (newTool) newTool.registerViewport(this)
  }

  onAppletNeedsRender(event: CustomEvent) {
    event.stopPropagation()
    if (!this.visible) return
    this.debounce(this.renderViewportDebounced)
  }

  onResized() {
    const rect = this.getBoundingClientRect()
    this.width = Math.floor(rect.width)
    this.height = Math.floor(rect.height)
    this.renderTarget.setSize(this.width, this.height)
    this.renderTarget.setPixelRatio(window.devicePixelRatio)
    this.renderViewportDebounced()
  }

  appletChanged() {
    this.debounce(this.renderViewportDebounced)
  }
  appletMutated() {
    this.debounce(this.renderViewportDebounced)
  }
  viewCamerasMutated() {
    this.debounce(this.renderViewportDebounced)
  }
  changed() {
    this.debounce(this.renderViewportDebounced)
  }

  renderViewportDebounced() {
    if (this.renderer.initialized === false) {
      this.debounce(this.renderViewportDebounced, undefined, 2)
      return
    }
    this.applet.updateViewportSize(this.width, this.height)
    this.renderViewport()
  }
  renderViewport() {
    if (this.renderer.initialized === false) return
    if (this.applet.isRendererInitialized() === false) {
      void this.applet.onRendererInitialized(this.renderer)
    }
    if (!this.width || !this.height) return

    this.renderer.setCanvasTarget(this.renderTarget)
    this.renderer.setClearColor(this.clearColor, this.clearAlpha)
    this.renderer.setSize(this.width, this.height)
    this.renderer.clear()

    this.applet.updateViewportSize(this.width, this.height)

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

  dispose() {
    delete (this as any).applet
    this.renderTarget.dispose()
    this.viewCameras.dispose()
    this.tool.unregisterViewport(this)
    super.dispose()
  }
}

export const ioThreeViewport = function(arg0: IoThreeViewportProps) {
  return IoThreeViewport.vConstructor(arg0)
}