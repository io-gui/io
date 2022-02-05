import { IoElement } from '../../core/io-element.js';
declare type NudgeDirection = 'pointer' | 'top' | 'left' | 'bottom' | 'right';
declare class IoLayer extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        pointerup: string;
        contextmenu: string;
        focusin: string;
        scroll: string;
        wheel: string;
        mousedown: string;
        mouseup: string;
        mousemove: string;
        touchstart: string;
        touchmove: string;
        touchend: string;
        keydown: string;
        keyup: string;
    };
    constructor(properties?: Record<string, any>);
    stopPropagation(event: Event): void;
    _onPointerup(event: PointerEvent): void;
    _collapse(): void;
    _onContextmenu(event: Event): void;
    _onFocusIn(event: FocusEvent): void;
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
export declare const IoLayerSingleton: IoLayer;
export {};
//# sourceMappingURL=layer.d.ts.map