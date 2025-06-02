import { IoElement, IoElementProps } from './IoElement';
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
    static get Listeners(): {
        pointerdown: (string | {
            passive: boolean;
        })[];
        pointermove: (string | {
            passive: boolean;
        })[];
        pointerup: string;
        contextmenu: string;
        mousedown: (string | {
            passive: boolean;
        })[];
        mousemove: (string | {
            passive: boolean;
        })[];
        mouseup: (string | {
            passive: boolean;
        })[];
        touchstart: (string | {
            passive: boolean;
        })[];
        touchmove: (string | {
            passive: boolean;
        })[];
        touchend: (string | {
            passive: boolean;
        })[];
        keydown: (string | {
            passive: boolean;
        })[];
        keyup: (string | {
            passive: boolean;
        })[];
        focusin: (string | {
            passive: boolean;
        })[];
        blur: (string | {
            passive: boolean;
        })[];
        scroll: string;
        wheel: (string | {
            passive: boolean;
        })[];
    };
    constructor(args?: IoElementProps);
    stopPropagation(event: Event): void;
    onPointerup(event: PointerEvent): void;
    onContextmenu(event: Event): void;
    onScroll(event: Event): void;
    onResized(): void;
    appendChild(child: HTMLElement): void;
    removeChild(child: HTMLElement): void;
    onChildExpandedChanged(): void;
    collapse(): void;
    expandAsChildren(): void;
    expandedChanged(): void;
}
export declare const IoOverlaySingleton: IoOverlay;
export {};
//# sourceMappingURL=IoOverlay.d.ts.map