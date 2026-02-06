import { IoElement, Register } from "@io-gui/core";
import { ioButton } from "@io-gui/inputs";
import type { DrawMode } from "./game/game.js";

const PAD_COLORS_ROW = [
  "red",
  "green",
  "blue",
  "pink",
  "yellow",
  "orange",
  "purple",
  "brown",
  "grey",
  "black",
] as const;

@Register
export class CircuitsEditor extends IoElement {
  static get Style() {
    return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.85);
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
        gap: 4px;
        padding: 8px;
      }
      :host > io-button {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
      }
    `;
  }

  ready() {
    this.changed();
  }

  changed() {
    this.render([
      this._padButton("white"),
      ...PAD_COLORS_ROW.map((c) => this._padButton(c)),
      this._modeButton("Line W", "line", "white"),
      this._modeButton("Line G", "line", "grey"),
      this._modeButton("Delete", "delete", "red"),
    ]);
  }

  private _padButton(color: string) {
    return ioButton({ label: color, action: () => this._select("pad", color) });
  }

  private _modeButton(label: string, mode: DrawMode, color: string) {
    return ioButton({ label, action: () => this._select(mode, color) });
  }

  private _select(mode: DrawMode, color: string) {
    this.dispatch("editor-select", { mode, color }, true);
  }
}

export const circuitsEditor = CircuitsEditor.vConstructor;
