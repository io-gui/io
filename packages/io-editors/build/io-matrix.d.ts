import { ArgsWithBinding, VDOMArray } from 'io-gui';
import { IoVector, IoVectorArgs } from './io-vector.js';
export type IoMatrixArgs = IoVectorArgs & ArgsWithBinding<{
    columns?: number;
}>;
/**
 * Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.
 **/
export declare class IoMatrix extends IoVector {
    static get Style(): string;
    value: number[];
    columns: number;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    static vDOM: (arg0?: IoMatrixArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioMatrix: (arg0?: IoMatrixArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-matrix.d.ts.map