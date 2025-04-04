import { IoElement, IoElementArgs, VDOMArray } from '../core/element';
import { ArgsWithBinding } from '../core/node';
export type IoFieldArgs = IoElementArgs & ArgsWithBinding<{
    appearance?: 'flush' | 'inset' | 'outset' | 'neutral';
    selected?: boolean;
    invalid?: boolean;
    disabled?: boolean;
}>;
export declare class IoField extends IoElement {
    static get Style(): string;
    appearance: 'flush' | 'inset' | 'outset' | 'neutral';
    selected: boolean;
    invalid: boolean;
    disabled: boolean;
    disabledChanged(): void;
    static vDOM: (arg0?: IoFieldArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioField: (arg0?: IoFieldArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=field.d.ts.map