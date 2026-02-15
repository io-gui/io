import { ReactiveNode } from '@io-gui/core';
import { Color, DataTexture } from 'three/webgpu';
import { Line, type LineData } from './items/line.js';
export type LayerData = Array<LineData>;
export declare class Layer extends ReactiveNode {
    private _width;
    private _height;
    private _lines;
    private _texture;
    get texture(): DataTexture;
    get lines(): Line[];
    get lastLine(): Line;
    constructor(width?: number, height?: number, data?: LayerData);
    private _createTexture;
    updateTexture(width: number, height: number): void;
    clear(width: number, height: number): void;
    load(width: number, height: number, data?: LayerData): void;
    forEach(callback: (line: Line) => void): void;
    getLinesAt(x: number, y: number): Line[];
    addAt(x: number, y: number, renderColor?: Color): boolean;
    extendAt(x: number, y: number): boolean;
    deleteAt(x: number, y: number): boolean;
    delete(line: Line): boolean;
    toJSON(): LayerData;
    static fromJSON(width: number, height: number, data: LayerData): Layer;
    inBounds(x: number, y: number): boolean;
    hasDiagonalCrossing(x1: number, y1: number, x2: number, y2: number): boolean;
    private _areIntegers;
}
//# sourceMappingURL=layer.d.ts.map