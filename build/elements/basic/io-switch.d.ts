import { IoBoolean } from './io-boolean.js';
/**
 * Input element for `Boolean` data type displayed as switch.
 *
 * <io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>
 **/
export declare class IoSwitch extends IoBoolean {
    static get Style(): string;
    init(): void;
    changed(): void;
    valueChanged(): void;
}
//# sourceMappingURL=io-switch.d.ts.map