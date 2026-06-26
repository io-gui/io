import { ReactiveElement, IoElementProps } from '@io-gui/core';
import { TodoItemModel } from './TodoItemModel.js';
import { TodoListModel } from './TodoListModel.js';
type TodoItemProps = IoElementProps & {
    item?: TodoItemModel;
    model?: TodoListModel;
};
export declare class TodoItem extends ReactiveElement {
    static get Style(): string;
    item: TodoItemModel;
    model: TodoListModel;
    editing: boolean;
    private $input;
    private _originalTitle;
    constructor(args?: TodoItemProps);
    itemMutated(): void;
    mutated(): void;
    onStartEdit(): void;
    onBlur(): void;
    onInputKey(event: KeyboardEvent): void;
}
export declare const todoItem: (arg0: TodoItemProps) => import("@io-gui/core").VDOMElement;
export {};
