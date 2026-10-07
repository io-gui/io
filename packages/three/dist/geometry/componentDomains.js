import { ComponentSet } from '../selection/ComponentSet.js';
/** Number of elements of `domain` in a topology (0 for domains it does not have). */
export function topologyDomainSize(topology, domain) {
    switch (domain) {
        case 'point': return topology.pointCount;
        case 'edge': return topology.edgeCount;
        case 'primitive': return topology.primitiveCount;
        case 'corner': return topology.cornerCount;
        default: return 0;
    }
}
/**
 * Derives point, edge and primitive selection from a selection in `domain` the way Blender switches select
 * modes: going down (primitive → edge → point) selects every element touched; going up selects an element
 * when all of its lower elements are selected. `corner` derives like `point`, per triangle corner.
 */
export function deriveComponents(topology, domain, set) {
    const point = new ComponentSet(topology.pointCount);
    const edge = new ComponentSet(topology.edgeCount);
    const primitive = new ComponentSet(topology.primitiveCount);
    const size = topology.primitiveSize;
    const edgesPerPrimitive = topology.kind === 'mesh' ? 3 : topology.kind === 'line' ? 1 : 0;
    if (!set || set.size !== topologyDomainSize(topology, domain))
        return { point, edge, primitive };
    if (domain === 'point' || domain === 'corner') {
        if (domain === 'point')
            set.forEach(index => point.add(index));
        else
            set.forEach(corner => point.add(topology.vertexToPoint[topology.corners[corner]]));
        for (let e = 0; e < topology.edgeCount; e++) {
            if (point.has(topology.edgePoints[e * 2]) && point.has(topology.edgePoints[e * 2 + 1]))
                edge.add(e);
        }
        for (let p = 0; p < topology.primitiveCount; p++) {
            let all = true;
            for (let k = 0; k < size && all; k++) {
                const corner = p * size + k;
                all = domain === 'corner' ? set.has(corner) : point.has(topology.vertexToPoint[topology.corners[corner]]);
            }
            if (all)
                primitive.add(p);
        }
    }
    else if (domain === 'edge') {
        set.forEach(e => {
            edge.add(e);
            point.add(topology.edgePoints[e * 2]);
            point.add(topology.edgePoints[e * 2 + 1]);
        });
        for (let p = 0; p < topology.primitiveCount; p++) {
            let all = edgesPerPrimitive > 0;
            for (let k = 0; k < edgesPerPrimitive && all; k++)
                all = edge.has(topology.primitiveEdges[p * edgesPerPrimitive + k]);
            if (all)
                primitive.add(p);
        }
    }
    else if (domain === 'primitive') {
        set.forEach(p => {
            primitive.add(p);
            for (let k = 0; k < size; k++)
                point.add(topology.vertexToPoint[topology.corners[p * size + k]]);
            for (let k = 0; k < edgesPerPrimitive; k++)
                edge.add(topology.primitiveEdges[p * edgesPerPrimitive + k]);
        });
    }
    return { point, edge, primitive };
}
/** Corners whose point is selected in `derived` (the 3D selection seen per UV corner). */
export function cornersFromPoints(topology, point) {
    const corners = new ComponentSet(topology.cornerCount);
    for (let c = 0; c < topology.cornerCount; c++)
        if (point.has(topology.vertexToPoint[topology.corners[c]]))
            corners.add(c);
    return corners;
}
/** Converts a selection from one domain to another (select mode switching). */
export function convertComponents(topology, from, set, to) {
    if (from === to && set && set.size === topologyDomainSize(topology, to))
        return set.clone();
    const derived = deriveComponents(topology, from, set);
    if (to === 'corner')
        return cornersFromPoints(topology, derived.point);
    return derived[to]?.clone() ?? new ComponentSet(topologyDomainSize(topology, to));
}
