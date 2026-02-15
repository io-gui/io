var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ThreeScene_1;
import { AmbientLight, BoxGeometry, CapsuleGeometry, Color, Group, InstancedMesh, Matrix4, Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, PointLight, Quaternion, SphereGeometry, Vector3, Texture, } from 'three/webgpu';
import { ReactiveProperty, Register } from '@io-gui/core';
import { ThreeApplet } from '@io-gui/three';
import { Grid } from './grid';
import { DebugPlanes } from './debugPlanes.js';
import { PadsStateMaterial } from './materials/PadsStateMaterial.js';
import { TerminalsStateMaterial } from './materials/TerminalsStateMaterial.js';
import { Layer0LinesStateMaterial } from './materials/Layer0LinesStateMaterial.js';
import { Layer1LinesStateMaterial } from './materials/Layer1LinesStateMaterial.js';
import { Game } from '../game/game';
const PAD_SPHERE_RADIUS = 0.25;
const TERMINAL_BOX_SIZE = 0.5;
const LINE_CAPSULE_RADIUS = 0.12;
const LINE_CAPSULE_AXIS_LENGTH = 1;
const LINE_DIAGONAL_INSET = 0.035;
const LINE_LAYER_BEHIND_Z = -0.25;
const LINE_LAYER_MINUS_ONE_WIDTH_FACTOR = 1.5;
const _yAxis = new Vector3(0, 1, 0);
const _targetVector = new Vector3();
const _segmentDir = new Vector3();
const _segmentQuat = new Quaternion();
const _segmentScale = new Vector3();
const _segmentPosition = new Vector3();
const _instanceUVColor = new Color();
const tempTexture = new Texture();
let ThreeScene = class ThreeScene extends ThreeApplet {
    static { ThreeScene_1 = this; }
    camera = new PerspectiveCamera(25, 1, 0.1, 1000);
    cameraRig = new Group();
    cameraTarget = new Object3D();
    grid = new Grid();
    debugPlanes = new DebugPlanes();
    pads;
    terminals;
    layer0Lines;
    layer1Lines;
    padsMaterial;
    terminalsMaterial;
    layer0LinesMaterial;
    layer1LinesMaterial;
    hitMarker = new Mesh(new SphereGeometry(0.1, 16, 12), new MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 }));
    oldHitMarker = new Mesh(new SphereGeometry(0.12, 16, 12), new MeshPhongMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 }));
    rawHitMarker = new Mesh(new SphereGeometry(0.13, 16, 12), new MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
    static padGeometry = new SphereGeometry(PAD_SPHERE_RADIUS, 16, 12);
    static terminalGeometry = new BoxGeometry(TERMINAL_BOX_SIZE, TERMINAL_BOX_SIZE, TERMINAL_BOX_SIZE * 0.6);
    static lineGeometry = new CapsuleGeometry(LINE_CAPSULE_RADIUS, LINE_CAPSULE_AXIS_LENGTH, 4, 8);
    _drag = new Vector3();
    static get Listeners() {
        return {
            'game-update': 'onGameUpdate',
            'game-init': 'onGameInit',
        };
    }
    constructor(args) {
        super(args);
        this.scene.add(this.cameraRig);
        this.cameraRig.add(this.camera);
        this.cameraRig.add(this.cameraTarget);
        this.scene.add(this.grid);
        this.scene.add(this.debugPlanes);
        this.padsMaterial = new PadsStateMaterial(tempTexture, tempTexture, tempTexture);
        this.terminalsMaterial = new TerminalsStateMaterial(tempTexture, tempTexture, tempTexture);
        this.layer0LinesMaterial = new Layer0LinesStateMaterial(tempTexture, tempTexture, tempTexture);
        this.layer1LinesMaterial = new Layer1LinesStateMaterial(tempTexture, tempTexture, tempTexture);
        this.pads = new InstancedMesh(ThreeScene_1.padGeometry.clone(), this.padsMaterial, 1);
        this.terminals = new InstancedMesh(ThreeScene_1.terminalGeometry.clone(), this.terminalsMaterial, 1);
        this.layer0Lines = new InstancedMesh(ThreeScene_1.lineGeometry.clone(), this.layer0LinesMaterial, 1);
        this.layer1Lines = new InstancedMesh(ThreeScene_1.lineGeometry.clone(), this.layer1LinesMaterial, 1);
        this.pads.count = 0;
        this.terminals.count = 0;
        this.layer0Lines.count = 0;
        this.layer1Lines.count = 0;
        this.scene.add(this.pads);
        this.scene.add(this.terminals);
        this.scene.add(this.layer0Lines);
        this.scene.add(this.layer1Lines);
        this.scene.add(this.hitMarker);
        this.scene.add(this.oldHitMarker);
        this.scene.add(this.rawHitMarker);
        const ambientLight = new AmbientLight(0xcccccc, 1.5);
        this.scene.add(ambientLight);
        const pointLight = new PointLight(0xffffff, 2.5, 0, 0);
        pointLight.position.set(0, 0, 500);
        this.scene.add(pointLight);
    }
    ready() {
        this.debounce(() => {
            this.onGameInit();
        });
    }
    onGameInit() {
        this.initGrid(this.game);
        this.onGameUpdate();
    }
    ;
    onGameUpdate() {
        this.updateGrid(this.game);
        this.updatePads(this.game.pads);
        this.updateTerminals(this.game.pads);
        this.updateLines(this.game.layer0.lines, this.game.layer1.lines);
    }
    ;
    updateMarkers(hit, oldHit, rawHit) {
        this.hitMarker.position.set(hit.x, hit.y, 0);
        this.oldHitMarker.position.set(oldHit.x, oldHit.y, 0);
        this.rawHitMarker.position.set(rawHit.x, rawHit.y, 0);
    }
    updateDrag(screen, screenStart) {
        this._drag.set(screen.x - screenStart.x, screen.y - screenStart.y, 0);
    }
    initGrid(game) {
        const segmentWidth = Math.max(game.width - 1, 1);
        const segmentHeight = Math.max(game.height - 1, 1);
        this.camera.aspect = segmentWidth / segmentHeight;
        // calculate distance to contain grid in view
        const halfFovRad = this.camera.fov * Math.PI / 360;
        const gridDistance = segmentHeight / (2 * Math.tan(halfFovRad));
        this.cameraRig.position.set(segmentWidth / 2, segmentHeight / 2, 0);
        this.camera.position.set(0, 0, gridDistance);
    }
    updateGrid(game) {
        this.grid.update(game.width, game.height, game.layer0.lines, game.layer1.lines, game.pads);
        this.debugPlanes.update(game.width, game.height, game.pads.texture, game.layer0.texture, game.layer1.texture);
        this.padsMaterial.setTextures(game.pads.texture, game.layer0.texture, game.layer1.texture);
        this.terminalsMaterial.setTextures(game.pads.texture, game.layer0.texture, game.layer1.texture);
        this.layer0LinesMaterial.setTextures(game.pads.texture, game.layer0.texture, game.layer1.texture);
        this.layer1LinesMaterial.setTextures(game.pads.texture, game.layer0.texture, game.layer1.texture);
    }
    // TODO: Fix empty instanced arrays
    updatePads(pads) {
        const nonTerminalPads = [];
        pads.forEach((pad, x, y) => {
            if (!pad.isTerminal)
                nonTerminalPads.push([pad, x, y]);
        });
        const count = nonTerminalPads.length;
        this.pads = this._ensureMeshCapacity(this.pads, this.padsMaterial, () => ThreeScene_1.padGeometry.clone(), count);
        const width = this.grid.width;
        const height = this.grid.height;
        const matrix = new Matrix4();
        for (let i = 0; i < count; i++) {
            matrix.makeTranslation(nonTerminalPads[i][1], nonTerminalPads[i][2], 0);
            this.pads.setMatrixAt(i, matrix);
            _instanceUVColor.setRGB(this._coordToTextureU(nonTerminalPads[i][1], width), this._coordToTextureV(nonTerminalPads[i][2], height), 0);
            this.pads.setColorAt(i, _instanceUVColor);
        }
        this.pads.count = count;
        this.pads.instanceMatrix.needsUpdate = true;
        if (this.pads.instanceColor) {
            this.pads.instanceColor.needsUpdate = true;
            this.padsMaterial.setInstanceUVAttribute(this.pads.instanceColor);
        }
    }
    updateTerminals(pads) {
        const terminalPads = [];
        pads.forEach((pad, x, y) => {
            if (pad.isTerminal)
                terminalPads.push([pad, x, y]);
        });
        const count = terminalPads.length;
        this.terminals = this._ensureMeshCapacity(this.terminals, this.terminalsMaterial, () => ThreeScene_1.terminalGeometry.clone(), count);
        const width = this.grid.width;
        const height = this.grid.height;
        const matrix = new Matrix4();
        for (let i = 0; i < count; i++) {
            matrix.makeTranslation(terminalPads[i][1], terminalPads[i][2], 0);
            this.terminals.setMatrixAt(i, matrix);
            _instanceUVColor.setRGB(this._coordToTextureU(terminalPads[i][1], width), this._coordToTextureV(terminalPads[i][2], height), 0);
            this.terminals.setColorAt(i, _instanceUVColor);
        }
        this.terminals.count = count;
        this.terminals.instanceMatrix.needsUpdate = true;
        if (this.terminals.instanceColor) {
            this.terminals.instanceColor.needsUpdate = true;
            this.terminalsMaterial.setInstanceUVAttribute(this.terminals.instanceColor);
        }
    }
    updateLines(layer0Lines, layer1Lines) {
        this._updateLayerLines(layer0Lines, true);
        this._updateLayerLines(layer1Lines, false);
    }
    _updateLayerLines(lines, isLayer0) {
        const segmentCount = lines.reduce((n, line) => n + Math.max(0, line.pos.length - 1), 0);
        const mesh = isLayer0
            ? this.layer0Lines = this._ensureMeshCapacity(this.layer0Lines, this.layer0LinesMaterial, () => ThreeScene_1.lineGeometry.clone(), segmentCount)
            : this.layer1Lines = this._ensureMeshCapacity(this.layer1Lines, this.layer1LinesMaterial, () => ThreeScene_1.lineGeometry.clone(), segmentCount);
        const material = isLayer0 ? this.layer0LinesMaterial : this.layer1LinesMaterial;
        const width = this.grid.width;
        const height = this.grid.height;
        const matrix = new Matrix4();
        let idx = 0;
        for (const line of lines) {
            const pos = line.pos;
            const isBehind = isLayer0;
            const widthScale = isBehind ? LINE_LAYER_MINUS_ONE_WIDTH_FACTOR : 1;
            const segmentZ = isBehind ? LINE_LAYER_BEHIND_Z : 0;
            for (let j = 0; j < pos.length - 1; j++) {
                const ax = pos[j].x;
                const ay = pos[j].y;
                const bx = pos[j + 1].x;
                const by = pos[j + 1].y;
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
                mesh.setMatrixAt(idx, matrix);
                _instanceUVColor.setRGB(this._coordToTextureU(ax, width), this._coordToTextureV(ay, height), 0);
                mesh.setColorAt(idx, _instanceUVColor);
                idx++;
            }
        }
        mesh.count = segmentCount;
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
            material.setInstanceUVAttribute(mesh.instanceColor);
        }
    }
    _coordToTextureU(x, width) {
        return (x + 0.5) / Math.max(width, 1);
    }
    _coordToTextureV(y, height) {
        return (y + 0.5) / Math.max(height, 1);
    }
    _ensureMeshCapacity(mesh, material, createGeometry, count) {
        const required = Math.max(count, 1);
        if (mesh.instanceMatrix.count >= required)
            return mesh;
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        const nextMesh = new InstancedMesh(createGeometry(), material, required);
        nextMesh.count = 0;
        this.scene.add(nextMesh);
        return nextMesh;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta, time) {
        const segmentWidth = Math.max(this.grid.width - 1, 0);
        const segmentHeight = Math.max(this.grid.height - 1, 0);
        this.camera.position.x = ((this.camera.position.x * 9) - this._drag.x * 0.25 * segmentWidth) / 10;
        this.camera.position.y = ((this.camera.position.y * 9) - this._drag.y * 0.25 * segmentHeight) / 10;
        this.cameraTarget.position.x = ((this.cameraTarget.position.x * 9) - this._drag.x * 0.02 * segmentWidth) / 10;
        this.cameraTarget.position.y = ((this.cameraTarget.position.y * 9) - this._drag.y * 0.02 * segmentHeight) / 10;
        this.camera.lookAt(_targetVector.setFromMatrixPosition(this.cameraTarget.matrixWorld));
    }
    dispose() {
        this.debugPlanes.dispose();
        this.grid.dispose();
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: Game, init: null })
], ThreeScene.prototype, "game", void 0);
ThreeScene = ThreeScene_1 = __decorate([
    Register
], ThreeScene);
export { ThreeScene };
//# sourceMappingURL=threeScene.js.map