export const PAD_COLORS = {
    white: '#ffffff',
    red: '#e52800',
    green: '#005923',
    blue: '#06afff',
    pink: '#ef47cc',
    yellow: '#fec41a',
    orange: '#ff6910',
    purple: '#760281',
};
export class Pad {
    id;
    pos;
    isTerminal;
    color;
    renderColor;
    constructor(id, pos, isTerminal = false, color) {
        if (isTerminal && !color)
            console.error('Terminal pad must have a color');
        if (!isTerminal && color !== undefined)
            console.error('Non-terminal pad cannot have a color');
        this.id = id;
        this.pos = pos;
        this.isTerminal = isTerminal;
        this.color = isTerminal ? (color ?? 'red') : undefined;
        this.renderColor = this.color ?? 'white';
    }
    toJSON() {
        if (this.isTerminal) {
            debug: if (!this.color)
                console.error('Terminal pad must have a color');
            return { pos: this.pos, id: this.id, isTerminal: this.isTerminal, color: this.color };
        }
        else {
            debug: if (this.color)
                console.error('Non-terminal pad cannot have a color');
            return { pos: this.pos, id: this.id };
        }
    }
    static fromJSON(data) {
        return new Pad(data.id, data.pos, data.isTerminal, data.color);
    }
}
//# sourceMappingURL=pad.js.map