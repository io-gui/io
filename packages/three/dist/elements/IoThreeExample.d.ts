import { IoElement } from '@io-gui/core';
import { PropertyConfig, PropertyGroups } from '@io-gui/editors';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
export declare class IoThreeExample extends IoElement {
    static get Style(): string;
    uiConfig: PropertyConfig[];
    uiGroups: PropertyGroups;
    applet: ThreeApplet;
    ready(): void;
    dispose(): void;
}
export declare const ioThreeExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoThreeExample.d.ts.map