import { NodeProps, WithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';
export type MenuOptionsProps = NodeProps & {
    selected?: WithBinding<string>;
    path?: string;
    delimiter?: string;
    items?: MenuItem[];
};
declare const MenuOptions_base: {
    new (args?: NodeProps, ...superProps: any[]): {
        [x: string]: any;
        readonly _protochain: import("io-gui").ProtoChain;
        readonly _reactiveProperties: Map<string, import("io-gui").ReactivePropertyInstance>;
        readonly _bindings: Map<string, import("io-gui").Binding<any>>;
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
        throttle(func: import("io-gui").CallbackFunction, arg?: any, timeout?: number): void;
        debounce(func: import("io-gui").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): true | undefined;
        bind<T_1>(name: string): import("io-gui").Binding<T_1>;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("io-gui").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("io-gui").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: import("io-gui").Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof import("io-gui").Node): void;
    };
    [x: string]: any;
    readonly ReactiveProperties: import("io-gui").ReactivePropertyDefinitions;
};
export declare class MenuOptions extends MenuOptions_base {
    selected: string;
    path: string;
    delimiter: string;
    items: MenuItem[];
    reactivity: string;
    constructor(properties?: MenuOptionsProps);
    getAllItems(): MenuItem[];
    findItemByValue(value: any): MenuItem | null;
    findItemById(id: string): MenuItem | null;
    fromJSON(menuItemDefLoose: MenuItemDefLoose[]): this;
    initItems(items: MenuItem[]): void;
    unselectAll(): void;
    pathChanged(): void;
    selectedChanged(): void;
    updatePaths(item?: MenuItem): void;
    _onItemSelectedChanged(event: CustomEvent): void;
    _onSubOptionsPathChanged(event: CustomEvent): void;
    selectDefault(): boolean;
    dispose(): void;
}
export {};
//# sourceMappingURL=MenuOptions.d.ts.map