import { IoElement, IoElementProps } from '@io-gui/core';
import { Game } from './game/game.js';
import { ThreeScene } from './scene/threeScene.js';
import { Pointer3D } from '@io-gui/three';
type CircuitsBoardProps = IoElementProps & {
    game: Game;
};
/**
 * CircuitsBoard — 3D game board IoElement.
 * Owns the ThreeScene, hosts io-three-viewport, handles pointer events,
 * and maps viewport coordinates to grid via camera unproject (plotter logic).
 */
export declare class CircuitsBoard extends IoElement {
    static get Style(): string;
    static get Listeners(): Record<string, string>;
    applet: ThreeScene;
    game: Game;
    private _currentID;
    private _dragging;
    constructor(args: CircuitsBoardProps);
    onGameInit(): void;
    onGameUpdate(): void;
    ready(): void;
    on3DPointerDown(event: CustomEvent<Pointer3D[]>): void;
    on3DPointerMove(event: CustomEvent<Pointer3D[]>): void;
    on3DPointerUp(event: PointerEvent): void;
    onEndDrag(): void;
    dispose(): void;
}
export declare const circuitsBoard: (arg0: CircuitsBoardProps) => import("@io-gui/core").VDOMElement;
export {};
//# sourceMappingURL=CircuitsBoard.d.ts.map