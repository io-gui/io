import { Pad, type PadData } from './items/pad.js';
import { type ColorName } from './items/colors.js';
import { ReactiveNode } from '@io-gui/core';
import { DataTexture } from 'three';
export type PadsData = Record<string, PadData>;
export declare class Pads extends ReactiveNode {
    private _width;
    private _height;
    private _stride;
    private _cells;
    private _texture;
    get texture(): DataTexture;
    constructor(width?: number, height?: number, data?: PadsData);
    private _createTexture;
    updateTexture(width: number, height: number): void;
    clear(width: number, height: number): void;
    load(data?: PadsData): void;
    forEach(callback: (pad: Pad, x: number, y: number) => void): void;
    getAt(x: number, y: number): Pad | undefined;
    addAt(x: number, y: number, color?: ColorName): boolean;
    deleteAt(x: number, y: number): boolean;
    toJSON(): PadsData;
    static fromJSON(width: number, height: number, data: PadsData): Pads;
    private _index;
    private _inBounds;
    private _areIntegers;
}
//# sourceMappingURL=pads.d.ts.map