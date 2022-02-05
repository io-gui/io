import {ProtoChain} from './protoChain.js';
import {IoNode, IoNodeMixin, PropertiesDeclaration, ListenersDeclaration} from '../io-node.js';
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

class FakeIoNode1 {
  static get Properties(): PropertiesDeclaration {
    return {
      prop1: {
        notify: false
      }
    };
  }
  static get Listeners(): ListenersDeclaration {
    return {
      listener1: 'function1',
      listener2: '',
      listener3: ['_function1', {capture: true}],
      listener4: () => {}
    };
  }
  static get Style() {
    return 'a';
  }
  function1() {}
  onFunction1() {}
  _function1() {}
}

class FakeIoNode2 extends FakeIoNode1 {
  function2() {}
  onFunction2() {}
  _function2() {}
  static get Properties(): PropertiesDeclaration {
    return {
      prop1: {
        observe: true
      },
      prop2: {}
    };
  }
  static get Listeners(): ListenersDeclaration {
    return {
      listener1: '_function2',
      listener2: ['function2', {capture: true, passive: true}],
      listener3: ['_function1', {passive: true}]
    };
  }
  static get Style() {
    return 'b';
  }
}
class FakeIoNode3 extends FakeIoNode2 {}

export default class {
  run() {
    describe('ProtoChain', () => {
      it('Should include an array of all inherited constructors', () => {
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
      it('Should end constructor array at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`', () => {
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
      it('Should include an array of auto-binding functions starting with "on" or "_"', () => {
        const protoChain = new ProtoChain(FakeIoNode2);
        chai.expect(protoChain.functions).to.be.eql(['onFunction2', '_function2', 'onFunction1', '_function1']);
      });
      it('Should bind the auto-binding functions to specified instance with `.bindFunctions(node)` function', () => {
        const protoChain = new ProtoChain(FakeIoNode2);
        const node = new FakeIoNode2();
        protoChain.bindFunctions(node as unknown as IoNode);
        chai.expect(node.function1.name).to.be.equal('function1');
        chai.expect(node.onFunction1.name).to.be.equal('bound onFunction1');
        chai.expect(node._function1.name).to.be.equal('bound _function1');
        chai.expect(node.function2.name).to.be.equal('function2');
        chai.expect(node.onFunction2.name).to.be.equal('bound onFunction2');
        chai.expect(node._function2.name).to.be.equal('bound _function2');
      });
      it('Should include all declared properties correctly', () => {
        const protoChain = new ProtoChain(FakeIoNode2);
        chai.expect(Object.keys(protoChain.properties)).to.be.eql(['prop1', 'prop2']);
        chai.expect(protoChain.properties).to.be.eql({
          prop1:{value: undefined, type: undefined, binding: undefined, notify:false, reflect:0, observe:true, readonly:false, strict:false, enumerable:true},
          prop2:{value: undefined, type: undefined, binding: undefined, notify:true, reflect:0, observe:false, readonly:false, strict:false, enumerable:true},
        });
      });
      it('Should include all declared listeners correctly', () => {
        const protoChain = new ProtoChain(FakeIoNode2);
        chai.expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4', 'listener2']);
        chai.expect(protoChain.listeners['listener1']).to.be.eql([['function1'], ['_function2']]);
        chai.expect(protoChain.listeners['listener2']).to.be.eql([['function2', {capture: true, passive: true}]]);
        chai.expect(protoChain.listeners['listener3']).to.be.eql([['_function1', {capture: true, passive: true}]]);
      });
      it('Should include all declared style strings correctly', () => {
        const protoChain = new ProtoChain(FakeIoNode3);
        chai.expect(protoChain.style).to.be.equal('a\nb\n');
      });
      it('Should include names of all observed object properties', () => {
        const protoChain = new ProtoChain(FakeIoNode2);
        chai.expect(protoChain.observedObjects).to.be.eql(['prop1']);
      });
    });
  }
}
