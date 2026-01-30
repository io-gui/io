import { Vector3 } from 'three/webgpu';
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js';
export type IoVector3Props = IoVectorBaseProps & {
    value?: Vector3;
};
export declare class IoVector3 extends IoVectorBase {
    value: Vector3;
    keys: Array<string>;
    constructor(args: IoVector3Props);
}
export declare const ioVector3: (arg0?: IoVector3Props) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoVector3.d.ts.map