import { IoField, IoFieldProps } from '@io-gui/inputs';
import { Tab } from '../nodes/Tab.js';
export type IoTabProps = IoFieldProps & {
    tab: Tab;
};
export declare class IoTab extends IoField {
    static get Style(): string;
    tab: Tab;
    overflow: boolean;
    static get Listeners(): {
        click: string;
        contextmenu: string;
    };
    constructor(args: IoTabProps);
    onResized(): void;
    onTouchmove(event: TouchEvent): void;
    preventDefault(event: Event): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointercancel(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onClick(): void;
    onDeleteClick(): void;
    expandContextEditor(): void;
    onKeydown(event: KeyboardEvent): void;
    tabMutated(): void;
    changed(): void;
}
export declare const ioTab: (arg0: IoTabProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoTab.d.ts.map