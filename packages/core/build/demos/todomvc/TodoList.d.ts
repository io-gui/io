import { IoElement, IoElementProps } from 'io-core';
import { TodoListModel } from './TodoListModel.js';
type TodoListProps = IoElementProps & {
    model?: TodoListModel;
    route?: string;
};
export declare class TodoList extends IoElement {
    static get Style(): string;
    model: TodoListModel;
    route: string;
    constructor(args?: TodoListProps);
    modelMutated(): void;
    changed(): void;
}
export declare const todoList: (arg0: TodoListProps) => import("io-core").VDOMElement;
export {};
//# sourceMappingURL=TodoList.d.ts.map