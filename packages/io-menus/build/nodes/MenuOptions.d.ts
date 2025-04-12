import { NodeArgs, ArgsWithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';
export type MenuOptionsArgs = NodeArgs & ArgsWithBinding<{
    first?: any;
    last?: any;
    scroll?: string;
    path?: string;
    delimiter?: string;
    items?: MenuItem[];
}>;
declare const MenuOptions_base: {
    new (...superArgs: any[]): {
        [x: string]: any;
        readonly _protochain: import("io-gui").ProtoChain;
        readonly _properties: Map<string, import("io-gui").PropertyInstance>;
        readonly _bindings: Map<string, import("io-gui").Binding>;
        readonly _changeQueue: import("io-gui").ChangeQueue;
        readonly _eventDispatcher: import("io-gui").EventDispatcher;
        applyProperties(props: any, skipDispatch?: boolean): void;
        setProperties(props: any): void;
        setProperty(name: string, value: any, debounce?: boolean): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(name: string, value: any, oldValue: any): void;
        dispatchQueue(debounce?: boolean): void;
        throttle(func: import("io-gui").CallbackFunction, arg?: any): void;
        debounce(func: import("io-gui").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): void;
        bind(name: string): import("io-gui").Binding;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("io-gui").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("io-gui").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: import("io-gui").Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof import("io-gui").Node): void;
    };
    [x: string]: any;
    readonly Properties: import("io-gui").PropertyDefinitions;
};
export declare class MenuOptions extends MenuOptions_base {
    first: any;
    last: any;
    scroll: any;
    path: string;
    delimiter: string;
    items: MenuItem[];
    getItem(value: any, deep?: boolean): any;
    constructor(properties?: MenuOptionsArgs);
    fromJSON(menuItemDefLoose: MenuItemDefLoose[]): this;
    initItems(items: MenuItem[]): void;
    pathChanged(): void;
    firstChanged(): void;
    lastChanged(): void;
    updatePaths(item?: MenuItem): void;
    _onItemSelectedChanged(event: CustomEvent): void;
    _onSubOptionsPathChanged(event: CustomEvent): void;
    selectDefault(): boolean;
    bind(prop: string): import("io-gui").Binding;
    dispose(): void;
}
export {};
//# sourceMappingURL=MenuOptions.d.ts.map