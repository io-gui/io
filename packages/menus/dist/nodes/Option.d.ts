import { ReactiveObject, WithBinding, NodeArray, Json } from '@io-gui/core';
export type OptionMode = 'select' | 'toggle' | 'none';
export type OptionProps = {
    id?: string;
    value?: any;
    label?: WithBinding<string>;
    icon?: string;
    hint?: WithBinding<string>;
    action?: (value?: any) => void;
    mode?: OptionMode;
    disabled?: boolean;
    hidden?: boolean;
    selected?: WithBinding<boolean>;
    options?: Array<string | number | boolean | null | undefined | OptionProps | Option>;
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
    action?: (value?: any) => void;
    mode: OptionMode;
    selected: boolean;
    options: NodeArray<Option>;
    static get Listeners(): {
        'option-selected-changed': string;
    };
    constructor(args: string | number | boolean | null | undefined | OptionProps);
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
    toJSON(): Json;
    fromJSON(json: OptionProps): this;
}
