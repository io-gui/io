import { ListenerDefinitions } from '../nodes/ReactiveObject.js';
import { ReactiveElement, ReactiveElementProps } from './ReactiveElement.js';
export type IoExpandable = {
    expanded: boolean;
};
/**
 * Singleton full-window overlay; blocks pointer events when {@link expanded} and collapses children on backdrop click.
 */
declare class IoOverlay extends ReactiveElement {
    static get Style(): string;
    expanded: boolean;
    static get Listeners(): ListenerDefinitions;
    constructor(args?: ReactiveElementProps);
    init(): void;
    stopPropagation(event: Event): void;
    onPointerup(event: PointerEvent): void;
    onContextmenu(event: Event): void;
    onScroll(event: Event): void;
    onResized(): void;
    appendChild<El extends Node>(child: El): El;
    removeChild<El extends Node>(child: El): El;
    onChildExpandedChanged(): void;
    collapse(): void;
    expandAsChildren(): void;
    expandedChanged(): void;
}
export declare const IoOverlaySingleton: IoOverlay;
export {};
