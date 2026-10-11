import { Vector4 } from 'three/webgpu';
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js';
export type ThreeVector4Props = ThreeVectorBaseProps & {
    value?: Vector4;
};
export declare class ThreeVector4 extends ThreeVectorBase {
    value: Vector4;
    keys: Array<string>;
    constructor(args: ThreeVector4Props);
}
export declare const threeVector4: (arg0?: ThreeVector4Props) => import("@io-gui/core").VDOMElement;
