import { IoElement, VDOMElement, IoElementProps, WithBinding } from '@io-gui/core';
export type CachingType = 'proactive' | 'reactive' | 'none';
export type IoSelectorProps = IoElementProps & {
    elements?: VDOMElement[];
    selected?: WithBinding<string>;
    anchor?: WithBinding<string>;
    caching?: CachingType;
    loading?: WithBinding<boolean>;
    import?: string;
};
export declare class IoSelector extends IoElement {
    static get Style(): string;
    elements: VDOMElement[];
    selected: string;
    anchor: string;
    caching: CachingType;
    loading: boolean;
    private _caches;
    private _preaching;
    private scrollToSuspended;
    private onScrollSuspended;
    static get Listeners(): {
        scroll: string;
    };
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
//# sourceMappingURL=IoSelector.d.ts.map