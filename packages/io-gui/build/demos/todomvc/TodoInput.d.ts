import { IoElement } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoInput extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        model: {
            type: typeof TodoListModel;
        };
    };
    onInputKey(event: any): void;
    changed(): void;
}
export declare const todoInput: (arg0?: import("io-gui").IoElementProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=TodoInput.d.ts.map