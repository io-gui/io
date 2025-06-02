import { Node, NodeProps, WithBinding, Change } from 'io-gui';
import { MenuOptions } from './MenuOptions.js';
export type MenuItemSelectType = 'select' | 'toggle' | 'link' | 'action' | 'none';
export type MenuItemDefLoose = undefined | null | string | number | MenuItemProps;
export type MenuItemProps = NodeProps & {
    value?: any;
    id?: string;
    label?: string;
    icon?: string;
    hint?: string;
    action?: () => void;
    mode?: MenuItemSelectType;
    hidden?: boolean;
    disabled?: boolean;
    selected?: WithBinding<boolean>;
    options?: MenuOptions | MenuItemDefLoose[];
};
export declare class MenuItem extends Node {
    value: any;
    id: string;
    label: string;
    icon: string;
    hint: string;
    hidden: boolean;
    disabled: boolean;
    action?: (value?: any) => void;
    mode: MenuItemSelectType;
    selected: boolean;
    options?: MenuOptions;
    get hasmore(): boolean;
    constructor(args?: MenuItemProps);
    findItemByValue(value: any): MenuItem | null;
    findItemById(id: string): MenuItem | null;
    fromJSON(looseDef: MenuItemDefLoose): this;
    toJSON(): Record<string, any>;
    onOptionsItemSelected(): void;
    onOptionsPathChanged(event: CustomEvent): void;
    optionsChanged(change: Change): void;
    selectedChanged(): void;
    changed(): void;
    dispose(): void;
}
//# sourceMappingURL=MenuItem.d.ts.map