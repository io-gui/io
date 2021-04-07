import { Change } from './utils/changeQueue.js';
import { IoElement } from './io-element.js';
export declare class TestElement extends IoElement {
    static get Properties(): any;
    static get Listeners(): {
        'prop0-changed': string;
        'custom-event': string;
    };
    reset(): void;
    constructor(initProps: any);
    changed(): void;
    prop1Changed(change: Change): void;
    onProp1ChangeAlt(event: CustomEvent): void;
    onProp1Change(event: CustomEvent): void;
    onCustomEvent(event: CustomEvent): void;
}
export declare class TestSubelement extends IoElement {
    static get Properties(): any;
}
export default class {
    _changedCounter: number;
    element: TestElement;
    constructor();
    changed(event: CustomEvent): void;
    reset(): void;
    run(): void;
}
//# sourceMappingURL=io-element.test.d.ts.map