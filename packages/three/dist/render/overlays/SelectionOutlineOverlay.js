import { Color, Group, InstancedMesh, Line, LineBasicNodeMaterial, LineSegments, Mesh, MeshBasicNodeMaterial, RenderTarget, Scene, SkinnedMesh, UnsignedByteType, Vector2 } from 'three/webgpu';
import { Fn, float, max, screenUV, select, texture, uniform, vec2, vec4 } from 'three/tsl';
import { createScreenQuad } from '../screenQuad.js';
/** Outline width in CSS pixels. */
export const OUTLINE_WIDTH = 2;
const ACTIVE = 1;
const SELECTED = 0.5;
/**
 * Outlines selected objects, active brighter (Blender-style). Selected meshes and lines are drawn into a
 * mask through proxies that share their geometry (content materials are never touched), then a full-screen
 * pass draws the mask's silhouette edge. Redraws on selection changes without redrawing the pipeline.
 */
export class SelectionOutlineOverlay {
    root = new Group();
    activeColor = new Color(0xffaa33);
    selectedColor = new Color(0xe8590c);
    _mask = new RenderTarget(1, 1, { type: UnsignedByteType, depthBuffer: false });
    _maskScene = new Scene();
    _proxies = new Map();
    _meshMaterials = [new MeshBasicNodeMaterial(), new MeshBasicNodeMaterial()];
    _lineMaterials = [new LineBasicNodeMaterial(), new LineBasicNodeMaterial()];
    _texel = uniform(new Vector2(1, 1));
    _active = uniform(this.activeColor);
    _selected = uniform(this.selectedColor);
    _quad;
    _quadMaterial = new MeshBasicNodeMaterial();
    constructor() {
        this.root.name = 'SelectionOutlineOverlay';
        this._maskScene.matrixWorldAutoUpdate = false;
        for (const [i, value] of [ACTIVE, SELECTED].entries()) {
            this._meshMaterials[i].colorNode = vec4(value, value, value, 1);
            this._lineMaterials[i].colorNode = vec4(value, value, value, 1);
        }
        const mask = texture(this._mask.texture);
        const texel = this._texel;
        const outline = Fn(() => {
            const center = mask.sample(screenUV).r;
            const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];
            const samples = offsets.map(([x, y]) => mask.sample(screenUV.add(vec2(x, y).mul(texel))).r);
            const around = max(samples[0], samples[1], ...samples.slice(2));
            const edge = around.greaterThan(0).and(center.equal(0));
            const color = select(around.greaterThan(0.75), this._active, this._selected);
            return vec4(color, select(edge, float(1), float(0)));
        });
        const material = this._quadMaterial;
        material.name = 'SelectionOutlineOverlay';
        material.colorNode = outline();
        material.transparent = true;
        material.depthTest = false;
        material.depthWrite = false;
        this._quad = createScreenQuad(material);
        this._quad.renderOrder = 1000;
        this.root.add(this._quad);
    }
    prepare(ctx) {
        const objects = ctx.selection?.getObjects() ?? [];
        const active = ctx.selection?.active ?? '';
        const shown = new Set();
        for (const object of objects) {
            object.traverseVisible(child => {
                const proxy = this._proxy(child, child.uuid === active || object.uuid === active);
                if (!proxy)
                    return;
                shown.add(child.uuid);
                proxy.matrix.copy(child.matrixWorld);
                proxy.matrixWorld.copy(child.matrixWorld);
            });
        }
        for (const [uuid, proxy] of this._proxies) {
            if (shown.has(uuid))
                continue;
            this._maskScene.remove(proxy);
            this._proxies.delete(uuid);
        }
        this._quad.visible = shown.size > 0;
        if (!shown.size)
            return;
        const renderer = ctx.renderer;
        const width = Math.max(1, Math.floor(ctx.width * ctx.pixelRatio));
        const height = Math.max(1, Math.floor(ctx.height * ctx.pixelRatio));
        if (this._mask.width !== width || this._mask.height !== height)
            this._mask.setSize(width, height);
        this._texel.value.set(OUTLINE_WIDTH * ctx.pixelRatio / this._mask.width, OUTLINE_WIDTH * ctx.pixelRatio / this._mask.height);
        renderer.setRenderTarget(this._mask);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(this._maskScene, ctx.camera);
        renderer.setRenderTarget(null);
    }
    /** A mask proxy for `object` sharing its geometry (and skeleton or instances), or null if it draws nothing outlinable. */
    _proxy(object, isActive) {
        const index = isActive ? 0 : 1;
        let proxy = this._proxies.get(object.uuid);
        if (!proxy) {
            if (object.isMesh) {
                const source = object;
                if (object.isSkinnedMesh) {
                    const skinned = new SkinnedMesh(source.geometry);
                    skinned.bind(source.skeleton, source.bindMatrix);
                    proxy = skinned;
                }
                else if (object.isInstancedMesh) {
                    const instanced = source;
                    const copy = new InstancedMesh(source.geometry, undefined, instanced.count);
                    copy.instanceMatrix = instanced.instanceMatrix;
                    proxy = copy;
                }
                else {
                    proxy = new Mesh(source.geometry);
                }
                proxy.morphTargetInfluences = source.morphTargetInfluences;
            }
            else if (object.isLine) {
                proxy = object.isLineSegments ? new LineSegments(object.geometry) : new Line(object.geometry);
            }
            else {
                return null;
            }
            proxy.matrixAutoUpdate = false;
            proxy.frustumCulled = false;
            this._proxies.set(object.uuid, proxy);
            this._maskScene.add(proxy);
        }
        proxy.material = (proxy.isMesh ? this._meshMaterials : this._lineMaterials)[index];
        return proxy;
    }
    dispose() {
        this._mask.dispose();
        this._quadMaterial.dispose();
        for (const material of [...this._meshMaterials, ...this._lineMaterials])
            material.dispose();
        this._proxies.clear();
    }
}
export const selectionOutlineOverlayType = {
    id: 'selection',
    label: 'Selection outline',
    viewKinds: ['3d'],
    enabledByDefault: true,
    order: 100,
    create: () => new SelectionOutlineOverlay(),
};
