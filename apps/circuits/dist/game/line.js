export class Line {
    ID;
    pos;
    layer;
    readonly;
    constructor(ID, pos, layer) {
        this.ID = ID;
        this.pos = [pos];
        this.layer = layer;
        this.readonly = false;
    }
    /**
     * Add a grid segment.
     * Returns false if the segment was rejected.
     */
    addSegment(x, y) {
        if (!this._checkErase(x, y))
            return false;
        if (!this._checkDirection(x, y))
            return false;
        this.pos.push([x, y]);
        return true;
    }
    removeLast() {
        this.pos.pop();
    }
    toJSON() {
        return { ID: this.ID, pos: this.pos, layer: this.layer };
    }
    static fromJSON(data) {
        const layer = 'layer' in data && typeof data.layer === 'number'
            ? data.layer
            : data.color === 'grey'
                ? -1
                : 0;
        const line = new Line(data.ID, data.pos[0], layer);
        for (let j = 1; j < data.pos.length; j++) {
            line.addSegment(data.pos[j][0], data.pos[j][1]);
        }
        if (data.readonly)
            line.readonly = true;
        return line;
    }
    /** Prevent backtracking over more than one step. */
    _checkDirection(x, y) {
        const ln = this.pos.length;
        if (ln > 1) {
            if (y === this.pos[ln - 2][1] && Math.abs(x - this.pos[ln - 2][0]) === 1)
                return false;
            if (x === this.pos[ln - 2][0] && Math.abs(y - this.pos[ln - 2][1]) === 1)
                return false;
        }
        const last = this.pos[ln - 1];
        if (Math.abs(last[0] - x) > 1)
            return false;
        if (Math.abs(last[1] - y) > 1)
            return false;
        return true;
    }
    /** Erase last segment if user drags back to prev node. */
    _checkErase(x, y) {
        const ln = this.pos.length;
        if (ln < 2)
            return true;
        if (x === this.pos[ln - 2][0] && y === this.pos[ln - 2][1]) {
            this.removeLast();
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=line.js.map