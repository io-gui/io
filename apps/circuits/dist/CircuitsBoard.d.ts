import { IoElement, IoElementProps } from '@io-gui/core';
import { Game } from './game/game.js';
import type { Pad } from './game/pad.js';
import type { Terminal } from './game/terminal.js';
import type { Line } from './game/line.js';
/**
 * Scene — manages layered HTML5 canvases and renders the game state.
 *
 * Layer stack (bottom -> top):
 *   grid   – static grid lines (redrawn on initGrid)
 *   layer0 – grey "underlines"
 *   layer1 – coloured lines + pads
 *   top    – touch marker overlay
 */
interface CanvasLayer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}
export declare class Scene {
    layers: Record<string, CanvasLayer>;
    canvasWidth: number;
    canvasHeight: number;
    gridWidth: number;
    gridHeight: number;
    gridUnit: number;
    gridOffsetX: number;
    gridOffsetY: number;
    markerRadius: number;
    /** Set up layers from externally provided canvases. */
    init(canvases: Record<string, HTMLCanvasElement>): void;
    /** Recalculate grid geometry and draw the static grid. */
    initGrid(gameWidth: number, gameHeight: number, containerWidth: number, containerHeight: number): void;
    /** Full re-render of lines, pads and terminals on the dynamic layers. */
    render(pads: Record<number, Pad>, terminals: Record<number, Terminal>, lines: Record<number, Line>, padColors?: Record<number, string>, terminalColors?: Record<number, string>, lineColors?: Record<number, string>): void;
    private _lineParams;
    private _buildLinePath;
    private _drawLineStroke;
    private _drawLineFill;
    private _drawPadStroke;
    private _drawPadFill;
    private _drawTerminalStroke;
    private _drawTerminalFill;
    drawMarker(touchX: number, touchY: number): void;
    hideMarker(): void;
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
    private _wireGameCallbacks;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    private _initPosition;
    private _updatePosition;
}
export declare const circuitsBoard: (arg0: CircuitsBoardProps) => import("@io-gui/core").VDOMElement;
export {};
//# sourceMappingURL=CircuitsBoard.d.ts.map