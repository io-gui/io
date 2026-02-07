var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, ReactiveProperty, div, } from '@io-gui/core';
import { BoxGeometry, BufferGeometry, Color, GridHelper, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, OrthographicCamera, Scene as ThreeScene, SphereGeometry, Vector3, WebGLRenderer, } from 'three';
import { Game } from './game/game.js';
import { TERMINAL_COLORS as COLORS } from './game/items/terminal.js';
/**
 * Scene — Three.js WebGL scene for the circuits board.
 * Renders grid (GridHelper), lines (Line), pads (spheres), terminals (cubes), and touch marker.
 */
export class Scene {
    canvasWidth = 0;
    canvasHeight = 0;
    gridWidth = 0;
    gridHeight = 0;
    gridUnit = 0;
    gridOffsetX = 0;
    gridOffsetY = 0;
    markerRadius = 0;
    _renderer = null;
    _scene = new ThreeScene();
    _camera = null;
    _grid = null;
    _gameGroup = new ThreeScene();
    _marker = null;
    /** Set up Three.js from a container; canvas is created and appended. */
    init(container) {
        if (this._renderer) {
            if (!container.contains(this._renderer.domElement))
                container.appendChild(this._renderer.domElement);
            return;
        }
        this._scene.add(this._gameGroup);
        const renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio ?? 1);
        renderer.setClearColor(0x000000, 0.8);
        container.appendChild(renderer.domElement);
        this._renderer = renderer;
    }
    /** Recalculate grid geometry, resize renderer, and build grid. */
    initGrid(gameWidth, gameHeight, containerWidth, containerHeight) {
        this.canvasWidth = containerWidth;
        this.canvasHeight = containerHeight;
        this.gridWidth = gameWidth;
        this.gridHeight = gameHeight;
        if (this.canvasHeight / this.gridHeight >
            this.canvasWidth / this.gridWidth) {
            this.gridUnit = this.canvasWidth / (this.gridWidth + 1);
        }
        else {
            this.gridUnit = this.canvasHeight / (this.gridHeight + 1);
        }
        this.gridOffsetX = (this.canvasWidth - this.gridUnit * this.gridWidth) / 2;
        this.gridOffsetY =
            (this.canvasHeight - this.gridUnit * this.gridHeight) / 2;
        if (this._renderer) {
            this._renderer.setSize(this.canvasWidth, this.canvasHeight);
        }
        this._camera = new OrthographicCamera(0, this.canvasWidth, 0, this.canvasHeight, 0.1, 1000);
        this._camera.position.set(this.canvasWidth / 2, this.canvasHeight / 2, 500);
        this._camera.lookAt(this.canvasWidth / 2, this.canvasHeight / 2, 0);
        if (this._grid)
            this._scene.remove(this._grid);
        const size = Math.max(this.gridWidth, this.gridHeight) * this.gridUnit;
        const divisions = Math.max(this.gridWidth, this.gridHeight);
        this._grid = new GridHelper(size, divisions, 0xffffff, 0xffffff);
        this._grid.rotation.x = -Math.PI / 2;
        this._grid.position.set(this.gridOffsetX + (this.gridWidth * this.gridUnit) / 2, this.gridOffsetY + (this.gridHeight * this.gridUnit) / 2, 0);
        this._scene.add(this._grid);
        this.markerRadius = this.canvasWidth * 0.1;
    }
    _gridToWorld(gx, gy, z) {
        return new Vector3(this.gridOffsetX + gx * this.gridUnit, this.gridOffsetY + gy * this.gridUnit, z);
    }
    /** Full re-render of lines, pads and terminals. */
    render(pads, terminals, lines) {
        while (this._gameGroup.children.length > 0) {
            const obj = this._gameGroup.children[0];
            this._gameGroup.remove(obj);
            if (obj instanceof Line) {
                obj.geometry.dispose();
                if (obj.material instanceof LineBasicMaterial)
                    obj.material.dispose();
            }
            else if (obj instanceof Mesh) {
                obj.geometry.dispose();
                const mat = obj.material;
                if (Array.isArray(mat))
                    for (const m of mat)
                        m.dispose();
                else if (mat)
                    mat.dispose();
            }
        }
        const padRadius = this.gridUnit / 3;
        const termHalf = this.gridUnit / 3;
        const lineZBottom = -0.5;
        const lineZTop = 0.5;
        for (const line of lines) {
            if (line.pos.length < 2)
                continue;
            const z = line.layer === -1 ? lineZBottom : lineZTop;
            const points = line.pos.map((p) => this._gridToWorld(p[0], p[1], z));
            const geometry = new BufferGeometry().setFromPoints(points);
            const material = new LineBasicMaterial({
                color: new Color(COLORS[line._color] ?? '#ffffff'),
            });
            const lineObj = new Line(geometry, material);
            this._gameGroup.add(lineObj);
        }
        for (const pad of pads) {
            const geom = new SphereGeometry(padRadius, 12, 8);
            const mat = new MeshBasicMaterial({
                color: new Color(COLORS[pad._color] ?? '#ffffff'),
            });
            const mesh = new Mesh(geom, mat);
            mesh.position.copy(this._gridToWorld(pad.pos[0], pad.pos[1], 0.5));
            this._gameGroup.add(mesh);
        }
        for (const term of terminals) {
            const geom = new BoxGeometry(termHalf * 2, termHalf * 2, termHalf * 2);
            const mat = new MeshBasicMaterial({
                color: new Color(COLORS[term.color] ?? '#ffffff'),
            });
            const mesh = new Mesh(geom, mat);
            mesh.position.copy(this._gridToWorld(term.pos[0], term.pos[1], 0.5));
            this._gameGroup.add(mesh);
        }
        this._renderFrame();
    }
    drawMarker(touchX, touchY) {
        this.hideMarker();
        if (!this._gameGroup)
            return;
        const geom = new SphereGeometry(this.markerRadius, 16, 12);
        const mat = new MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
        });
        this._marker = new Mesh(geom, mat);
        this._marker.position.copy(this._gridToWorld(touchX, touchY, 1));
        this._gameGroup.add(this._marker);
        this._renderFrame();
    }
    hideMarker() {
        if (this._marker && this._gameGroup) {
            this._gameGroup.remove(this._marker);
            this._marker.geometry.dispose();
            const mat = this._marker.material;
            if (Array.isArray(mat))
                for (const m of mat)
                    m.dispose();
            else
                mat.dispose();
            this._marker = null;
        }
        this._renderFrame();
    }
    _renderFrame() {
        if (this._renderer && this._camera) {
            this._renderer.render(this._scene, this._camera);
        }
    }
}
/**
 * CircuitsBoard — canvas-based game board IoElement.
 * Owns the Scene, creates 4 layered canvases, handles pointer events,
 * and translates screen coordinates to grid positions (plotter logic).
 */
