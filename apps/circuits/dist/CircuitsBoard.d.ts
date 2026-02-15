import { IoElement, IoElementProps } from '@io-gui/core';
import { DrawMode, Game } from './game/game.js';
import { ThreeScene } from './scene/threeScene.js';
import { Pointer3D } from '@io-gui/three';
import { ColorName } from './game/items/colors.js';
/**
 * CircuitsBoard — 3D game board IoElement.
 * Owns the ThreeScene, hosts io-three-viewport, handles pointer events,
 * and maps viewport coordinates to grid via camera unproject (plotter logic).
 */
export declare class CircuitsBoard extends IoElement {
    static get Style(): string;
    static get Listeners(): {
        'game-init': string;
        '3dpointer-down': string;
        '3dpointer-move': string;
        '3dpointer-up': string;
        'line-end-drag': string;
    };
    game: Game;
    applet: ThreeScene;
    private _dragging;
    drawMode: DrawMode;
    drawColor: ColorName;
    drawLayer: number;
    _rAF: number;
    constructor(args: IoElementProps);
    onGameInit(): void;
    ready(): void;
    on3DPointerDown(event: CustomEvent<Pointer3D[]>): void;
    on3DPointerMove(event: CustomEvent<Pointer3D[]>): void;
    on3DPointerUp(event: PointerEvent): void;
    onEndDrag(): void;
    onLinePlot(): void;
    onUndo(): void;
    onRedo(): void;
    onReset(): void;
    onEdit(): void;
    dispose(): void;
}
export declare const circuitsBoard: (arg0: IoElementProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=CircuitsBoard.d.ts.map