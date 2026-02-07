export interface TerminalData {
    ID: number;
    pos: [number, number];
    color: string;
}
export declare class Terminal {
    ID: number;
    pos: [number, number];
    color: string;
    constructor(ID: number, pos: [number, number], color: string);
    toJSON(): TerminalData;
    static fromJSON(data: TerminalData): Terminal;
}
//# sourceMappingURL=terminal.d.ts.map