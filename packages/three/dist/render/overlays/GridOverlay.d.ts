import { Group } from 'three/webgpu';
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js';
/**
 * Floor grid with colored axes. Drawn in the plane facing an axis view (XY for front/back, YZ for left/right),
 * otherwise on XZ. The spacing follows the view distance in powers of ten. Depth-tested against content.
 */
export declare class GridOverlay implements Overlay {
    readonly root: Group<import("three").Object3DEventMap>;
    private readonly _grid;
    private readonly _axes;
    private readonly _x;
    private readonly _y;
    private readonly _z;
    constructor();
    prepare(ctx: OverlayContext): void;
    dispose(): void;
}
export declare const gridOverlayType: OverlayType;
