import { Node, RegisterIoNode } from '../node.js';
class Node11 extends Node {
    static get Listeners() {
        return {
            'event1': 'handler1',
        };
    }
    handler1() { }
}
RegisterIoNode(Node11);
class Node2 extends Node11 {
    static get Listeners() {
        return {
            'event2': 'handler2',
        };
    }
    handler2() { }
    handler3() { }
}
RegisterIoNode(Node2);
export default class {
    run() {
        describe('EventDispatcher', () => {
            describe('ProtoListeners', () => {
                it('Should include all listeners from protochain', () => {
                    const node = new Node2();
                    chai.expect(JSON.stringify(node.__protoListeners)).to.be.equal(JSON.stringify({ 'event1': ['handler1'], 'event2': ['handler2'] }));
                });
            });
            describe('Listeners', () => {
                it('Should include all listeners from protochain', () => {
                    const node = new Node2();
                    chai.expect(JSON.stringify(node.__protoListeners)).to.be.equal(JSON.stringify({ 'event1': ['handler1'], 'event2': ['handler2'] }));
                });
                it('Should include all prop listeners in active listeners', () => {
                    const handler4 = function () { };
                    const node = new Node2({ 'on-event3': 'handler3', 'on-event4': handler4 }).connect();
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
//TODO
// import {ProtoChain} from './protoChain.js';
// import {ProtoListeners} from './listeners';
// class Object1 {}
// class Object2 extends Object1 {}
// class Object3 extends Object2 {}
// export default class {
//   run() {
//     describe('ProtoChain', () => {
//       it('Should have all prototypes from the inheritance chain', () => {
//         let protochain = new ProtoChain(Object3);
//         // chai.expect(protochain[0]).to.be.equal(Array3);
//         // chai.expect(protochain[1]).to.be.equal(Array2);
//         // chai.expect(protochain[2]).to.be.equal(Array1);
//         // protochain = new ProtoChain(Object3);
//         // chai.expect(protochain[0]).to.be.equal(Object3);
//         // chai.expect(protochain[1]).to.be.equal(Object2);
//         // chai.expect(protochain[2]).to.be.equal(Object1);
//         // protochain = new ProtoChain(HTMLElement3);
//         // chai.expect(protochain[0]).to.be.equal(HTMLElement3);
//         // chai.expect(protochain[1]).to.be.equal(HTMLElement2);
//         // chai.expect(protochain[2]).to.be.equal(HTMLElement1);
//       });
//       // it('Should terminate at `HTMLElementElement`, `Object` or `Array`', () => {
//       //   let protochain = new ProtoChain(Array3);
//       //   chai.expect(protochain[3]).to.be.equal(undefined);
//       //   protochain = new ProtoChain(Object3);
//       //   chai.expect(protochain[3]).to.be.equal(undefined);
//       //   protochain = new ProtoChain(HTMLElement3);
//       //   chai.expect(protochain[3]).to.be.equal(undefined);
//       // });
//     });
//   }
// }
//# sourceMappingURL=eventDispatcher.test.js.map