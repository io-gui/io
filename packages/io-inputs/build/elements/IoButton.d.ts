import { PropsWithBinding, VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from './IoField';
export type IoButtonProps = IoFieldProps & PropsWithBinding<{
    action?: Function;
}>;
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
export declare class IoButton extends IoField {
    static vConstructor: (arg0?: IoButtonProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: any;
    action?: Function;
    appearance: 'inset' | 'outset' | 'neutral';
    role: string;
    constructor(args?: IoButtonProps);
    onPointerdown(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    onClick(event: MouseEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioButton: (arg0?: IoButtonProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoButton.d.ts.map