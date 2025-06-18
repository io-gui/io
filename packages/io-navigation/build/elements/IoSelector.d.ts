import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type SelectType = 'shallow' | 'deep' | 'none';
export type CachingType = 'proactive' | 'reactive' | 'none';
export type IoSelectorProps = IoElementProps & {
    options?: MenuOptions;
    elements?: VDOMElement[];
    select?: SelectType;
    caching?: CachingType;
    loading?: WithBinding<boolean>;
    import?: string;
};
export declare class IoSelector extends IoElement {
    static vConstructor: (arg0?: IoSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    elements: VDOMElement[];
    select: SelectType;
    caching: CachingType;
    loading: boolean;
    private _caches;
    private _preaching;
    constructor(args?: IoSelectorProps);
    init(): void;
    optionsChanged(): void;
    optionsMutated(): void;
    elementsChanged(): void;
    renderSelected(): void;
    renderSelectedId(id: string): void;
    renderDebounced(vElement: VDOMElement): void;
    startPreache(): void;
    preacheNext(): void;
    dispose(): void;
}
export declare const ioSelector: (arg0?: IoSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSelector.d.ts.map