import {Node, RegisterIoNode} from '../node.js';

const string = (object: any) => {
  return JSON.stringify(object);
};

class Node1 extends Node {
  static get Listeners(): any {
    return {
      'event1': 'handler1',
    };
  }
  handler1() {}
}
RegisterIoNode(Node1);

class Node2 extends Node1 {
  static get Listeners(): any {
    return {
      'event2': 'handler2',
    };
  }
  handler2() {}
  handler3() {}
}
RegisterIoNode(Node2);

export default class {
  run() {
    describe('EventDispatcher', () => {
      describe('ProtoListeners', () => {
        it('Should include all listeners from protochain', () => {
          const node = new Node2();
          chai.expect(string(node.__protoListeners)).to.be.equal(string({'event1': 'handler1', 'event2': 'handler2'}));
        });
      });
      describe('Listeners', () => {
        it('Should include all listeners from protochain', () => {
          const node = new Node2();
          chai.expect(string(node.__eventDispatcher)).to.be.equal(string({'event1': 'handler1', 'event2': 'handler2'}));
        });
        it('Should include all prop listeners in active listeners', () => {
          const handler4 = function() {};
          const node = new Node2({'on-event3': 'handler3', 'on-event4': handler4});
          node.connect();
          chai.expect(node.__eventDispatcher.__activeListeners.event1[0]).to.be.equal(node.handler1);
          chai.expect(node.__eventDispatcher.__activeListeners.event2[0]).to.be.equal(node.handler2);
          chai.expect(node.__eventDispatcher.__activeListeners.event3[0]).to.be.equal(node.handler3);
          chai.expect(node.__eventDispatcher.__activeListeners.event4[0]).to.be.equal(handler4);
        });
        // TODO: test multi-listeners
        // TODO: test listeners on-off
        // TODO: test connection on-off
      });
    });
  }
}
