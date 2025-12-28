import { Node } from '@io-gui/core';
import { TodoItemModel } from './TodoItemModel.js';
export declare class TodoListModel extends Node {
    items: TodoItemModel[];
    static get Listeners(): {
        'delete-item': string;
    };
    onDeleteItem(event: any): void;
    get filters(): {
        all: () => boolean;
        active: (item: TodoItemModel) => boolean;
        completed: (item: TodoItemModel) => boolean;
    };
    get count(): number;
    get completedCount(): number;
    get activeCount(): number;
    get allCompleted(): boolean;
    constructor(args: any);
    completeAll: () => void;
    clearCompleted: () => void;
    itemsMutated(): void;
    toJSON(): {
        items: {
            title: string;
            completed: boolean;
        }[];
    };
    fromJSON(json: any): this;
}
//# sourceMappingURL=TodoListModel.d.ts.map