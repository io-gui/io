var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bench, describe } from 'vitest';
import { Register } from '../decorators/Register.js';
import { ReactiveNode } from '../nodes/ReactiveNode.js';
let BenchChainNode = class BenchChainNode extends ReactiveNode {
};
BenchChainNode = __decorate([
    Register
], BenchChainNode);
describe('EventDispatcher', () => {
    bench('synthetic dispatch depth 20', () => {
        const nodes = [];
        for (let i = 0; i < 20; i++) {
            const node = new BenchChainNode();
            if (i > 0)
                node.addParent(nodes[i - 1]);
            nodes.push(node);
        }
        nodes[19]._eventDispatcher.dispatchEvent('bench-event', 1, true);
        for (const node of nodes)
            node.dispose();
    });
});
//# sourceMappingURL=EventDispatcher.bench.js.map