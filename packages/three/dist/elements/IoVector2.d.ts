import { Vector2 } from 'three/webgpu';
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js';
export type IoVector2Props = IoVectorBaseProps & {
    value?: Vector2;
};
export declare class IoVector2 extends IoVectorBase {
    value: Vector2;
    keys: Array<string>;
    constructor(args: IoVector2Props);
}
export declare const ioVector2: (arg0?: IoVector2Props) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoVector2.d.ts.map