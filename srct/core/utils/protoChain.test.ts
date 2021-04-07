import {ProtoChain} from './protoChain.js';

class Array1 extends Array {}
class Array2 extends Array1 {}
class Array3 extends Array2 {}

class Object1 {}
class Object2 extends Object1 {}
class Object3 extends Object2 {}

class HTMLElement1 extends HTMLElement {}
class HTMLElement2 extends HTMLElement1 {}
class HTMLElement3 extends HTMLElement2 {}

export default class {
  run() {
    describe('ProtoChain', () => {
      it('Should have all prototypes from the inheritance chain', () => {
        let protochain = new ProtoChain(Array3.prototype);
        chai.expect(protochain[0]).to.be.equal(Array3.prototype);
        chai.expect(protochain[1]).to.be.equal(Array2.prototype);
        chai.expect(protochain[2]).to.be.equal(Array1.prototype);
        protochain = new ProtoChain(Object3.prototype);
        chai.expect(protochain[0]).to.be.equal(Object3.prototype);
        chai.expect(protochain[1]).to.be.equal(Object2.prototype);
        chai.expect(protochain[2]).to.be.equal(Object1.prototype);
        protochain = new ProtoChain(HTMLElement3.prototype);
        chai.expect(protochain[0]).to.be.equal(HTMLElement3.prototype);
        chai.expect(protochain[1]).to.be.equal(HTMLElement2.prototype);
        chai.expect(protochain[2]).to.be.equal(HTMLElement1.prototype);
      });
      it('Should terminate at `HTMLElementElement`, `Object` or `Array`', () => {
        let protochain = new ProtoChain(Array3.prototype);
        chai.expect(protochain[3]).to.be.equal(undefined);
        protochain = new ProtoChain(Object3.prototype);
        chai.expect(protochain[3]).to.be.equal(undefined);
        protochain = new ProtoChain(HTMLElement3.prototype);
        chai.expect(protochain[3]).to.be.equal(undefined);
      });
    });
  }
}
