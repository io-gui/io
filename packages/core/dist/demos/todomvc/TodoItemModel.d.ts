import { ReactiveObject } from '@io-gui/core';
export type TodoItemProps = {
    title: string;
    completed: boolean;
};
export declare class TodoItemModel extends ReactiveObject {
    title: string;
    completed: boolean;
    toggle: () => void;
    delete: () => void;
}
