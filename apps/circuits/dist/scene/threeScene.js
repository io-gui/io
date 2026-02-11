var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ThreeScene_1;
import { AmbientLight, BoxGeometry, CapsuleGeometry, Color, Group, InstancedMesh, Matrix4, MeshPhongMaterial, Object3D, PerspectiveCamera, PointLight, Quaternion, SphereGeometry, Vector3, } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { ThreeApplet } from '@io-gui/three';
import { TERMINAL_COLORS } from '../game/items/terminal';
import { Grid } from '../objects/grid';
const PAD_SPHERE_RADIUS = 0.25;
const TERMINAL_BOX_SIZE = 0.5;
const LINE_CAPSULE_RADIUS = 0.12;
const LINE_CAPSULE_AXIS_LENGTH = 1;
const LINE_DIAGONAL_INSET = 0.035;
const LINE_LAYER_BEHIND_Z = -0.25;
const LINE_LAYER_MINUS_ONE_WIDTH_FACTOR = 1.5;
const LINE_LAYER_MINUS_ONE_COLOR_FACTOR = 0.25;
const _yAxis = new Vector3(0, 1, 0);
const _targetVector = new Vector3();
const _segmentDir = new Vector3();
const _segmentQuat = new Quaternion();
const _segmentScale = new Vector3();
const _segmentPosition = new Vector3();
let ThreeScene = class ThreeScene extends ThreeApplet {
    static { ThreeScene_1 = this; }
    camera = new PerspectiveCamera(25, 1, 0.1, 1000);
    cameraRig = new Group();
    cameraTarget = new Object3D();
    grid = new Grid();
    pads;
    terminals;
    lines;
    static padGeometry = new SphereGeometry(PAD_SPHERE_RADIUS, 16, 12);
    static padMaterial = new MeshPhongMaterial({ vertexColors: true });
    static terminalGeometry = new BoxGeometry(TERMINAL_BOX_SIZE, TERMINAL_BOX_SIZE, TERMINAL_BOX_SIZE * 0.6);
    static terminalMaterial = new MeshPhongMaterial({ vertexColors: true });
    static lineGeometry = new CapsuleGeometry(LINE_CAPSULE_RADIUS, LINE_CAPSULE_AXIS_LENGTH, 4, 8);
    static lineMaterial = new MeshPhongMaterial({ vertexColors: true });
    _drag = new Vector3();
    static instanceColor(terminalColor) {
        return new Color(TERMINAL_COLORS[terminalColor] ?? TERMINAL_COLORS.white);
    }
    constructor(args) {
        super(args);
        this.scene.add(this.cameraRig);
        this.cameraRig.add(this.camera);
        this.cameraRig.add(this.cameraTarget);
        this.scene.add(this.grid);
        this.pads = new InstancedMesh(ThreeScene_1.padGeometry, ThreeScene_1.padMaterial, 0);
        this.terminals = new InstancedMesh(ThreeScene_1.terminalGeometry, ThreeScene_1.terminalMaterial, 0);
        this.lines = new InstancedMesh(ThreeScene_1.lineGeometry, ThreeScene_1.lineMaterial, 0);
        const ambientLight = new AmbientLight(0xcccccc, 1.5);
        this.scene.add(ambientLight);
        const pointLight = new PointLight(0xffffff, 2.5, 0, 0);
        pointLight.position.set(0, 0, 500);
        this.scene.add(pointLight);
    }
    updateDrag(screen, screenStart) {
        this._drag.set(screen.x - screenStart.x, screen.y - screenStart.y, 0);
    }
    initGrid(width, height) {
        this.camera.aspect = width / height;
        // calculate distance to contain grid in view
        const halfFovRad = this.camera.fov * Math.PI / 360;
        const gridDistance = height / (2 * Math.tan(halfFovRad));
        this.cameraRig.position.set(width / 2, height / 2, 0);
        this.camera.position.set(0, 0, gridDistance);
    }
    updateGrid(width, height, lines, pads, terminals) {
        this.grid.update(width, height, lines, pads, terminals);
    }
    // TODO: Consider empty instanced arrays
    updatePads(pads) {
        if (this.pads.parent) {
            this.scene.remove(this.pads);
            if (pads.length === 0)
                return;
        }
        this.pads = new InstancedMesh(ThreeScene_1.padGeometry, ThreeScene_1.padMaterial, pads.length);
        const matrix = new Matrix4();
        const padColor = new Color();
        for (let i = 0; i < pads.length; i++) {
            matrix.makeTranslation(pads[i].pos[0], pads[i].pos[1], 0);
            this.pads.setMatrixAt(i, matrix);
            padColor.copy(ThreeScene_1.instanceColor(pads[i].color));
            this.pads.setColorAt(i, padColor);
        }
        this.pads.instanceMatrix.needsUpdate = true;
        if (this.pads.instanceColor)
            this.pads.instanceColor.needsUpdate = true;
        this.scene.add(this.pads);
    }
    updateTerminals(terminals) {
        if (this.terminals.parent) {
            this.scene.remove(this.terminals);
        }
        this.terminals = new InstancedMesh(ThreeScene_1.terminalGeometry, ThreeScene_1.terminalMaterial, terminals.length);
        const matrix = new Matrix4();
        const terminalColor = new Color();
        for (let i = 0; i < terminals.length; i++) {
            matrix.makeTranslation(terminals[i].pos[0], terminals[i].pos[1], 0);
            this.terminals.setMatrixAt(i, matrix);
            terminalColor.copy(ThreeScene_1.instanceColor(terminals[i].color));
            this.terminals.setColorAt(i, terminalColor);
        }
        this.terminals.instanceMatrix.needsUpdate = true;
        if (this.terminals.instanceColor)
            this.terminals.instanceColor.needsUpdate = true;
        this.scene.add(this.terminals);
    }
    updateLines(lines) {
        if (this.lines.parent) {
            this.scene.remove(this.lines);
        }
        const segmentCount = lines.reduce((n, line) => n + Math.max(0, line.pos.length - 1), 0);
        this.lines = new InstancedMesh(ThreeScene_1.lineGeometry, ThreeScene_1.lineMaterial, segmentCount);
        const matrix = new Matrix4();
        const lineColor = new Color();
        let idx = 0;
        for (const line of lines) {
            lineColor.copy(ThreeScene_1.instanceColor(line.color));
            if (line.layer === -1) {
                lineColor.multiplyScalar(LINE_LAYER_MINUS_ONE_COLOR_FACTOR);
            }
            const pos = line.pos;
            const isBehind = line.layer === -1;
            const widthScale = isBehind ? LINE_LAYER_MINUS_ONE_WIDTH_FACTOR : 1;
            const segmentZ = isBehind ? LINE_LAYER_BEHIND_Z : 0;
            for (let j = 0; j < pos.length - 1; j++) {
                const ax = pos[j][0];
                const ay = pos[j][1];
                const bx = pos[j + 1][0];
                const by = pos[j + 1][1];
                _segmentPosition.set((ax + bx) / 2, (ay + by) / 2, segmentZ);
                const dx = bx - ax;
                const dy = by - ay;
                const segmentLength = Math.sqrt(dx * dx + dy * dy) || 1;
                const isDiagonal = segmentLength > 1.01;
                const effectiveLength = isDiagonal ? segmentLength - 2 * LINE_DIAGONAL_INSET : segmentLength;
                _segmentDir.set(dx / segmentLength, dy / segmentLength, 0);
                _segmentQuat.setFromUnitVectors(_yAxis, _segmentDir);
                _segmentScale.set(widthScale, effectiveLength / LINE_CAPSULE_AXIS_LENGTH, widthScale);
                matrix.compose(_segmentPosition, _segmentQuat, _segmentScale);
                this.lines.setMatrixAt(idx, matrix);
                this.lines.setColorAt(idx, lineColor);
                idx++;
            }
        }
        this.lines.instanceMatrix.needsUpdate = true;
        if (this.lines.instanceColor)
            this.lines.instanceColor.needsUpdate = true;
        this.scene.add(this.lines);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta, time) {
        this.camera.position.x = ((this.camera.position.x * 9) + this._drag.x * 0.25 * this.grid.width) / 10;
        this.camera.position.y = ((this.camera.position.y * 9) + this._drag.y * 0.25 * this.grid.height) / 10;
        this.cameraTarget.position.x = ((this.cameraTarget.position.x * 9) + this._drag.x * 0.02 * this.grid.width) / 10;
        this.cameraTarget.position.y = ((this.cameraTarget.position.y * 9) + this._drag.y * 0.02 * this.grid.height) / 10;
        this.camera.lookAt(_targetVector.setFromMatrixPosition(this.cameraTarget.matrixWorld));
    }
};
ThreeScene = ThreeScene_1 = __decorate([
    Register
], ThreeScene);
export { ThreeScene };
//# sourceMappingURL=threeScene.js.map