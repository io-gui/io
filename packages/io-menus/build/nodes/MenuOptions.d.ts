import { Node, NodeProps, WithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';
export type MenuOptionsProps = NodeProps & {
    selected?: WithBinding<string>;
    path?: string;
    delimiter?: string;
    items?: MenuItem[] | MenuItemDefLoose[];
};
export declare class MenuOptions extends Node {
    selected: string;
    selectedShallow: string;
    path: string;
    delimiter: string;
    items: MenuItem[];
    constructor(properties?: MenuOptionsProps);
    init(): void;
    getAllItems(): MenuItem[];
    findItemByValue(value: any): MenuItem | null;
    findItemById(id: string): MenuItem | null;
    fromJSON(menuItemDefLoose: MenuItemDefLoose[]): this;
    moveItem(oldIndex: number, newIndex: number): void;
    addItem(itemLoose: MenuItem | MenuItemDefLoose, index?: number): void;
    removeItemById(id: string): void;
    removeItemByIndex(index: number): void;
    removeItem(item: MenuItem): void;
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