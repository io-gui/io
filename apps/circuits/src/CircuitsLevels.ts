import { IoElement, Register, ReactiveProperty } from "@io-gui/core";
import { MenuOption, ioMenuTree } from "@io-gui/menus";

@Register
export class CircuitsLevels extends IoElement {
  static get Style() {
    return /* css */ `
      :host > .app-title {
        margin-left: 1rem;
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    `;
  }

  @ReactiveProperty({ type: Array, value: [] })
  declare completedLevels: string[];

  private _option = new MenuOption({ id: "levels", options: [] });
  private _levelIds: string[] = [];

  async ready() {
    await this._loadLevels();
    this.changed();
  }

  private _buildLevelOptions(levelIds: string[], completedIds: string[]) {
    return levelIds.map(
      (id) =>
        new MenuOption({
          id,
          label: id,
          disabled: completedIds.includes(id),
          action: () => this.dispatch("level-select", { level: id }, true),
        }),
    );
  }

  private async _loadLevels() {
    const response = await fetch("./public/levels/index.json");
    this._levelIds = await response.json();
    const completed = this.completedLevels ?? [];
    this._option = new MenuOption({
      id: "levels",
      options: this._buildLevelOptions(this._levelIds, completed),
    });
  }

  refreshCompleted(completedIds: string[]) {
    this.completedLevels = completedIds;
    this._option = new MenuOption({
      id: "levels",
      options: this._buildLevelOptions(this._levelIds, completedIds),
    });
    this.changed();
  }

  changed() {
    this.render([ioMenuTree({ option: this._option })]);
  }
}

export const circuitsLevels = CircuitsLevels.vConstructor;
