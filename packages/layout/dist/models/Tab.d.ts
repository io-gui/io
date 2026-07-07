import { ReactiveObject } from '@io-gui/core';
export type TabData = {
    id: string;
    label?: string;
    icon?: string;
    selected?: boolean;
};
export declare class Tab extends ReactiveObject {
    id: string;
    label: string;
    icon: string;
    selected: boolean;
    constructor(data: TabData);
    toJSON(): TabData;
    applyJSON(data: TabData): this;
}
