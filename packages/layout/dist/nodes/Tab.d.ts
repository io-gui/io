import { ReactiveNode } from '@io-gui/core';
export type TabProps = {
    id: string;
    label?: string;
    icon?: string;
    selected?: boolean;
};
export declare class Tab extends ReactiveNode {
    id: string;
    label: string;
    icon: string;
    selected: boolean;
    constructor(args: TabProps);
    toJSON(): TabProps;
    applyJSON(json: TabProps): this;
}
