import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { IoTabs } from './IoTabs.js';
type IoTabDropMarkerProps = IoElementProps & {};
declare class IoTabDropMarker extends IoElement {
    static vConstructor: (arg0?: IoTabDropMarkerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    dropTarget: IoTabs | null;
    dropIndex: number;
    constructor(args?: IoTabDropMarkerProps);
    changed(): void;
}
export declare const tabDropMarkerSingleton: IoTabDropMarker;
export {};
//# sourceMappingURL=IoTabDropMarker.d.ts.map