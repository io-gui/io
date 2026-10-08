import { ReactiveElement, VDOMElement, ReactiveElementProps, WithBinding, ListenerDefinitions } from '@io-gui/core';
export type CachingType = 'proactive' | 'reactive' | 'none';
/**
 * Selector entry. `import` sits next to `tag` and `props` (not inside `props`) because it is
 * read by the selector, not by the element: the module is imported before the element is rendered.
 **/
export type SelectorElement = VDOMElement & {
    import?: string;
};
export type IoSelectorProps = ReactiveElementProps & {
    elements?: SelectorElement[];
    selected?: WithBinding<string>;
    anchor?: WithBinding<string>;
    caching?: CachingType;
    loading?: WithBinding<boolean>;
};
export declare class IoSelector extends ReactiveElement {
    static get Style(): string;
    elements: SelectorElement[];
    selected: string;
    anchor: string;
    caching: CachingType;
    loading: boolean;
    private _caches;
    private _preaching;
    private scrollToSuspended;
    private onScrollSuspended;
    static get Listeners(): ListenerDefinitions;
    constructor(args?: IoSelectorProps);
    init(): void;
    anchorChanged(): void;
    anchorChangedDebounced(): void;
    scrollToUnsuspend(): void;
    onScrollUnsuspend(): void;
    onScrollChanged(): void;
    elementsChanged(): void;
    selectedChanged(): void;
    renderSelectedId(id: string): void;
    renderDebounced(vElement: VDOMElement): void;
    startPreache(): void;
    preacheNext(): void;
    dispose(): void;
}
export declare const ioSelector: (arg0?: IoSelectorProps) => VDOMElement;
