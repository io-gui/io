import { DoubleSide, FloatType, Mesh, MeshBasicNodeMaterial, NoBlending, RenderTarget, Scene } from 'three/webgpu';
import { attribute, positionView, uniform, vec4 } from 'three/tsl';
import { getGeometryAdapter } from '../geometry/GeometryAdapter.js';
/** Reads one pixel of an ID buffer (outside the buffer reads as nothing). */
export function readIdBuffer(buffer, x, y, out = { slot: 0, element: 0, depth: 0 }) {
    const px = Math.floor(x), py = Math.floor(y);
    if (px < 0 || py < 0 || px >= buffer.width || py >= buffer.height) {
        out.slot = out.element = out.depth = 0;
        return out;
    }
    const offset = py * buffer.stride + px * 4;
    out.slot = Math.round(buffer.data[offset]);
    out.element = Math.round(buffer.data[offset + 1]);
    out.depth = buffer.data[offset + 2];
    return out;
}
/**
 * Draws the ID buffer for component picking (ADR-0007): edit objects as non-indexed triangles carrying
 * their primitive index, every other visible mesh as an occluder, into a float target at CSS-pixel size,
 * then reads it back. Proxies share geometry with the scene; content materials are never touched.
 * Deformation (skinning, morph targets) is not applied: components are picked on the rest shape.
 */
export class IdPass {
    _renderer;
    _target = new RenderTarget(1, 1, { type: FloatType, depthBuffer: true });
    _scene = new Scene();
    _proxies = new Map();
    _slot = uniform(0).onObjectUpdate(({ object }) => object?.userData.pickSlot ?? 0);
    _idMaterial = new MeshBasicNodeMaterial({ side: DoubleSide, blending: NoBlending });
    _occluderMaterial = new MeshBasicNodeMaterial({ side: DoubleSide, blending: NoBlending });
    constructor(renderer) {
        this._renderer = renderer;
        this._scene.matrixWorldAutoUpdate = false;
        this._idMaterial.colorNode = vec4(this._slot, attribute('pickId', 'float'), positionView.z.negate(), 1);
        this._occluderMaterial.colorNode = vec4(0, 0, positionView.z.negate(), 1);
    }
    /** Draws `objects` (edit set) and the occluders under `scene` and reads the buffer back. */
    async read(scene, camera, objects, width, height) {
        width = Math.max(1, Math.floor(width));
        height = Math.max(1, Math.floor(height));
        if (this._target.width !== width || this._target.height !== height)
            this._target.setSize(width, height);
        this._sync(scene, camera, objects);
        const renderer = this._renderer;
        const previousTarget = renderer.getRenderTarget();
        // Clear color is not restored: every pipeline and the compositor set their own before clearing.
        try {
            renderer.setRenderTarget(this._target);
            renderer.setClearColor(0x000000, 0);
            renderer.clear();
            renderer.render(this._scene, camera);
        }
        finally {
            renderer.setRenderTarget(previousTarget);
        }
        const data = await renderer.readRenderTargetPixelsAsync(this._target, 0, 0, width, height);
        return { width, height, stride: Math.ceil(width * 16 / 256) * 256 / 4, data, objects };
    }
    _sync(scene, camera, objects) {
        const slots = new Map(objects.map((object, i) => [object, i + 1]));
        const shown = new Set();
        scene.traverseVisible(child => {
            const object = child;
            if (!object.isMesh || !object.geometry || !object.layers.test(camera.layers))
                return;
            const slot = slots.get(object);
            const geometry = slot ? getGeometryAdapter(object)?.getPrimitiveIdGeometry(object) ?? null : object.isInstancedMesh ? null : object.geometry;
            if (!geometry)
                return;
            const key = `${object.uuid}:${slot ? 'id' : 'occluder'}`;
            let proxy = this._proxies.get(key);
            if (!proxy) {
                proxy = new Mesh(geometry, slot ? this._idMaterial : this._occluderMaterial);
                proxy.matrixAutoUpdate = false;
                proxy.frustumCulled = false;
                this._proxies.set(key, proxy);
                this._scene.add(proxy);
            }
            proxy.geometry = geometry;
            proxy.userData.pickSlot = slot ?? 0;
            proxy.matrixWorld.copy(object.matrixWorld);
            shown.add(key);
        });
        for (const [key, proxy] of this._proxies) {
            if (shown.has(key))
                continue;
            this._scene.remove(proxy);
            this._proxies.delete(key);
        }
    }
    dispose() {
        this._target.dispose();
        this._idMaterial.dispose();
        this._occluderMaterial.dispose();
        this._proxies.clear();
    }
}
