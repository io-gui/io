export class Pad {
    id;
    pos;
    _color = 'white';
    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }
    constructor(id, pos) {
        this.id = id;
        this.pos = pos;
    }
    toJSON() {
        return { pos: this.pos, id: this.id };
    }
    static fromJSON(data) {
        return new Pad(data.id, data.pos);
    }
}
//# sourceMappingURL=pad.js.map