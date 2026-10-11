var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ThreeScenegraphItem_1;
import { Register, Property, Field, span } from '@io-gui/core';
import { IoField, ioString } from '@io-gui/inputs';
import { ioIcon } from '@io-gui/icons';
/**
 * One row of a `ThreeScenegraph`: the disclosure triangle, `icon` and `label` of one object, indented by `depth`.
 * Clicking the row dispatches `three-scenegraph-select`, with the mode viewport clicks use (Shift toggles, Ctrl
 * removes); clicking the triangle dispatches `three-scenegraph-toggle`. Up / Down / Home / End move between rows;
 * Right expands, then moves to the first child; Left collapses, then moves to the parent; Enter / Space select.
 * Double-click or F2 dispatches `three-scenegraph-rename-start`; while `renaming`, a name field replaces the label,
 * and Enter or leaving it dispatches `three-scenegraph-rename-end` with the name, Escape with `null`.
 */
let ThreeScenegraphItem = ThreeScenegraphItem_1 = class ThreeScenegraphItem extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        align-items: center;
        border-radius: 0;
      }
      :host > .expander {
        flex: none;
        width: var(--io_lineHeight);
        height: var(--io_lineHeight);
      }
      :host > io-icon {
        flex: none;
      }
      :host > span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 var(--io_spacing2);
      }
      :host > io-string[appearance] {
        flex: none;
        width: 12em;
        height: var(--io_lineHeight);
        min-height: var(--io_lineHeight);
        margin-left: var(--io_spacing);
        padding-top: 0;
        padding-bottom: 0;
      }
      :host[selected] {
        color: var(--io_color);
        background-color: color-mix(in srgb, var(--io_bgColorBlue) 40%, transparent);
        border-color: transparent;
      }
      :host[active] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorBlue);
      }
      :host[active] > io-icon {
        fill: var(--io_colorWhite);
      }
    `;
    }
    static get Listeners() {
        return {
            'dblclick': 'onDblclick',
        };
    }
    /** Whether the last press started on the disclosure triangle. */
    _expanderPressed = false;
    constructor(args) { super(args); }
    onPointerdown(event) {
        // The name field takes its own presses: placing the caret, selecting text.
        if (this._nameField()?.contains(event.target))
            return;
        const expander = this.querySelector(':scope > io-icon.expander');
        this._expanderPressed = !!expander && expander.contains(event.target);
        super.onPointerdown(event);
    }
    onClick(event) {
        event?.stopPropagation();
        if (event && this._nameField()?.contains(event.target))
            return;
        if (event && this._expanderPressed) {
            this._dispatchObject('three-scenegraph-toggle');
        }
        else {
            const mode = event?.shiftKey ? 'toggle' : event?.ctrlKey ? 'subtract' : 'set';
            this.dispatch('three-scenegraph-select', { object: this.object, mode }, true);
        }
    }
    onDblclick() {
        if (!this.renaming && !this._expanderPressed)
            this._dispatchObject('three-scenegraph-rename-start');
    }
    onKeydown(event) {
        const rows = this.parentElement;
        switch (event.key) {
            case 'ArrowDown':
                focusRow(this.nextElementSibling);
                break;
            case 'ArrowUp':
                focusRow(this.previousElementSibling);
                break;
            case 'Home':
                focusRow(rows?.firstElementChild);
                break;
            case 'End':
                focusRow(rows?.lastElementChild);
                break;
            case 'ArrowRight':
                if (this.hasChildren && !this.expanded)
                    this._dispatchObject('three-scenegraph-toggle');
                else if (this.expanded)
                    focusRow(this.nextElementSibling);
                break;
            case 'ArrowLeft':
                if (this.expanded)
                    this._dispatchObject('three-scenegraph-toggle');
                else
                    focusRow(this._parentRow());
                break;
            case 'F2':
                this._dispatchObject('three-scenegraph-rename-start');
                break;
            default:
                super.onKeydown(event);
                return;
        }
        event.preventDefault();
    }
    // Ending the rename removes the name field, so its own handlers for the same event are stopped.
    onNameKeydown(event) {
        if (event.key !== 'Enter' && event.key !== 'Escape')
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this._endRename(event.key === 'Enter' ? event.currentTarget.textNode ?? '' : null);
        this.focus();
    }
    onNameBlur(event) {
        event.stopImmediatePropagation();
        this._endRename(event.currentTarget.textNode ?? '');
    }
    mutated() {
        // Each level indents by half a triangle, so deep hierarchies stay compact.
        this.style.paddingLeft = `calc(var(--io_spacing) + ${this.depth} * var(--io_lineHeight) * 0.5)`;
        this.setAttribute('aria-level', String(this.depth + 1));
        if (this.hasChildren)
            this.setAttribute('aria-expanded', String(this.expanded));
        else
            this.removeAttribute('aria-expanded');
        this.render([
            this.hasChildren
                ? ioIcon({ class: 'expander', value: this.expanded ? 'io:triangle_down' : 'io:triangle_right' })
                : span({ class: 'expander' }),
            ioIcon({ value: this.icon }),
            this.renaming
                ? ioString({
                    value: this.object.name,
                    placeholder: this.object.constructor.name,
                    '@keydown': this.onNameKeydown,
                    '@blur': this.onNameBlur,
                })
                : span(this.label),
        ]);
        const field = this._nameField();
        if (field && document.activeElement !== field) {
            field.focus();
            field.selectAll();
        }
    }
    _nameField() {
        return this.querySelector(':scope > io-string');
    }
    _endRename(name) {
        this.dispatch('three-scenegraph-rename-end', { name }, true);
    }
    _dispatchObject(type) {
        this.dispatch(type, { object: this.object }, true);
    }
    /** The row of the parent object: the nearest row above with a smaller depth. */
    _parentRow() {
        let row = this.previousElementSibling;
        while (row instanceof ThreeScenegraphItem_1 && row.depth >= this.depth)
            row = row.previousElementSibling;
        return row;
    }
};
__decorate([
    Field()
], ThreeScenegraphItem.prototype, "object", void 0);
__decorate([
    Property({ type: Number, value: 0 })
], ThreeScenegraphItem.prototype, "depth", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], ThreeScenegraphItem.prototype, "hasChildren", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], ThreeScenegraphItem.prototype, "expanded", void 0);
__decorate([
    Property({ type: Boolean, value: false, reflect: true })
], ThreeScenegraphItem.prototype, "active", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], ThreeScenegraphItem.prototype, "renaming", void 0);
__decorate([
    Field('treeitem')
], ThreeScenegraphItem.prototype, "role", void 0);
ThreeScenegraphItem = ThreeScenegraphItem_1 = __decorate([
    Register
], ThreeScenegraphItem);
export { ThreeScenegraphItem };
function focusRow(row) {
    if (row instanceof ThreeScenegraphItem)
        row.focus();
}
export const threeScenegraphItem = function (arg0) {
    return ThreeScenegraphItem.vConstructor(arg0);
};
