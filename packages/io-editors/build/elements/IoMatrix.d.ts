import { VDOMElement } from 'io-gui';
import { IoVector, IoVectorProps } from './IoVector.js';
export type IoMatrixProps = IoVectorProps & {
    columns?: number;
};
/**
 * Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.
 **/
export declare class IoMatrix extends IoVector {
    static vConstructor: (arg0?: IoMatrixProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: number[];
    columns: number;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
}
export declare const ioMatrix: (arg0?: IoMatrixProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMatrix.d.ts.map