import 'mocha';
import 'chai';
import { IoElement } from './iogui.js';
export declare function nextTick(): Promise<void>;
export declare class IoTest extends IoElement {
    static get Style(): string;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=iogui.test.d.ts.map