import { Color, Vector2 } from 'three/webgpu';
export type LineData = [number, number][];
export declare class Line {
    pos: Vector2[];
    renderColor: Color;
    isFinalized: boolean;
    constructor(pos: Vector2[], isFinalized?: boolean, renderColor?: Color);
    toJSON(): LineData;
    static fromJSON(data: LineData): Line;
    get length(): number;
    get firstPt(): Vector2;
    get lastPt(): Vector2;
    get secondLastPt(): Vector2;
    /**
     * Plot a new segment on the line if direction is valid.
     * Erase last segment if user drags back to prev node.
     * Return true if segment was added, false otherwise.
     */
    addSegment(point: Vector2): boolean;
    /**
     * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
     * Returns false if nothing was done, true if segment was added.
     */
    tryAddNewSegment(point: Vector2): boolean;
    /**
     * Erase last segment if user drags back to prev node.
     * Returns true if segment was erased, false otherwise.
     */
    tryEraseLastSegment(point: Vector2): boolean;
    hasSegmentAt(point1: Vector2, point2: Vector2): boolean;
    resetColor(): void;
    finalize(): void;
}
//# sourceMappingURL=line.d.ts.map