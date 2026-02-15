import { LineSegments, LineBasicMaterial, BufferGeometry } from 'three/webgpu';
import type { Line } from '../game/items/line.js';
import type { Pads } from '../game/pads.js';
declare class Grid extends LineSegments {
    geometry: BufferGeometry;
    material: LineBasicMaterial;
    width: number;
    height: number;
    constructor();
    update(width: number, height: number, layer0Lines: Line[], layer1Lines: Line[], pads: Pads): void;
    dispose(): void;
}
export { Grid };
//# sourceMappingURL=grid.d.ts.map