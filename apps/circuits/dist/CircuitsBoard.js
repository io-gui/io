var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, } from '@io-gui/core';
import { Vector2 } from 'three';
import { Game } from './game/game.js';
import { ThreeScene } from './scene/threeScene.js';
import { ioThreeViewport } from '@io-gui/three';
import { PointerTool } from './tools/pointerTool.js';
const _pos = new Vector2();
const _posOld = new Vector2();
/**
 * CircuitsBoard — 3D game board IoElement.
 * Owns the ThreeScene, hosts io-three-viewport, handles pointer events,
 * and maps viewport coordinates to grid via camera unproject (plotter logic).
 */
let CircuitsBoard = class CircuitsBoard extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
      }
    `;
    }
    static get Listeners() {
        return {
            '3dpointer-down': 'on3DPointerDown',
            '3dpointer-move': 'on3DPointerMove',
            '3dpointer-up': 'on3DPointerUp',
            'game-init-scene': 'onGameInit',
            'game-update': 'onGameUpdate',
            'line-end-drag': 'onEndDrag',
        };
    }
    _currentID = 0;
    constructor(args) {
        super(args);
    }
    onGameInit() {
        this.applet.updateGrid(this.game.width, this.game.height);
        this.onGameUpdate();
    }
    ;
    onGameUpdate() {
        this.applet.updatePads(this.game.pads);
        this.applet.updateTerminals(this.game.terminals);
        this.applet.updateLines(this.game.lines);
        // TODO: hmm?
        this.applet.dispatch('three-applet-needs-render', undefined, true);
    }
    ;
    ready() {
        this.render([
            ioThreeViewport({ applet: this.applet, tool: new PointerTool({}), cameraSelect: 'scene', overscan: 1.2 }),
        ]);
    }
    on3DPointerDown(event) {
        if (event.detail.length !== 1)
            return;
        _pos.set(Math.round(event.detail[0].origin.x), Math.round(event.detail[0].origin.y));
        _posOld.copy(_pos);
        this._currentID = Math.floor(Math.random() * 100000);
        if (this.game.drawMode === 'pad') {
            console.log(_pos.x, _pos.y);
            this.game.plotter.addPad(this._currentID, _pos.x, _pos.y);
        }
        if (this.game.drawMode === 'terminal') {
            this.game.plotter.addTerminal(this._currentID, _pos.x, _pos.y, this.game.drawColor);
        }
        if (this.game.drawMode === 'line') {
            this.game.plotter.addLineSegment(this._currentID, _pos.x, _pos.y, this.game.drawLayer);
        }
        if (this.game.drawMode === 'delete') {
            this.game.plotter.delete(_pos.x, _pos.y);
        }
    }
    on3DPointerMove(event) {
        if (event.detail.length !== 1)
            return;
        _pos.set(Math.round(event.detail[0].origin.x), Math.round(event.detail[0].origin.y));
        if (this.game.drawMode === 'line' && _pos.distanceTo(_posOld) > 0) {
            this.game.plotter.addLineSegment(this._currentID, _pos.x, _pos.y, this.game.drawLayer);
        }
    }
    on3DPointerUp(event) {
        event.preventDefault();
        this.onEndDrag();
    }
    onEndDrag() {
        if (this.game)
            this.game.finalizeMove(this._currentID);
    }
    dispose() {
        this.applet.dispose();
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: ThreeScene, init: null })
], CircuitsBoard.prototype, "applet", void 0);
__decorate([
    ReactiveProperty({ type: Game })
], CircuitsBoard.prototype, "game", void 0);
CircuitsBoard = __decorate([
    Register
], CircuitsBoard);
export { CircuitsBoard };
export const circuitsBoard = function (arg0) {
    return CircuitsBoard.vConstructor(arg0);
};
//# sourceMappingURL=CircuitsBoard.js.map