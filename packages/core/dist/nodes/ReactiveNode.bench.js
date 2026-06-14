var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bench, describe } from 'vitest';
import { Register } from '../decorators/Register.js';
import { ReactiveNode } from './ReactiveNode.js';
let BenchNode = class BenchNode extends ReactiveNode {
    static get ReactiveProperties() {
        const props = {};
        for (let i = 0; i < 50; i++) {
            props[`p${i}`] = 0;
        }
        return props;
    }
};
BenchNode = __decorate([
    Register
], BenchNode);
describe('ReactiveNode', () => {
    bench('setProperty 50 props', () => {
        const node = new BenchNode();
        for (let i = 0; i < 50; i++) {
            node.setProperty(`p${i}`, i + 1);
        }
        node.dispose();
    });
    bench('setProperties batch 50', () => {
        const node = new BenchNode();
        const props = {};
        for (let i = 0; i < 50; i++) {
            props[`p${i}`] = i + 1;
        }
        node.setProperties(props);
        node.dispose();
    });
});
//# sourceMappingURL=ReactiveNode.bench.js.map