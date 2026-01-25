import { ListenerDefinitions } from '../nodes/ReactiveNode.js';
import { IoElement, IoElementProps } from './IoElement.js';
/**
 * This element is designed to be used as a singleton `IoOverlaySingleton`.
 * It is a pointer-blocking element covering the entire window at a very high z-index.
 * It is designed to be displayed on top all other elements and contain elements like modals, popovers, floating menus etc.
 * When clicked, IoOverlay collapses all child elements by setting their `expanded` property to `false`.
 * Child elements should emmit bubbling `"expanded"` event when expanded/collapsed.
 **/
declare class IoOverlay extends IoElement {
    static get Style(): string;
    expanded: boolean;
    static get Listeners(): ListenerDefinitions;
    constructor(args?: IoElementProps);
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
//# sourceMappingURL=IoOverlay.d.ts.map