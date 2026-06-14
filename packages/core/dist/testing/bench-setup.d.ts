declare class MockElement {
    constructor(tag?: string);
    appendChild(child: any): any;
    removeChild(child: any): any;
    insertBefore(newEl: any, ref: any): any;
    setAttribute(name: any, value: any): void;
    removeAttribute(name: any): void;
    getAttribute(name: any): any;
    hasAttribute(name: any): boolean;
    addEventListener(): void;
    removeEventListener(): void;
    querySelectorAll(): never[];
}
declare const customElementRegistry: Map<any, any>;
//# sourceMappingURL=bench-setup.d.ts.map