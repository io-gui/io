import { Register, IoElement, IoElementProps, ReactiveProperty, ReactivityType, Binding } from '@io-gui/core'
import { WebGPURenderer, CanvasTarget, Clock, NeutralToneMapping } from 'three/webgpu'
import WebGPU from 'three/addons/capabilities/WebGPU.js'
import { ThreeApplet } from '../nodes/ThreeApplet.js'
import { ViewCameras } from '../nodes/ViewCameras.js'

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
void _renderer.init()

const _clock = new Clock()

const _playingViewports: IoThreeViewport[] = []
let _time = -1
let _delta = 0

new Promise((resolve, reject) => {
  _renderer.setAnimationLoop((time: number) => {
    _time = time
    _delta = _clock.getDelta()
    for (const viewport of _playingViewports) {
      viewport.onAnimate()
    }
  }).then(resolve).catch(reject)
}).then(() => {
  console.log('animation loop initialized')
}).catch(error => {
  console.error('animation loop initialization failed', error)
})

export type IoThreeViewportProps = IoElementProps & {
  clearColor?: number | Binding<number>
  clearAlpha?: number | Binding<number>
  state: ThreeApplet | Binding<ThreeApplet>
  playing?: boolean | Binding<boolean>
  cameraSelect?: string | Binding<string>
  renderer?: WebGPURenderer
}

@Register
export class IoThreeViewport extends IoElement {

  public width: number = 0
  public height: number = 0
  public visible: boolean = false

  @ReactiveProperty({type: Number, value: 0x000000})
  declare public clearColor: number

  @ReactiveProperty({type: Number, value: 1})
  declare public clearAlpha: number

  @ReactiveProperty({type: String, value: 'throttled'})
  declare reactivity: ReactivityType

  @ReactiveProperty({type: ThreeApplet, init: null})
  declare state: ThreeApplet

  @ReactiveProperty({type: Boolean})
  declare playing: boolean

  @ReactiveProperty({type: String, value: 'perspective'})
  declare cameraSelect: string

  @ReactiveProperty({type: WebGPURenderer, value: _renderer})
  declare renderer: WebGPURenderer

  declare private readonly viewCameras: ViewCameras
  declare private readonly renderTarget: CanvasTarget

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
      }
      :host > canvas {
        position: absolute;
      }
    `
  }

  constructor(args: IoThreeViewportProps) {
    super(args)
    this.renderViewport = this.renderViewport.bind(this)

    this.renderTarget = new CanvasTarget(document.createElement('canvas'))
    this.appendChild(this.renderTarget.domElement)

    this.viewCameras = new ViewCameras({viewport: this, state: this.state, cameraSelect: this.bind('cameraSelect')})

    this.debounce(this.renderViewport)
  }

  connectedCallback() {
    super.connectedCallback()
    observer.observe(this)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    observer.unobserve(this)
    this.visible = false
  }

  playingChanged() {
    if (this.playing) {
      _playingViewports.push(this)
    } else if (_playingViewports.includes(this)) {
      _playingViewports.splice(_playingViewports.indexOf(this), 1)
    }
  }


  onAnimate() {
    if (!this.visible) return
    this.debounce(this.renderViewport)
  }

  onResized() {
    const rect = this.getBoundingClientRect()
    this.width = Math.floor(rect.width)
    this.height = Math.floor(rect.height)
    this.renderTarget.setSize(this.width, this.height)
    this.renderTarget.setPixelRatio(window.devicePixelRatio)
    this.renderViewport()
  }

  stateChanged() {
    this.debounce(this.renderViewport)
  }
  stateMutated() {
    this.debounce(this.renderViewport)
  }
  changed() {
    this.debounce(this.renderViewport)
  }

  renderViewport() {
    if (this.renderer.initialized === false) {
      this.debounce(this.renderViewport)
      return
    }
    if (this.state.isRendererInitialized() === false) {
      void this.state.onRendererInitialized(this.renderer)
    }
    if (!this.width || !this.height) {
      return
    }
    this.renderer.setCanvasTarget(this.renderTarget)
    this.renderer.setClearColor(this.clearColor, this.clearAlpha)
    this.renderer.setSize(this.width, this.height)
    this.renderer.clear()

    this.state.updateViewportSize(this.width, this.height)
    this.state.animate(_time, _delta)

    const toneMapping = this.renderer.toneMapping
    const toneMappingExposure = this.renderer.toneMappingExposure

    this.renderer.toneMapping = this.state.toneMapping
    this.renderer.toneMappingExposure = this.state.toneMappingExposure

    this.viewCameras.setOverscan(this.width, this.height, 1)
    this.renderer.render(this.state.scene, this.viewCameras.camera)
    this.viewCameras.resetOverscan()

    this.renderer.toneMapping = toneMapping
    this.renderer.toneMappingExposure = toneMappingExposure
  }

  dispose() {
    super.dispose()
    this.renderTarget.dispose()
    this.viewCameras.dispose()
    if (this.renderer !== _renderer) {
      this.renderer.dispose()
    }
  }
}

export const ioThreeViewport = function(arg0: IoThreeViewportProps) {
  return IoThreeViewport.vConstructor(arg0)
}