var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget, Clock } from 'three/webgpu';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import { ThreeState } from '../nodes/ThreeState.js';
import { ViewCameras } from '../nodes/ViewCameras.js';
if (WebGPU.isAvailable() === false) {
    throw new Error('No WebGPU support');
}
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.visible = entry.isIntersecting;
    });
});
// TODO: Add support for logarithmic depth buffer
// TODO: Add support for unique renderer instances per viewport
const _renderer = new WebGPURenderer({ antialias: false, alpha: true });
_renderer.setPixelRatio(window.devicePixelRatio);
void _renderer.init();
const _clock = new Clock();
const _playingViewports = [];
let _currentFrameTime = -1;
let _currentFrameDelta = 0;
new Promise((resolve, reject) => {
    _renderer.setAnimationLoop((time) => {
        _currentFrameTime = time;
        _currentFrameDelta = _clock.getDelta();
        for (const viewport of _playingViewports) {
            viewport.onAnimate();
        }
    }).then(resolve).catch(reject);
}).then(() => {
    console.log('animation loop initialized');
}).catch(error => {
    console.error('animation loop initialization failed', error);
});
let IoThreeViewport = class IoThreeViewport extends IoElement {
    width = 0;
    height = 0;
    visible = false;
    static get Style() {
        return /* css */ `
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
    `;
    }
    constructor(args) {
        super(args);
        this.renderViewport = this.renderViewport.bind(this);
        this.renderTarget = new CanvasTarget(document.createElement('canvas'));
        this.appendChild(this.renderTarget.domElement);
        this.viewCameras = new ViewCameras({ viewport: this, state: this.state, cameraSelect: this.bind('cameraSelect') });
        this.debounce(this.renderViewport);
    }
    connectedCallback() {
        super.connectedCallback();
        observer.observe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        observer.unobserve(this);
        this.visible = false;
    }
    playingChanged() {
        if (this.playing) {
            _playingViewports.push(this);
        }
        else if (_playingViewports.includes(this)) {
            _playingViewports.splice(_playingViewports.indexOf(this), 1);
        }
    }
    onAnimate() {
        if (!this.visible)
            return;
        this.debounce(this.renderViewport);
    }
    onResized() {
        const rect = this.getBoundingClientRect();
        this.width = Math.floor(rect.width);
        this.height = Math.floor(rect.height);
        this.renderTarget.setSize(this.width, this.height);
        this.renderTarget.setPixelRatio(window.devicePixelRatio);
        this.viewCameras.setSize(this.width, this.height);
        this.renderViewport();
    }
    stateChanged() {
        this.debounce(this.renderViewport);
    }
    stateMutated() {
        this.debounce(this.renderViewport);
    }
    changed() {
        this.debounce(this.renderViewport);
    }
    renderViewport() {
        if (_renderer.initialized === false) {
            this.debounce(this.renderViewport);
            return;
        }
        if (this.state.isRendererInitialized() === false) {
            void this.state.onRendererInitialized(_renderer);
        }
        if (!this.width || !this.height) {
            return;
        }
        _renderer.setCanvasTarget(this.renderTarget);
        _renderer.setClearColor(this.clearColor, this.clearAlpha);
        _renderer.setSize(this.width, this.height);
        _renderer.clear();
        this.state.setViewportSize(this.width, this.height);
        this.state.animate(_currentFrameTime, _currentFrameDelta);
        _renderer.render(this.state.scene, this.viewCameras.camera);
    }
    dispose() {
        super.dispose();
        this.renderTarget.dispose();
        this.viewCameras.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: Number, value: 0x000000 })
], IoThreeViewport.prototype, "clearColor", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 1 })
], IoThreeViewport.prototype, "clearAlpha", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'throttled' })
], IoThreeViewport.prototype, "reactivity", void 0);
__decorate([
    ReactiveProperty({ type: ThreeState, init: null })
], IoThreeViewport.prototype, "state", void 0);
__decorate([
    ReactiveProperty({ type: Boolean })
], IoThreeViewport.prototype, "playing", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'perspective' })
], IoThreeViewport.prototype, "cameraSelect", void 0);
IoThreeViewport = __decorate([
    Register
], IoThreeViewport);
export { IoThreeViewport };
export const ioThreeViewport = function (arg0) {
    return IoThreeViewport.vConstructor(arg0);
};
//# sourceMappingURL=IoThreeViewport.js.map