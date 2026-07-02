import { ReactiveElement } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoApp extends ReactiveElement {
    model: TodoListModel;
    route: string;
    ready(): void;
}
export declare const todoApp: (arg0: any) => import("@io-gui/core").VDOMElement;
