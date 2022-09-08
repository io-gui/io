import { IoElement } from '../../iogui.js';
import './breadcrumbs.js';
export declare class IoInspector extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        'item-clicked': string;
    };
    constructor(props?: any);
    _onItemClicked(event: CustomEvent): void;
    valueChanged(): void;
    advancedChanged(): void;
    selectedMutated(): void;
    _getConfig(): void;
    _getGroups(): void;
    _getWidgets(): void;
    _getAll(): void;
    changed(): void;
    _onhangedThrCottle(): void;
    _onChange(): void;
    static get Config(): {
        'type:object': (string | {
            class: string;
        })[];
        'type:null': (string | {
            class: string;
        })[];
    };
    static get Groups(): {
        'Object|hidden': RegExp[];
        'HTMLElement|main': (string | RegExp)[];
        'HTMLElement|hidden': (string | RegExp)[];
        'HTMLElement|content': RegExp[];
        'HTMLElement|display': RegExp[];
        'HTMLElement|hierarchy': RegExp[];
    };
    static get Widgets(): {};
    static RegisterConfig: (config: any) => void;
    static RegisterGroups: (groups: any) => void;
    static RegisterWidgets: (widgets: any) => void;
    static Register(): void;
}
//# sourceMappingURL=inspector.d.ts.map