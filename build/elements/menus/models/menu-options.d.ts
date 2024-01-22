import { IoNodeArgs } from '../../../core/node.js';
import { MenuItem, MenuItemArgsLoose } from './menu-item.js';
declare const MenuOptions_base: {
    new (...args: any[]): {
        [x: string]: any;
        readonly _protochain: import("../../../iogui.js").ProtoChain;
        readonly _properties: Map<string, import("../../../core/internals/property.js").PropertyInstance>;
        readonly _bindings: Map<string, import("../../../iogui.js").Binding>;
        readonly _changeQueue: import("../../../iogui.js").ChangeQueue;
        readonly _eventDispatcher: import("../../../iogui.js").EventDispatcher;
        setProperty(name: string, value: any, skipDispatch?: boolean | undefined): void;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(prop: string, value: any, oldValue: any): void;
        dispatchQueue(): void;
        dispatchQueueSync: () => void;
        throttle(func: import("../../../core/node.js").CallbackFunction, arg?: any, timeout?: number): void;
        onObjectMutated: (event: CustomEvent<any>) => void;
        objectMutated: (prop: string) => void;
        bind(prop: string): import("../../../iogui.js").Binding;
        unbind(prop: string): void;
        addEventListener(type: string, listener: import("../../../core/node.js").AnyEventListener, options?: AddEventListenerOptions | undefined): void;
        removeEventListener(type: string, listener?: import("../../../core/node.js").AnyEventListener | undefined, options?: AddEventListenerOptions | undefined): void;
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: Node | Document | HTMLElement | Window | undefined): void;
        dispatchMutationEvent(object: any): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof import("../../../core/node.js").IoNode): void;
    };
    [x: string]: any;
    readonly Properties: import("../../../core/internals/property.js").PropertyDeclarations;
};
export declare class MenuOptions extends MenuOptions_base {
    first: any;
    last: any;
    scroll: any;
    path: string;
    delimiter: string;
    push(...items: MenuItem[]): void;
    getItem(value: any, deep?: boolean): any;
    constructor(args?: MenuItemArgsLoose[], properties?: IoNodeArgs);
    protected addItems(items: MenuItemArgsLoose[]): void;
    pathChanged(): void;
    firstChanged(): void;
    lastChanged(): void;
    updatePaths(item?: MenuItem): void;
    _onItemSelectedChanged(event: CustomEvent): void;
    _onSubOptionsPathChanged(event: CustomEvent): void;
    selectDefault(): boolean;
    bind(prop: string): import("../../../iogui.js").Binding;
    dispose(): void;
    changed(): void;
}
export {};
//# sourceMappingURL=menu-options.d.ts.map