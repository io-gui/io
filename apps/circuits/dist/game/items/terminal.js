export const TERMINAL_COLORS = {
    white: '#ffffff',
    red: '#e52800',
    green: '#005923',
    blue: '#06afff',
    pink: '#ef47cc',
    yellow: '#fec41a',
    orange: '#ff6910',
    purple: '#760281',
};
export class Terminal {
    id;
    pos;
    color;
    constructor(id, pos, color) {
        this.id = id;
        this.pos = pos;
        this.color = color;
    }
    toJSON() {
        return { id: this.id, pos: this.pos, color: this.color };
    }
    static fromJSON(data) {
        return new Terminal(data.id, data.pos, data.color);
    }
}
//# sourceMappingURL=terminal.js.map