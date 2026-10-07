import { ReactiveElement, ReactiveElementProps, Change, WithBinding } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget, Scene, Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ThreeEditor } from '../editor/ThreeEditor.js';
import { ToolBase } from '../nodes/ToolBase.js';
import { ThreeView } from '../view/ThreeView.js';
import { InputRouter } from '../input/InputRouter.js';
import { Keymap } from '../input/Keymap.js';
import { NavigationBehavior } from '../input/behaviors/NavigationBehavior.js';
import { SelectBehavior } from '../input/behaviors/SelectBehavior.js';
import type { SelectionModel } from '../selection/SelectionModel.js';
import { DocumentChange, ChangeBus } from '../editor/ChangeBus.js';
import { ScheduledView, DirtyReason, FrameInfo, ViewRenderResult } from '../render/RenderScheduler.js';
import { ViewCompositor } from '../render/ViewCompositor.js';
import { GizmoLayer } from '../tools/Gizmo.js';
import type { Picker } from '../selection/Picker.js';
import { ComponentPicker } from '../selection/ComponentPicker.js';
export type IoThreeViewportProps = ReactiveElementProps & {
    /** The editor whose active document this viewport shows. */
    editor?: WithBinding<ThreeEditor>;
    /** Compatibility alias: a ThreeApplet is a ThreeEditor; setting it sets `editor`. */
    applet?: WithBinding<ThreeApplet>;
    /** View state to show. Pass one to keep navigation across remounts; otherwise the viewport makes its own. */
    view?: WithBinding<ThreeView>;
    /** Shorthand that sets the view: `'perspective'`, an axis (`'top'`, `'front'`, ...), `'scene'` or `'scene:<camera name>'`. */
    cameraSelect?: WithBinding<string>;
    /** Navigation and selection bindings (default: `keymaps.default`, OrbitControls-like navigation). */
    keymap?: Keymap;
    renderer?: WebGPURenderer;
    tool?: WithBinding<ToolBase>;
};
export declare class IoThreeViewport extends ReactiveElement implements ScheduledView {
    width: number;
    height: number;
    visible: boolean;
    editor: ThreeEditor;
    applet: ThreeApplet;
    view: ThreeView;
    /** Empty leaves the view as it is. */
    cameraSelect: string;
    renderer: WebGPURenderer;
    keymap: Keymap;
    tool: ToolBase;
    tabIndex: number;
    private _renderTarget;
    get renderTarget(): CanvasTarget;
    attachSurface(): void;
    static get Style(): string;
    static get Listeners(): {
        'frame-object': string;
    };
    private _ownsView;
    /** `cameraSelect` asks for a scene camera that is not in the scene yet (assets still loading). */
    private _sceneCameraPending;
    private _inputRouter;
    private _navigation;
    private _select;
    private _gizmos;
    private _toolBehaviors;
    private _compositor;
    private _shownDocument;
    private _idPass;
    private _idPicker;
    /** Routes this viewport's input to behaviors: navigation, tools, later gizmos and operators (ADR-0004). */
    get inputRouter(): InputRouter;
    /** Runs this viewport's pipeline and draws its overlays (ADR-0006). Recreated when the renderer changes. */
    get compositor(): ViewCompositor;
    /** Gizmos of the active tool in this viewport. */
    get gizmoLayer(): GizmoLayer;
    /** The pipeline's picker when it has one (UV view), otherwise null (raycast the content scene). */
    get picker(): Picker | null;
    /**
     * How edit mode picks components here: the pipeline's (UV view) or an ID-buffer picker drawing this
     * viewport's camera at its size (ADR-0007). The ID buffer is cached until content changes.
     */
    get componentPicker(): ComponentPicker;
    get navigationBehavior(): NavigationBehavior;
    get selectBehavior(): SelectBehavior;
    constructor(args: IoThreeViewportProps);
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get scene(): Scene | null;
    get changeBus(): ChangeBus | null;
    get mode(): string | undefined;
    get selection(): SelectionModel | null;
    /** Marks this viewport for redraw on the next frame. */
    tag(reason: DirtyReason): void;
    isRenderable(): boolean;
    getPriority(): 0 | 1 | 2;
    listens(change: DocumentChange): DirtyReason | false;
    onRendererError(error: Error): void;
    /** The camera this viewport draws and picks with, built from its view at the current size. */
    getViewCamera(): PerspectiveCamera | OrthographicCamera;
    /** Applet event `frame-object` with `{object, overscan?}`: frames the object in this viewport's view. */
    onFrameObject(event: CustomEvent<{
        object: Object3D;
        overscan?: number;
    }>): void;
    private _syncView;
    /** On a document switch, park this view's navigation for the old document and restore it for the new one. */
    private _syncDocument;
    /**
     * Installs navigation, selection, gizmos and the editor's active tool according to the view's interaction
     * profile. Gizmos need the `full` profile and the view's `gizmos` overlay flag (default on).
     */
    private _syncBehaviors;
    /** Matches the compositor's pipeline and overlays to the view. */
    private _syncRendering;
    toolChanged(change: Change<ToolBase>): void;
    onResized(): void;
    rendererChanged(change: Change<WebGPURenderer>): void;
    appletChanged(): void;
    editorChanged(): void;
    editorMutated(): void;
    cameraSelectChanged(): void;
    viewChanged(change: Change<ThreeView>): void;
    keymapChanged(): void;
    viewMutated(): void;
    mutated(): void;
    /** Called by the RenderScheduler only (ADR-0003). */
    renderView(reasons: ReadonlySet<DirtyReason>, frame: FrameInfo): ViewRenderResult | void;
    dispose(): void;
}
export declare const ioThreeViewport: (arg0: IoThreeViewportProps) => import("@io-gui/core").VDOMElement;
