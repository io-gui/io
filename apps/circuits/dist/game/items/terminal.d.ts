export declare const TERMINAL_COLORS: {
    white: string;
    red: string;
    green: string;
    blue: string;
    pink: string;
    yellow: string;
    orange: string;
    purple: string;
};
export type TerminalColor = keyof typeof TERMINAL_COLORS;
export interface TerminalData {
    id: number;
    pos: [number, number];
    color: TerminalColor;
}
export declare class Terminal {
    id: number;
    pos: [number, number];
    color: TerminalColor;
    constructor(id: number, pos: [number, number], color: TerminalColor);
    toJSON(): TerminalData;
    static fromJSON(data: TerminalData): Terminal;
}
//# sourceMappingURL=terminal.d.ts.map