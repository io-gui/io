import { IoMatrixBase, IoMatrixBaseProps } from './IoMatrixBase.js';
export type IoMatrix4Props = IoMatrixBaseProps & {
    value?: number[];
};
export declare class IoMatrix4 extends IoMatrixBase {
    static get Style(): string;
}
export declare const ioMatrix4: (arg0?: IoMatrix4Props) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoMatrix4.d.ts.map