import { IoElement, VDOMArray } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
export declare class IoSelector extends IoElement {
    static get Style(): string;
    options: MenuOptions;
    select: 'first' | 'last';
    elements: VDOMArray[];
    cache: boolean;
    precache: boolean;
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
//# sourceMappingURL=io-selector.d.ts.map