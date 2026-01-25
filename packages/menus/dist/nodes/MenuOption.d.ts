import { ReactiveNode, WithBinding, NodeArray } from '@io-gui/core';
export type MenuOptionMode = 'select' | 'toggle' | 'none';
export type MenuOptionProps = {
    id?: string;
    value?: any;
    label?: string;
    icon?: string;
    hint?: string;
    action?: (value?: any) => void;
    mode?: MenuOptionMode;
    disabled?: boolean;
    selected?: WithBinding<boolean>;
    selectedID?: WithBinding<string>;
    selectedIDImmediate?: WithBinding<string>;
    path?: WithBinding<string>;
    options?: Array<string | number | boolean | null | undefined | MenuOptionProps>;
};
export declare class MenuOption extends ReactiveNode {
    id: string;
    value: any;
    label: string;
    icon: string;
    hint: string;
    disabled: boolean;
    action?: (value?: any) => void;
    mode: MenuOptionMode;
    selected: boolean;
    selectedIDImmediate: string;
    selectedID: string;
    path: string;
    options: NodeArray<MenuOption>;
    static get Listeners(): {
        'option-selected-changed': string;
    };
    constructor(args: string | number | boolean | null | undefined | MenuOptionProps);
    getAllOptions(): MenuOption[];
    findItemByValue(value: any): MenuOption | undefined;
    findItemById(id: string): MenuOption | undefined;
    selectDefault(): void;
    selectedChanged(): void;
    selectedIDChanged(): void;
    selectedIDImmediateChanged(): void;
    getSelectedIDImmediate(): string;
    setSelectedIDImmediate(id: string): void;
    onOptionSelectedChanged(event: CustomEvent): void;
    unselectSuboptions(): void;
    updatePaths(): void;
    pathChanged(): void;
    optionsMutated(event: CustomEvent): void;
    toJSON(): MenuOptionProps;
    fromJSON(json: MenuOptionProps): this;
    changed(): void;
    dispose(): void;
}
//# sourceMappingURL=MenuOption.d.ts.map