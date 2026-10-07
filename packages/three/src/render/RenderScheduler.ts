import { NeutralToneMapping, Scene, Timer, WebGPURenderer } from 'three/webgpu'
import { DocumentChange, ChangeBus } from '../editor/ChangeBus.js'

export type DirtyReason = 'content' | 'view' | 'overlay' | 'resize' | 'continuous'

export interface FrameInfo {
  frame: number
  delta: number
  time: number
}

export interface ViewRenderResult {
  /** `false` keeps the view tagged `continuous` (progressive pipelines). */
  converged: boolean
}

/**
 * What the scheduler needs from a view. Implemented by `IoThreeViewport`.
 */
export interface ScheduledView {
  readonly renderer: WebGPURenderer
  /** Scene evaluated once per frame before any view draws it. */
  readonly scene: Scene | null
  readonly changeBus: ChangeBus | null
  isRenderable(): boolean
  /** Higher draws first: focused 2, hovered 1, other 0. */
  getPriority(): number
  /** How a change affects this view: `true` or `'content'` redraws it, `'overlay'` redraws only overlays. */
  listens(change: DocumentChange): boolean | DirtyReason
  renderView(reasons: ReadonlySet<DirtyReason>, frame: FrameInfo): ViewRenderResult | void
  onRendererError?(error: Error): void
}

/**
 * Anything advanced by the scheduler clock while playing, such as a playing ThreeEditor.
 */
export interface ScheduledTicker {
  readonly changeBus: ChangeBus
  tick(frame: FrameInfo): void
}

export type RenderSchedulerOptions = {
  /** Start a requestAnimationFrame loop when the first view or ticker is added. Default true. */
  autoStart?: boolean
  /** Milliseconds of draw time per frame before remaining views wait for the next frame. */
  frameBudget?: number
  now?: () => number
}

/**
 * The only thing that renders (ADR-0003). Each frame it collects changes into typed dirty tags,
 * ticks playing editors, evaluates each scene once and draws tagged views within a frame budget.
 */
export class RenderScheduler {

  frameBudget: number

  private readonly _views = new Map<ScheduledView, Set<DirtyReason>>()
  private readonly _tickers = new Set<ScheduledTicker>()
  private readonly _rendererStates = new Map<WebGPURenderer, 'pending' | 'ready' | 'failed'>()
  private readonly _timer = new Timer()
  private readonly _autoStart: boolean
  private readonly _now: () => number
  private _frame = 0
  private _running = false

  constructor(options: RenderSchedulerOptions = {}) {
    this._autoStart = options.autoStart ?? true
    this.frameBudget = options.frameBudget ?? 12
    this._now = options.now ?? (() => performance.now())
    this._timer.connect(document)
  }

  register(view: ScheduledView) {
    if (!this._views.has(view)) {
      this._views.set(view, new Set(['content']))
    } else {
      this._views.get(view)!.add('content')
    }
    this._initRenderer(view.renderer)
    this._start()
  }

  unregister(view: ScheduledView) {
    this._views.delete(view)
  }

  isRegistered(view: ScheduledView) {
    return this._views.has(view)
  }

  tag(view: ScheduledView, reason: DirtyReason) {
    this._views.get(view)?.add(reason)
  }

  getTags(view: ScheduledView): ReadonlySet<DirtyReason> {
    return this._views.get(view) ?? new Set()
  }

  addTicker(ticker: ScheduledTicker) {
    this._tickers.add(ticker)
    this._start()
  }

  removeTicker(ticker: ScheduledTicker) {
    this._tickers.delete(ticker)
  }

  getRendererState(renderer: WebGPURenderer) {
    return this._rendererStates.get(renderer)
  }

