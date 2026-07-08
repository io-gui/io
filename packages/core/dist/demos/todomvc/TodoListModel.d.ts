import { ReactiveObject } from '@io-gui/core';
import { TodoItemModel, TodoItemProps } from './TodoItemModel.js';
export type TodoListProps = {
    items: TodoItemProps[];
};
export declare class TodoListModel extends ReactiveObject {
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
    constructor(args: TodoListProps);
    completeAll: () => void;
    clearCompleted: () => void;
    itemsMutated(): void;
    applyJSON(json: TodoListProps): this;
}
