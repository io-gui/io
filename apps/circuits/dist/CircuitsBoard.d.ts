import { IoElement, IoElementProps } from '@io-gui/core';
import { Game } from './game/game.js';
import { Pad } from './game/items/pad.js';
import { Terminal } from './game/items/terminal.js';
import { Line as GameLine } from './game/items/line.js';
/**
 * Scene — Three.js WebGL scene for the circuits board.
 * Renders grid (GridHelper), lines (Line), pads (spheres), terminals (cubes), and touch marker.
 */
export declare class Scene {
    canvasWidth: number;
    canvasHeight: number;
    gridWidth: number;
    gridHeight: number;
    gridUnit: number;
    gridOffsetX: number;
    gridOffsetY: number;
    markerRadius: number;
    private _renderer;
    private _scene;
    private _camera;
    private _grid;
    private _gameGroup;
    private _marker;
    /** Set up Three.js from a container; canvas is created and appended. */
    init(container: HTMLElement): void;
    /** Recalculate grid geometry, resize renderer, and build grid. */
    initGrid(gameWidth: number, gameHeight: number, containerWidth: number, containerHeight: number): void;
    private _gridToWorld;
    /** Full re-render of lines, pads and terminals. */
    render(pads: Pad[], terminals: Terminal[], lines: GameLine[]): void;
    drawMarker(touchX: number, touchY: number): void;
    hideMarker(): void;
    private _renderFrame;
}
type CircuitsBoardProps = IoElementProps & {
    game?: Game;
};
/**
 * CircuitsBoard — canvas-based game board IoElement.
 * Owns the Scene, creates 4 layered canvases, handles pointer events,
 * and translates screen coordinates to grid positions (plotter logic).
 */
export declare class CircuitsBoard extends IoElement {
    static get Style(): string;
    static get Listeners(): Record<string, string>;
    game: Game;
    scene: Scene;
    private _touchX;
    private _touchY;
    private _gridX;
    private _gridY;
    private _gridXOld;
    private _gridYOld;
    private _drag;
    private _randomID;
    constructor(args?: CircuitsBoardProps);
    ready(): void;
    changed(): void;
    onResized(): void;
    private _initScene;
    gameChanged(): void;
    onGameInitScene(): void;
    onGameRender(): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    private _initPosition;
    private _updatePosition;
}
export declare const circuitsBoard: (arg0: CircuitsBoardProps) => import("@io-gui/core").VDOMElement;
export {};
//# sourceMappingURL=CircuitsBoard.d.ts.map