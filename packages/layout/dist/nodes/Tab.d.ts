import { ReactiveObject } from '@io-gui/core';
export type TabProps = {
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
    constructor(args: TabProps);
    toJSON(): TabProps;
    applyJSON(json: TabProps): this;
}
