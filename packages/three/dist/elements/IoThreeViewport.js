var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, Field } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget } from 'three/webgpu';
import { ThreeEditor } from '../editor/ThreeEditor.js';
import { toolAllowsProfile } from '../tools/Tool.js';
import { ThreeView } from '../view/ThreeView.js';
import { InputRouter } from '../input/InputRouter.js';
import { Keymap, keymaps } from '../input/Keymap.js';
import { NavigationBehavior } from '../input/behaviors/NavigationBehavior.js';
import { SelectBehavior } from '../input/behaviors/SelectBehavior.js';
import { renderScheduler, getDefaultRenderer } from '../render/RenderScheduler.js';
import { ViewCompositor } from '../render/ViewCompositor.js';
import { GizmoLayer } from '../tools/Gizmo.js';
import { IdComponentPicker } from '../selection/ComponentPicker.js';
import { IdPass } from '../render/IdPass.js';
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
    renderTarget = new CanvasTarget(document.createElement('canvas'));
    /**
     * Routes this viewport's input to navigation, selection, gizmos and the active tool (ADR-0004).
     * Class fields exist only after the base constructor, where change handlers already run; those skip routing.
     */
    inputRouter = new InputRouter(this);
    navigationBehavior = new NavigationBehavior(this);
    selectBehavior = new SelectBehavior(this);
    /** Gizmos of the active tool in this viewport. */
    gizmoLayer = new GizmoLayer(this);
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
            'navigation-changed': 'onNavigationChanged',
        };
    }
    /** Runs this viewport's pipeline and draws its overlays (ADR-0006). Recreated when the renderer changes. */
    get compositor() {
        if (!this._compositor)
            this._compositor = new ViewCompositor(this.renderer);
        return this._compositor;
    }
    /** The pipeline's picker when it has one (UV view), otherwise null (raycast the content scene). */
    get picker() {
        return this._compositor?.pipeline?.picker ?? null;
    }
    /**
     * How edit mode picks components here: the pipeline's (UV view) or an ID-buffer picker drawing this
     * viewport's camera at its size (ADR-0007). The ID buffer is cached until content changes.
     */
    get componentPicker() {
        const pipelinePicker = this._compositor?.pipeline?.componentPicker;
        if (pipelinePicker)
            return pipelinePicker;
        if (!this._idPicker) {
            this._idPicker = new IdComponentPicker({
                source: (_host, camera, objects, width, height) => {
                    const scene = this.scene;
                    if (!scene || !this.renderer?.initialized)
                        return Promise.resolve(null);
                    if (!this._idPass)
                        this._idPass = new IdPass(this.renderer);
                    return this._idPass.read(scene, camera, objects, width, height);
                },
            });
        }
        return this._idPicker;
    }
    constructor(args) {
        super({
            ...args,
            view: args.view ?? new ThreeView(),
            renderer: args.renderer ?? getDefaultRenderer(),
        });
        this._ownsView = !args.view;
        this.keymapChanged();
        this._syncBehaviors();
    }
    connectedCallback() {
        super.connectedCallback();
        observer.observe(this);
        if (this.renderTarget.domElement.parentElement !== this)
            this.appendChild(this.renderTarget.domElement);
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
        if (reason === 'content')
            this._idPicker?.invalidate();
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
        // Pipeline and overlays are synced on view changes and before each draw, not here.
        const reason = this._compositor?.listens(change) ?? 'content';
        if (reason === 'content')
            this._idPicker?.invalidate();
        return reason;
    }
    onRendererError(error) {
        this.textContent = error.message;
    }
    /** The camera this viewport draws and picks with, built from its view at the current size. */
    getViewCamera() {
        return this.view.getCamera(this.width, this.height, this.scene);
    }
    /** Event `frame-object` with `{object, overscan?}`: frames the object in this viewport's view. */
    onFrameObject(event) {
        event.stopPropagation();
        this.view.frame(event.detail.object, event.detail.overscan ?? 1);
    }
    /** Event `navigation-changed` from the view: camera moves only redraw, they change no behaviors, pipeline or overlays. */
    onNavigationChanged(event) {
        event.stopPropagation();
        this.tag('view');
    }
    _syncView() {
        const view = this.view;
        const scene = this.scene;
        if (!view)
            return;
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
        const router = this.inputRouter;
        if (!view || !router)
            return;
        const gizmos = this.gizmoLayer;
        if (view.profile === 'none')
            router.remove(this.navigationBehavior);
        else
            router.add(this.navigationBehavior);
        if (view.profile === 'full' || view.profile === 'select')
            router.add(this.selectBehavior);
        else
            router.remove(this.selectBehavior);
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
        // Behaviors and gizmo groups get the view and editor at creation, so a swap of either rebuilds them.
        const current = this._toolBehaviors;
        if ((current?.toolId ?? null) === toolId && (!current || (current.view === view && current.editor === this.editor)))
            return;
        for (const behavior of this._toolBehaviors?.behaviors ?? [])
            router.remove(behavior);
        this._toolBehaviors = undefined;
        if (tool && toolId) {
            const ctx = { editor: this.editor, host: this, view };
            const behaviors = tool.createBehaviors(ctx);
            for (const behavior of behaviors)
                router.add(behavior);
            this._toolBehaviors = { toolId, view, editor: this.editor, behaviors };
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
        this.tag('resize');
    }
    rendererChanged(change) {
        if (!change.oldValue)
            return;
        this._idPass?.dispose();
        this._idPass = undefined;
        this._idPicker?.invalidate();
        this._compositor?.dispose();
        this._compositor = undefined;
        // The gizmo layer is an overlay of the new compositor.
        this._syncBehaviors();
    }
    editorChanged() {
        this._syncDocument();
        this._syncView();
        this._syncBehaviors();
        this.tag('content');
    }
    editorMutated() {
        this.editorChanged();
    }
    viewChanged(change) {
        if (this._ownsView && change.oldValue) {
            change.oldValue.dispose();
            this._ownsView = false;
        }
        this._syncView();
        this._syncBehaviors();
        this.tag('view');
    }
    keymapChanged() {
        if (!this.navigationBehavior)
            return;
        this.navigationBehavior.keymap = this.keymap;
        this.selectBehavior.keymap = this.keymap;
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
        const editor = this.editor;
        const document = editor.document;
        if (editor.isRendererInitialized() === false) {
            void editor.onRendererInitialized(this.renderer);
        }
        document._prepareRenderer(this.renderer);
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
        delete this.editor;
        this.renderTarget.dispose();
        this.inputRouter.dispose();
        this.gizmoLayer.dispose();
        this._compositor?.dispose();
        this._idPass?.dispose();
        if (this._ownsView)
            this.view.dispose();
        super.dispose();
    }
};
__decorate([
    Property({ type: ThreeEditor })
], IoThreeViewport.prototype, "editor", void 0);
__decorate([
    Property({ type: ThreeView })
], IoThreeViewport.prototype, "view", void 0);
__decorate([
    Property({ type: WebGPURenderer })
], IoThreeViewport.prototype, "renderer", void 0);
__decorate([
    Property({ type: Keymap, value: keymaps.default })
], IoThreeViewport.prototype, "keymap", void 0);
__decorate([
    Field(0)
], IoThreeViewport.prototype, "tabIndex", void 0);
IoThreeViewport = __decorate([
    Register
], IoThreeViewport);
export { IoThreeViewport };
export const ioThreeViewport = function (arg0) {
    return IoThreeViewport.vConstructor(arg0);
};
