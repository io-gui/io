import { ThreeMatrixBase, ThreeMatrixBaseProps } from './ThreeMatrixBase.js';
export type ThreeMatrix3Props = ThreeMatrixBaseProps & {
    value?: number[];
};
export declare class ThreeMatrix3 extends ThreeMatrixBase {
    static get Style(): string;
}
export declare const threeMatrix3: (arg0?: ThreeMatrix3Props) => import("@io-gui/core").VDOMElement;
