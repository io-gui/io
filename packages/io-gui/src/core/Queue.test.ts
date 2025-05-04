import { throttle, debounce, nextQueue } from '../index';

export default class {
  run() {
    describe('Queue', () => {
      it('Should initialize with correct default values', () => {
        let count = 0;
        const func = () => { count++; };
        throttle(func);
        expect(count).to.be.equal(1);
      });
      // it('Should keep track of changes correctly', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.queue('prop1', 1, 0);
      //   changeQueue.queue('prop1', 2, 1);
      //   expect(JSON.stringify(changeQueue.changes)).to.be.equal('[{"property":"prop1","value":2,"oldValue":0}]');
      //   changeQueue.dispatch();
      //   expect(JSON.stringify(changeQueue.changes)).to.be.equal('[]');
      // });
      // it('Should dispatch change events with correct payloads', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.queue('prop1', 1, 0);
      //   changeQueue.queue('prop1', 2, 1);
      //   changeQueue.dispatch();
      //   expect(JSON.stringify(node.eventStack)).to.be.equal('["prop1-changed prop1 2 0","object-mutated"]');
      // });
      // it('Should invoke handler functions with correct payloads', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.queue('prop1', 1, 0);
      //   changeQueue.queue('prop1', 2, 1);
      //   changeQueue.dispatch();
      //   expect(JSON.stringify(node.changeStack)).to.be.equal('["prop1Changed prop1 2 0","changed"]');
      // });
      // it('Should handle changes in first-in, first-out (FIFO) order', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.queue('prop1', 1, 0);
      //   changeQueue.queue('prop1', 3, 1);
      //   changeQueue.queue('prop2', 2, 0);
      //   changeQueue.dispatch();
      //   expect(JSON.stringify(node.changeStack)).to.be.equal('["prop1Changed prop1 3 0","prop2Changed prop2 2 0","changed"]');
      //   expect(JSON.stringify(node.eventStack)).to.be.equal('["prop1-changed prop1 3 0","prop2-changed prop2 2 0","object-mutated"]');
      // });
      // it('Setting new value to the same value as oldValue should not trigger change event', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.queue('prop1', 1, 0);
      //   expect(JSON.stringify(changeQueue.changes)).to.be.equal('[{"property":"prop1","value":1,"oldValue":0}]');
      //   changeQueue.queue('prop1', 0, 1);
      //   expect(JSON.stringify(changeQueue.changes)).to.be.equal('[]');
      //   changeQueue.dispatch();
      //   expect(JSON.stringify(node.changeStack)).to.be.equal('[]');
      //   expect(JSON.stringify(node.eventStack)).to.be.equal('[]');
      // });
      // it('Should skip dispatch if value is same as oldValue', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.queue('prop1', 0, 0);
      //   changeQueue.dispatch();
      //   expect(node.changeStack).to.be.eql([]);
      //   expect(node.eventStack).to.be.eql([]);
      // });
      // it('Should dispose correctly', () => {
      //   const node = new MockNode();
      //   const changeQueue = new ChangeQueue(node);
      //   changeQueue.dispose();
      //   expect(changeQueue.node).to.be.equal(undefined);
      //   expect(changeQueue.changes).to.be.equal(undefined);
      // });
    });
  }
}
