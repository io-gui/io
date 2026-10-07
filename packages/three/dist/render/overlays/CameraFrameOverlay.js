import { Group, MeshBasicNodeMaterial, Vector2 } from 'three/webgpu';
import { Fn, abs, float, screenUV, select, uniform, vec4 } from 'three/tsl';
import { createScreenQuad } from '../screenQuad.js';
/**
 * Passepartout for views that look through a scene camera: darkens what lies outside the camera's frame
 * (the view fits the frame inside the viewport with the view's overscan, ADR-0005).
 */
export class CameraFrameOverlay {
    root = new Group();
    /** Opacity of the area outside the frame. */
    opacity = uniform(0.5);
    /** Half size of the frame in normalized device coordinates. */
    _half = uniform(new Vector2(1, 1));
    _quad;
    _material = new MeshBasicNodeMaterial();
    constructor() {
        this.root.name = 'CameraFrameOverlay';
        const half = this._half;
        const opacity = this.opacity;
        const material = this._material;
        material.name = 'CameraFrameOverlay';
        material.colorNode = Fn(() => {
            const ndc = abs(screenUV.mul(2).sub(1));
            const outside = ndc.x.greaterThan(half.x).or(ndc.y.greaterThan(half.y));
            return vec4(0, 0, 0, select(outside, opacity, float(0)));
        })();
        material.transparent = true;
        material.depthTest = false;
        material.depthWrite = false;
        this._quad = createScreenQuad(material);
        this.root.add(this._quad);
    }
    prepare(ctx) {
        const source = ctx.view.getSourceCamera(ctx.scene);
        this._quad.visible = !!source;
        if (!source)
            return;
        const aspect = ctx.width / Math.max(1, ctx.height);
        let sourceAspect;
        if (source.isPerspectiveCamera) {
            sourceAspect = source.aspect;
        }
        else {
            const ortho = source;
            sourceAspect = (ortho.right - ortho.left) / Math.max(1e-9, ortho.top - ortho.bottom);
        }
        const overscan = ctx.view.overscan;
        if (sourceAspect > aspect)
            this._half.value.set(1 / overscan, aspect / sourceAspect / overscan);
        else
            this._half.value.set(sourceAspect / aspect / overscan, 1 / overscan);
    }
    dispose() {
        this._material.dispose();
    }
}
export const cameraFrameOverlayType = {
    id: 'cameraFrame',
    label: 'Camera frame',
    viewKinds: ['3d'],
    enabledByDefault: true,
    order: 200,
    create: () => new CameraFrameOverlay(),
};
