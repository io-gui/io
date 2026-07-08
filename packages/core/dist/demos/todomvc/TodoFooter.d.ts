import { ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
type TodoFooterProps = ReactiveElementProps & {
    model: TodoListModel;
    route: WithBinding<string>;
};
export declare class TodoFooter extends ReactiveElement {
    static get Style(): string;
    model: TodoListModel;
    route: string;
    constructor(args: TodoFooterProps);
    onRouteClicked(event: CustomEvent): void;
    modelMutated(): void;
    mutated(): void;
}
export declare const todoFooter: (arg0: TodoFooterProps) => import("@io-gui/core").VDOMElement;
export {};
