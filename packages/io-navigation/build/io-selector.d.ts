import { IoElement, VDOMArray, IoElementArgs } from 'io-gui';
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
export declare const ioSelector: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-selector.d.ts.map