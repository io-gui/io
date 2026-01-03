import { IoElement } from '@io-gui/core';
import { ThreeApplet } from '@io-gui/three';
export declare class IoThreeDemo extends IoElement {
    static get Style(): string;
    selectedExample: ThreeApplet;
    selectedExampleOptionChanged(): void;
    ready(): void;
}
export declare const ioThreeDemo: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoThreeDemo.d.ts.map