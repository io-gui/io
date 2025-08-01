import { Node } from 'io-gui';
export declare class TodoItemModel extends Node {
    static get ReactiveProperties(): {
        title: StringConstructor;
        completed: BooleanConstructor;
    };
    toggle: () => void;
    delete: () => void;
    toJSON(): {
        title: any;
        completed: any;
    };
    fromJSON(json: any): this;
}
//# sourceMappingURL=TodoItemModel.d.ts.map