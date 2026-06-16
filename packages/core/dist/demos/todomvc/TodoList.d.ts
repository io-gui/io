import { IoElement, IoElementProps } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
type TodoListProps = IoElementProps & {
    model: TodoListModel;
    route: WithBinding<string>;
};
export declare class TodoList extends IoElement {
    static get Style(): string;
    model: TodoListModel;
    route: string;
    constructor(args: TodoListProps);
    modelMutated(): void;
    changed(): void;
}
export declare const todoList: (arg0: TodoListProps) => import("@io-gui/core").VDOMElement;
export {};
