var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget, NeutralToneMapping, PerspectiveCamera, Vector2, Vector3 } from 'three/webgpu';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ViewCameras } from '../nodes/ViewCameras.js';
import { ToolBase } from '../nodes/ToolBase.js';
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
_renderer.toneMapping = NeutralToneMapping;
_renderer.setPixelRatio(window.devicePixelRatio);
_renderer.shadowMap.enabled = true;
void _renderer.init();
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
    `;
    }
    static get Listeners() {
        return {
            'three-applet-needs-render': 'onAppletNeedsRender',
        };
    }
    constructor(args) {
        super(args);
        this.renderTarget = new CanvasTarget(document.createElement('canvas'));
        this.appendChild(this.renderTarget.domElement);
        this.viewCameras = new ViewCameras({ viewport: this, applet: this.bind('applet'), cameraSelect: this.bind('cameraSelect') });
        this.debounce(this.renderViewportDebounced);
    }
    connectedCallback() {
        super.connectedCallback();
        observer.observe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        observer.unobserve(this);
        // TODO: Visibility observe
        this.visible = false;
    }
    toolChanged(change) {
        const newTool = change.value;
        const oldTool = change.oldValue;
        if (oldTool)
            oldTool.unregisterViewport(this);
        if (newTool)
            newTool.registerViewport(this);
    }
    onAppletNeedsRender(event) {
        event.stopPropagation();
        if (!this.visible)
            return;
        this.debounce(this.renderViewportDebounced);
    }
    onResized() {
        const rect = this.getBoundingClientRect();
        this.width = Math.floor(rect.width);
        this.height = Math.floor(rect.height);
        this.renderTarget.setSize(this.width, this.height);
        this.renderTarget.setPixelRatio(window.devicePixelRatio);
        this.renderViewportDebounced();
    }
    appletChanged() {
        this.debounce(this.renderViewportDebounced);
    }
    appletMutated() {
        this.debounce(this.renderViewportDebounced);
    }
    viewCamerasMutated() {
        this.debounce(this.renderViewportDebounced);
    }
    changed() {
        this.debounce(this.renderViewportDebounced);
    }
    renderViewportDebounced() {
        if (this.renderer.initialized === false) {
            this.debounce(this.renderViewportDebounced, undefined, 2);
            return;
        }
        this.applet.updateViewportSize(this.width, this.height);
        this.renderViewport();
    }
    renderViewport() {
        if (this.renderer.initialized === false)
            return;
        if (this.applet.isRendererInitialized() === false) {
            void this.applet.onRendererInitialized(this.renderer);
        }
        if (!this.width || !this.height)
            return;
        this.renderer.setCanvasTarget(this.renderTarget);
        this.renderer.setClearColor(this.clearColor, this.clearAlpha);
        this.renderer.setSize(this.width, this.height);
        this.renderer.clear();
        this.applet.updateViewportSize(this.width, this.height);
        const toneMapping = this.renderer.toneMapping;
        const toneMappingExposure = this.renderer.toneMappingExposure;
        this.renderer.toneMapping = this.applet.toneMapping;
        this.renderer.toneMappingExposure = this.applet.toneMappingExposure;
        this.viewCameras.setOverscan(this.width, this.height, this.overscan);
        this.renderer.render(this.applet.scene, this.viewCameras.camera);
        this.viewCameras.resetOverscan();
        this.renderer.toneMapping = toneMapping;
        this.renderer.toneMappingExposure = toneMappingExposure;
    }
    pointerTo3D(event) {
        const rect = event.target.getBoundingClientRect();
        const screen = new Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        this.viewCameras.setOverscan(this.width, this.height, this.overscan);
        const camera = this.viewCameras.camera;
        const origin = new Vector3(screen.x, screen.y, -1).unproject(camera);
        camera.updateMatrixWorld();
        origin.applyMatrix4(camera.matrixWorld);
        const direction = new Vector3();
        if (camera instanceof PerspectiveCamera) {
            direction.setFromMatrixPosition(camera.matrixWorld);
            direction.subVectors(origin, direction).normalize();
        }
        else {
            direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
        }
        this.viewCameras.resetOverscan();
        return {
            screen,
            origin,
            direction,
            event,
        };
    }
    dispose() {
        delete this.applet;
        this.renderTarget.dispose();
        this.viewCameras.dispose();
        this.tool.unregisterViewport(this);
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: Number, value: 1.1 })
], IoThreeViewport.prototype, "overscan", void 0);
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
    ReactiveProperty({ type: ThreeApplet, init: null })
], IoThreeViewport.prototype, "applet", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'perspective' })
], IoThreeViewport.prototype, "cameraSelect", void 0);
__decorate([
    ReactiveProperty({ type: WebGPURenderer, value: _renderer })
], IoThreeViewport.prototype, "renderer", void 0);
__decorate([
    ReactiveProperty({ type: ViewCameras })
], IoThreeViewport.prototype, "viewCameras", void 0);
__decorate([
    ReactiveProperty({ type: ToolBase })
], IoThreeViewport.prototype, "tool", void 0);
__decorate([
    Property(0)
], IoThreeViewport.prototype, "tabIndex", void 0);
IoThreeViewport = __decorate([
    Register
], IoThreeViewport);
export { IoThreeViewport };
export const ioThreeViewport = function (arg0) {
    return IoThreeViewport.vConstructor(arg0);
};
//# sourceMappingURL=IoThreeViewport.js.map