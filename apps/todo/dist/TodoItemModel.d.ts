import { ReactiveNode } from '@io-gui/core';
export declare class TodoItemModel extends ReactiveNode {
    title: string;
    completed: boolean;
    toggle: () => void;
    delete: () => void;
    toJSON(): {
        title: string;
        completed: boolean;
    };
    fromJSON(json: any): this;
}
//# sourceMappingURL=TodoItemModel.d.ts.map