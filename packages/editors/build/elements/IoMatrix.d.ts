import { IoVectorArray, IoVectorArrayProps } from './IoVectorArray.js';
export type IoMatrixProps = IoVectorArrayProps & {
    columns?: number;
};
/**
 * Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.
 **/
export declare class IoMatrix extends IoVectorArray {
    static get Style(): string;
    value: number[];
    columns: number;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
}
export declare const ioMatrix: (arg0?: IoMatrixProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoMatrix.d.ts.map