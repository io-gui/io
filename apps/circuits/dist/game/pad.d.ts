export interface PadData {
    ID: number;
    pos: [number, number];
}
export declare class Pad {
    ID: number;
    pos: [number, number];
    constructor(ID: number, pos: [number, number]);
    toJSON(): PadData;
    static fromJSON(data: PadData): Pad;
}
//# sourceMappingURL=pad.d.ts.map