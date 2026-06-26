import { ReactiveElement, IoElementProps } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
type TodoInputProps = IoElementProps & {
    model?: TodoListModel;
};
export declare class TodoInput extends ReactiveElement {
    static get Style(): string;
    model: TodoListModel;
    constructor(args?: TodoInputProps);
    onInputKey(event: KeyboardEvent): void;
    ready(): void;
}
export declare const todoInput: (arg0: TodoInputProps) => import("@io-gui/core").VDOMElement;
export {};
