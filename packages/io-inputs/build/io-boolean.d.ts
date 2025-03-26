import { IoField } from 'io-gui';
/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` string or icon depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
export declare class IoBoolean extends IoField {
    static get Style(): string;
    value: boolean;
    true: string;
    false: string;
    role: string;
    _onClick(): void;
    toggle(): void;
    init(): void;
    changed(): void;
}
//# sourceMappingURL=io-boolean.d.ts.map