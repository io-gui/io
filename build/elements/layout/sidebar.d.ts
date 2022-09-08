import { IoElement } from '../../iogui.js';
export declare class IoSidebar extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    _filterObject(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
    _onSelect(id: string): void;
    _addOptions(options: any): any;
    changed(): void;
}
//# sourceMappingURL=sidebar.d.ts.map