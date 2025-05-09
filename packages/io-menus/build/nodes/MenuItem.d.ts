import { Node, NodeProps, PropsWithBinding } from 'io-gui';
import { MenuOptions } from './MenuOptions.js';
export type MenuItemSelectType = 'select' | 'scroll' | 'toggle' | 'link' | 'none';
export type MenuItemDefLoose = undefined | null | string | number | MenuItemProps;
export type MenuItemProps = NodeProps & PropsWithBinding<{
    value?: any;
    label?: string;
    icon?: string;
    hint?: string;
    action?: () => void;
    mode?: MenuItemSelectType;
    hidden?: boolean;
    disabled?: boolean;
    selected?: boolean;
    options?: MenuOptions | MenuItemDefLoose[];
}>;
export declare class MenuItem extends Node {
    value: any;
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
    getSubitem(value: any): any;
    constructor(args?: MenuItemProps);
    fromJSON(looseDef: MenuItemDefLoose): this;
    toJSON(): Record<string, any>;
    _onSubItemSelected(): void;
    _onOptionsPathChanged(event: CustomEvent): void;
    optionsChanged(): void;
    selectedChanged(): void;
    dispose(): void;
}
//# sourceMappingURL=MenuItem.d.ts.map