  /**
   * Runs one frame. Called by the rAF loop; tests call it directly with `autoStart: false`.
   */
  step(timestamp?: number) {
    this._frame++
    this._timer.update(timestamp)
    const frame: FrameInfo = {frame: this._frame, delta: this._timer.getDelta(), time: this._timer.getElapsed()}

    for (const ticker of this._tickers) {
      try {
        ticker.tick(frame)
      } catch (e) {
        console.error(e)
      }
    }

    this._collect()

    const drawList: ScheduledView[] = []
    for (const [view, tags] of this._views) {
      if (tags.size === 0) continue
      if (this._rendererStates.get(view.renderer) !== 'ready') continue
      if (!view.isRenderable()) continue
      drawList.push(view)
    }
    if (drawList.length === 0) return
    drawList.sort((a, b) => b.getPriority() - a.getPriority())

    // Evaluate each scene once; views then draw without re-traversing it.
    const scenes = new Map<Scene, boolean>()
    for (const view of drawList) {
      const scene = view.scene
      if (scene && !scenes.has(scene)) {
        scene.updateMatrixWorld()
        scenes.set(scene, scene.matrixWorldAutoUpdate)
        scene.matrixWorldAutoUpdate = false
      }
    }

    const start = this._now()
    for (let i = 0; i < drawList.length; i++) {
      if (i > 0 && this._now() - start > this.frameBudget) break
      const view = drawList[i]
      const tags = this._views.get(view)!
      const reasons = new Set(tags)
      tags.clear()
      try {
        const result = view.renderView(reasons, frame)
        if (result && result.converged === false) tags.add('continuous')
      } catch (e) {
        console.error(e)
      }
    }

    for (const [scene, autoUpdate] of scenes) {
      scene.matrixWorldAutoUpdate = autoUpdate
    }
  }

  private _collect() {
    const buses = new Set<ChangeBus>()
    for (const ticker of this._tickers) buses.add(ticker.changeBus)
    for (const view of this._views.keys()) {
      if (view.changeBus) buses.add(view.changeBus)
    }
    for (const bus of buses) {
      if (!bus.pending) continue
      for (const change of bus.drain()) {
        for (const [view, tags] of this._views) {
          const reason = view.listens(change)
          if (reason) tags.add(reason === true ? 'content' : reason)
        }
      }
    }
  }

  private _initRenderer(renderer: WebGPURenderer) {
    if (this._rendererStates.has(renderer)) return
    if (renderer.initialized) {
      this._setRendererReady(renderer)
      return
    }
    this._rendererStates.set(renderer, 'pending')
    renderer.init().then(() => {
      this._setRendererReady(renderer)
    }).catch((error: Error) => {
      this._setRendererFailed(renderer, error)
    })
  }

  private _setRendererReady(renderer: WebGPURenderer) {
    if ((renderer.backend as {isWebGPUBackend?: boolean}).isWebGPUBackend !== true) {
      this._setRendererFailed(renderer, new Error('@io-gui/three requires WebGPU, which is not available in this browser.'))
      return
    }
    this._rendererStates.set(renderer, 'ready')
    for (const view of this._views.keys()) {
      if (view.renderer === renderer) this.tag(view, 'content')
    }
  }

  private _setRendererFailed(renderer: WebGPURenderer, error: Error) {
    this._rendererStates.set(renderer, 'failed')
    console.error(error)
    for (const view of this._views.keys()) {
      if (view.renderer === renderer) view.onRendererError?.(error)
    }
  }

  private _start() {
    if (!this._autoStart || this._running) return
    this._running = true
    // Request from a microtask so that, when started inside core's FrameScheduler callback,
    // core has already queued its next frame and runs first: reactive work flushes before drawing.
    queueMicrotask(() => requestAnimationFrame(this._onFrame))
  }

  private _onFrame = (timestamp: number) => {
    if (this._views.size === 0 && this._tickers.size === 0) {
      this._running = false
      return
    }
    this.step(timestamp)
    requestAnimationFrame(this._onFrame)
  }
}

let _defaultRenderer: WebGPURenderer | null = null

/**
 * The shared WebGPURenderer used by viewports that are not given their own (ADR-0001).
 */
export function getDefaultRenderer() {
  if (!_defaultRenderer) {
    _defaultRenderer = new WebGPURenderer({antialias: false, alpha: true})
    _defaultRenderer.toneMapping = NeutralToneMapping
    _defaultRenderer.setPixelRatio(window.devicePixelRatio)
    _defaultRenderer.shadowMap.enabled = true
  }
  return _defaultRenderer
}

export const renderScheduler = new RenderScheduler()