export class CircuitsBoard extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        flex: 1;
        position: relative;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #99f;
        border-radius: 12px;
        margin: 2px;
        overflow: hidden;
        touch-action: none;
      }
      :host > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
    }
    static get Listeners() {
        return {
            pointerdown: 'onPointerdown',
            'game-init-scene': 'onGameInitScene',
            'game-render': 'onGameRender',
        };
    }
    // Plotter state
    _touchX = 0;
    _touchY = 0;
    _gridX = 0;
    _gridY = 0;
    _gridXOld = 0;
    _gridYOld = 0;
    _drag = false;
    _randomID = 0;
    constructor(args = {}) {
        super(args);
    }
    ready() {
        this.changed();
    }
    changed() {
        this.render([div({ id: 'scene-container' })]);
        this._initScene();
    }
    onResized() {
        this._initScene();
    }
    _initScene() {
        const container = this.querySelector('#scene-container');
        if (!container)
            return;
        if (!this.scene)
            this.scene = new Scene();
        this.scene.init(container);
        const rect = this.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0)
            return;
        if (this.game) {
            this.scene.initGrid(this.game.width, this.game.height, rect.width, rect.height);
            this.scene.render(this.game.pads, this.game.terminals, this.game.lines);
        }
    }
    gameChanged() {
        this._initScene();
    }
    onGameInitScene() {
        const rect = this.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0)
            return;
        this.scene.initGrid(this.game.width, this.game.height, rect.width, rect.height);
        this.scene.render(this.game.pads, this.game.terminals, this.game.lines);
    }
    ;
    onGameRender() {
        this.scene.render(this.game.pads, this.game.terminals, this.game.lines);
    }
    ;
    onPointerdown(event) {
        event.preventDefault();
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this.onPointermove);
        this.addEventListener('pointerup', this.onPointerup);
        this._randomID = Math.floor(Math.random() * 100000);
        this._drag = true;
        this._initPosition(event);
        this.scene.drawMarker(this._touchX, this._touchY);
        if (!this.game)
            return;
        if (this.game.drawMode === 'pad') {
            this.game.plotter.addPad(this._randomID, this._gridX, this._gridY);
        }
        if (this.game.drawMode === 'terminal') {
            this.game.plotter.addTerminal(this._randomID, this._gridX, this._gridY, this.game.drawColor);
        }
        if (this.game.drawMode === 'line') {
            this.game.plotter.addLineSegment(this._randomID, this._gridX, this._gridY, this.game.drawLayer);
        }
        if (this.game.drawMode === 'delete') {
            this.game.plotter.delete(this._gridX, this._gridY);
        }
    }
    onPointermove(event) {
        event.preventDefault();
        this._updatePosition(event);
        this.scene.drawMarker(this._gridX, this._gridY);
        if (!this.game)
            return;
        if (this.game.drawMode === 'line' &&
            this._drag &&
            (this._gridX !== this._gridXOld || this._gridY !== this._gridYOld)) {
            const { endDrag } = this.game.plotter.addLineSegment(this._randomID, this._gridX, this._gridY, this.game.drawLayer);
            if (endDrag)
                this._drag = false;
        }
    }
    onPointerup(event) {
        event.preventDefault();
        this.releasePointerCapture(event.pointerId);
        this.removeEventListener('pointermove', this.onPointermove);
        this.removeEventListener('pointerup', this.onPointerup);
        this._drag = false;
        this.scene.hideMarker();
        if (!this.game)
            return;
        this.game.finalizeMove(this._randomID);
    }
    _initPosition(event) {
        const rect = this.getBoundingClientRect();
        this._touchX =
            (event.clientX - rect.left - this.scene.gridOffsetX) /
                this.scene.gridUnit;
        this._touchY =
            (event.clientY - rect.top - this.scene.gridOffsetY) / this.scene.gridUnit;
        this._gridX = Math.round(this._touchX);
        this._gridY = Math.round(this._touchY);
        this._gridXOld = this._gridX;
        this._gridYOld = this._gridY;
    }
    _updatePosition(event) {
        const rect = this.getBoundingClientRect();
        this._touchX =
            (event.clientX - rect.left - this.scene.gridOffsetX) /
                this.scene.gridUnit;
        this._touchY =
            (event.clientY - rect.top - this.scene.gridOffsetY) / this.scene.gridUnit;
        const distance = Math.sqrt(Math.pow(this._touchX - Math.round(this._touchX), 2) +
            Math.pow(this._touchY - Math.round(this._touchY), 2));
        if (!this.game)
            return;
        if (distance < 0.5 &&
            // this._touchX <= this.game.width + 0.5 &&
            // this._touchY <= this.game.height + 0.5 &&
            this._touchX >= -0.5 &&
            this._touchY >= -0.5) {
            this._gridXOld = this._gridX;
            this._gridYOld = this._gridY;
            this._gridX = Math.round(this._touchX);
            this._gridY = Math.round(this._touchY);
            if (this._gridX > this._gridXOld)
                this._gridX = this._gridXOld + 1;
            if (this._gridX < this._gridXOld)
                this._gridX = this._gridXOld - 1;
            if (this._gridY > this._gridYOld)
                this._gridY = this._gridYOld + 1;
            if (this._gridY < this._gridYOld)
                this._gridY = this._gridYOld - 1;
        }
    }
}
__decorate([
    ReactiveProperty({ type: Game })
], CircuitsBoard.prototype, "game", void 0);
__decorate([
    ReactiveProperty({ type: Scene, init: null })
], CircuitsBoard.prototype, "scene", void 0);
Register(CircuitsBoard);
export const circuitsBoard = function (arg0) {
    return CircuitsBoard.vConstructor(arg0);
};
//# sourceMappingURL=CircuitsBoard.js.map