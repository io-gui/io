var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bench, describe } from 'vitest';
import { Register } from '../decorators/Register.js';
import { ReactiveNode } from '../nodes/ReactiveNode.js';
import { NodeArray } from './NodeArray.js';
let BenchArrayNode = class BenchArrayNode extends ReactiveNode {
    static get ReactiveProperties() {
        return {
            items: { type: NodeArray, init: null },
        };
    }
};
BenchArrayNode = __decorate([
    Register
], BenchArrayNode);
let BenchItemNode = class BenchItemNode extends ReactiveNode {
    static get ReactiveProperties() {
        return { n: 0 };
    }
};
BenchItemNode = __decorate([
    Register
], BenchItemNode);
describe('NodeArray', () => {
    bench('push x1000', () => {
        const parent = new BenchArrayNode();
        for (let i = 0; i < 1000; i++) {
            parent.items.push(new BenchItemNode({ n: i }));
        }
        parent.dispose();
    });
    bench('splice(0,1) x1000', () => {
        const parent = new BenchArrayNode();
        for (let i = 0; i < 1000; i++) {
            parent.items.push(new BenchItemNode({ n: i }));
        }
        for (let i = 0; i < 1000; i++) {
            parent.items.splice(0, 1);
        }
        parent.dispose();
    });
});
//# sourceMappingURL=NodeArray.bench.js.map