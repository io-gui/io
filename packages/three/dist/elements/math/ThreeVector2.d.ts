import { Vector2 } from 'three/webgpu';
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js';
export type ThreeVector2Props = ThreeVectorBaseProps & {
    value?: Vector2;
};
export declare class ThreeVector2 extends ThreeVectorBase {
    value: Vector2;
    keys: Array<string>;
    constructor(args: ThreeVector2Props);
}
export declare const threeVector2: (arg0?: ThreeVector2Props) => import("@io-gui/core").VDOMElement;
