import { NeutralToneMapping, Timer, WebGPURenderer } from 'three/webgpu';
/**
 * The only thing that renders (ADR-0003). Each frame it collects changes into typed dirty tags,
 * ticks playing editors, evaluates each scene once and draws tagged views within a frame budget.
 */
export class RenderScheduler {
    frameBudget;
    _views = new Map();
    /** Frames each tagged view has waited past the budget. Added to its priority so no view starves. */
    _waits = new Map();
    _tickers = new Set();
    _rendererStates = new Map();
    _timer = new Timer();
    _autoStart;
    _now;
    _frame = 0;
    _running = false;
    constructor(options = {}) {
        this._autoStart = options.autoStart ?? true;
        this.frameBudget = options.frameBudget ?? 12;
        this._now = options.now ?? (() => performance.now());
        this._timer.connect(document);
    }
    register(view) {
        if (!this._views.has(view)) {
            this._views.set(view, new Set(['content']));
        }
        else {
            this._views.get(view).add('content');
        }
        this._initRenderer(view.renderer);
        this._start();
    }
    unregister(view) {
        this._views.delete(view);
        this._waits.delete(view);
    }
    isRegistered(view) {
        return this._views.has(view);
    }
    tag(view, reason) {
        this._views.get(view)?.add(reason);
    }
    getTags(view) {
        return this._views.get(view) ?? new Set();
    }
    addTicker(ticker) {
        this._tickers.add(ticker);
        this._start();
    }
    removeTicker(ticker) {
        this._tickers.delete(ticker);
    }
    getRendererState(renderer) {
        return this._rendererStates.get(renderer);
    }
    /**
     * Runs one frame. Called by the rAF loop; tests call it directly with `autoStart: false`.
     */
    step(timestamp) {
        this._frame++;
        this._timer.update(timestamp);
        const frame = { frame: this._frame, delta: this._timer.getDelta(), time: this._timer.getElapsed() };
        for (const ticker of this._tickers) {
            try {
                ticker.tick(frame);
            }
            catch (e) {
                console.error(e);
            }
        }
        this._collect();
        const drawList = [];
        for (const [view, tags] of this._views) {
            if (tags.size === 0)
                continue;
            if (this._rendererStates.get(view.renderer) !== 'ready')
                continue;
            if (!view.isRenderable())
                continue;
            drawList.push(view);
        }
        if (drawList.length === 0)
            return;
        const rank = (view) => view.getPriority() + (this._waits.get(view) ?? 0);
        drawList.sort((a, b) => rank(b) - rank(a));
        // Evaluate each scene once; views then draw without re-traversing it.
        const scenes = new Map();
        for (const view of drawList) {
            const scene = view.scene;
            if (scene && !scenes.has(scene)) {
                scene.updateMatrixWorld();
                scenes.set(scene, scene.matrixWorldAutoUpdate);
                scene.matrixWorldAutoUpdate = false;
            }
        }
        const start = this._now();
        for (let i = 0; i < drawList.length; i++) {
            const view = drawList[i];
            if (i > 0 && this._now() - start > this.frameBudget) {
                this._waits.set(view, (this._waits.get(view) ?? 0) + 1);
                continue;
            }
            this._waits.delete(view);
            const tags = this._views.get(view);
            const reasons = new Set(tags);
            tags.clear();
            try {
                const result = view.renderView(reasons, frame);
                if (result && result.converged === false)
                    tags.add('continuous');
            }
            catch (e) {
                console.error(e);
            }
        }
        for (const [scene, autoUpdate] of scenes) {
            scene.matrixWorldAutoUpdate = autoUpdate;
        }
    }
    _collect() {
        const buses = new Set();
        for (const ticker of this._tickers)
            buses.add(ticker.changeBus);
        for (const view of this._views.keys()) {
            if (view.changeBus)
                buses.add(view.changeBus);
        }
        for (const bus of buses) {
            if (!bus.pending)
                continue;
            for (const change of bus.drain()) {
                for (const [view, tags] of this._views) {
                    const reason = view.listens(change);
                    if (reason)
                        tags.add(reason === true ? 'content' : reason);
                }
            }
        }
    }
    _initRenderer(renderer) {
        if (this._rendererStates.has(renderer))
            return;
        if (renderer.initialized) {
            this._setRendererReady(renderer);
            return;
        }
        this._rendererStates.set(renderer, 'pending');
        renderer.init().then(() => {
            this._setRendererReady(renderer);
        }).catch((error) => {
            this._setRendererFailed(renderer, error);
        });
    }
    _setRendererReady(renderer) {
        if (renderer.backend.isWebGPUBackend !== true) {
            this._setRendererFailed(renderer, new Error('@io-gui/three requires WebGPU, which is not available in this browser.'));
            return;
        }
        this._rendererStates.set(renderer, 'ready');
        for (const view of this._views.keys()) {
            if (view.renderer === renderer)
                this.tag(view, 'content');
        }
    }
    _setRendererFailed(renderer, error) {
        this._rendererStates.set(renderer, 'failed');
        console.error(error);
        for (const view of this._views.keys()) {
            if (view.renderer === renderer)
                view.onRendererError?.(error);
        }
    }
    _start() {
        if (!this._autoStart || this._running)
            return;
        this._running = true;
        // Request from a microtask so that, when started inside core's FrameScheduler callback,
        // core has already queued its next frame and runs first: reactive work flushes before drawing.
        queueMicrotask(() => requestAnimationFrame(this._onFrame));
    }
    _onFrame = (timestamp) => {
        if (this._views.size === 0 && this._tickers.size === 0) {
            this._running = false;
            return;
        }
        this.step(timestamp);
        requestAnimationFrame(this._onFrame);
    };
}
let _defaultRenderer = null;
/**
 * The shared WebGPURenderer used by viewports that are not given their own (ADR-0001).
 */
export function getDefaultRenderer() {
    if (!_defaultRenderer) {
        _defaultRenderer = new WebGPURenderer({ antialias: false, alpha: true });
        _defaultRenderer.toneMapping = NeutralToneMapping;
        _defaultRenderer.setPixelRatio(window.devicePixelRatio);
        _defaultRenderer.shadowMap.enabled = true;
    }
    return _defaultRenderer;
}
export const renderScheduler = new RenderScheduler();
