import { IoElement } from '@io-gui/core';
export declare class CircuitsLevels extends IoElement {
    static get Style(): string;
    completedLevels: string[];
    private _option;
    private _levelIds;
    ready(): Promise<void>;
    private _buildLevelOptions;
    private _loadLevels;
    refreshCompleted(completedIds: string[]): void;
    changed(): void;
}
export declare const circuitsLevels: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=CircuitsLevels.d.ts.map