import { ReactiveObject, NodeArray, Json, WithBinding } from '@io-gui/core';
export type OptionMode = 'select' | 'toggle' | 'none';
export type OptionSimpleData = string | number | boolean | null;
export type OptionData = {
    id?: string;
    value?: Json;
    label?: string;
    icon?: string;
    hint?: string;
    disabled?: boolean;
    hidden?: boolean;
    mode?: OptionMode;
    options?: Array<OptionSimpleData | OptionData>;
};
export type OptionProps = {
    id?: string;
    value?: Json;
    label?: WithBinding<string>;
    icon?: string;
    hint?: WithBinding<string>;
    disabled?: boolean;
    hidden?: boolean;
    mode?: OptionMode;
    options?: Array<OptionSimpleData | OptionProps>;
    selected?: WithBinding<boolean>;
    action?: (value?: any) => void;
};
/**
 * One node of a Menu's tree. Carries local state only (id, value, label, icon,
 * hint, mode, action, selected, child options) — tree-scoped state (selection
 * tracking, disclosure, serialization entry point) belongs on `Menu`.
 *
 * The `select`-mode children of any one Option form a selection scope: at most
 * one of them is selected, enforced here by the parent.
 */
export declare class Option extends ReactiveObject {
    id: string;
    value: any;
    label: string;
    icon: string;
    hint: string;
    disabled: boolean;
    hidden: boolean;
    mode: OptionMode;
    options: NodeArray<Option>;
    action?: (value?: any) => void;
    selected: boolean;
    static get Listeners(): {
        'option-selected-changed': string;
    };
    constructor(args: OptionSimpleData | OptionProps);
    getAllOptions(): Option[];
    findOptionByValue(value: any): Option | undefined;
    findOptionById(id: string): Option | undefined;
    selectDefault(): void;
    selectedChanged(): void;
    getSelectedIDImmediate(): string;
    findSelectedImmediateOption(): Option | undefined;
    getSelectedChain(): Option[];
    onOptionSelectedChanged(event: CustomEvent): void;
    unselectSuboptions(): void;
    optionsMutated(): void;
    mutated(): void;
    toJSON(): OptionData;
    applyJSON(json: OptionSimpleData | OptionData): this;
}
