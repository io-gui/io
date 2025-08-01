import { IoElement, IoElementProps } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
type TodoInputProps = IoElementProps & {
    model?: TodoListModel;
};
export declare class TodoInput extends IoElement {
    static get Style(): string;
    model: TodoListModel;
    constructor(args?: TodoInputProps);
    onInputKey(event: CustomEvent): void;
    changed(): void;
}
export declare const todoInput: (arg0: TodoInputProps) => import("io-gui").VDOMElement;
export {};
//# sourceMappingURL=TodoInput.d.ts.map