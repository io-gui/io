import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';
export type IoBooleanArgs = IoInputBaseArgs & ArgsWithBinding<{
    value?: boolean;
    true?: string;
    false?: string;
}>;
/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` string or icon depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
export declare class IoBoolean extends IoInputBase {
    static vConstructor: (arg0?: IoBooleanArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    value: boolean;
    true: string;
    false: string;
    type: string;
    role: string;
    constructor(args?: IoBooleanArgs);
    onClick(): void;
    toggle(): void;
    init(): void;
    changed(): void;
}
export declare const ioBoolean: (arg0?: IoBooleanArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoBoolean.d.ts.map