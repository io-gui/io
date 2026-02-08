import { IoElement, IoElementProps, WithBinding, ListenerDefinitions } from '@io-gui/core';
import { Game } from './game/game.js';
type CircuitsGameProps = IoElementProps & {
    level: WithBinding<string>;
    game: Game;
};
export declare class CircuitsGame extends IoElement {
    static get Style(): string;
    static get Listeners(): ListenerDefinitions;
    level: string;
    game: Game;
    completeFn: ((level: string, completed: boolean) => void) | null;
    constructor(args: CircuitsGameProps);
    ready(): void;
    onGameComplete(event: CustomEvent<{
        level: string;
        completed: boolean;
    }>): void;
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