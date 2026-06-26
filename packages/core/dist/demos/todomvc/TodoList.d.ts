import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
type TodoListProps = ReactiveElementProps & {
    model: TodoListModel;
    route: WithBinding<string>;
};
export declare class TodoList extends ReactiveElement {
    static get Style(): string;
    model: TodoListModel;
    route: string;
    constructor(args: TodoListProps);
    modelMutated(): void;
    mutated(): void;
}
export declare const todoList: (arg0: TodoListProps) => import("@io-gui/core").VDOMElement;
export {};
