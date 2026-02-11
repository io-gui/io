export class Line {
    id;
    pos;
    layer;
    _color = 'white';
    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }
    constructor(id, pos, layer) {
        this.id = id;
        this.pos = pos;
        this.layer = layer;
    }
    toJSON() {
        return {
            id: this.id,
            pos: this.pos,
            layer: this.layer,
        };
    }
    static fromJSON(data) {
        return new Line(data.id, data.pos, data.layer);
    }
    hasDiagonalSegmentAt(mx, my) {
        const pos = this.pos;
        for (let i = 1; i < pos.length; i++) {
            const ax = pos[i - 1][0];
            const ay = pos[i - 1][1];
            const bx = pos[i][0];
            const by = pos[i][1];
            if (Math.abs(bx - ax) === 1 && Math.abs(by - ay) === 1 &&
                (ax + bx) / 2 === mx && (ay + by) / 2 === my) {
                return true;
            }
        }
        return false;
    }
    /**
     * Plot a new segment on the line if direction is valid.
     * Erase last segment if user drags back to prev node.
     * Return true if segment was added, false otherwise.
     */
    plotSegment(x, y) {
        if (this._tryEraseLastSegment(x, y))
            return true;
        if (this._tryAddNewSegment(x, y))
            return true;
        return false;
    }
    /**
     * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
     * Returns true if nothing was done, false if path was updated.
     */
    _tryAddNewSegment(x, y) {
        const ln = this.pos.length;
        if (ln > 1) {
            if (y === this.pos[ln - 2][1] && Math.abs(x - this.pos[ln - 2][0]) === 1) {
                this.pos.pop();
                this.pos.push([x, y]);
                return false;
            }
            if (x === this.pos[ln - 2][0] && Math.abs(y - this.pos[ln - 2][1]) === 1) {
                this.pos.pop();
                this.pos.push([x, y]);
                return false;
            }
        }
        const last = this.pos[ln - 1];
        if (Math.abs(last[0] - x) > 1)
            return true;
        if (Math.abs(last[1] - y) > 1)
            return true;
        this.pos.push([x, y]);
        return false;
    }
    /** Erase last segment if user drags back to prev node. */
    _tryEraseLastSegment(x, y) {
        const ln = this.pos.length;
        if (ln < 2)
            return false;
        if (x === this.pos[ln - 2][0] && y === this.pos[ln - 2][1]) {
            this.pos.pop();
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=line.js.map