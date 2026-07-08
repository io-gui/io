import { WithBinding } from '@io-gui/core';
import { Option, OptionProps, OptionData } from './Option.js';
export type MenuData = OptionData & {
    selectedID?: string;
    path?: string;
    expandedIDs?: string;
};
export type MenuProps = OptionProps & {
    selectedID?: WithBinding<string>;
    path?: WithBinding<string>;
    expandedIDs?: WithBinding<string>;
};
/**
 * The root model of a whole menu tree. Owns everything tree-scoped: selection
 * tracking (`selectedID`, `path`), tree disclosure (`expandedIDs`), default
 * selection, serialization, and invariants no single Option can see.
 *
 * `Option.selected` (within each selection scope) is the only source of truth
 * for selection. `path` and `selectedID` are derived projections that stay
 * writable on purpose — they are the entry points for persistence and routing:
 * writing a Path performs a stale-tolerant restore (the deepest surviving id
 * wins). This is deliberate, not a sync bug (see ADR 0001).
 *
 * Serialized Menu JSON is structure only; selection persists exclusively
 * through Path/`selectedID` bindings.
 */
export declare class Menu extends Option {
    selectedID: string;
    path: string;
    expandedIDs: string;
    private _syncingSelection;
    constructor(args: MenuProps);
    selectedIDChanged(): void;
    pathChanged(): void;
    updatePaths(): void;
    optionsMutated(): void;
    getDisclosed(): string[];
    isDisclosed(id: string): boolean;
    setDisclosed(id: string, disclosed: boolean): void;
}
