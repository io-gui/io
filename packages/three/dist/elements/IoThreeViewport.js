var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, Field } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ToolBase } from '../nodes/ToolBase.js';
import { ThreeView } from '../view/ThreeView.js';
import { AXIS_VIEW_DIRECTIONS } from '../view/ViewNavigation.js';
import { ViewOrbitControls } from '../view/ViewOrbitControls.js';
import { renderScheduler, getDefaultRenderer } from '../render/RenderScheduler.js';
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const viewport = entry.target;
        viewport.visible = entry.isIntersecting;
        if (entry.isIntersecting)
            viewport.tag('view');
    });
});
let IoThreeViewport = class IoThreeViewport extends ReactiveElement {
    width = 0;
    height = 0;
    visible = false;
    get renderTarget() {
        if (!this._renderTarget)
            this._renderTarget = new CanvasTarget(document.createElement('canvas'));
        return this._renderTarget;
    }
    attachSurface() {
        const canvas = this.renderTarget.domElement;
        if (canvas.parentElement !== this) {
            this.appendChild(canvas);
        }
    }
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
            'frame-object': 'onFrameObject',
        };
    }
    constructor(args) {
        super({
            ...args,
            view: args.view ?? new ThreeView(),
            renderer: args.renderer ?? getDefaultRenderer(),
        });
        this._ownsView = !args.view;
        this._orbitControls = new ViewOrbitControls(this);
    }
    ready() {
        this.attachSurface();
    }
    connectedCallback() {
        super.connectedCallback();
        observer.observe(this);
        this.attachSurface();
        renderScheduler.register(this);
        this.onResized();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        observer.unobserve(this);
        renderScheduler.unregister(this);
        this.visible = false;
    }
    get scene() {
        return this.applet?.scene ?? null;
    }
    get changeBus() {
        return this.applet?.changeBus ?? null;
    }
    /** Marks this viewport for redraw on the next frame. */
    tag(reason) {
        renderScheduler.tag(this, reason);
    }
    isRenderable() {
        return this.visible && this.width > 0 && this.height > 0 && !!this.applet?.scene;
    }
    getPriority() {
        if (this.matches(':focus-within'))
            return 2;
        if (this.matches(':hover'))
            return 1;
        return 0;
    }
    listens(change) {
        return change.source === this.applet;
    }
    onRendererError(error) {
        this.textContent = error.message;
    }
    /** The camera this viewport draws and picks with, built from its view at the current size. */
    getViewCamera() {
        return this.view.getCamera(this.width, this.height, this.scene);
    }
    /** Applet event `frame-object` with `{object, overscan?}`: frames the object in this viewport's view. */
    onFrameObject(event) {
        event.stopPropagation();
        if (this._sceneCameraPending)
            this._syncView();
        this.view.frame(event.detail.object, event.detail.overscan ?? 1);
    }
    _syncView() {
        const view = this.view;
        const scene = this.scene;
        if (!view)
            return;
        this._sceneCameraPending = !applyCameraSelect(view, this.cameraSelect, scene);
        if (!view.navigation.framed && scene)
            view.frame(scene);
        this._orbitControls?.updateEnabled();
    }
    toolChanged(change) {
        const newTool = change.value;
        const oldTool = change.oldValue;
        if (oldTool)
            oldTool.unregisterViewport(this);
        if (newTool)
            newTool.registerViewport(this);
    }
    onResized() {
        const rect = this.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        if (width === this.width && height === this.height)
            return;
        this.width = width;
        this.height = height;
        this.renderTarget.setSize(width, height);
        this.renderTarget.setPixelRatio(window.devicePixelRatio);
        if (width && height)
            this.applet?.onResized(width, height, this);
        this.tag('resize');
    }
    appletChanged() {
        this._syncView();
        this.tag('content');
    }
    appletMutated() {
        if (this._sceneCameraPending)
            this._syncView();
        this.tag('content');
    }
    cameraSelectChanged() {
        this._syncView();
    }
    viewChanged(change) {
        if (this._ownsView && change.oldValue && change.oldValue !== change.value) {
            change.oldValue.dispose();
            this._ownsView = false;
        }
        this._syncView();
        this.tag('view');
    }
    viewMutated() {
        this._orbitControls?.updateEnabled();
        this.tag('view');
    }
    mutated() {
        this.tag('view');
    }
    /** Called by the RenderScheduler only (ADR-0003). */
    renderView() {
        if (this._sceneCameraPending)
            this._syncView();
        if (this.applet.isRendererInitialized() === false) {
            void this.applet.onRendererInitialized(this.renderer);
        }
        this.renderer.setCanvasTarget(this.renderTarget);
        this.renderer.setClearColor(this.view.clearColor, this.view.clearAlpha);
        this.renderer.setSize(this.width, this.height);
        this.renderer.clear();
        const toneMapping = this.renderer.toneMapping;
        const toneMappingExposure = this.renderer.toneMappingExposure;
        this.renderer.toneMapping = this.applet.toneMapping;
        this.renderer.toneMappingExposure = this.applet.toneMappingExposure;
        this.renderer.render(this.applet.scene, this.getViewCamera());
        this.renderer.toneMapping = toneMapping;
        this.renderer.toneMappingExposure = toneMappingExposure;
    }
    dispose() {
        renderScheduler.unregister(this);
        delete this.applet;
        this.renderTarget.dispose();
        this._orbitControls.dispose();
        if (this._ownsView)
            this.view.dispose();
        if (this.tool) {
            this.tool.unregisterViewport(this);
        }
        super.dispose();
    }
};
__decorate([
    Property({ type: ThreeApplet, init: null })
], IoThreeViewport.prototype, "applet", void 0);
__decorate([
    Property({ type: ThreeView })
], IoThreeViewport.prototype, "view", void 0);
__decorate([
    Property({ type: String, value: '' })
], IoThreeViewport.prototype, "cameraSelect", void 0);
__decorate([
    Property({ type: WebGPURenderer })
], IoThreeViewport.prototype, "renderer", void 0);
__decorate([
    Property({ type: ToolBase })
], IoThreeViewport.prototype, "tool", void 0);
__decorate([
    Field(0)
], IoThreeViewport.prototype, "tabIndex", void 0);
IoThreeViewport = __decorate([
    Register
], IoThreeViewport);
export { IoThreeViewport };
/**
 * Maps the `cameraSelect` shorthand onto a view: `'perspective'`, an axis view, `'scene'` (first scene camera)
 * or `'scene:<name>'` (scene camera by name, resolved to its uuid).
 * Returns false when a requested scene camera is not in the scene yet; the view then shows the default
 * perspective view until it appears.
 */
