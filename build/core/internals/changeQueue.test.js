import { ChangeQueue } from '../../iogui.js';
class FakeIoNode {
    prop1ChangeCounter = 0;
    prop1Change;
    prop2ChangeCounter = 0;
    prop2Change;
    changeCounter = 0;
    eventDispatchCounter = 0;
    eventName;
    eventChange;
    eventRegister = [];
    changeRegister = [];
    prop1Changed(change) {
        this.prop1Change = change;
        this.prop1ChangeCounter++;
        this.changeRegister.push('prop1Changed');
    }
    prop2Changed(change) {
        this.prop2Change = change;
        this.prop2ChangeCounter++;
        this.changeRegister.push('prop2Changed');
    }
    dispatchEvent(eventName, change) {
        this.eventDispatchCounter++;
        this.eventRegister.push(eventName);
        if (eventName === 'changed')
            return;
        this.eventName = eventName;
        this.eventChange = change;
    }
    dispatchMutationEvent() {
        // this.dispatchEvent('object-mutated', {object: this} as any);
    }
    changed() {
        this.changeCounter++;
    }
}
export default class {
    run() {
        describe('ChangeQueue', () => {
            it('Should initialize with correct default values', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue(node);
                chai.expect(changeQueue.node).to.be.equal(node);
                chai.expect(JSON.stringify(changeQueue.changes)).to.be.equal('[]');
                chai.expect(changeQueue.changes.length).to.be.equal(0);
                chai.expect(changeQueue.dispatching).to.be.equal(false);
            });
            it('Should dispatch change events with correct payloads', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue(node);
                changeQueue.queue('test', 1, 0);
                changeQueue.queue('test', 2, 1);
                chai.expect(changeQueue.changes.length).to.be.equal(1);
                changeQueue.dispatch();
                chai.expect(changeQueue.changes.length).to.be.equal(0);
                chai.expect(node.eventName).to.be.equal('test-changed');
                chai.expect(node.eventChange?.property).to.be.equal('test');
                chai.expect(node.eventChange?.value).to.be.equal(2);
                chai.expect(node.eventChange?.oldValue).to.be.equal(0);
                chai.expect(node.eventDispatchCounter).to.be.equal(2);
                chai.expect(node.changeCounter).to.be.equal(1);
                changeQueue.queue('test2', 0, -1);
                changeQueue.queue('test3', 2, 1);
                chai.expect(changeQueue.changes.length).to.be.equal(2);
                changeQueue.dispatch();
                chai.expect(changeQueue.changes.length).to.be.equal(0);
                chai.expect(node.eventName).to.be.equal('test3-changed');
                chai.expect(node.eventChange?.property).to.be.equal('test3');
                chai.expect(node.eventChange?.value).to.be.equal(2);
                chai.expect(node.eventChange?.oldValue).to.be.equal(1);
                chai.expect(node.eventDispatchCounter).to.be.equal(5);
                chai.expect(node.prop1ChangeCounter).to.be.equal(0);
                chai.expect(node.changeCounter).to.be.equal(2);
            });
            it('Should invoke handler functions with correct payloads', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue(node);
                changeQueue.queue('prop1', 1, 0);
                changeQueue.queue('prop1', 2, 1);
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(1);
                chai.expect(node.changeCounter).to.be.equal(1);
                chai.expect(node.prop1Change?.property).to.be.equal('prop1');
                chai.expect(node.prop1Change?.value).to.be.equal(2);
                chai.expect(node.prop1Change?.oldValue).to.be.equal(0);
            });
            it('Should handle changes in first-in, first-out (FIFO) order', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue(node);
                changeQueue.queue('prop1', 1, 0);
                changeQueue.queue('prop1', 3, 0);
                changeQueue.queue('prop2', 2, 0);
                changeQueue.dispatch();
                chai.expect(JSON.stringify(node.changeRegister)).to.be.equal('["prop1Changed","prop2Changed"]');
                chai.expect(JSON.stringify(node.eventRegister)).to.be.equal('["prop1-changed","prop2-changed","changed"]');
            });
            it('Should skip dispatch if value is same as oldValue', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue(node);
                changeQueue.queue('prop1', 0, 0);
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(0);
            });
            it('Should dispose correctly', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue(node);
                changeQueue.dispose();
                chai.expect(changeQueue.node).to.be.equal(undefined);
                chai.expect(changeQueue.changes).to.be.equal(undefined);
            });
        });
    }
}
//# sourceMappingURL=changeQueue.test.js.map