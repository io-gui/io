import {ChangeQueue, Change} from './changeQueue.js';
import {IoNode, RegisterIoNode} from '../components/io-node.js'

class TestIoNode extends IoNode {
  prop1ChangeCounter = 0;
  prop1Change?: Change;
  prop2ChangeCounter = 0;
  prop2Change?: Change;
  changeCounter = 0;
  eventDispatchCounter = 0;
  eventName?: string;
  eventChange?: Change;
  eventRegister: string[] = [];
  changeRegister: string[] = [];
  static get Properties(): any {
    return {
      prop1: 0,
      prop2: 0,
    };
  }
  prop1Changed(change: Change) {
    this.prop1Change = change;
    this.prop1ChangeCounter++;
    this.changeRegister.push('prop1Changed');
  }
  prop2Changed(change: Change) {
    this.prop2Change = change;
    this.prop2ChangeCounter++;
    this.changeRegister.push('prop2Changed');
  }
  dispatchEvent(eventName: string, change: Change) {
    this.eventDispatchCounter++;
    this.eventName = eventName;
    this.eventChange = change;
    this.eventRegister.push(eventName);
  }
  changed() {
    this.changeCounter++;
  }
}
RegisterIoNode(TestIoNode);

export default class {
  run() {
    describe('ChangeQueue', () => {
      it('Should initialize with correct default values', () => {
        const node = new TestIoNode().connect();
        const changeQueue = new ChangeQueue(node);
        chai.expect(typeof (changeQueue as any).__node).to.be.equal('object');
        chai.expect(typeof (changeQueue as any).__changes).to.be.equal('object');
        chai.expect((changeQueue as any).__changes instanceof Array).to.be.equal(true);
        chai.expect((changeQueue as any).__changes.length).to.be.equal(0);
        chai.expect((changeQueue as any).__dispatching).to.be.equal(false);
      });
      it('Should dispatch change events with correct payloads', () => {
        const node = new TestIoNode().connect();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('test', 1, 0);
        changeQueue.queue('test', 2, 1);
        chai.expect((changeQueue as any).__changes.length).to.be.equal(1);
        changeQueue.dispatch();
        chai.expect((changeQueue as any).__changes.length).to.be.equal(0);
        chai.expect(node.eventName).to.be.equal('test-changed');
        chai.expect(node.eventChange?.property).to.be.equal('test');
        chai.expect(node.eventChange?.value).to.be.equal(2);
        chai.expect(node.eventChange?.oldValue).to.be.equal(0);
        chai.expect(node.eventDispatchCounter).to.be.equal(1);
        chai.expect(node.changeCounter).to.be.equal(1);
        changeQueue.queue('test2', 0, -1);
        changeQueue.queue('test3', 2, 1);
        chai.expect((changeQueue as any).__changes.length).to.be.equal(2);
        changeQueue.dispatch();
        chai.expect((changeQueue as any).__changes.length).to.be.equal(0);
        // TODO: convert to FIFO
        chai.expect(node.eventName).to.be.equal('test2-changed');
        chai.expect(node.eventChange?.property).to.be.equal('test2');
        chai.expect(node.eventChange?.value).to.be.equal(0);
        chai.expect(node.eventChange?.oldValue).to.be.equal(-1);
        // chai.expect(node.eventChange?.property).to.be.equal('test3');
        // chai.expect(node.eventChange?.value).to.be.equal(2);
        // chai.expect(node.eventChange?.oldValue).to.be.equal(1);
        chai.expect(node.eventDispatchCounter).to.be.equal(3);
        chai.expect(node.prop1ChangeCounter).to.be.equal(0);
        chai.expect(node.changeCounter).to.be.equal(2);
      });
      it('Should invoke handler functions with correct payloads', () => {
        const node = new TestIoNode().connect();
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
        const node = new TestIoNode().connect();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        changeQueue.queue('prop1', 3, 0);
        changeQueue.queue('prop2', 2, 0);
        changeQueue.dispatch();
        // TODO: convert to FIFO
        chai.expect(JSON.stringify(node.changeRegister)).to.be.equal('["prop2Changed","prop1Changed"]');
        chai.expect(JSON.stringify(node.eventRegister)).to.be.equal('["prop2-changed","prop1-changed"]');
        // chai.expect(JSON.stringify(node.changeRegister)).to.be.equal('["prop1Changed","prop2Changed"]');
        // chai.expect(JSON.stringify(node.eventRegister)).to.be.equal('["prop1-changed","prop2-changed"]');
      });
      it('Should skip dispatch if value is same as oldValue', () => {
        const node = new TestIoNode().connect();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 0, 0);
        changeQueue.dispatch();
        chai.expect(node.prop1ChangeCounter).to.be.equal(0);
      });
      it('Should abort dispatch if owner node is disconnected', () => {
        const node = new TestIoNode().connect();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        node.disconnect();
        changeQueue.dispatch();
        chai.expect(node.prop1ChangeCounter).to.be.equal(0);
        node.connect();
        changeQueue.dispatch();
        chai.expect(node.prop1ChangeCounter).to.be.equal(1);
      });
      it('Should dispose correctly', () => {
        const node = new TestIoNode().connect();
        const changeQueue = new ChangeQueue(node);
        changeQueue.dispose();
        chai.expect((changeQueue as any).__node).to.be.equal(undefined);
        chai.expect((changeQueue as any).__changes).to.be.equal(undefined);
        chai.expect((changeQueue as any).__dispatching).to.be.equal(undefined);
      });
    });
  }
}
