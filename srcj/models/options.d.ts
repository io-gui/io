import { Item } from './item.js';
import { Path } from './path.js';
declare const Options_base: {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        readonly compose: Record<string, Record<string, any>> | null;
        connect(node?: import("../components/io-node.js").IoNode | HTMLElement | Document | Window): any;
        disconnect(node?: import("../components/io-node.js").IoNode | HTMLElement | Document | Window): any;
        connectedCallback(): void;
        disconnectedCallback(): void;
        dispose(): void;
        changed(): void;
        applyCompose(): void;
        queue(prop: string, value: any, oldValue: any): void;
        queueDispatch(): void;
        queueDispatchLazy(): void;
        objectMutated(event: CustomEvent<any>): void;
        objectMutatedThrottled(prop: string): void;
        bind(prop: string): import("../core/propertyBinder.js").Binding;
        unbind(prop: string): void;
        set(prop: string, value: any, force: boolean): void;
        setProperties(props: any): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | undefined): void;
        removeEventListener(type: string, listener?: EventListener | EventListenerObject | undefined, options?: AddEventListenerOptions | undefined): void;
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: HTMLElement | Node | Document | Window | undefined): void;
        throttle(func: Function, arg?: any, asynchronous?: boolean | undefined): void;
        requestAnimationFrameOnce(func: Function): void;
        filterObject(object: any, predicate: Function, _depth?: number, _chain?: any[], _i?: number): any;
        filterObjects(object: any, predicate: Function, _depth?: number, _chain?: any[], _i?: number): any;
        import(path: string): Promise<unknown>;
        preventDefault(event: CustomEvent<any>): void;
        stopPropagation(event: CustomEvent<any>): void;
    };
    [x: string]: any;
    readonly Properties: any;
};
export declare class Options extends Options_base {
    static get Properties(): {
        items: {
            type: ArrayConstructor;
            readonly: boolean;
            strict: boolean;
        };
        path: {
            type: typeof Path;
            readonly: boolean;
            strict: boolean;
        };
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