var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoNode, RegisterIoNode } from '../core/node.js';
let Path = class Path extends IoNode {
    static get Properties() {
        return {
            value: Array,
            string: String,
            root: null,
            leaf: null,
            delimiter: ':',
        };
    }
    constructor(...args) {
        super(...args);
        this.valueChanged();
    }
    valueChanged() {
        // TODO: redesign. Investigate why inputValue causes infinite loop.
        this._properties['value'].value = new Proxy(this._properties['value'].value, {
            get: (target, prop) => target[prop],
            set: (target, prop, value) => {
                if (target[prop] === value)
                    return true;
                target[prop] = value;
                this.update();
                this.throttle(this.onMutation);
                return true;
            }
        });
        this.update();
        this.throttle(this.onMutation, undefined, true);
    }
    onMutation() {
        this.dispatchQueue();
    }
    update() {
        let string = '';
        for (let i = 0; i < this.value.length; i++) {
            debug: {
                if (this.value[i] && typeof this.value[i] === 'string' && this.value[i].search(this.delimiter) !== -1) {
                    console.warn(`IoGUI Path: Value ${this.value[i]} with special string "${this.delimiter}" cannot be used in path!`);
                    break;
                }
            }
            string += this.value[i];
            if (i !== this.value.length - 1)
                string += this.delimiter;
        }
        this.setProperties({
            'string': string,
            'leaf': this.value[this.value.length - 1],
            'root': this.value[0],
        });
    }
    stringChanged() {
        const array = this.string ? [...this.string.split(this.delimiter)] : [];
        for (let i = 0; i < array.length; i++) {
            if (this.value[i] !== array[i])
                this.value[i] = array[i];
        }
        this.value.length = array.length;
    }
    rootChanged() {
        if (this.value[0] !== this.root) {
            this.value = [this.root];
        }
    }
    leafChanged() {
        const i = Math.max(0, this.value.length - 1);
        if (this.value[i] !== this.leaf) {
            this.value[i] = this.leaf;
        }
    }
};
Path = __decorate([
    RegisterIoNode
], Path);
export { Path };
//# sourceMappingURL=path.js.map