import { ReactiveElement, ReactiveElementProps, Change, WithBinding } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget, Scene, Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ToolBase } from '../nodes/ToolBase.js';
import { ThreeView } from '../view/ThreeView.js';
import { DocumentChange, ChangeBus } from '../editor/ChangeBus.js';
import { ScheduledView, DirtyReason } from '../render/RenderScheduler.js';
export type IoThreeViewportProps = ReactiveElementProps & {
    applet: WithBinding<ThreeApplet>;
    /** View state to show. Pass one to keep navigation across remounts; otherwise the viewport makes its own. */
    view?: WithBinding<ThreeView>;
    /** Shorthand that sets the view: `'perspective'`, an axis (`'top'`, `'front'`, ...), `'scene'` or `'scene:<camera name>'`. */
    cameraSelect?: WithBinding<string>;
    renderer?: WebGPURenderer;
    tool?: WithBinding<ToolBase>;
};
export declare class IoThreeViewport extends ReactiveElement implements ScheduledView {
    width: number;
    height: number;
    visible: boolean;
    applet: ThreeApplet;
    view: ThreeView;
    /** Empty leaves the view as it is. */
    cameraSelect: string;
    renderer: WebGPURenderer;
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
    private _orbitControls;
    constructor(args: IoThreeViewportProps);
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get scene(): Scene | null;
    get changeBus(): ChangeBus | null;
    /** Marks this viewport for redraw on the next frame. */
    tag(reason: DirtyReason): void;
    isRenderable(): boolean;
    getPriority(): 1 | 0 | 2;
    listens(change: DocumentChange): boolean;
    onRendererError(error: Error): void;
    /** The camera this viewport draws and picks with, built from its view at the current size. */
    getViewCamera(): PerspectiveCamera | OrthographicCamera;
    /** Applet event `frame-object` with `{object, overscan?}`: frames the object in this viewport's view. */
    onFrameObject(event: CustomEvent<{
        object: Object3D;
        overscan?: number;
    }>): void;
    private _syncView;
    toolChanged(change: Change<ToolBase>): void;
    onResized(): void;
    appletChanged(): void;
    appletMutated(): void;
    cameraSelectChanged(): void;
    viewChanged(change: Change<ThreeView>): void;
    viewMutated(): void;
    mutated(): void;
    /** Called by the RenderScheduler only (ADR-0003). */
    renderView(): void;
    dispose(): void;
}
export declare const ioThreeViewport: (arg0: IoThreeViewportProps) => import("@io-gui/core").VDOMElement;
