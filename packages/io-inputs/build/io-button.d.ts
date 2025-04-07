import { ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';
export type IoButtonArgs = IoInputBaseArgs & ArgsWithBinding<{
    action?: Function;
    pressed?: boolean;
}>;
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
 **/
export declare class IoButton extends IoInputBase {
    static get Style(): string;
    action?: Function;
    value: any;
    appearance: 'flush' | 'inset' | 'outset' | 'neutral';
    pressed: boolean;
    role: string;
    constructor(args?: IoButtonArgs);
    onPointerdown(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    onClick(): void;
    init(): void;
    changed(): void;
}
export declare const ioButton: (arg0?: IoInputBaseArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-button.d.ts.map