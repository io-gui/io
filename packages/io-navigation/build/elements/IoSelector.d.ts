import { IoElement, VDOMElement, IoElementProps, PropsWithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoSelectorProps = IoElementProps & PropsWithBinding<{
    options?: MenuOptions;
    select?: 'first' | 'last';
    elements?: VDOMElement[];
    cache?: boolean;
    precache?: boolean;
    precacheDelay?: number;
    loading?: boolean;
    import?: string;
}>;
export declare class IoSelector extends IoElement {
    static vConstructor: (arg0?: IoSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    select: 'first' | 'last';
    elements: VDOMElement[];
    cache: boolean;
    precache: boolean;
    precacheDelay: number;
    loading: boolean;
    private _caches;
    private _selected?;
    init(): void;
    optionsMutated(): void;
    importModule(path: string): Promise<unknown>;
    protected renderSelected(): void;
    onLoadPrecache(): void;
    dispose(): void;
}
export declare const ioSelector: (arg0?: IoSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSelector.d.ts.map