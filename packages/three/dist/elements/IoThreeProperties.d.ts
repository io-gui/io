import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import './Three.js';
export type IoThreePropertiesProps = IoElementProps & {
    applet: WithBinding<ThreeApplet>;
};
export declare class IoThreeProperties extends IoElement {
    applet: ThreeApplet;
    static get Style(): string;
    constructor(args: IoThreePropertiesProps);
    changed(): void;
}
export declare const ioThreeProperties: (arg0: IoThreePropertiesProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoThreeProperties.d.ts.map