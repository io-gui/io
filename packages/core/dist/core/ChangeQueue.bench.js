import { bench, describe } from 'vitest';
import { ChangeQueue } from './ChangeQueue.js';
function benchOwner(handlers = {}) {
    return {
        dispatch() { },
        changed() { },
        constructor: { name: 'BenchOwner' },
        ...handlers,
    };
}
function freshQueue() {
    return new ChangeQueue(benchOwner());
}
describe('ChangeQueue', () => {
    bench('queue 50 unique', () => {
        const q = freshQueue();
        for (let i = 0; i < 50; i++) {
            q.queue(`p${i}`, i, 0);
        }
    });
    bench('coalesce 1000x', () => {
        const q = freshQueue();
        for (let i = 1; i <= 1000; i++) {
            q.queue('x', i, i - 1);
        }
    });
    bench('cancel', () => {
        const q = freshQueue();
        q.queue('x', 1, 0);
        q.queue('x', 0, 1);
    });
    bench('dispatch 50', () => {
        const q = freshQueue();
        for (let i = 0; i < 50; i++) {
            q.queue(`p${i}`, i, 0);
        }
        q.dispatch();
    });
    bench('cascade', () => {
        const owner = benchOwner();
        const q = new ChangeQueue(owner);
        Object.assign(owner, {
            prop1Changed(change) {
                if (change.value === 1) {
                    q.queue('prop2', 'cascaded', '');
                }
            },
            prop2Changed(change) {
                if (change.value === 'cascaded') {
                    q.queue('prop3', 'final', '');
                }
            },
            prop3Changed() { },
        });
        q.queue('prop1', 1, 0);
        q.dispatch();
    });
    bench('coalesce 50 props to final values', () => {
        const q = freshQueue();
        for (let i = 0; i < 50; i++) {
            q.queue(`p${i}`, 0, 0);
            q.queue(`p${i}`, i + 1, 0);
        }
        q.dispatch();
    });
});
//# sourceMappingURL=ChangeQueue.bench.js.map