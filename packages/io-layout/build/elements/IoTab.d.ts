import { VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { MenuItem } from 'io-menus';
import { IoPanel } from './IoPanel.js';
export type TabEditCommand = 'delete' | 'shiftLeft' | 'shiftRight' | 'shiftUp' | 'shiftDown' | 'shiftStart' | 'shiftEnd';
export type TabData = {
    id?: string;
    label?: string;
    icon?: string;
    hint?: string;
};
export type IoTabProps = IoFieldProps & {
    item?: MenuItem;
    $parent?: IoPanel;
};
export declare class IoTab extends IoField {
    static vConstructor: (arg0?: IoTabProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    item: MenuItem;
    $parent?: IoPanel;
    constructor(args?: IoTabProps);
    preventDefault(event: Event): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointerupAction(event: PointerEvent): void;
    onClick(): void;
    onCloseClick(): void;
    onKeydown(event: KeyboardEvent): void;
    itemChanged(): void;
    itemMutated(): void;
    changed(): void;
}
export declare const ioTab: (arg0?: IoTabProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoTab.d.ts.map