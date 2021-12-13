import { IoSelector } from './selector.js';
import './sidebar.js';
export declare class IoSelectorSidebar extends IoSelector {
    static get Style(): string;
    static get Properties(): any;
    onResized(): void;
    collapsedChanged(): void;
    getSlotted(): (string | {
        selected: import("../../core/internals/propertyBinder.js").Binding;
        options: any;
        collapsed: any;
    })[];
}
//# sourceMappingURL=selector-sidebar.d.ts.map