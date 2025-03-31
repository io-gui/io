import { IoElement, VDOMArray } from 'io-gui';
import { MenuOptions } from 'io-menus';
export declare class IoSelector extends IoElement {
    static get Style(): string;
    options: MenuOptions;
    select: 'first' | 'last';
    elements: VDOMArray[];
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
export declare const ioSelector: (arg0?: import("io-gui").IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
//# sourceMappingURL=io-selector.d.ts.map