import { Material, Mesh } from 'three/webgpu';
/**
 * A mesh that covers the viewport whatever the camera, for drawing full-screen passes inside a scene
 * (the overlay scene presents the pipeline output and composites screen-space overlays this way).
 * The material must be a node material; its `vertexNode` is replaced. Sample targets with `screenUV`.
 */
export declare function createScreenQuad(material: Material & {
    vertexNode: unknown;
}): Mesh;
