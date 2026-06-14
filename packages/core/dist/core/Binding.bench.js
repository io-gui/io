var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bench, describe } from 'vitest';
import { Register } from '../decorators/Register.js';
import { ReactiveNode } from '../nodes/ReactiveNode.js';
import { Binding } from './Binding.js';
let BenchBindingNode = class BenchBindingNode extends ReactiveNode {
    static get ReactiveProperties() {
        const props = { source: 0 };
        for (let i = 0; i < 16; i++) {
            props[`t${i}`] = 0;
        }
        return props;
    }
};
BenchBindingNode = __decorate([
    Register
], BenchBindingNode);
describe('Binding', () => {
    bench('1 source to 16 targets', () => {
        const source = new BenchBindingNode();
        const binding = new Binding(source, 'source');
        const targets = [];
        for (let i = 0; i < 16; i++) {
            const target = new BenchBindingNode();
            targets.push(target);
            binding.addTarget(target, `t${i}`);
        }
        source.source = 42;
        source.dispose();
        for (const target of targets)
            target.dispose();
    });
});
//# sourceMappingURL=Binding.bench.js.map