import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
type TodoFooterProps = IoElementProps & {
    model?: TodoListModel;
    route?: WithBinding<string>;
};
export declare class TodoFooter extends IoElement {
    static get Style(): string;
    model: TodoListModel;
    route: string;
    constructor(args?: TodoFooterProps);
    onRouteClicked(event: CustomEvent): void;
    modelMutated(): void;
    changed(): void;
}
export declare const todoFooter: (arg0: TodoFooterProps) => import("@io-gui/core").VDOMElement;
export {};
//# sourceMappingURL=TodoFooter.d.ts.map