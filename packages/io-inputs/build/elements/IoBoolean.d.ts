import { WithBinding } from 'io-gui';
import { IoField, IoFieldProps } from './IoField.js';
export type IoBooleanProps = IoFieldProps & {
    value?: WithBinding<boolean>;
    true?: string;
    false?: string;
};
/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` strings.
 **/
export declare class IoBoolean extends IoField {
    static get Style(): string;
    value: boolean;
    true: string;
    false: string;
    role: string;
    constructor(args?: IoBooleanProps);
    onClick(): void;
    toggle(): void;
    ready(): void;
    valueChanged(): void;
    changed(): void;
}
export declare const ioBoolean: (arg0?: IoBooleanProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoBoolean.d.ts.map