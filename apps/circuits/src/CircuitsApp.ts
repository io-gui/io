import {
  Register,
  IoElement,
  ReactiveProperty,
  Storage as $,
  ListenerDefinitions,
} from "@io-gui/core";
import { ioSplit, Split } from "@io-gui/layout";

import { circuitsLevels, CircuitsLevels } from "./CircuitsLevels.js";
import { circuitsGame } from "./CircuitsGame.js";
import { circuitsEditor } from "./CircuitsEditor.js";
import { Game } from "./game/game.js";

$.permit();
const $level = $({ key: "level", storage: "hash", value: "" });
const $completed = $({
  key: "circuits-completed",
  storage: "local",
  value: "[]",
});

@Register
export class CircuitsApp extends IoElement {
  static get Style() {
    return /* css */ `
      :host {
        display: flex;
        position: fixed;
        inset: 0;
        background-color: var(--io_bgColor);
        color: var(--io_color);
        user-select: none;
        -webkit-user-select: none;
        -webkit-text-size-adjust: none;
        -webkit-touch-callout: none;
      }
    `;
  }

  @ReactiveProperty({ type: Game, init: null })
  declare game: Game;

  static get Listeners(): ListenerDefinitions {
    return {
      "level-select": "onLevelSelect",
      "editor-select": "onEditorSelect",
    };
  }

  ready() {
    const completedIds = this._getCompletedIds();
    this.render([
      ioSplit({
        split: new Split({
          type: "split",
          children: [
            { type: "panel", flex: "0 0 110px", tabs: [{ id: "levels" }] },
            { type: "panel", flex: "1 1 auto", tabs: [{ id: "game" }] },
            { type: "panel", flex: "0 0 120px", tabs: [{ id: "editor" }] },
          ],
        }),
        elements: [
          circuitsLevels({ id: "levels", completedLevels: completedIds } as {
            id: string;
            completedLevels: string[];
          }),
          circuitsGame({ id: "game", level: $level, game: this.game }),
          circuitsEditor({ id: "editor" }),
        ],
      }),
    ]);
    const gameEl = this.querySelector("#game") as {
      completeFn?: (level: string, completed: boolean) => void;
    } | null;
    if (gameEl) {
      gameEl.completeFn = (level: string, completed: boolean) =>
        this.onLevelComplete(level, completed);
    }
  }

  private _getCompletedIds(): string[] {
    try {
      return JSON.parse($completed.value || "[]") as string[];
    } catch {
      return [];
    }
  }

  private _setCompletedIds(ids: string[]) {
    $completed.value = JSON.stringify(ids);
  }

  onLevelComplete(level: string, completed: boolean) {
    if (!completed) return;
    const ids = this._getCompletedIds();
    if (ids.includes(level)) return;
    this._setCompletedIds([...ids, level]);
    const levelsEl = this.querySelector("#levels") as CircuitsLevels | null;
    if (levelsEl?.refreshCompleted)
      levelsEl.refreshCompleted(this._getCompletedIds());
  }

  onEditorSelect(event: CustomEvent) {
    event.stopPropagation();
    const { mode, color, layer } = event.detail;
    this.game.drawMode = mode;
    if (mode === "line" && layer !== undefined) {
      this.game.drawLayer = layer;
    } else if (color !== undefined) {
      this.game.drawColor = color;
    }
    this.changed();
  }

  onLevelSelect(event: CustomEvent) {
    event.stopPropagation();
    const { level } = event.detail;
    $level.value = level;
  }
}
