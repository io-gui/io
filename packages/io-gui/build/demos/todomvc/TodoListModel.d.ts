import { Node, NodeArray } from 'io-gui';
export declare class TodoListModel extends Node {
    static get ReactiveProperties(): {
        items: {
            type: typeof NodeArray;
            init: string;
        };
    };
    static get Listeners(): {
        'delete-item': string;
    };
    onDeleteItem(event: any): void;
    get filters(): {
        all: () => boolean;
        active: (item: any) => boolean;
        completed: (item: any) => any;
    };
    get count(): any;
    get completedCount(): any;
    get activeCount(): any;
    get allCompleted(): any;
    constructor(args: any);
    completeAll: () => void;
    clearCompleted: () => void;
    itemsMutated(): void;
    toJSON(): {
        items: any;
    };
    fromJSON(json: any): this;
}
//# sourceMappingURL=TodoListModel.d.ts.map