import { throttle, debounce, nextQueue, Node } from '@io-gui/core';
export default class {
    run() {
        describe('Queue', () => {
            it('Should exectute twice throttled function once in the next frame', async () => {
                let count = 0;
                const func = () => { count++; };
                throttle(func);
                throttle(func);
                await nextQueue();
                expect(count).to.be.equal(1);
                await nextQueue();
                expect(count).to.be.equal(1);
            });
            it('Should exectute throttled function with correct argument', async () => {
                let arg = '';
                const func = (a) => { arg = a; };
                throttle(func, 'first');
                throttle(func, 'second');
                expect(arg).to.be.equal('');
                await nextQueue();
                expect(arg).to.be.equal('second');
                throttle(func, 'third');
                throttle(func, 'fourth');
                throttle(func, 'sixt');
                await nextQueue();
                expect(arg).to.be.equal('sixt');
            });
            it('Should execute throttled function in the next frame if called multiple times', async () => {
                let count = 0;
                const func = () => { count++; };
                throttle(func);
                throttle(func);
                throttle(func);
                throttle(func);
                expect(count).to.be.equal(0);
                await nextQueue();
                expect(count).to.be.equal(1);
                await nextQueue();
                expect(count).to.be.equal(1);
            });
            it('Should execute throttled function after specified delay', async () => {
                let count = 0;
                const func = () => { count++; };
                throttle(func, undefined, undefined, 10);
                throttle(func, undefined, undefined, 10);
                throttle(func, undefined, undefined, 10);
                throttle(func, undefined, undefined, 10);
                expect(count).to.be.equal(0);
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                expect(count).to.be.equal(1);
                await nextQueue();
                expect(count).to.be.equal(1);
            });
            it('Should exectute debounced function in the next frame', async () => {
                let count = 0;
                const func = () => { count++; };
                debounce(func);
                expect(count).to.be.equal(0);
                await nextQueue();
                expect(count).to.be.equal(1);
            });
            it('Should exectute debounced function with correct argument', async () => {
                let arg = '';
                const func = (a) => { arg = a; };
                debounce(func, 'first');
                debounce(func, 'second');
                await nextQueue();
                expect(arg).to.be.equal('second');
                await nextQueue();
                debounce(func, 'third');
                debounce(func, 'fourth');
                debounce(func, 'sixt');
                await nextQueue();
                expect(arg).to.be.equal('sixt');
            });
            it('Should postpone debounced function execution if called multiple times before specified delay', async () => {
                let count = 0;
                const func = () => { count++; };
                debounce(func, undefined, undefined, 2);
                expect(count).to.be.equal(0);
                await nextQueue();
                debounce(func, undefined, undefined, 2);
                expect(count).to.be.equal(0);
                await nextQueue();
                debounce(func);
                expect(count).to.be.equal(0);
                await nextQueue();
                expect(count).to.be.equal(1);
            });
            it('Should execute debounced function after specified delay', async () => {
                let count = 0;
                const func = () => { count++; };
                debounce(func, undefined, undefined, 10);
                expect(count).to.be.equal(0);
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                await nextQueue();
                expect(count).to.be.equal(1);
            });
            it('Should abort execution if node is disposed', async () => {
                let count = 0;
                const func = () => { count++; };
                const node = new Node();
                debounce(func, undefined, node);
                node.dispose();
                await nextQueue();
                expect(count).to.be.equal(0);
                throttle(func, undefined, node);
                throttle(func, undefined, node);
                await nextQueue();
                expect(count).to.be.equal(0);
                await nextQueue();
                expect(count).to.be.equal(0);
            });
        });
    }
}
//# sourceMappingURL=Queue.test.js.map