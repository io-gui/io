import { ThreeMatrixBase, ThreeMatrixBaseProps } from './ThreeMatrixBase.js';
export type ThreeMatrix4Props = ThreeMatrixBaseProps & {
    value?: number[];
};
export declare class ThreeMatrix4 extends ThreeMatrixBase {
    static get Style(): string;
}
export declare const threeMatrix4: (arg0?: ThreeMatrix4Props) => import("@io-gui/core").VDOMElement;
