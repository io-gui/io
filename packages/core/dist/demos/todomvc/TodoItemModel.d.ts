import { ReactiveNode } from '@io-gui/core';
export declare class TodoItemModel extends ReactiveNode {
    title: string;
    completed: boolean;
    toggle: () => void;
    delete: () => void;
    applyJSON(json: any): this;
}
