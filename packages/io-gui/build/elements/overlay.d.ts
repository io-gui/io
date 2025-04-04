import { IoElement } from '../core/element';
export type NudgeDirection = 'none' | 'pointer' | 'up' | 'left' | 'down' | 'right';
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
        focusin: string;
        scroll: string;
        wheel: (string | {
            passive: boolean;
        })[];
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
    };
    constructor(properties?: Record<string, any>);
    stopPropagation(event: Event): void;
    onResized(): void;
    onPointerup(event: PointerEvent): void;
    _onCollapse(): void;
    onContextmenu(event: Event): void;
    onFocusIn(event: FocusEvent): void;
    _onScroll(event: Event): void;
    nudgeDown(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
    nudgeUp(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
    nudgeRight(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
    nudgeLeft(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
    nudgePointer(element: HTMLElement, x: number, y: number, elemRect: DOMRect): boolean;
    setElementPosition(element: HTMLElement, direction: NudgeDirection, srcRect: DOMRect): void;
    appendChild(child: HTMLElement): void;
    removeChild(child: HTMLElement): void;
    onChildExpanded(): void;
    onChildExpandedDelayed(): void;
    expandedChanged(): void;
}
export declare const IoOverlaySingleton: IoOverlay;
export {};
//# sourceMappingURL=overlay.d.ts.map