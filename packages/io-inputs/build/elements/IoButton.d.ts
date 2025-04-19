import { ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';
export type IoButtonArgs = IoInputBaseArgs & ArgsWithBinding<{
    action?: Function;
}>;
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
export declare class IoButton extends IoInputBase {
    static get Style(): string;
    value: any;
    action?: Function;
    appearance: 'inset' | 'outset' | 'neutral';
    role: string;
    constructor(args?: IoButtonArgs);
    onPointerdown(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    onClick(event: MouseEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioButton: (arg0?: IoInputBaseArgs | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoButton.d.ts.map