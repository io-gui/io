import { BoxGeometry, CapsuleGeometry, InstancedMesh, MeshPhongMaterial, OrthographicCamera, SphereGeometry } from 'three/webgpu';
import { ThreeApplet, ThreeAppletProps } from '@io-gui/three';
import { Pad } from '../game/items/pad';
import { Line } from '../game/items/line';
import { Terminal } from '../game/items/terminal';
import { Grid } from '../objects/grid';
export declare class ThreeScene extends ThreeApplet {
    camera: OrthographicCamera;
    grid: Grid;
    pads: InstancedMesh;
    terminals: InstancedMesh;
    lines: InstancedMesh;
    static padGeometry: SphereGeometry;
    static padMaterial: MeshPhongMaterial;
    static terminalGeometry: BoxGeometry;
    static terminalMaterial: MeshPhongMaterial;
    static lineGeometry: CapsuleGeometry;
    static lineMaterial: MeshPhongMaterial;
    private static instanceColor;
    constructor(args: ThreeAppletProps);
    updateGrid(width: number, height: number): void;
    updatePads(pads: Pad[]): void;
    updateTerminals(terminals: Terminal[]): void;
    updateLines(lines: Line[]): void;
}
//# sourceMappingURL=threeScene.d.ts.map