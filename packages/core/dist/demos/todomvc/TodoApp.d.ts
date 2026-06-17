import { IoElement } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoApp extends IoElement {
    model: TodoListModel;
    route: string;
    ready(): void;
}
export declare const todoApp: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
