import { ReactiveNode } from '@io-gui/core';
import { Vector2 } from 'three/webgpu';
import { Pads } from './pads.js';
import { Layer } from './layer.js';
/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
export declare class Plotter extends ReactiveNode {
    width: number;
    height: number;
    pads: Pads;
    layer0: Layer;
    layer1: Layer;
    private _activeLayer;
    connect(pads: Pads, layer0: Layer, layer1: Layer): void;
    finalizeLine(): boolean;
    private isLineCompleated;
    plotLineTo(point: Vector2, layer: number): boolean;
    private getNextStepToward;
    startLineAt(point: Vector2, layer: number): boolean;
    extendLineTo(point: Vector2, layer: number): boolean;
}
//# sourceMappingURL=plotter.d.ts.map