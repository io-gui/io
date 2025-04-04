import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';
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
    static get Style(): string;
    value: boolean;
    true: string;
    false: string;
    type: string;
    role: string;
    onClick(): void;
    toggle(): void;
    init(): void;
    changed(): void;
    static vDOM: (arg0?: IoBooleanArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioBoolean: (arg0?: IoBooleanArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-boolean.d.ts.map