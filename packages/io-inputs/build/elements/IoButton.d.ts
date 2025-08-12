import { IoField, IoFieldProps } from './IoField.js';
export type IoButtonProps = IoFieldProps & {
    action?: Function;
};
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
export declare class IoButton extends IoField {
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
    ready(): void;
    changed(): void;
}
export declare const ioButton: (arg0?: IoButtonProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoButton.d.ts.map