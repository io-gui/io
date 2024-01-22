import 'mocha/mocha.js';
import 'chai/chai.js';
import { IoElement } from './iogui.js';
export declare function nextTick(): Promise<void>;
export declare function afterHashChange(): Promise<void>;
export declare class IoGuiTestPage extends IoElement {
    static get Style(): string;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=iogui.test.d.ts.map