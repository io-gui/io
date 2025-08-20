import { IoElement, IoElementProps } from 'io-core';
import { TodoItemModel } from './TodoItemModel.js';
import { TodoListModel } from './TodoListModel.js';
type TodoItemProps = IoElementProps & {
    item?: TodoItemModel;
    model?: TodoListModel;
};
export declare class TodoItem extends IoElement {
    static get Style(): string;
    item: TodoItemModel;
    model: TodoListModel;
    editing: boolean;
    private $input;
    private _originalTitle;
    constructor(args?: TodoItemProps);
    itemMutated(): void;
    changed(): void;
    onStartEdit(): void;
    onBlur(): void;
    onInputKey(event: CustomEvent): void;
}
export declare const todoItem: (arg0: TodoItemProps) => import("io-core").VDOMElement;
export {};
//# sourceMappingURL=TodoItem.d.ts.map