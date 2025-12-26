import { IoElement, IoElementProps } from 'io-core';
import { TodoListModel } from './TodoListModel.js';
type TodoInputProps = IoElementProps & {
    model?: TodoListModel;
};
export declare class TodoInput extends IoElement {
    static get Style(): string;
    model: TodoListModel;
    constructor(args?: TodoInputProps);
    onInputKey(event: KeyboardEvent): void;
    changed(): void;
}
export declare const todoInput: (arg0: TodoInputProps) => import("io-core").VDOMElement;
export {};
//# sourceMappingURL=TodoInput.d.ts.map