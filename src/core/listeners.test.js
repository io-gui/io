import {IoNode} from '../io.js';

const string = (object) => {
  return JSON.stringify(object);
};

class Node1 extends IoNode {
  static get Listeners() {
    return {
      'event1': 'handler1',
    };
  }
  handler1() {}
}
Node1.Register();

class Node2 extends Node1 {
  static get Listeners() {
    return {
      'event2': 'handler2',
    };
  }
  handler2() {}
  handler3() {}
}
Node2.Register();

export default class {
  run() {
    describe('Listeners', () => {
      describe('ProtoListeners', () => {
        it('Should include all listeners from protochain', () => {
          const node = new Node2();
          chai.expect(string(node.__protoListeners)).to.be.equal(string({'event1': 'handler1', 'event2': 'handler2'}));
        });
      });
      describe('Listeners', () => {
        it('Should include all listeners from protochain', () => {
          const node = new Node2();
          chai.expect(string(node.__listeners)).to.be.equal(string({'event1': 'handler1', 'event2': 'handler2'}));
        });
        it('Should include all prop listeners in active listeners', () => {
          const handler4 = function() {};
          const node = new Node2({'on-event3': 'handler3', 'on-event4': handler4});
          node.connect();
          chai.expect(node.__listeners.activeListeners.event1[0]).to.be.equal(node.handler1);
          chai.expect(node.__listeners.activeListeners.event2[0]).to.be.equal(node.handler2);
          chai.expect(node.__listeners.activeListeners.event3[0]).to.be.equal(node.handler3);
          chai.expect(node.__listeners.activeListeners.event4[0]).to.be.equal(handler4);
        });
        // TODO: test multi-listeners
        // TODO: test listeners on-off
        // TODO: test connection on-off
      });
    });
  }
}
