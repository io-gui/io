import { Node, NodeProps, WithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';
export type MenuOptionsProps = NodeProps & {
    selected?: WithBinding<string>;
    path?: string;
    delimiter?: string;
    items?: MenuItem[];
};
export declare class MenuOptions extends Node {
    selected: string;
    path: string;
    delimiter: string;
    items: MenuItem[];
    reactivity: string;
    constructor(properties?: MenuOptionsProps);
    getAllItems(): MenuItem[];
    findItemByValue(value: any): MenuItem | null;
    findItemById(id: string): MenuItem | null;
    fromJSON(menuItemDefLoose: MenuItemDefLoose[]): this;
    initItems(): void;
    unselectAll(): void;
    pathChanged(): void;
    selectedChanged(): void;
    updatePaths(item?: MenuItem): void;
    updatePathsDebounced(item?: MenuItem): void;
    onItemSelectedChanged(event: CustomEvent): void;
    onSubOptionsPathChanged(event: CustomEvent): void;
    selectDefault(): boolean;
    dispose(): void;
}
//# sourceMappingURL=MenuOptions.d.ts.map