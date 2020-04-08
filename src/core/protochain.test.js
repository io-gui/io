import {ProtoChain} from './protochain.js';

class Array1 extends Array {}
class Array2 extends Array1 {}
class Array3 extends Array2 {}

class Object1 {}
class Object2 extends Object1 {}
class Object3 extends Object2 {}

class HTML1 extends HTMLElement {}
class HTML2 extends HTML1 {}
class HTML3 extends HTML2 {}

export default class {
  run() {
    describe('ProtoChain', () => {
      it('Should have prototype chain elements ', () => {
        const protochain = new ProtoChain(Array3.prototype);
        chai.expect(protochain[0]).to.be.equal(Array3.prototype);
        chai.expect(protochain[1]).to.be.equal(Array2.prototype);
        chai.expect(protochain[2]).to.be.equal(Array1.prototype);
      });
      it('Should terminate at `HTMLElement`, `Object` or `Array`', () => {
        let protochain = new ProtoChain(Array3.prototype);
        chai.expect(protochain[3]).to.be.equal(undefined);

        protochain = new ProtoChain(Object3.prototype);
        chai.expect(protochain[3]).to.be.equal(undefined);

        protochain = new ProtoChain(HTML3.prototype);
        chai.expect(protochain[3]).to.be.equal(undefined);
      });
    });
  }
}
