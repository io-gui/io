import { ThreeMatrixBase, ThreeMatrixBaseProps } from './ThreeMatrixBase.js';
export type ThreeMatrix2Props = ThreeMatrixBaseProps & {
    value?: number[];
};
export declare class ThreeMatrix2 extends ThreeMatrixBase {
    static get Style(): string;
}
export declare const threeMatrix2: (arg0?: ThreeMatrix2Props) => import("@io-gui/core").VDOMElement;
