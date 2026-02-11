import { LineSegments, LineBasicMaterial, BufferGeometry } from 'three/webgpu';
import type { Line } from '../game/items/line.js';
import type { Pad } from '../game/items/pad.js';
import type { Terminal } from '../game/items/terminal.js';
declare class Grid extends LineSegments {
    geometry: BufferGeometry;
    material: LineBasicMaterial;
    width: number;
    height: number;
    constructor();
    update(width: number, height: number, lines: Line[], pads: Pad[], terminals: Terminal[]): void;
    dispose(): void;
}
export { Grid };
//# sourceMappingURL=grid.d.ts.map