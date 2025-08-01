import { IoElement } from 'io-gui';
import { TodoItemModel } from './TodoItemModel.js';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoItem extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        item: typeof TodoItemModel;
        model: {
            type: typeof TodoListModel;
        };
        editing: boolean;
    };
    itemMutated(): void;
    changed(): void;
    onStartEdit(): void;
    onBlur(): void;
    onInputKey(event: any): void;
}
export declare const todoItem: (arg0?: import("io-gui").IoElementProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=TodoItem.d.ts.map