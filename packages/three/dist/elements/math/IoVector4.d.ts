import { Vector4 } from 'three/webgpu';
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js';
export type IoVector4Props = IoVectorBaseProps & {
    value?: Vector4;
};
export declare class IoVector4 extends IoVectorBase {
    value: Vector4;
    keys: Array<string>;
    constructor(args: IoVector4Props);
}
export declare const ioVector4: (arg0?: IoVector4Props) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoVector4.d.ts.map