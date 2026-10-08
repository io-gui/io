import { BufferGeometry, DoubleSide, Float32BufferAttribute, Group, InstancedBufferAttribute, LineBasicNodeMaterial, LineSegments, Mesh, MeshBasicNodeMaterial, PointsNodeMaterial, Sprite } from 'three/webgpu';
import { attribute, cameraFar, cameraNear, float, instancedBufferAttribute, positionView, select, uniform, vec4, viewZToOrthographicDepth, viewZToPerspectiveDepth } from 'three/tsl';
const _orthographic = uniform(0).onRenderUpdate(({ camera }) => camera?.isOrthographicCamera ? 1 : 0);
/**
 * Fragment depth pulled slightly toward the camera, so wires and points drawn on a surface win the depth
 * test against it (and stay hidden behind other surfaces). Relative in perspective, constant in orthographic.
 */
export function biasedDepthNode(bias = 0.002) {
    const z = positionView.z;
    const perspective = viewZToPerspectiveDepth(z.mul(1 - bias), cameraNear, cameraFar);
    const orthographic = viewZToOrthographicDepth(z.add(cameraFar.sub(cameraNear).mul(bias * 0.05)), cameraNear, cameraFar);
    return select(_orthographic.greaterThan(0.5), orthographic, perspective);
}
function stateColor(state, colors) {
    const normal = vec4(uniform(colors.normal), colors.normalAlpha);
    const selected = vec4(uniform(colors.selected), colors.selectedAlpha);
    const s = float(state);
    return select(s.greaterThan(1.5), selected, select(s.greaterThan(0.5), normal, vec4(0, 0, 0, 0)));
}
function overlayDefaults(material, depthTest) {
    material.transparent = true;
    material.depthWrite = false;
    material.depthTest = depthTest;
    if (depthTest)
        material.depthNode = biasedDepthNode();
    return material;
}
/** Faces colored by a per-vertex `state` attribute. */
export function stateFaceMaterial(colors, depthTest = true) {
    const material = new MeshBasicNodeMaterial({ side: DoubleSide });
    material.colorNode = stateColor(attribute('state', 'float'), colors);
    return overlayDefaults(material, depthTest);
}
/** Line segments colored by a per-vertex `state` attribute. */
export function stateLineMaterial(colors, depthTest = true) {
    const material = new LineBasicNodeMaterial();
    material.colorNode = stateColor(attribute('state', 'float'), colors);
    return overlayDefaults(material, depthTest);
}
/** Screen-sized squares at instanced positions (use with a `Sprite` whose `count` is the point count). */
export function statePointMaterial(positions, states, colors, size, depthTest = true) {
    const material = new PointsNodeMaterial({ sizeAttenuation: false });
    material.positionNode = instancedBufferAttribute(positions);
    material.sizeNode = float(size);
    material.colorNode = stateColor(instancedBufferAttribute(states), colors);
    return overlayDefaults(material, depthTest);
}
function stateGeometry(positions, states) {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('state', states);
    return geometry;
}
/**
 * Faces (triangles), edges (segments) and points with a state per vertex: how edit mode draws the components
 * of an object, and the UV view a layout. Positions are fixed; write the state arrays, then `updateStates()`.
 */
export class StateCage {
    group = new Group();
    faces = null;
    edges;
    points;
    /** One state per face vertex, per edge end and per point: 0 hidden, 1 normal, 2 selected. */
    faceStates = null;
    edgeStates;
    pointStates;
    _attributes = [];
    constructor(facePositions, edgePositions, pointPositions, colors, pointSize, depthTest = true) {
        // Float32BufferAttribute copies its array: the state arrays are read back from the attributes.
        if (facePositions) {
            const states = new Float32BufferAttribute(new Float32Array(facePositions.length / 3), 1);
            this.faceStates = states.array;
            this.faces = new Mesh(stateGeometry(facePositions, states), stateFaceMaterial(colors.faces, depthTest));
            this._attributes.push(states);
        }
        const edgeStates = new Float32BufferAttribute(new Float32Array(edgePositions.length / 3), 1);
        this.edgeStates = edgeStates.array;
        this.edges = new LineSegments(stateGeometry(edgePositions, edgeStates), stateLineMaterial(colors.edges, depthTest));
        const pointStates = new InstancedBufferAttribute(new Float32Array(pointPositions.length / 3), 1);
        this.pointStates = pointStates.array;
        this.points = new Sprite(statePointMaterial(new InstancedBufferAttribute(pointPositions, 3), pointStates, colors.points, pointSize, depthTest));
        this.points.count = pointStates.count;
        this._attributes.push(edgeStates, pointStates);
        for (const child of [this.faces, this.edges, this.points]) {
            if (!child)
                continue;
            child.frustumCulled = false;
            this.group.add(child);
        }
    }
    /** Uploads the state arrays after they were written. */
    updateStates() {
        for (const attribute of this._attributes)
            attribute.needsUpdate = true;
    }
    dispose() {
        this.faces?.geometry.dispose();
        this.edges.geometry.dispose();
        for (const child of [this.faces, this.edges, this.points])
            child?.material?.dispose();
    }
}
