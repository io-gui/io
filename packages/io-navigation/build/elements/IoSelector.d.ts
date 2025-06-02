import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoSelectorProps = IoElementProps & {
    options?: MenuOptions;
    select?: 'shallow' | 'deep';
    elements?: VDOMElement[];
    cache?: boolean;
    precache?: boolean;
    loading?: WithBinding<boolean>;
    import?: string;
    precacheDelay?: number;
};
export declare class IoSelector extends IoElement {
    static vConstructor: (arg0?: IoSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    select: 'shallow' | 'deep';
    elements: VDOMElement[];
    cache: boolean;
    precache: boolean;
    loading: boolean;
    private _caches;
    precacheDelay: number;
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