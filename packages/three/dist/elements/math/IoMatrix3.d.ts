import { IoMatrixBase, IoMatrixBaseProps } from './IoMatrixBase.js';
export type IoMatrix3Props = IoMatrixBaseProps & {
    value?: number[];
};
export declare class IoMatrix3 extends IoMatrixBase {
    static get Style(): string;
}
export declare const ioMatrix3: (arg0?: IoMatrix3Props) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoMatrix3.d.ts.map