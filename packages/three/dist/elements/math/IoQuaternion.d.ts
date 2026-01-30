import { Quaternion } from 'three/webgpu';
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js';
export type IoQuaternionProps = IoVectorBaseProps & {
    value?: Quaternion;
};
export declare class IoQuaternion extends IoVectorBase {
    value: Quaternion;
    keys: Array<string>;
    constructor(args: IoQuaternionProps);
}
export declare const ioQuaternion: (arg0?: IoQuaternionProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoQuaternion.d.ts.map