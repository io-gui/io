export interface LineData {
    ID: number;
    pos: [number, number][];
    color: string;
    readonly?: boolean;
}
export declare class Line {
    ID: number;
    pos: [number, number][];
    color: string;
    readonly: boolean;
    constructor(ID: number, pos: [number, number], color: string);
    /**
     * Add a grid segment.
     * Returns false if the segment was rejected.
     */
    addSegment(x: number, y: number): boolean;
    removeLast(): void;
    toJSON(): LineData;
    static fromJSON(data: LineData): Line;
    /** Prevent backtracking over more than one step. */
    private _checkDirection;
    /** Erase last segment if user drags back to prev node. */
    private _checkErase;
}
//# sourceMappingURL=line.d.ts.map