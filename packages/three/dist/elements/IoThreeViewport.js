var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, Field } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ThreeEditor } from '../editor/ThreeEditor.js';
import { toolAllowsProfile } from '../tools/Tool.js';
import { ToolBase } from '../nodes/ToolBase.js';
import { ThreeView } from '../view/ThreeView.js';
import { AXIS_VIEW_DIRECTIONS } from '../view/ViewNavigation.js';
import { InputRouter } from '../input/InputRouter.js';
import { Keymap, keymaps } from '../input/Keymap.js';
import { NavigationBehavior } from '../input/behaviors/NavigationBehavior.js';
import { SelectBehavior } from '../input/behaviors/SelectBehavior.js';
import { renderScheduler, getDefaultRenderer } from '../render/RenderScheduler.js';
import { ViewCompositor } from '../render/ViewCompositor.js';
import { GizmoLayer } from '../tools/Gizmo.js';
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
        touch-action: none;
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
    /** Routes this viewport's input to behaviors: navigation, tools, later gizmos and operators (ADR-0004). */
    get inputRouter() {
        if (!this._inputRouter) {
            this._inputRouter = new InputRouter(this);
            this._navigation = new NavigationBehavior(this, this.keymap);
            this._select = new SelectBehavior(this, this.keymap);
            this._gizmos = new GizmoLayer(this);
            this._inputRouter.add(this._navigation);
            this._inputRouter.add(this._select);
        }
        return this._inputRouter;
    }
    /** Runs this viewport's pipeline and draws its overlays (ADR-0006). Recreated when the renderer changes. */
    get compositor() {
        if (!this._compositor)
            this._compositor = new ViewCompositor(this.renderer);
        return this._compositor;
    }
    /** Gizmos of the active tool in this viewport. */
    get gizmoLayer() {
        void this.inputRouter;
        return this._gizmos;
    }
    /** The pipeline's picker when it has one (UV view), otherwise null (raycast the content scene). */
    get picker() {
        return this._compositor?.pipeline?.picker ?? null;
    }
    get navigationBehavior() {
        void this.inputRouter;
        return this._navigation;
    }
    get selectBehavior() {
        void this.inputRouter;
        return this._select;
    }
    constructor(args) {
        super({
            ...args,
            view: args.view ?? new ThreeView(),
            renderer: args.renderer ?? getDefaultRenderer(),
        });
        this._ownsView = !args.view;
        void this.inputRouter;
        this._syncBehaviors();
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
        return this.editor?.document?.scene ?? null;
    }
    get changeBus() {
        return this.editor?.document?.changeBus ?? null;
    }
    get mode() {
        return this.editor?.mode;
    }
    get selection() {
        return this.editor?.selection ?? null;
    }
    /** Marks this viewport for redraw on the next frame. */
    tag(reason) {
        renderScheduler.tag(this, reason);
    }
    isRenderable() {
        return this.visible && this.width > 0 && this.height > 0 && !!this.scene;
    }
    getPriority() {
        if (this.matches(':focus-within'))
            return 2;
        if (this.matches(':hover'))
            return 1;
        return 0;
    }
    listens(change) {
        if (!this.editor || change.source !== this.editor.document)
            return false;
        this._syncRendering();
        return this.compositor.listens(change);
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
        if (view.kind === 'uv') {
            if (!view.navigation.framed || view.navigation.axisView !== 'front')
                view.frameUV();
        }
        else if (!view.navigation.framed && scene) {
            view.frame(scene);
        }
    }
    /** On a document switch, park this view's navigation for the old document and restore it for the new one. */
    _syncDocument() {
        const document = this.editor?.document;
        if (document === this._shownDocument)
            return;
        if (this._shownDocument && document && this.view)
            this.view.switchDocument(this._shownDocument.uuid, document.uuid);
        this._shownDocument = document;
    }
    /**
     * Installs navigation, selection, gizmos and the editor's active tool according to the view's interaction
     * profile. Gizmos need the `full` profile and the view's `gizmos` overlay flag (default on).
     */
    _syncBehaviors() {
        const view = this.view;
        if (!view || !this._inputRouter)
            return;
        const router = this._inputRouter;
        const gizmos = this._gizmos;
        if (view.profile === 'none')
            router.remove(this._navigation);
        else
            router.add(this._navigation);
        if (view.profile === 'full' || view.profile === 'select')
            router.add(this._select);
        else
            router.remove(this._select);
        if (view.profile === 'full' && view.isOverlayEnabled('gizmos')) {
            router.add(gizmos);
            this.compositor.addOverlay(gizmos, 300);
        }
        else {
            router.remove(gizmos);
            this._compositor?.removeOverlay(gizmos);
        }
        const tool = this.editor?.getActiveTool(view.kind) ?? null;
        const toolId = tool && toolAllowsProfile(tool, view.profile) ? tool.id : null;
        if ((this._toolBehaviors?.toolId ?? null) === toolId)
            return;
        for (const behavior of this._toolBehaviors?.behaviors ?? [])
            router.remove(behavior);
        this._toolBehaviors = undefined;
        if (tool && toolId) {
            const ctx = { editor: this.editor, host: this, view };
            const behaviors = tool.createBehaviors(ctx);
            for (const behavior of behaviors)
                router.add(behavior);
            this._toolBehaviors = { toolId, behaviors };
            gizmos.setGroups(tool.createGizmoGroups?.(ctx) ?? []);
        }
        else {
            gizmos.setGroups([]);
        }
    }
    /** Matches the compositor's pipeline and overlays to the view. */
    _syncRendering() {
        const view = this.view;
        if (!view || !this.renderer)
            return;
        this.compositor.syncPipeline(view);
        this.compositor.syncOverlays(view);
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
            this.editor?.onResized(width, height, this);
        this.tag('resize');
    }
    rendererChanged(change) {
        if (change.oldValue && change.oldValue !== change.value && this._compositor) {
            this._compositor.dispose();
            this._compositor = undefined;
            this._syncBehaviors();
        }
    }
    appletChanged() {
        if (this.applet)
            this.editor = this.applet;
    }
    editorChanged() {
        this._syncDocument();
        this._syncView();
        this._syncBehaviors();
        this.tag('content');
    }
    editorMutated() {
        this._syncDocument();
        if (this._sceneCameraPending || !this.view?.navigation.framed)
            this._syncView();
        this._syncBehaviors();
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
        this._syncBehaviors();
        this.tag('view');
    }
    keymapChanged() {
        if (this._navigation)
            this._navigation.keymap = this.keymap;
        if (this._select)
            this._select.keymap = this.keymap;
    }
    viewMutated() {
        this._syncBehaviors();
        this._syncRendering();
        this.tag('view');
    }
    mutated() {
        this.tag('view');
    }
    /** Called by the RenderScheduler only (ADR-0003). */
    renderView(reasons, frame) {
        if (this._sceneCameraPending)
            this._syncView();
        const editor = this.editor;
        const document = editor.document;
        if (editor.isRendererInitialized() === false) {
            void editor.onRendererInitialized(this.renderer);
        }
        const renderer = this.renderer;
        renderer.setCanvasTarget(this.renderTarget);
        renderer.setSize(this.width, this.height);
        this._syncRendering();
        return this.compositor.render({
            renderer,
            editor,
            document,
            scene: document.scene,
            view: this.view,
            camera: this.getViewCamera(),
            selection: this.selection,
            width: this.width,
            height: this.height,
            pixelRatio: renderer.getPixelRatio(),
            reasons,
            frame,
        });
    }
    dispose() {
        renderScheduler.unregister(this);
        delete this.applet;
        delete this.editor;
        this.renderTarget.dispose();
        this._inputRouter?.dispose();
        this._gizmos?.dispose();
        this._compositor?.dispose();
        if (this._ownsView)
            this.view.dispose();
        if (this.tool) {
            this.tool.unregisterViewport(this);
        }
        super.dispose();
    }
};
__decorate([
    Property({ type: ThreeEditor })
], IoThreeViewport.prototype, "editor", void 0);
__decorate([
    Property({ type: ThreeApplet })
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
    Property({ type: Keymap, value: keymaps.default })
], IoThreeViewport.prototype, "keymap", void 0);
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
