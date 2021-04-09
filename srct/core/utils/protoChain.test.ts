import {ProtoChain} from './protoChain.js';
import {Node} from '../node.js';
import {IoElement} from '../io-element.js';

class Array1 extends Array {}
class Array2 extends Array1 {}
class Array3 extends Array2 {}

class Object1 {}
class Object2 extends Object1 {}
class Object3 extends Object2 {}

class HTMLElement1 extends HTMLElement {}
class HTMLElement2 extends HTMLElement1 {}
class HTMLElement3 extends HTMLElement2 {}

class Node1 extends Node {}
class IoElement1 extends IoElement {}

export default class {
  run() {
    describe('ProtoChain', () => {
      it('Should have all prototypes from the inheritance chain', () => {
        let protochain = new ProtoChain(Array3);
        chai.expect(protochain[0]).to.be.equal(Array3);
        chai.expect(protochain[1]).to.be.equal(Array2);
        chai.expect(protochain[2]).to.be.equal(Array1);
        protochain = new ProtoChain(Object3);
        chai.expect(protochain[0]).to.be.equal(Object3);
        chai.expect(protochain[1]).to.be.equal(Object2);
        chai.expect(protochain[2]).to.be.equal(Object1);
        protochain = new ProtoChain(HTMLElement3);
        chai.expect(protochain[0]).to.be.equal(HTMLElement3);
        chai.expect(protochain[1]).to.be.equal(HTMLElement2);
        chai.expect(protochain[2]).to.be.equal(HTMLElement1);
        protochain = new ProtoChain(Node1);
        chai.expect(protochain[0]).to.be.equal(Node1);
        chai.expect(protochain[1]).to.be.equal(Node);
        protochain = new ProtoChain(IoElement1);
        chai.expect(protochain[0]).to.be.equal(IoElement1);
        chai.expect(protochain[1]).to.be.equal(IoElement);
        chai.expect(String(protochain[2])).to.be.equal(String((Node as any).__proto__));
      });
      it('Should terminate at `HTMLElement`, `Object` or `Array`', () => {
        let protochain = new ProtoChain(Array3);
        chai.expect(protochain[3]).to.be.equal(undefined);
        protochain = new ProtoChain(Object3);
        chai.expect(protochain[3]).to.be.equal(undefined);
        protochain = new ProtoChain(HTMLElement3);
        chai.expect(protochain[3]).to.be.equal(undefined);
        protochain = new ProtoChain(Node1);
        chai.expect(protochain[2]).to.be.equal(undefined);
        protochain = new ProtoChain(IoElement1);
        chai.expect(protochain[4]).to.be.equal(undefined);
      });
    });
  }
}
