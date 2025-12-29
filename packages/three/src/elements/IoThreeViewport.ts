import { Register, IoElement, IoElementProps, ReactiveProperty, ReactivityType, Binding } from '@io-gui/core'
import { WebGPURenderer, CanvasTarget, Clock } from 'three/webgpu'
import WebGPU from 'three/addons/capabilities/WebGPU.js'
import { ThreeState } from '../nodes/ThreeState.js'
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
_renderer.setPixelRatio(window.devicePixelRatio)
void _renderer.init()

const _clock = new Clock()

const _playingViewports: IoThreeViewport[] = []
let _currentFrameTime = -1
let _currentFrameDelta = 0

new Promise((resolve, reject) => {
  _renderer.setAnimationLoop((time: number) => {
    _currentFrameTime = time
    _currentFrameDelta = _clock.getDelta()
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
  state: ThreeState | Binding<ThreeState>
  cameraSelect?: string | Binding<string>
  playing?: boolean | Binding<boolean>
  clearColor?: number | Binding<number>
  clearAlpha?: number | Binding<number>
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

  @ReactiveProperty({type: ThreeState, init: null})
  declare state: ThreeState

  @ReactiveProperty({type: Boolean})
  declare playing: boolean

  @ReactiveProperty({type: String, value: 'perspective'})
  declare cameraSelect: string

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
    this.viewCameras.setSize(this.width, this.height)
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
    if (_renderer.initialized === false) {
      this.debounce(this.renderViewport)
      return
    }
    if (this.state.isRendererInitialized() === false) {
      void this.state.onRendererInitialized(_renderer)
    }
    if (!this.width || !this.height) {
      return
    }
    _renderer.setCanvasTarget(this.renderTarget)
    _renderer.setClearColor(this.clearColor, this.clearAlpha)
    _renderer.setSize(this.width, this.height)
    _renderer.clear()

    this.state.setViewportSize(this.width, this.height)
    this.state.animate(_currentFrameTime, _currentFrameDelta)
    _renderer.render(this.state.scene, this.viewCameras.camera)
  }

  dispose() {
    super.dispose()
    this.renderTarget.dispose()
    this.viewCameras.dispose()
  }
}

export const ioThreeViewport = function(arg0: IoThreeViewportProps) {
  return IoThreeViewport.vConstructor(arg0)
}