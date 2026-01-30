import { Euler } from 'three/webgpu';
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js';
export type IoEulerProps = IoVectorBaseProps & {
    value?: Euler;
};
export declare class IoEuler extends IoVectorBase {
    value: Euler;
    keys: Array<string>;
    constructor(args: IoEulerProps);
}
export declare const ioEuler: (arg0?: IoEulerProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoEuler.d.ts.map