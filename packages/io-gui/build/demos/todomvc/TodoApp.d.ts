import { IoElement } from 'io-gui';
export declare class TodoApp extends IoElement {
    static get ReactiveProperties(): {
        model: import("io-gui").Binding<any>;
        route: import("io-gui").Binding<any>;
    };
    ready(): void;
    modelMutated(): void;
    changed(): void;
}
export declare const todoApp: (arg0?: import("io-gui").IoElementProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=TodoApp.d.ts.map