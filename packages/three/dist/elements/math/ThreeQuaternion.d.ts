import { Quaternion } from 'three/webgpu';
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js';
export type ThreeQuaternionProps = ThreeVectorBaseProps & {
    value?: Quaternion;
};
export declare class ThreeQuaternion extends ThreeVectorBase {
    value: Quaternion;
    keys: Array<string>;
    constructor(args: ThreeQuaternionProps);
}
export declare const threeQuaternion: (arg0?: ThreeQuaternionProps) => import("@io-gui/core").VDOMElement;
