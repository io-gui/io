import type { PadColor } from './pad.js';
type vec2 = [number, number];
export interface LineData {
    id: number;
    pos: vec2[];
    layer: number;
}
export declare class Line {
    id: number;
    pos: [number, number][];
    layer: number;
    private _color;
    get color(): PadColor;
    set color(color: PadColor);
    constructor(id: number, pos: vec2[], layer: number);
    toJSON(): LineData;
    static fromJSON(data: LineData): Line;
    hasDiagonalSegmentAt([mx, my]: vec2): boolean;
    /**
     * Plot a new segment on the line if direction is valid.
     * Erase last segment if user drags back to prev node.
     * Return true if segment was added, false otherwise.
     */
    plotSegment([x, y]: vec2): boolean;
    /**
     * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
     * Returns true if nothing was done, false if path was updated.
     */
    private _tryAddNewSegment;
    /** Erase last segment if user drags back to prev node. */
    private _tryEraseLastSegment;
}
export {};
//# sourceMappingURL=line.d.ts.map