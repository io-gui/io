import { BufferGeometry, Float32BufferAttribute, Mesh } from 'three/webgpu';
import { positionGeometry, vec4 } from 'three/tsl';
// One triangle that covers the screen.
const _geometry = new BufferGeometry();
_geometry.setAttribute('position', new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
/**
 * A mesh that covers the viewport whatever the camera, for drawing full-screen passes inside a scene
 * (the overlay scene presents the pipeline output and composites screen-space overlays this way).
 * The material must be a node material; its `vertexNode` is replaced. Sample targets with `screenUV`.
 */
export function createScreenQuad(material) {
    material.vertexNode = vec4(positionGeometry.xy, 0, 1);
    const mesh = new Mesh(_geometry, material);
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    return mesh;
}
