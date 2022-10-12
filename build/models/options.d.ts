import { Item } from './item.js';
import { Path } from './path.js';
declare const Options_base: {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        readonly _protochain: import("../iogui.js").ProtoChain;
        readonly _properties: Record<string, import("../iogui.js").PropertyInstance>;
        readonly _bindings: Record<string, import("../iogui.js").Binding>;
        readonly _changeQueue: import("../iogui.js").ChangeQueue;
        readonly _eventDispatcher: import("../iogui.js").EventDispatcher;
        setProperty(name: string, value: any, skipDispatch?: boolean | undefined): void;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(prop: string, value: any, oldValue: any): void;
        dispatchQueue(): void;
        dispatchQueueSync: () => void;
        throttle(func: import("../core/node.js").CallbackFunction, arg?: any, sync?: boolean): void;
        onObjectMutated: (event: CustomEvent<any>) => void;
        objectMutated: (prop: string) => void;
        bind(prop: string): import("../iogui.js").Binding;
        unbind(prop: string): void;
        addEventListener(type: string, listener: import("../core/node.js").AnyEventListener, options?: AddEventListenerOptions | undefined): void;
        removeEventListener(type: string, listener?: import("../core/node.js").AnyEventListener | undefined, options?: AddEventListenerOptions | undefined): void;
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: Window | Document | Node | HTMLElement | undefined): void;
        dispose(): void;
    };
    [x: string]: any;
    readonly Properties: import("../iogui.js").PropertyDeclarations;
};
export declare class Options extends Options_base {
    static get Properties(): {
        items: {
            type: ArrayConstructor;
        };
        path: {
            type: typeof Path;
        };
        lazy: boolean;
    };
    constructor(options?: Array<Item | any>, props?: {});
    option(value: any): any;
    pathChanged(): void;
    onItemSelectedPathChanged(event: any): void;
    onItemSelectedChanged(event: any): void;
    setSelectedPath(path?: any[]): void;
    selectDefault(): boolean;
    changed(): void;
}
export {};
//# sourceMappingURL=options.d.ts.map