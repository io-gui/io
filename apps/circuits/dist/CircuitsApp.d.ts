import { IoElement, ListenerDefinitions } from '@io-gui/core';
import { Game } from './game/game.js';
export declare class CircuitsApp extends IoElement {
    static get Style(): string;
    game: Game;
    static get Listeners(): ListenerDefinitions;
    ready(): void;
    private _getCompletedIds;
    private _setCompletedIds;
    onLevelComplete(level: string, completed: boolean): void;
    onEditorSelect(event: CustomEvent): void;
    onLevelSelect(event: CustomEvent): void;
}
//# sourceMappingURL=CircuitsApp.d.ts.map