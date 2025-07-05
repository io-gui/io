import { VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { MenuItem } from 'io-menus';
import { IoTabs } from './IoTabs.js';
type IoTabDragIconProps = IoFieldProps & {
    item?: MenuItem;
};
declare class IoTabDragIcon extends IoField {
    static vConstructor: (arg0?: IoTabDragIconProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    dragging: boolean;
    item: MenuItem;
    dropTarget: IoTabs | null;
    dropIndex: number;
    tabIndex: string;
    constructor(args?: IoTabDragIconProps);
    changed(): void;
}
export declare const tabDragIconSingleton: IoTabDragIcon;
export {};
//# sourceMappingURL=IoTabDragIcon.d.ts.map