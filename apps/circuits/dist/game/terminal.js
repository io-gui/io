export class Terminal {
    ID;
    pos;
    color;
    constructor(ID, pos, color) {
        this.ID = ID;
        this.pos = pos;
        this.color = color;
    }
    toJSON() {
        return { pos: this.pos, color: this.color, ID: this.ID };
    }
    static fromJSON(data) {
        return new Terminal(data.ID, data.pos, data.color);
    }
}
//# sourceMappingURL=terminal.js.map