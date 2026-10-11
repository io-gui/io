import { Vector3 } from 'three/webgpu';
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js';
export type ThreeVector3Props = ThreeVectorBaseProps & {
    value?: Vector3;
};
export declare class ThreeVector3 extends ThreeVectorBase {
    value: Vector3;
    keys: Array<string>;
    constructor(args: ThreeVector3Props);
}
export declare const threeVector3: (arg0?: ThreeVector3Props) => import("@io-gui/core").VDOMElement;
