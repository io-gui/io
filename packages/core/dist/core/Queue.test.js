import { describe, it, expect } from 'vitest';
import { throttle, debounce, nextQueue, ReactiveNode } from '@io-gui/core';
describe('Queue', () => {
    describe('throttle - leading + trailing edge', () => {
        it('Should execute immediately on first call (leading edge)', async () => {
            let count = 0;
            const func = () => { count++; };
            throttle(func);
            expect(count).toBe(1); // Executes synchronously
            await nextQueue(); // Trailing also executes
            expect(count).toBe(2);
        });
        it('Should execute leading edge and queue trailing with latest arg', async () => {
            const args = [];
            const func = (a) => { args.push(a); };
            throttle(func, 'first'); // Leading: executes with 'first'
            throttle(func, 'second'); // Updates trailing arg
            throttle(func, 'third'); // Updates trailing arg
            expect(args).toEqual(['first']); // Only leading executed so far
            await nextQueue();
            expect(args).toEqual(['first', 'third']); // Trailing executes with last arg
        });
        it('Should execute again after trailing completes', async () => {
            let count = 0;
            const func = () => { count++; };
            throttle(func); // Leading
            expect(count).toBe(1);
            await nextQueue(); // Trailing
            expect(count).toBe(2);
            throttle(func); // New leading (delay expired)
            expect(count).toBe(3);
        });
        it('Should respect custom delay', async () => {
            let count = 0;
            const func = () => { count++; };
            throttle(func, undefined, undefined, 3); // Leading executes
            expect(count).toBe(1);
            await nextQueue(); // Frame 1
            throttle(func, undefined, undefined, 3); // Ignored, trailing not reached
            expect(count).toBe(1);
            await nextQueue(); // Frame 2
            throttle(func, undefined, undefined, 3); // Ignored, trailing not reached
            expect(count).toBe(1);
            await nextQueue(); // Frame 3 - trailing executes
            expect(count).toBe(2);
            throttle(func, undefined, undefined, 3); // New leading
            expect(count).toBe(3);
        });
        it('Should not execute if node is disposed', async () => {
            let count = 0;
            const func = () => { count++; };
            const node = new ReactiveNode();
            node.dispose();
            throttle(func, undefined, node);
            expect(count).toBe(0);
            await nextQueue();
            expect(count).toBe(0); // Trailing also skipped
        });
        it('Should handle errors gracefully', async () => {
            let count = 0;
            const errorFunc = () => { throw new Error('test error'); };
            const normalFunc = () => { count++; };
            expect(() => throttle(errorFunc)).not.toThrow();
            throttle(normalFunc);
            expect(count).toBe(1);
        });
    });
    describe('debounce - trailing edge deferral', () => {
        it('Should not execute immediately', async () => {
            let count = 0;
            const func = () => { count++; };
            debounce(func);
            expect(count).toBe(0);
        });
        it('Should execute after delay', async () => {
            let count = 0;
            const func = () => { count++; };
            debounce(func);
            expect(count).toBe(0);
            await nextQueue();
            expect(count).toBe(1);
        });
        it('Should reset timer on each call', async () => {
            let count = 0;
            const func = () => { count++; };
            debounce(func, undefined, undefined, 2);
            expect(count).toBe(0);
            await nextQueue(); // Frame 1
            expect(count).toBe(0);
            debounce(func, undefined, undefined, 2); // Reset to frame+2
            await nextQueue(); // Frame 2
            expect(count).toBe(0);
            await nextQueue(); // Frame 3
            expect(count).toBe(1);
        });
        it('Should use latest argument', async () => {
            let arg = '';
            const func = (a) => { arg = a; };
            debounce(func, 'first');
            debounce(func, 'second');
            debounce(func, 'third');
            await nextQueue();
            expect(arg).toBe('third');
        });
        it('Should abort if node is disposed', async () => {
            let count = 0;
            const func = () => { count++; };
            const node = new ReactiveNode();
            debounce(func, undefined, node);
            node.dispose();
            await nextQueue();
            expect(count).toBe(0);
        });
        it('Should handle different functions independently', async () => {
            let count1 = 0;
            let count2 = 0;
            const func1 = () => { count1++; };
            const func2 = () => { count2++; };
            debounce(func1);
            debounce(func2);
            await nextQueue();
            expect(count1).toBe(1);
            expect(count2).toBe(1);
        });
        it('Should handle errors without breaking queue', async () => {
            let count = 0;
            const errorFunc = () => { throw new Error('test'); };
            const normalFunc = () => { count++; };
            debounce(errorFunc);
            debounce(normalFunc);
            await nextQueue();
            expect(count).toBe(1);
        });
    });
    describe('throttle and debounce together', () => {
        it('Should work independently', async () => {
            const throttleArgs = [];
            const debounceArgs = [];
            const throttleFunc = (a) => { throttleArgs.push(a); };
            const debounceFunc = (a) => { debounceArgs.push(a); };
            throttle(throttleFunc, 'a'); // Leading executes
            debounce(debounceFunc, 'x'); // Queued
            expect(throttleArgs).toEqual(['a']);
            expect(debounceArgs).toEqual([]);
            await nextQueue();
            expect(throttleArgs).toEqual(['a', 'a']); // Leading + trailing
            expect(debounceArgs).toEqual(['x']);
        });
    });
    describe('nextQueue utility', () => {
        it('Should resolve after one frame', async () => {
            let resolved = false;
            const promise = nextQueue().then(() => { resolved = true; });
            expect(resolved).toBe(false);
            await promise;
            expect(resolved).toBe(true);
        });
    });
});
//# sourceMappingURL=Queue.test.js.map