function applyCameraSelect(view, cameraSelect, scene) {
    if (!cameraSelect)
        return true;
    const nav = view.navigation;
    let resolved = true;
    if (cameraSelect.startsWith('scene')) {
        const name = cameraSelect.split(':')[1] || '';
        const cameras = scene ? [
            ...scene.getObjectsByProperty('isPerspectiveCamera', true),
            ...scene.getObjectsByProperty('isOrthographicCamera', true),
        ] : [];
        const camera = name ? cameras.find(camera => camera.name === name) : cameras[0];
        if (camera) {
            if (nav.cameraSource !== camera.uuid)
                view.setCameraSource(camera.uuid);
            return true;
        }
        resolved = false;
        cameraSelect = 'perspective';
    }
    if (nav.cameraSource !== null)
        view.setCameraSource(null);
    if (cameraSelect === 'perspective') {
        if (nav.axisView !== null)
            view.setAxisView(null);
    }
    else if (cameraSelect in AXIS_VIEW_DIRECTIONS) {
        if (nav.axisView !== cameraSelect)
            view.setAxisView(cameraSelect);
    }
    else {
        console.warn(`Unknown cameraSelect "${cameraSelect}", using default perspective view`);
        if (nav.axisView !== null)
            view.setAxisView(null);
    }
    return resolved;
}
export const ioThreeViewport = function (arg0) {
    return IoThreeViewport.vConstructor(arg0);
};
