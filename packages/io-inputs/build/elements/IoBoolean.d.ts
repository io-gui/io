import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';
export type IoBooleanArgs = IoInputBaseArgs & ArgsWithBinding<{
    value?: boolean;
    true?: string;
    false?: string;
}>;
/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` strings.
 **/
export declare class IoBoolean extends IoInputBase {
    static vConstructor: (arg0?: IoBooleanArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: boolean;
    true: string;
    false: string;
    role: string;
    constructor(args?: IoBooleanArgs);
    onPointerdown(event: PointerEvent): void;
    onClick(): void;
    toggle(): void;
    init(): void;
    valueChanged(): void;
    changed(): void;
}
export declare const ioBoolean: (arg0?: IoBooleanArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoBoolean.d.ts.map