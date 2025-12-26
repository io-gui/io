import { IoElement } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoApp extends IoElement {
    model: TodoListModel;
    route: string;
    ready(): void;
    modelMutated(): void;
    changed(): void;
}
export declare const todoApp: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=TodoApp.d.ts.map