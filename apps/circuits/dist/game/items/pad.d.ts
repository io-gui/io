export declare const PAD_COLORS: {
    white: string;
    red: string;
    green: string;
    blue: string;
    pink: string;
    yellow: string;
    orange: string;
    purple: string;
};
export type PadColor = keyof typeof PAD_COLORS;
type vec2 = [number, number];
export interface PadData {
    id: number;
    pos: vec2;
    isTerminal?: boolean;
    color?: PadColor;
}
export declare class Pad {
    id: number;
    pos: vec2;
    isTerminal: boolean;
    color: PadColor | undefined;
    renderColor: PadColor;
    constructor(id: number, pos: vec2, isTerminal?: boolean, color?: PadColor);
    toJSON(): PadData;
    static fromJSON(data: PadData): Pad;
}
export {};
//# sourceMappingURL=pad.d.ts.map