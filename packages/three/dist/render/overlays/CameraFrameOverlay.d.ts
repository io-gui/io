import { Group } from 'three/webgpu';
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js';
/**
 * Passepartout for views that look through a scene camera: darkens what lies outside the camera's frame
 * (the view fits the frame inside the viewport with the view's overscan, ADR-0005).
 */
export declare class CameraFrameOverlay implements Overlay {
    readonly root: Group<import("three").Object3DEventMap>;
    /** Opacity of the area outside the frame. */
    readonly opacity: import("three/webgpu").UniformNode<number>;
    /** Half size of the frame in normalized device coordinates. */
    private readonly _half;
    private readonly _quad;
    private readonly _material;
    constructor();
    prepare(ctx: OverlayContext): void;
    dispose(): void;
}
export declare const cameraFrameOverlayType: OverlayType;
