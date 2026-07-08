import { IoField, IoFieldProps } from '@io-gui/inputs';
import { Tab } from '../models/Tab.js';
export type IoTabData = IoFieldProps & {
    model: Tab;
};
export type TabActions = 'select' | 'delete' | 'move-left' | 'move-right' | 'move-start' | 'move-end';
export type TabDragPhase = 'start' | 'move' | 'end' | 'cancel';
export declare class IoTab extends IoField {
    static get Style(): string;
    model: Tab;
    overflow: boolean;
    private _pointerDown;
    private _dragging;
    constructor(args: IoTabData);
    onResized(): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointercancel(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onClick(): void;
    dispatchAction(action: TabActions): void;
    dispatchDrag(phase: TabDragPhase, x: number, y: number): void;
    stopPropagation(event: PointerEvent): void;
    onClose(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    modelMutated(): void;
    mutated(): void;
}
export declare const ioTab: (arg0: IoTabData) => import("@io-gui/core").VDOMElement;
