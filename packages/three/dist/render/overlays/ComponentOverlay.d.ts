import { Group } from 'three/webgpu';
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js';
/** Point size in CSS pixels. */
export declare const COMPONENT_POINT_SIZE = 6;
/**
 * Edit mode in 3D views (ADR-0007): the wire, points (point select mode) and selected faces of every
 * object in the edit set, colored from the selection's component sets. Selected elements in other
 * domains are derived for display (points of selected faces, edges between selected points, ...).
 */
export declare class ComponentOverlay implements Overlay {
    readonly root: Group<import("three").Object3DEventMap>;
    private readonly _cages;
    constructor();
    prepare(ctx: OverlayContext): void;
    private _remove;
    dispose(): void;
}
export declare const componentOverlayType: OverlayType;
