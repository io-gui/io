import { VDOMElement } from '../core/VDOM';
import { ArgsWithBinding } from '../nodes/Node';
import { IoElement, IoElementArgs } from './IoElement';
export type IoFieldArgs = IoElementArgs & ArgsWithBinding<{
    appearance?: 'flush' | 'inset' | 'outset' | 'neutral';
    selected?: boolean;
    invalid?: boolean;
    disabled?: boolean;
}>;
export declare class IoField extends IoElement {
    static vConstructor: (arg0?: IoFieldArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    appearance: 'flush' | 'inset' | 'outset' | 'neutral';
    selected: boolean;
    invalid: boolean;
    disabled: boolean;
    constructor(args?: IoFieldArgs);
    disabledChanged(): void;
}
export declare const ioField: (arg0?: IoFieldArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoField.d.ts.map