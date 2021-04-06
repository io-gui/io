import { ChangeQueue } from './changeQueue.js';
export default class {
    constructor() {
        this.prop1ChangeCounter = 0;
        this.changeCounter = 0;
        this.eventDispatchCounter = 0;
        this.init();
        this.changeQueue = new ChangeQueue(this.fakeNode);
    }
    init() {
        this.prop1ChangeCounter = 0;
        this.changeCounter = 0;
        this.eventDispatchCounter = 0;
        this.eventName = undefined;
        this.change = undefined;
        const scope = this;
        this.fakeNode = {
            prop1: 0,
            prop1Changed() {
                scope.prop1ChangeCounter++;
            },
            dispatchEvent(eventName, change) {
                scope.eventDispatchCounter++;
                scope.eventName = eventName;
                scope.change = change;
            },
            applyCompose() { },
            changed() {
                scope.changeCounter++;
            },
            __connected: true
        };
        this.changeQueue = new ChangeQueue(this.fakeNode);
    }
    run() {
        describe('Queue', () => {
            it('Should have correct defaults', () => {
                this.init();
                chai.expect(typeof this.changeQueue.__node).to.be.equal('object');
                chai.expect(typeof this.changeQueue.__changes).to.be.equal('object');
                chai.expect(this.changeQueue.__changes.length).to.be.equal(0);
                chai.expect(this.changeQueue.__changes instanceof Array).to.be.equal(true);
                chai.expect(this.changeQueue.__dispatching).to.be.equal(false);
            });
            it('Should dispose correctly', () => {
                this.init();
                this.changeQueue.dispose();
                chai.expect(typeof this.changeQueue.__node).to.be.equal('undefined');
                chai.expect(typeof this.changeQueue.__changes).to.be.equal('undefined');
                chai.expect(typeof this.changeQueue.__dispatching).to.be.equal('undefined');
            });
            it('Should trigger change events', () => {
                this.init();
                this.changeQueue.queue('test', 1, 0);
                this.changeQueue.queue('test', 2, 1);
                chai.expect(this.changeQueue.__changes.length).to.be.equal(1);
                this.changeQueue.dispatch();
                chai.expect(this.changeQueue.__changes.length).to.be.equal(0);
                chai.expect(this.eventName).to.be.equal('test-changed');
                chai.expect(this.change?.property).to.be.equal('test');
                chai.expect(this.change?.value).to.be.equal(2);
                chai.expect(this.change?.oldValue).to.be.equal(0);
                chai.expect(this.eventDispatchCounter).to.be.equal(1);
                chai.expect(this.changeCounter).to.be.equal(1);
                this.changeQueue.queue('test2', 0, -1);
                this.changeQueue.queue('test3', 2, 1);
                chai.expect(this.changeQueue.__changes.length).to.be.equal(2);
                this.changeQueue.dispatch();
                chai.expect(this.changeQueue.__changes.length).to.be.equal(0);
                chai.expect(this.eventName).to.be.equal('test2-changed');
                chai.expect(this.change?.property).to.be.equal('test2');
                chai.expect(this.change?.value).to.be.equal(0);
                chai.expect(this.change?.oldValue).to.be.equal(-1);
                chai.expect(this.eventDispatchCounter).to.be.equal(3);
                chai.expect(this.prop1ChangeCounter).to.be.equal(0);
                chai.expect(this.changeCounter).to.be.equal(2);
            });
            it('should trigger handler functions', () => {
                this.init();
                this.changeQueue.queue('prop1', 1, 0);
                this.changeQueue.queue('prop1', 2, 1);
                this.changeQueue.dispatch();
                chai.expect(this.prop1ChangeCounter).to.be.equal(1);
                chai.expect(this.changeCounter).to.be.equal(1);
            });
        });
    }
}
//# sourceMappingURL=changeQueue.test.js.map