import { LineSegments, LineBasicMaterial, BufferGeometry } from 'three/webgpu';
declare class Grid extends LineSegments {
    geometry: BufferGeometry;
    material: LineBasicMaterial;
    constructor();
    update(width: number, height: number): void;
    dispose(): void;
}
export { Grid };
//# sourceMappingURL=grid.d.ts.map