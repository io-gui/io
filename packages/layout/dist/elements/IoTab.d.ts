import { IoField, IoFieldProps } from '@io-gui/inputs';
import { Tab } from '../nodes/Tab.js';
export type IoTabData = IoFieldProps & {
    tab: Tab;
};
export declare class IoTab extends IoField {
    static get Style(): string;
    tab: Tab;
    overflow: boolean;
    constructor(args: IoTabData);
    onResized(): void;
    onClick(): void;
    onKeydown(event: KeyboardEvent): void;
    tabMutated(): void;
    mutated(): void;
}
export declare const ioTab: (arg0: IoTabData) => import("@io-gui/core").VDOMElement;
