import { Color, Group } from 'three/webgpu';
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js';
/** Outline width in CSS pixels. */
export declare const OUTLINE_WIDTH = 2;
/**
 * Outlines selected objects, active brighter (Blender-style). Selected meshes and lines are drawn into a
 * mask through proxies that share their geometry (content materials are never touched), then a full-screen
 * pass draws the mask's silhouette edge. Redraws on selection changes without redrawing the pipeline.
 */
export declare class SelectionOutlineOverlay implements Overlay {
    readonly root: Group<import("three").Object3DEventMap>;
    readonly activeColor: Color;
    readonly selectedColor: Color;
    private readonly _mask;
    private readonly _maskScene;
    private readonly _proxies;
    private readonly _meshMaterials;
    private readonly _lineMaterials;
    private readonly _texel;
    private readonly _active;
    private readonly _selected;
    private readonly _quad;
    private readonly _quadMaterial;
    constructor();
    prepare(ctx: OverlayContext): void;
    /**
     * A mask proxy for `object` sharing its geometry (and skeleton or instances), or null if it draws nothing
     * outlinable. Shared state is re-assigned every draw, so swapped geometry, skeletons and instances show.
     */
    private _proxy;
    dispose(): void;
}
export declare const selectionOutlineOverlayType: OverlayType;
