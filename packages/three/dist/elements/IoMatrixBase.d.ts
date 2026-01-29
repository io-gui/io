import { IoElement, IoElementProps } from '@io-gui/core';
export type IoMatrixBaseProps = IoElementProps & {
    value?: number[];
    disabled?: boolean;
};
/**
 * Input element for vector arrays and objects.
 **/
export declare class IoMatrixBase extends IoElement {
    static get Style(): string;
    value: Array<number>;
    disabled: boolean;
    keys: number[];
    constructor(args: IoMatrixBaseProps);
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    changed(): void;
}
//# sourceMappingURL=IoMatrixBase.d.ts.map