export declare const DEFAULT_SIZE = "auto";
export declare const DEFAULT_AUTO_BUDGET_PX = 240;
export declare const DEFAULT_MIN_SIZE_PX = 24;
export type LayoutSizeData = {
    size?: string;
};
export declare function sizeToPx(size: string): number;
export declare function sizeToFlex(size: string): string;
export declare function isAutoSize(size: string): boolean;
export declare function isValidSize(size: string): boolean;
export declare function parseSizeBudgetPx(size: string, containerSize: number): number;
export declare function layoutSizeToJSON(node: {
    size: string;
}): Partial<LayoutSizeData>;
export declare function applyLayoutSizeProps(data: LayoutSizeData): {
    size: string;
};
export declare function ensureOneChildHasAutoSize(children: Array<{
    size: string;
}>): void;
