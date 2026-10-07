import { ReactiveElement, ReactiveElementProps, Change, WithBinding } from '@io-gui/core';
import { WebGPURenderer, CanvasTarget, Scene } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ViewCameras } from '../nodes/ViewCameras.js';
import { ToolBase } from '../nodes/ToolBase.js';
import { DocumentChange, ChangeBus } from '../editor/ChangeBus.js';
import { ScheduledView, DirtyReason } from '../render/RenderScheduler.js';
export type IoThreeViewportProps = ReactiveElementProps & {
    applet: WithBinding<ThreeApplet>;
    overscan?: WithBinding<number>;
    clearColor?: WithBinding<number>;
    clearAlpha?: WithBinding<number>;
    cameraSelect?: WithBinding<string>;
    renderer?: WebGPURenderer;
    tool?: WithBinding<ToolBase>;
};
export declare class IoThreeViewport extends ReactiveElement implements ScheduledView {
    width: number;
    height: number;
    visible: boolean;
    applet: ThreeApplet;
    overscan: number;
    clearColor: number;
    clearAlpha: number;
    cameraSelect: string;
    renderer: WebGPURenderer;
    viewCameras: ViewCameras;
    tool: ToolBase;
    tabIndex: number;
    private _renderTarget;
    get renderTarget(): CanvasTarget;
    attachSurface(): void;
    static get Style(): string;
    static get Listeners(): {};
    constructor(args: IoThreeViewportProps);
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get scene(): Scene | null;
    get changeBus(): ChangeBus | null;
    /** Marks this viewport for redraw on the next frame. */
    tag(reason: DirtyReason): void;
    isRenderable(): boolean;
    getPriority(): 0 | 1 | 2;
    listens(change: DocumentChange): boolean;
    onRendererError(error: Error): void;
    toolChanged(change: Change<ToolBase>): void;
    onResized(): void;
    appletChanged(): void;
    appletMutated(): void;
    viewCamerasMutated(): void;
    mutated(): void;
    /** Called by the RenderScheduler only (ADR-0003). */
    renderView(): void;
    dispose(): void;
}
export declare const ioThreeViewport: (arg0: IoThreeViewportProps) => import("@io-gui/core").VDOMElement;
