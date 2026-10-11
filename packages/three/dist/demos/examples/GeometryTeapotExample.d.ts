import { Material, Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * The Utah teapot (`TeapotGeometry`) with its tessellation, parts, lid fit and Blinn scaling, and six shadings
 * (Document tab). The reflective shading shows its Pisa cube map as the background.
 */
export declare class GeometryTeapotExample extends Document {
    teapot: Mesh;
    materials: Record<string, Material>;
    private textureCube;
    tessellation: number;
    lid: boolean;
    body: boolean;
    bottom: boolean;
    fitLid: boolean;
    nonBlinn: boolean;
    shading: string;
    constructor(args?: DocumentProps);
    private createGeometry;
    /** Whenever the teapot's shape options change, its geometry is rebuilt. */
    private rebuild;
    tessellationChanged(): void;
    lidChanged(): void;
    bodyChanged(): void;
    bottomChanged(): void;
    fitLidChanged(): void;
    nonBlinnChanged(): void;
    shadingChanged(): void;
}
