import {ProtoChain} from './protoChain.js';
import {IoNode, IoNodeMixin} from '../io-node.js';
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

class IoNode1 extends IoNode {}
class IoElement1 extends IoElement {}
class IoNode2 extends IoNodeMixin(Object3) {}

class FakeSuperIoNode {
  function1() {}
  onFunction1() {}
  _function1() {}
}

class FakeIoNode extends FakeSuperIoNode {
  function2() {}
  onFunction2() {}
  _function2() {}
}

export default class {
  run() {
    describe('ProtoChain', () => {
      it('Should include all inherited constructors', () => {
        let constructors = new ProtoChain(Array3).constructors;
        chai.expect(constructors[0]).to.be.equal(Array3);
        chai.expect(constructors[1]).to.be.equal(Array2);
        chai.expect(constructors[2]).to.be.equal(Array1);
        constructors = new ProtoChain(Object3).constructors;
        chai.expect(constructors[0]).to.be.equal(Object3);
        chai.expect(constructors[1]).to.be.equal(Object2);
        chai.expect(constructors[2]).to.be.equal(Object1);
        constructors = new ProtoChain(HTMLElement3).constructors;
        chai.expect(constructors[0]).to.be.equal(HTMLElement3);
        chai.expect(constructors[1]).to.be.equal(HTMLElement2);
        chai.expect(constructors[2]).to.be.equal(HTMLElement1);
        constructors = new ProtoChain(IoNode1).constructors;
        chai.expect(constructors[0]).to.be.equal(IoNode1);
        chai.expect(constructors[1]).to.be.equal(IoNode);
        constructors = new ProtoChain(IoElement1).constructors;
        chai.expect(constructors[0]).to.be.equal(IoElement1);
        chai.expect(constructors[1]).to.be.equal(IoElement);
        constructors = new ProtoChain(IoNode2).constructors;
        chai.expect(constructors[0]).to.be.equal(IoNode2);
      });
      it('Should terminate at `IoNode` and `IoElement` or before `HTMLElement`, `Object` or `Array`', () => {
        let constructors = new ProtoChain(Array3).constructors;
        chai.expect(constructors[3]).to.be.equal(undefined);
        constructors = new ProtoChain(Object3).constructors;
        chai.expect(constructors[3]).to.be.equal(undefined);
        constructors = new ProtoChain(HTMLElement3).constructors;
        chai.expect(constructors[3]).to.be.equal(undefined);
        constructors = new ProtoChain(IoNode1).constructors;
        chai.expect(constructors[2]).to.be.equal(undefined);
        constructors = new ProtoChain(IoElement1).constructors;
        chai.expect(constructors[4]).to.be.equal(undefined);
        constructors = new ProtoChain(IoNode2).constructors;
        chai.expect(constructors[1]).to.be.equal(undefined);
      });
      it('Should include all functions starting with "on" or "_"', () => {
        const protoChain = new ProtoChain(FakeIoNode);
        console.log(protoChain.functions);
        chai.expect(JSON.stringify(protoChain.functions)).to.be.equal(JSON.stringify(['onFunction2', '_function2', 'onFunction1', '_function1']));
      });
      it('Should bind the functions to specified instance with `.bind(node)` function', () => {
        const protoChain = new ProtoChain(FakeIoNode);
        const node = new FakeIoNode();
        protoChain.bindFunctions(node as any);
        chai.expect(node.function1.name).to.be.equal('function1');
        chai.expect(node.onFunction1.name).to.be.equal('bound onFunction1');
        chai.expect(node._function1.name).to.be.equal('bound _function1');
        chai.expect(node.function2.name).to.be.equal('function2');
        chai.expect(node.onFunction2.name).to.be.equal('bound onFunction2');
        chai.expect(node._function2.name).to.be.equal('bound _function2');
      });
    });
  }
}
