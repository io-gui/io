import { Vector2 } from 'three/webgpu';
import { COLORS } from './colors.js';
const SQRT_2 = Math.sqrt(2);
const _vec2_1 = new Vector2();
const _vec2_2 = new Vector2();
export class Line {
    pos;
    renderColor;
    isFinalized;
    constructor(pos, isFinalized = false, renderColor = COLORS.white) {
        this.pos = pos;
        this.renderColor = renderColor;
        this.isFinalized = isFinalized;
    }
    toJSON() {
        return this.pos.map((point) => [point.x, point.y]);
    }
    static fromJSON(data) {
        return new Line(data.map((point) => new Vector2(point[0], point[1])), true);
    }
    get length() {
        return this.pos.length;
    }
    get firstPt() {
        return this.pos[0];
    }
    get lastPt() {
        return this.pos[this.length - 1];
    }
    get secondLastPt() {
        return this.pos[this.length - 2];
    }
    /**
     * Plot a new segment on the line if direction is valid.
     * Erase last segment if user drags back to prev node.
     * Return true if segment was added, false otherwise.
     */
    addSegment(point) {
        if (this.tryEraseLastSegment(point))
            return true;
        if (this.tryAddNewSegment(point))
            return true;
        return false;
    }
    /**
     * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
     * Returns false if nothing was done, true if segment was added.
     */
    tryAddNewSegment(point) {
        // Reject if segment is too long
        if (this.lastPt.distanceTo(point) > SQRT_2)
            return false;
        // Reroute if user went 45° backwards
        if (this.secondLastPt) {
            _vec2_1.copy(this.lastPt).sub(this.secondLastPt);
            _vec2_2.copy(point).sub(this.lastPt);
            if (_vec2_1.dot(_vec2_2) === -1) {
                this.pos.pop();
                this.pos.push(point.clone());
                return true;
            }
        }
        if (point.equals(this.lastPt)) {
            return false;
        }
        // Add new segment
        this.pos.push(point.clone());
        return true;
    }
    /**
     * Erase last segment if user drags back to prev node.
     * Returns true if segment was erased, false otherwise.
     */
    tryEraseLastSegment(point) {
        if (!this.secondLastPt)
            return false;
        if (this.secondLastPt.distanceTo(point) === 0) {
            this.pos.pop();
            return true;
        }
        return false;
    }
    hasSegmentAt(point1, point2) {
        for (let i = 0; i < this.pos.length - 2; i++) {
            if (this.pos[i].equals(point1) && this.pos[i + 1].equals(point2)) {
                return true;
            }
            else if (this.pos[i].equals(point2) && this.pos[i + 1].equals(point1)) {
                return true;
            }
        }
        return false;
    }
    resetColor() {
        this.renderColor = COLORS.white;
    }
    finalize() {
        this.isFinalized = true;
    }
}
//# sourceMappingURL=line.js.map