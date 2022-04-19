import { Item } from './item.js';
import { Path } from './path.js';
declare const Options_base: {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        readonly compose: Record<string, Record<string, any>> | null;
        readonly _properties: Record<string, import("../../iogui.js").Property>;
        readonly _bindings: Record<string, import("../../iogui.js").Binding>;
        readonly _changeQueue: import("../../iogui.js").ChangeQueue;
        readonly _eventDispatcher: import("../../iogui.js").EventDispatcher;
        setProperty(name: string, value: any, skipDispatch?: boolean | undefined): void;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        setValue(value: any): void;
        dispose(): void;
        changed(): void;
        applyCompose(): void;
        queue(prop: string, value: any, oldValue: any): void;
        queueDispatch(): void;
        queueDispatchLazy(): void;
        objectMutated(event: CustomEvent<any>): void;
        objectMutatedThrottled(prop: string): void;
        bind(prop: string): import("../../iogui.js").Binding;
        unbind(prop: string): void;
        addEventListener(type: string, listener: EventListener | ((event: KeyboardEvent) => void) | ((event: PointerEvent) => void) | ((event: CustomEvent<any>) => void) | ((event: FocusEvent) => void) | ((event: TouchEvent) => void), options?: AddEventListenerOptions | undefined): void;
        removeEventListener(type: string, listener?: (EventListener | ((event: KeyboardEvent) => void) | ((event: PointerEvent) => void) | ((event: CustomEvent<any>) => void) | ((event: FocusEvent) => void) | ((event: TouchEvent) => void)) | undefined, options?: AddEventListenerOptions | undefined): void;
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: Window | Document | Node | HTMLElement | undefined): void;
        throttle(func: (arg?: any) => void, arg?: any, asynchronous?: boolean | undefined): void;
        requestAnimationFrameOnce(func: (arg?: any) => void): void;
        filterObject(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
        filterObjects(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
        import(path: string): Promise<unknown>;
        preventDefault(event: Event): void;
        stopPropagation(event: CustomEvent<any>): void;
    };
    [x: string]: any;
    readonly Properties: import("../../iogui.js").PropertiesDeclaration;
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