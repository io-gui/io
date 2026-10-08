import { BufferAttribute, BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Group, LineBasicNodeMaterial, LineSegments, Mesh, MeshBasicNodeMaterial, NoToneMapping, PlaneGeometry, Scene, WireframeGeometry } from 'three/webgpu';
import { RaycastPicker } from '../../selection/Picker.js';
import { RenderTargetPipeline } from './RenderTargetPipeline.js';
import { attributeVersion } from '../../geometry/Topology.js';
import { UVComponentPicker, UVEditCage, getUVEditMeshes, getUVEditState, uvKey } from './UVEdit.js';
/** Meshes with a `uv` attribute under the selected objects: the edit set the UV view shows. */
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
/** A flat copy of a geometry's UV layout: `uv` becomes the xy position, the index is kept. */
export function buildUVGeometry(geometry) {
    const uv = geometry.getAttribute('uv');
    const positions = new Float32Array(uv.count * 3);
    for (let i = 0; i < uv.count; i++) {
        positions[i * 3] = uv.getX(i);
        positions[i * 3 + 1] = uv.getY(i);
    }
    const result = new BufferGeometry();
    result.setAttribute('position', new BufferAttribute(positions, 3));
    if (geometry.index)
        result.setIndex(geometry.index.clone());
    return result;
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
 * active object's color texture, and the UV layout of every selected mesh (the edit set), active brighter.
 * Picking hits the UV layouts and resolves to their meshes. Redraws on selection and geometry changes.
 * In edit mode it draws UV faces, edges and vertices with their selection instead, and picks components
 * (`componentPicker`, ADR-0007).
 */
export class UVPipeline extends RenderTargetPipeline {
    toneMapping = NoToneMapping;
    picker;
    componentPicker = new UVComponentPicker();
    uvScene = new Scene();
    /** Show the active object's `material.map` behind the layout. */
    showTexture = true;
    wireColor = new Color(0xb0b0b0);
    activeColor = new Color(0xffaa33);
    _layouts = new Group();
    _entries = new Map();
    _cages = new Map();
    _editLayouts = new Group();
    _grid;
    _textureMaterial = new MeshBasicNodeMaterial({ transparent: true, opacity: 0.6, depthWrite: false });
    _texturePlane;
    _wire = new LineBasicNodeMaterial({ transparent: true, opacity: 0.9 });
    _wireActive = new LineBasicNodeMaterial({ transparent: true, opacity: 1 });
    _fill = new MeshBasicNodeMaterial({ transparent: true, opacity: 0.08, side: DoubleSide, depthWrite: false });
    _fillActive = new MeshBasicNodeMaterial({ transparent: true, opacity: 0.18, side: DoubleSide, depthWrite: false });
    constructor() {
        super();
        this.picker = new RaycastPicker({
            root: () => this._layouts,
            resolve: object => object.userData.source ?? null,
        });
        this._wire.color = this.wireColor;
        this._fill.color = this.wireColor;
        this._wireActive.color = this.activeColor;
        this._fillActive.color = this.activeColor;
        this._grid = new LineSegments(unitGridGeometry(), new LineBasicNodeMaterial({ color: 0x555555, transparent: true, opacity: 0.6, depthWrite: false }));
        this._grid.userData.selectable = false;
        this._texturePlane = new Mesh(new PlaneGeometry(1, 1), this._textureMaterial);
        this._texturePlane.position.set(0.5, 0.5, -0.01);
        this._texturePlane.userData.selectable = false;
        this.uvScene.add(this._texturePlane, this._grid, this._layouts, this._editLayouts);
    }
    listens(change) {
        // The layout follows the selection and the geometry, not object transforms.
        if (change.kind === 'transform' || change.kind === 'time')
            return false;
        return 'content';
    }
    draw(ctx) {
        const editMode = ctx.editor.mode === 'edit' && !!ctx.selection;
        const active = ctx.selection?.getActiveObject();
        this._syncLayouts(editMode ? [] : collectUVMeshes(ctx.selection?.getObjects() ?? []), active);
        this._syncEditLayouts(editMode ? getUVEditMeshes(ctx.selection) : [], ctx);
        this._syncTexture(active);
        ctx.renderer.render(this.uvScene, ctx.camera);
    }
    _syncEditLayouts(meshes, ctx) {
        const shown = new Set();
        const selection = ctx.selection;
        const showPoints = selection.domain === 'point' || (!selection.uvSync && selection.domain === 'object');
        for (const mesh of meshes) {
            let cage = this._cages.get(mesh.uuid);
            if (cage && cage.key !== uvKey(mesh)) {
                this._removeCage(mesh.uuid);
                cage = undefined;
            }
            if (!cage) {
                cage = new UVEditCage(mesh);
                this._cages.set(mesh.uuid, cage);
                this._editLayouts.add(cage.group);
            }
            cage.update(getUVEditState(selection, mesh), showPoints);
            shown.add(mesh.uuid);
        }
        for (const uuid of [...this._cages.keys()])
            if (!shown.has(uuid))
                this._removeCage(uuid);
    }
    _removeCage(uuid) {
        const cage = this._cages.get(uuid);
        if (!cage)
            return;
        this._editLayouts.remove(cage.group);
        cage.dispose();
        this._cages.delete(uuid);
    }
    _syncLayouts(meshes, active) {
        const shown = new Set();
        for (const mesh of meshes) {
            const geometry = mesh.geometry;
            const key = `${geometry.uuid}:${attributeVersion(geometry.getAttribute('uv'))}:${geometry.index?.version ?? -1}`;
            let entry = this._entries.get(mesh.uuid);
            if (entry && entry.key !== key) {
                this._removeEntry(mesh.uuid);
                entry = undefined;
            }
            if (!entry) {
                const uvGeometry = buildUVGeometry(geometry);
                const fill = new Mesh(uvGeometry, this._fill);
                const wire = new LineSegments(new WireframeGeometry(uvGeometry), this._wire);
                fill.userData.source = mesh;
                wire.userData.source = mesh;
                const group = new Group();
                group.add(fill, wire);
                this._layouts.add(group);
                entry = { key, group, fill, wire };
                this._entries.set(mesh.uuid, entry);
            }
            const isActive = mesh === active || (!!active && isAncestor(active, mesh));
            entry.fill.material = isActive ? this._fillActive : this._fill;
            entry.wire.material = isActive ? this._wireActive : this._wire;
            // Draw the active layout on top.
            entry.group.position.z = isActive ? 0.001 : 0;
            shown.add(mesh.uuid);
        }
        for (const uuid of [...this._entries.keys()]) {
            if (!shown.has(uuid))
                this._removeEntry(uuid);
        }
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
    _removeEntry(uuid) {
        const entry = this._entries.get(uuid);
        if (!entry)
            return;
        this._layouts.remove(entry.group);
        entry.fill.geometry.dispose();
        entry.wire.geometry.dispose();
        this._entries.delete(uuid);
    }
    dispose() {
        for (const uuid of [...this._entries.keys()])
            this._removeEntry(uuid);
        for (const uuid of [...this._cages.keys()])
            this._removeCage(uuid);
        this._grid.geometry.dispose();
        this._grid.material.dispose();
        this._texturePlane.geometry.dispose();
        for (const material of [this._textureMaterial, this._wire, this._wireActive, this._fill, this._fillActive])
            material.dispose();
        super.dispose();
    }
}
function isAncestor(ancestor, object) {
    for (let node = object.parent; node; node = node.parent)
        if (node === ancestor)
            return true;
    return false;
}
