import { BufferGeometry, Float32BufferAttribute, Group, LineBasicNodeMaterial, LineSegments, Mesh, MeshBasicNodeMaterial, NoToneMapping, PlaneGeometry, Scene } from 'three/webgpu';
import { RaycastPicker } from '../../selection/Picker.js';
import { RenderTargetPipeline } from './RenderTargetPipeline.js';
import { UVComponentPicker, UVEditCage, getUVEditMeshes, getUVEditState, getUVLayoutState, uvKey } from './UVEdit.js';
import { KeyedPool } from '../../utils/KeyedPool.js';
import { isDescendant } from '../../utils/sceneGraph.js';
/** Meshes with a `uv` attribute under the selected objects: the layouts the UV view shows in object mode. */
export function collectUVMeshes(objects) {
    const meshes = new Set();
    for (const object of objects) {
        object.traverse(child => {
            const mesh = child;
            if (mesh.isMesh && mesh.geometry?.getAttribute('uv'))
                meshes.add(mesh);
        });
    }
    return [...meshes];
}
function unitGridGeometry(divisions = 10) {
    const positions = [];
    for (let i = 0; i <= divisions; i++) {
        const t = i / divisions;
        positions.push(t, 0, 0, t, 1, 0, 0, t, 0, 1, t, 0);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
}
/**
 * The `uv` view kind's pipeline (ADR-0006). It never draws the content scene: it draws the 0–1 grid, the
 * active object's color texture, and the UV layout of every selected mesh, the active one selected.
 * Picking hits the UV layouts and resolves to their meshes. Redraws on selection and geometry changes.
 * In edit mode the layouts show UV faces, edges and vertices with their selection, and picking goes
 * through `componentPicker` (ADR-0007).
 */
export class UVPipeline extends RenderTargetPipeline {
    toneMapping = NoToneMapping;
    picker;
    componentPicker = new UVComponentPicker();
    uvScene = new Scene();
    /** Show the active object's `material.map` behind the layout. */
    showTexture = true;
    _layouts = new Group();
    _cages = new KeyedPool(cage => {
        this._layouts.remove(cage.group);
        cage.dispose();
    });
    _grid;
    _textureMaterial = new MeshBasicNodeMaterial({ transparent: true, opacity: 0.6, depthWrite: false });
    _texturePlane;
    constructor() {
        super();
        this.picker = new RaycastPicker({
            root: () => this._layouts,
            resolve: object => object.userData.source ?? null,
        });
        this._grid = new LineSegments(unitGridGeometry(), new LineBasicNodeMaterial({ color: 0x555555, transparent: true, opacity: 0.6, depthWrite: false }));
        this._grid.userData.selectable = false;
        this._texturePlane = new Mesh(new PlaneGeometry(1, 1), this._textureMaterial);
        this._texturePlane.position.set(0.5, 0.5, -0.01);
        this._texturePlane.userData.selectable = false;
        this.uvScene.add(this._texturePlane, this._grid, this._layouts);
    }
    listens(change) {
        // The layout follows the selection and the geometry, not object transforms.
        if (change.kind === 'transform' || change.kind === 'time')
            return false;
        return 'content';
    }
    draw(ctx) {
        const selection = ctx.selection;
        const active = selection?.getActiveObject();
        const editMode = ctx.editor.mode === 'edit' && !!selection;
        const showPoints = editMode && (selection.domain === 'point' || (!selection.uvSync && selection.domain === 'object'));
        for (const mesh of editMode ? getUVEditMeshes(selection) : collectUVMeshes(selection?.getObjects() ?? [])) {
            const cage = this._cages.get(mesh.uuid, () => {
                const cage = new UVEditCage(mesh);
                this._layouts.add(cage.group);
                return cage;
            }, cage => cage.key === uvKey(mesh));
            const isActive = !editMode && !!active && isDescendant(mesh, active);
            cage.update(editMode ? getUVEditState(selection, mesh) : getUVLayoutState(mesh, isActive), showPoints);
            // Draw the active layout on top.
            cage.group.position.z = isActive ? 0.001 : 0;
        }
        this._cages.sweep();
        this._syncTexture(active);
        ctx.renderer.render(this.uvScene, ctx.camera);
    }
    _syncTexture(active) {
        const material = active?.material;
        const map = this.showTexture && material && !Array.isArray(material) ? material.map ?? null : null;
        this._texturePlane.visible = !!map;
        if (map && this._textureMaterial.map !== map) {
            this._textureMaterial.map = map;
            this._textureMaterial.needsUpdate = true;
        }
    }
    dispose() {
        this._cages.clear();
        this._grid.geometry.dispose();
        this._grid.material.dispose();
        this._texturePlane.geometry.dispose();
        this._textureMaterial.dispose();
        super.dispose();
    }
}
