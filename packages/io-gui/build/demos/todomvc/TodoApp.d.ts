import { IoElement } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoApp extends IoElement {
    model: TodoListModel;
    route: string;
    ready(): void;
    modelMutated(): void;
    changed(): void;
}
export declare const todoApp: (arg0?: import("io-gui").IoElementProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=TodoApp.d.ts.map