import { IoElement } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
export declare class TodoFooter extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        model: {
            type: typeof TodoListModel;
        };
        route: string;
    };
    onRouteClicked(event: any): void;
    modelMutated(): void;
    changed(): void;
}
export declare const todoFooter: (arg0?: import("io-gui").IoElementProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=TodoFooter.d.ts.map