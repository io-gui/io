import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
import { Game } from './game/game.js';
type CircuitsGameProps = IoElementProps & {
    level: WithBinding<string>;
    game: Game;
};
export declare class CircuitsGame extends IoElement {
    static get Style(): string;
    level: string;
    game: Game;
    constructor(args: CircuitsGameProps);
    ready(): void;
    changed(): void;
    levelChanged(): void;
    onUndo(): void;
    onRedo(): void;
    onReset(): void;
    onEdit(): void;
}
export declare const circuitsGame: (arg0: CircuitsGameProps) => import("@io-gui/core").VDOMElement;
export {};
//# sourceMappingURL=CircuitsGame.d.ts.map