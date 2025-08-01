import { Node } from 'io-gui';
export declare class TodoItemModel extends Node {
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