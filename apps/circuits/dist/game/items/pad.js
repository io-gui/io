import { COLORS } from './colors.js';
export class Pad {
    color;
    isTerminal;
    renderColor;
    constructor(color) {
        this.color = color;
        this.isTerminal = color !== undefined;
        this.renderColor = this.color ? COLORS[this.color] : COLORS.white;
    }
    toJSON() {
        if (this.isTerminal) {
            debug: if (this.color === undefined)
                console.error('Terminal pad must have a color');
            return { color: this.color };
        }
        else {
            debug: if (this.color !== undefined)
                console.error('Non-terminal pad cannot have a color');
            return {};
        }
    }
    resetColor() {
        this.renderColor = this.color ? COLORS[this.color] : COLORS.white;
    }
}
//# sourceMappingURL=pad.js.map