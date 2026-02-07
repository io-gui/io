export class Pad {
    ID;
    pos;
    constructor(ID, pos) {
        this.ID = ID;
        this.pos = pos;
    }
    toJSON() {
        return { pos: this.pos, ID: this.ID };
    }
    static fromJSON(data) {
        return new Pad(data.ID, data.pos);
    }
}
//# sourceMappingURL=pad.js.map