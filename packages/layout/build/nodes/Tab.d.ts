import { Node } from 'io-core';
export type TabProps = {
    id: string;
    label?: string;
    icon?: string;
    selected?: boolean;
};
export declare class Tab extends Node {
    id: string;
    label: string;
    icon: string;
    selected: boolean;
    constructor(args: TabProps);
    toJSON(): TabProps;
    fromJSON(json: TabProps): this;
}
//# sourceMappingURL=Tab.d.ts.map