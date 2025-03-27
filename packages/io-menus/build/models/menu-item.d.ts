import { IoNode, IoElementArgs } from 'io-gui';
import { MenuOptions } from './menu-options.js';
export type MenuItemSelectType = 'select' | 'scroll' | 'toggle' | 'link' | 'none';
export type MenuItemArgsLoose = undefined | null | string | number | MenuItemArgs;
export type MenuItemArgs = IoElementArgs & {
    value?: any;
    icon?: string;
    hint?: string;
    action?: () => void;
    mode?: MenuItemSelectType;
    hidden?: boolean;
    disabled?: boolean;
    selected?: boolean;
    options?: MenuItemArgsLoose[] | MenuOptions;
};
export declare class MenuItem extends IoNode {
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
    constructor(args?: MenuItemArgsLoose);
    toJSON(): Record<string, any>;
    _onSubItemSelected(): void;
    _onOptionsPathChanged(event: CustomEvent): void;
    optionsChanged(): void;
    selectedChanged(): void;
    dispose(): void;
}
//# sourceMappingURL=menu-item.d.ts.map