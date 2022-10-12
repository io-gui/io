var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoNode, RegisterIoNode } from '../core/node.js';
import { Options } from './options.js';
import { Path } from './path.js';
// TODO: document and test!
// TODO: consider menu model mutations.
// TODO: test for robustness and document.
let Item = class Item extends IoNode {
    static get Properties() {
        return {
            value: undefined,
            label: '',
            icon: '',
            hint: '',
            action: undefined,
            select: 'pick',
            selected: Boolean,
            path: {
                type: Path,
            },
            options: {
                type: Options
            }
        };
    }
    constructor(option) {
        if (typeof option !== 'object' || option === null) {
            option = {
                value: option,
                label: option,
            };
        }
        if (option.options) {
            if (!(option.options instanceof Options)) {
                option.options = new Options(option.options);
            }
        }
        if (!option.label) {
            if (typeof option.value === 'object') {
                option.label = option.value.constructor.name;
            }
            else {
                option.label = String(option.value);
            }
        }
        if (option.select === 'toggle' && option.options && option.options.length) {
            console.warn('IoGUI Item: options with {select: "toggle"} cannot have suboptions!');
            option.options = new Options();
        }
        if (option.select === 'pick' && option.options.length) {
            option.selected = !!option.options.path.value.length;
            option.path.value = [...option.options.path.value];
        }
        super(option);
        if (this.select === 'pick' && this.options.length) {
            this.setSelectedPath(!!this.options.path.value.length, [...this.options.path.value]);
        }
    }
    get hasmore() {
        return !!(this.options.length);
    }
    option(value) {
        return this.options.option(value);
    }
    onOptionsSelectedPathChanged() {
        if (this.select === 'pick') {
            this.setSelectedPath(!!this.options.path.value.length, [...this.options.path.value]);
        }
    }
    optionsChanged() {
        // TODO: test GC
        this.options.addEventListener('path-changed', this.onOptionsSelectedPathChanged);
    }
    selectedChanged() {
        if (this.select === 'pick') {
            if (!this.selected) {
                this.options.setSelectedPath([]);
                this.setSelectedPath(false, []);
            }
        }
    }
    setSelectedPath(selected, path = []) {
        this.path.value = path;
        this.selected = selected;
        this.dispatchEvent('path-changed', this.path); // TODO: TEMP HACK
    }
    changed() {
        this.dispatchEvent('changed');
    }
};
Item = __decorate([
    RegisterIoNode
], Item);
export { Item };
//# sourceMappingURL=item.js.map