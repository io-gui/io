import { ReactiveNode } from '@io-gui/core';
export type TodoItemProps = {
    title: string;
    completed: boolean;
};
export declare class TodoItemModel extends ReactiveNode {
    title: string;
    completed: boolean;
    toggle: () => void;
    delete: () => void;
}
