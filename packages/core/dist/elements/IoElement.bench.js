var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bench, describe } from 'vitest';
import { Register } from '../decorators/Register.js';
import { IoElement } from './IoElement.js';
import { div } from './IoNative.js';
let BenchRenderElement = class BenchRenderElement extends IoElement {
    renderNodes(changed = 0) {
        const nodes = [];
        for (let i = 0; i < 200; i++) {
            nodes.push(div({ key: i, class: i < changed ? 'changed' : 'same' }));
        }
        this.render(nodes);
    }
};
BenchRenderElement = __decorate([
    Register
], BenchRenderElement);
describe('IoElement', () => {
    bench('render 200 div nodes', () => {
        const el = new BenchRenderElement();
        el.renderNodes();
        el.dispose();
    });
    bench('re-render 10 changed', () => {
        const el = new BenchRenderElement();
        el.renderNodes();
        el.renderNodes(10);
        el.dispose();
    });
});
//# sourceMappingURL=IoElement.bench.js.map