import { TerminalColor } from './terminal.js';
export interface LineData {
    id: number;
    pos: [number, number][];
    layer: number;
}
export declare class Line {
    id: number;
    pos: [number, number][];
    layer: number;
    _color: TerminalColor;
    get color(): TerminalColor;
    set color(color: TerminalColor);
    constructor(id: number, pos: [number, number], layer: number);
    hasDiagonalSegmentAt(mx: number, my: number): boolean;
    /**
     * Plot a new segment on the line if direction is valid.
     * Erase last segment if user drags back to prev node.
     * Return true if segment was added, false otherwise.
     */
    plotSegment(x: number, y: number): boolean;
    toJSON(): LineData;
    static fromJSON(data: LineData): Line;
    /**
     * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
     * Returns true if nothing was done, false if path was updated.
     */
    private _tryAddNewSegment;
    /** Erase last segment if user drags back to prev node. */
    private _tryEraseLastSegment;
}
//# sourceMappingURL=line.d.ts.map