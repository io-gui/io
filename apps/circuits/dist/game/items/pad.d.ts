import { TerminalColor } from './terminal.js';
export interface PadData {
    id: number;
    pos: [number, number];
}
export declare class Pad {
    id: number;
    pos: [number, number];
    _color: TerminalColor;
    get color(): TerminalColor;
    set color(color: TerminalColor);
    constructor(id: number, pos: [number, number]);
    toJSON(): PadData;
    static fromJSON(data: PadData): Pad;
}
//# sourceMappingURL=pad.d.ts.map