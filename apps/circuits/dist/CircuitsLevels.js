var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, ReactiveProperty } from '@io-gui/core';
import { MenuOption, ioMenuTree } from '@io-gui/menus';
let CircuitsLevels = class CircuitsLevels extends IoElement {
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
    _option = new MenuOption({ id: 'levels', options: [] });
    _levelIds = [];
    async ready() {
        await this._loadLevels();
        this.changed();
    }
    _buildLevelOptions(levelIds, completedIds) {
        return levelIds.map((id) => new MenuOption({
            id,
            label: id,
            disabled: completedIds.includes(id),
            action: () => this.dispatch('level-select', { level: id }, true),
        }));
    }
    async _loadLevels() {
        const response = await fetch('./public/levels/index.json');
        this._levelIds = await response.json();
        const completed = this.completedLevels ?? [];
        this._option = new MenuOption({
            id: 'levels',
            options: this._buildLevelOptions(this._levelIds, completed),
        });
    }
    refreshCompleted(completedIds) {
        this.completedLevels = completedIds;
        this._option = new MenuOption({
            id: 'levels',
            options: this._buildLevelOptions(this._levelIds, completedIds),
        });
        this.changed();
    }
    changed() {
        this.render([ioMenuTree({ option: this._option })]);
    }
};
__decorate([
    ReactiveProperty({ type: Array, value: [] })
], CircuitsLevels.prototype, "completedLevels", void 0);
CircuitsLevels = __decorate([
    Register
], CircuitsLevels);
export { CircuitsLevels };
export const circuitsLevels = CircuitsLevels.vConstructor;
//# sourceMappingURL=CircuitsLevels.js.map