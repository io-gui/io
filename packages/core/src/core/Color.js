export class Color {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    applyJSON(hex) {
        const u = hex >>> 0;
        if (u <= 0xffffff) {
            this.r = ((u >> 16) & 255) / 255;
            this.g = ((u >> 8) & 255) / 255;
            this.b = (u & 255) / 255;
            this.a = 1;
            return this;
        }
        this.r = ((u >> 16) & 255) / 255;
        this.g = ((u >> 8) & 255) / 255;
        this.b = (u & 255) / 255;
        this.a = ((u >> 24) & 255) / 255;
        return this;
    }
    toHex() {
        const r = Math.round(this.r * 255);
        const g = Math.round(this.g * 255);
        const b = Math.round(this.b * 255);
        const a = Math.round(this.a * 255);
        return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
    }
    static toHex(r, g, b, a = 1) {
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        a = Math.round(a * 255);
        return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
    }
    toJSON() {
        return this.toHex();
    }
    toCss() {
        const r = Math.floor(this.r * 255);
        const g = Math.floor(this.g * 255);
        const b = Math.floor(this.b * 255);
        return `rgba(${r}, ${g}, ${b}, ${this.a})`;
    }
}
//# sourceMappingURL=Color.js.map