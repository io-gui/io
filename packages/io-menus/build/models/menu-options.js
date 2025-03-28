var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoNodeMixin, Property, Register } from 'io-gui';
import { MenuItem } from './menu-item.js';
// TODO: document!
function _isNaN(value) {
    return typeof value === 'number' && isNaN(value);
}
function _isSelectable(value) {
    return value === 'select' || value === 'scroll';
}
let MenuOptions = class MenuOptions extends IoNodeMixin(Array) {
    push(...items) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            debug: if (!(item instanceof MenuItem)) {
                console.warn('MenuOptions.push: item is not a MenuItem!');
            }
            if (item instanceof MenuItem) {
                debug: if (this.find((otherItem) => otherItem.label === item.label)) {
                    console.warn(`MenuOptions.addItems: duplicate label "${item.label}"`);
                }
                item.addEventListener('selected-changed', this._onItemSelectedChanged);
                item.addEventListener('path-changed', this._onSubOptionsPathChanged);
                super.push(item);
            }
        }
    }
    getItem(value, deep = false) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].value === value)
                return this[i];
            if (deep && this[i].options) {
                const item = this[i].options.getItem(value, deep);
                if (item)
                    return item;
            }
        }
        return null;
    }
    constructor(args = [], properties = {}) {
        const _args = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i] instanceof MenuItem) {
                _args.push(args[i]);
            }
            else {
                _args.push(new MenuItem(args[i]));
            }
        }
        super(properties, ..._args);
        if (this.path !== '')
            this.pathChanged();
        if (this.first !== undefined)
            this.firstChanged();
        for (let i = 0; i < this.length; i++) {
            const item = this[i];
            debug: {
                if (!(item instanceof MenuItem)) {
                    console.warn('MenuOptions.constructor: item is not a MenuItem!');
                }
                // TODO check if same item is at other index
                if (this.find((otherItem) => otherItem !== item && otherItem.label === item.label)) {
                    console.warn(`MenuOptions.addItems: duplicate label "${item.label}"`);
                }
            }
            item.addEventListener('selected-changed', this._onItemSelectedChanged);
            item.addEventListener('path-changed', this._onSubOptionsPathChanged);
            if (item.selected && item.mode === 'select') {
                this.updatePaths(item);
                continue;
            }
        }
    }
    // TODO: consider preventing built-in Array functions like push, pop, etc.
    addItems(items) {
        for (let i = 0; i < items.length; i++) {
            let item;
            if (items[i] instanceof MenuItem) {
                item = items[i];
            }
            else {
                item = new MenuItem(items[i]);
            }
            debug: if (this.find((otherItem) => otherItem.label === item.label)) {
                console.warn(`MenuOptions.addItems: duplicate label "${item.label}"`);
            }
            this.push(item);
            item.addEventListener('selected-changed', this._onItemSelectedChanged);
            item.addEventListener('path-changed', this._onSubOptionsPathChanged);
        }
    }
    pathChanged() {
        const path = this.path ? [...this.path.split(this.delimiter)] : [];
        if (this.length && path.length) {
            const first = path.shift();
            const item = this.find((item) => (item.label === first));
            if (item) {
                debug: if (!_isSelectable(item.mode)) {
                    console.warn('MenuOptions.pathChanged: Path set to non-selectable MenuItem!');
                }
                if (_isSelectable(item.mode)) {
                    if (item.options) {
                        item.options.path = path.join(this.delimiter);
                    }
                    item.selected = true;
                }
            }
            else {
                debug: console.warn(`MenuOptions.pathChanged: cannot find item for specified path "${this.path}"!`);
                for (let i = 0; i < this.length; i++) {
                    if (_isSelectable(this[i].mode))
                        this[i].selected = false;
                }
            }
        }
        else {
            for (let i = 0; i < this.length; i++) {
                if (_isSelectable(this[i].mode))
                    this[i].selected = false;
            }
        }
    }
    firstChanged() {
        if (this.first !== undefined) {
            const item = this.find((item) => ((item.value === this.first && item.mode === 'select') || (_isNaN(item.value) && _isNaN(this.first))));
            if (item) {
                item.selected = true;
            }
            debug: if (item === undefined) {
                console.warn(`MenuOptions.firstChanged: cannot find pickable item for specified first value "${this.first}"!`);
            }
        }
        else {
            for (let i = 0; i < this.length; i++) {
                if (this[i].mode === 'select')
                    this[i].selected = false;
            }
        }
    }
    lastChanged() {
        debug: if (this.last !== undefined) {
            const path = this.path ? [...this.path.split(this.delimiter)] : [];
            if (path.length) {
                let label = path.shift();
                let item = this.find((item) => (item.selected === true && item.label === label && (item.mode === 'select' || item.mode === 'scroll')));
                let options = item?.options || undefined;
                while (path.length && options) {
                    label = path.shift();
                    item = options.find((item) => (item.selected === true && item.label === label && (item.mode === 'select' || item.mode === 'scroll')));
                    options = item?.options || undefined;
                }
                if (item === undefined) {
                    console.warn(`MenuOptions.lastChanged: cannot find item for specified last value "${this.last}"!`);
                }
                else if ((item.value !== this.last && !(_isNaN(item.value) && _isNaN(this.last))) &&
                    (item.value !== this.scroll && !(_isNaN(item.value) && _isNaN(this.scroll)))) {
                    // TODO: test this?
                    console.warn(`MenuOptions.lastChanged: last property value "${this.last}" diverged from item specified by path!`);
                    console.log(this.path, this.last);
                }
            }
            else {
                console.warn(`MenuOptions.lastChanged: last property value set "${this.last}" but path is empty!`);
            }
        }
    }
    updatePaths(item) {
        const path = [];
        let walker = (item?.mode === 'select' || item?.mode === 'scroll') ? item : undefined;
        let lastSelected = item?.mode === 'select' ? item : undefined;
        let lastAnchor = item?.mode === 'scroll' ? item : undefined;
        const hasSelected = this.find((item) => item.mode === 'select' && item.selected);
        const hasAnchor = this.find((item) => item.mode === 'scroll' && item.selected);
        if (!walker && (hasSelected || hasAnchor))
            return;
        while (walker) {
            path.push(walker.label);
            if (walker.mode === 'select')
                lastSelected = walker;
            if (walker.mode === 'scroll')
                lastAnchor = walker;
            walker = walker.options?.find((item) => (item.mode === 'select' || item.mode === 'scroll') && item.selected);
        }
        // TODO: when binding two menu elements to both `first` and `path` properties, it is important that we
        // update the `path` property before the `first`. Otherwise, the menu binding will be broken!
        // TODO: create a test for this edge-case.
        this.setProperties({
            path: path.join(this.delimiter),
            first: item?.mode === 'select' ? item.value : undefined,
            last: lastSelected !== undefined ? lastSelected.value : undefined,
            scroll: lastAnchor !== undefined ? lastAnchor.value : undefined,
        });
    }
    _onItemSelectedChanged(event) {
        const item = event.target;
        if (_isSelectable(item.mode)) {
            if (item.selected) {
                for (let i = 0; i < this.length; i++) {
                    if (this[i] !== item && _isSelectable(this[i].mode)) {
                        this[i].selected = false;
                    }
                }
                this.updatePaths(item);
                this.dispatchEvent('item-selected', { item: item });
            }
            else {
                this.updatePaths();
            }
        }
    }
    _onSubOptionsPathChanged(event) {
        const item = event.target;
        item.selected ? this.updatePaths(item) : this.updatePaths();
    }
    selectDefault() {
        for (let i = 0; i < this.length; i++) {
            if (_isSelectable(this[i].mode)) {
                if (this[i].hasmore) {
                    const selected = this[i].options.selectDefault();
                    if (selected)
                        return true;
                }
                else {
                    this[i].selected = true;
                    return true;
                }
            }
        }
        return false;
    }
    bind(prop) {
        debug: if (prop === 'last' || prop === 'scroll') {
            console.warn('MenuPath: Binding to `last` or `scroll` property is not recommended!');
        }
        return super.bind(prop);
    }
    dispose() {
        for (let i = 0; i < this.length; i++) {
            this[i].removeEventListener('selected-changed', this._onItemSelectedChanged);
            this[i].removeEventListener('path-changed', this._onSubOptionsPathChanged);
        }
        super.dispose();
    }
};
__decorate([
    Property(undefined)
], MenuOptions.prototype, "first", void 0);
__decorate([
    Property(undefined)
], MenuOptions.prototype, "last", void 0);
__decorate([
    Property(undefined)
], MenuOptions.prototype, "scroll", void 0);
__decorate([
    Property('')
], MenuOptions.prototype, "path", void 0);
__decorate([
    Property(',')
], MenuOptions.prototype, "delimiter", void 0);
MenuOptions = __decorate([
    Register
], MenuOptions);
export { MenuOptions };
//# sourceMappingURL=menu-options.js.map