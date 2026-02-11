import { BoxGeometry, CapsuleGeometry, Group, InstancedMesh, MeshPhongMaterial, Object3D, PerspectiveCamera, SphereGeometry, Vector2, Vector3 } from 'three/webgpu';
import { ThreeApplet, ThreeAppletProps } from '@io-gui/three';
import { Pad } from '../game/items/pad';
import { Line } from '../game/items/line';
import { Terminal } from '../game/items/terminal';
import { Grid } from '../objects/grid';
export declare class ThreeScene extends ThreeApplet {
    camera: PerspectiveCamera;
    cameraRig: Group;
    cameraTarget: Object3D;
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
    _drag: Vector3;
    private static instanceColor;
    constructor(args: ThreeAppletProps);
    updateDrag(screen: Vector2, screenStart: Vector2): void;
    initGrid(width: number, height: number): void;
    updateGrid(width: number, height: number, lines: Line[], pads: Pad[], terminals: Terminal[]): void;
    updatePads(pads: Pad[]): void;
    updateTerminals(terminals: Terminal[]): void;
    updateLines(lines: Line[]): void;
    onAnimate(delta: number, time: number): void;
}
//# sourceMappingURL=threeScene.d.ts.map