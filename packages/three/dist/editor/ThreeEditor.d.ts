import { ReactiveObject, ReactiveObjectProps, Change } from '@io-gui/core';
import { WebGPURenderer } from 'three/webgpu';
import { ChangeBus, DocumentChange } from './ChangeBus.js';
import { ThreeDocument } from './ThreeDocument.js';
import { FrameInfo, ScheduledTicker } from '../render/RenderScheduler.js';
import { OperatorRegistry } from '../tools/Operator.js';
import { ToolDefinition, ToolRegistry } from '../tools/Tool.js';
import { SelectionModel } from '../selection/SelectionModel.js';
import type { ViewKind } from '../view/ThreeView.js';
import type { IoThreeViewport } from '../elements/IoThreeViewport.js';
export type ThreeEditorProps = ReactiveObjectProps & {
    document?: ThreeDocument;
    mode?: string;
    isPlaying?: boolean;
};
/**
 * The app object (ADR-0002): one active ThreeDocument (switchable at runtime), the editor mode,
 * playback, operators and tools. Viewports read `editor.document`; they never hold a document themselves.
 */
export declare class ThreeEditor extends ReactiveObject implements ScheduledTicker {
    document: ThreeDocument;
    /** `'object'`, `'edit'`, ... Picks the active tool and keymap entries with `when.mode`. */
    mode: string;
    isPlaying: boolean;
    /** Active tool id per `'<viewKind>:<mode>'`. Replace the object to change it (or use `setActiveTool`). */
    activeTools: Record<string, string>;
    /** Selection of the active document. Session state; each document keeps its own (ADR-0007). */
    selection: SelectionModel;
    _renderer: WebGPURenderer | null;
    private _operators;
    private _tools;
    private _selections;
    constructor(args?: ThreeEditorProps);
    get operators(): OperatorRegistry;
    get tools(): ToolRegistry;
    /** The active document's change bus; the scheduler drains it each frame. */
    get changeBus(): ChangeBus;
    setActiveTool(viewKind: ViewKind, mode: string, toolId: string | null): void;
    getActiveTool(viewKind: ViewKind, mode?: string): ToolDefinition | null;
    documentChanged(change: Change<ThreeDocument>): void;
    private _selectionFor;
    isPlayingChanged(): void;
    tick(frame: FrameInfo): void;
    /** Reports a change in the active document (the source is always the document). */
    notify(change: Omit<DocumentChange, 'source'> & {
        source?: object;
    }): void;
    /** Redraws every view showing the active document on the next frame. */
    requestRender(): void;
    isRendererInitialized(): boolean;
    onRendererInitialized(renderer: WebGPURenderer): void;
    /**
     * @deprecated Size belongs to each view (ADR-0002). Called when a viewport showing this editor resizes;
     * with several viewports, the last one resized wins.
     */
    onResized(width: number, height: number, viewport?: IoThreeViewport): void;
    onAnimate(delta: number, time: number): void;
    dispose(): void;
}
