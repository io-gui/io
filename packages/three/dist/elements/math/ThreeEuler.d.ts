import { Euler } from 'three/webgpu';
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js';
export type ThreeEulerProps = ThreeVectorBaseProps & {
    value?: Euler;
};
export declare class ThreeEuler extends ThreeVectorBase {
    value: Euler;
    keys: Array<string>;
    constructor(args: ThreeEulerProps);
}
export declare const threeEuler: (arg0?: ThreeEulerProps) => import("@io-gui/core").VDOMElement;
