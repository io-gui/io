import { Color } from 'three/webgpu';
import { type ColorName } from './colors.js';
export interface PadData {
    color?: ColorName;
}
export declare class Pad {
    color: ColorName | undefined;
    isTerminal: boolean;
    renderColor: Color;
    constructor(color?: ColorName);
    toJSON(): PadData;
    resetColor(): void;
}
//# sourceMappingURL=pad.d.ts.map