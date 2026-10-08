import { Color, Group } from 'three/webgpu';
import { getEditObjects, getGeometryAdapter } from '../../geometry/GeometryAdapter.js';
import { deriveComponents } from '../../geometry/componentDomains.js';
import { StateCage } from './componentMaterials.js';
import { KeyedPool } from '../../utils/KeyedPool.js';
import { isShown } from '../../utils/sceneGraph.js';
/** Point size in CSS pixels. */
export const COMPONENT_POINT_SIZE = 6;
const SELECTED = new Color(0xffaa33);
const WIRE = new Color(0x1a1a1a);
const COLORS = {
    faces: { normal: WIRE, normalAlpha: 0, selected: SELECTED, selectedAlpha: 0.25 },
    edges: { normal: WIRE, normalAlpha: 0.9, selected: SELECTED, selectedAlpha: 1 },
    points: { normal: WIRE, normalAlpha: 1, selected: SELECTED, selectedAlpha: 1 },
};
/** Edit-mode drawing of one object: wire, points and selected faces, built from its topology. */
class EditCage extends StateCage {
    topology;
    _state = '';
    constructor(object, adapter) {
        const topology = adapter.getTopology(object);
        const edgePositions = new Float32Array(topology.edgeCount * 6);
        for (let e = 0; e < topology.edgeCount; e++) {
            for (let k = 0; k < 2; k++) {
                const point = topology.edgePoints[e * 2 + k];
                edgePositions.set(topology.pointPositions.subarray(point * 3, point * 3 + 3), e * 6 + k * 3);
            }
        }
        // A copy of the face triangles: disposing a geometry releases its attributes' GPU buffers, and the ID geometry is shared.
        const faces = adapter.getPrimitiveIdGeometry(object)?.getAttribute('position').array;
        super(faces?.slice() ?? null, edgePositions, topology.pointPositions, COLORS, COMPONENT_POINT_SIZE);
        this.topology = topology;
        this.group.matrixAutoUpdate = false;
        for (const child of this.group.children)
            child.matrixAutoUpdate = false;
    }
    update(object, selection) {
        // Same result whether or not the overlay scene updates world matrices (children keep identity matrices).
        this.group.matrix.copy(object.matrixWorld);
        this.group.matrixWorld.copy(object.matrixWorld);
        for (const child of this.group.children)
            child.matrixWorld.copy(object.matrixWorld);
        const domain = selection.domain;
        const state = `${selection.version}:${domain}`;
        if (state === this._state)
            return;
        this._state = state;
        const topology = this.topology;
        const { point, edge, primitive } = deriveComponents(topology, domain, selection.getComponents(object.uuid, domain));
        const faceStates = this.faceStates;
        if (faceStates)
            for (let f = 0; f < topology.primitiveCount; f++)
                faceStates.fill(primitive.has(f) ? 2 : 1, f * 3, f * 3 + 3);
        for (let e = 0; e < topology.edgeCount; e++)
            this.edgeStates.fill(edge.has(e) ? 2 : 1, e * 2, e * 2 + 2);
        for (let p = 0; p < topology.pointCount; p++)
            this.pointStates[p] = point.has(p) ? 2 : 1;
        this.updateStates();
        this.points.visible = domain === 'point';
    }
}
/**
 * Edit mode in 3D views (ADR-0007): the wire, points (point select mode) and selected faces of every
 * object in the edit set, colored from the selection's component sets. Selected elements in other
 * domains are derived for display (points of selected faces, edges between selected points, ...).
 */
export class ComponentOverlay {
    root = new Group();
    _cages = new KeyedPool(cage => {
        this.root.remove(cage.group);
        cage.dispose();
    });
    constructor() {
        this.root.name = 'ComponentOverlay';
    }
    prepare(ctx) {
        const selection = ctx.selection;
        const objects = ctx.editor.mode === 'edit' && selection ? getEditObjects(selection.getObjects()) : [];
        for (const object of objects) {
            if (!isShown(object))
                continue;
            const adapter = getGeometryAdapter(object);
            const cage = this._cages.get(object.uuid, () => {
                const cage = new EditCage(object, adapter);
                this.root.add(cage.group);
                return cage;
            }, cage => cage.topology === adapter.getTopology(object));
            cage.update(object, selection);
        }
        this._cages.sweep();
    }
    dispose() {
        this._cages.clear();
    }
}
export const componentOverlayType = {
    id: 'components',
    label: 'Edit mode components',
    viewKinds: ['3d'],
    enabledByDefault: true,
    order: 90,
    create: () => new ComponentOverlay(),
};
