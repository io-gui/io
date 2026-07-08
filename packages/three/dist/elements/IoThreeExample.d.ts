import { ReactiveElement } from '@io-gui/core';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
export declare class IoThreeExample extends ReactiveElement {
    static get Style(): string;
    applet: ThreeApplet;
    ready(): void;
    dispose(): void;
}
export declare const ioThreeExample: (arg0: any) => import("@io-gui/core").VDOMElement;
