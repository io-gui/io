import { ProtoChain, IoNode, IoNodeMixin, Property, PropertyDefinitions, ListenerDefinitions, IoElement, Register } from '../../iogui.js';
import { expect } from 'chai';

class Array1 extends Array {}
class Array2 extends Array1 {}
class Array3 extends Array2 {}

class Object1 {}
class Object2 extends Object1 {}
class Object3 extends Object2 {}

class HTMLElement1 extends HTMLElement {}
class HTMLElement2 extends HTMLElement1 {}
class HTMLElement3 extends HTMLElement2 {}

@Register
class IoNode1 extends IoNode {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        reactive: false
      },
      prop2: {
        observe: true
      }
    };
  }

  @Property({observe: true, type: Object})
  declare prop2: Object;
}

@Register
class IoNode3 extends IoNode1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        reactive: true,
        reflect: true
      }
    };
  }

  @Property({reactive: true, observe: true, init: undefined})
  declare prop1: any;

  @Property({value: 'foo', reflect: false, observe: false})
  declare prop2: any;

  @Property({reflect: true})
  declare prop3: any;
}

@Register
class IoNode4 extends IoNode1 {
  @Property({reactive: true})
  declare prop1: any;

  @Property({observe: false})
  declare prop2: any;
}

class IoElement1 extends IoElement {}
class IoNode2 extends IoNodeMixin(Object3) {}

class MockIoNode1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        reactive: false
      }
    };
  }
  static get Listeners(): ListenerDefinitions {
    return {
      listener1: 'function1',
      listener2: '',
      listener3: ['_onFunction1', {capture: true}],
      listener4: () => {}
    };
  }
  static get Style() {
    return 'a';
  }
  function1() {}
  onFunction1() {}
  _onFunction1() {}
}

class MockIoNode2 extends MockIoNode1 {
  function2() {}
  onFunction2() {}
  _onFunction2() {}
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        observe: true
      },
      prop2: {}
    };
  }
  static get Listeners(): ListenerDefinitions {
    return {
      listener1: '_onFunction2',
      listener2: ['function2', {capture: true, passive: true}],
      listener3: ['_onFunction1', {passive: true}]
    };
  }
  static get Style() {
    return 'b';
  }
}
class MockIoNode3 extends MockIoNode2 {}

export default class {
  run() {
    describe('protoChain.test.ts', () => {
      it('Should include an array of inherited class constructors', () => {
        let constructors = new ProtoChain(Array3).constructors;
        expect(constructors).to.be.eql([Array3, Array2, Array1]);
        constructors = new ProtoChain(Object3).constructors;
        expect(constructors).to.be.eql([Object3, Object2, Object1]);
        constructors = new ProtoChain(HTMLElement3).constructors;
        expect(constructors).to.be.eql([HTMLElement3, HTMLElement2, HTMLElement1]);
        constructors = new ProtoChain(IoNode).constructors;
        expect(constructors).to.be.eql([IoNode, Object.getPrototypeOf(IoNode)]);
        constructors = new ProtoChain(IoNode1).constructors;
        expect(constructors).to.be.eql([IoNode1, IoNode, Object.getPrototypeOf(IoNode)]);
        constructors = new ProtoChain(IoElement1).constructors;
        expect(constructors).to.be.eql([IoElement1, IoElement, Object.getPrototypeOf(IoElement)]);
        constructors = new ProtoChain(IoNode2).constructors;
        expect(constructors).to.be.eql([IoNode2, Object.getPrototypeOf(IoNode2), Object3, Object2, Object1]);
      });
      it('Should include an array of function names that start with "on" or "_on" for auto-binding', () => {
        let protoChain = new ProtoChain(IoNode1);
        expect(protoChain.functions).to.be.eql([]);
        protoChain = new ProtoChain(MockIoNode1);
        expect(protoChain.functions).to.be.eql(['onFunction1', '_onFunction1']);
        protoChain = new ProtoChain(MockIoNode2);
        expect(protoChain.functions).to.be.eql(['onFunction2', '_onFunction2', 'onFunction1', '_onFunction1']);
      });
      it('Should bind auto-binding functions with `.autobindFunctions(node)` function', () => {
        const protoChain = new ProtoChain(MockIoNode2);
        const node = new MockIoNode2();
        protoChain.autobindFunctions(node as unknown as IoNode);
        expect(node.function1.name).to.be.equal('function1');
        expect(node.onFunction1.name).to.be.equal('bound onFunction1');
        expect(node._onFunction1.name).to.be.equal('bound _onFunction1');
        expect(node.function2.name).to.be.equal('function2');
        expect(node.onFunction2.name).to.be.equal('bound onFunction2');
        expect(node._onFunction2.name).to.be.equal('bound _onFunction2');
      });
      it('Should include all properties declared in `static get Properties()` return oject', () => {
        let protoChain = new ProtoChain(MockIoNode1);
        expect(Object.keys(protoChain.properties)).to.be.eql(['prop1']);
        expect(protoChain.properties).to.be.eql({
          prop1:{value: undefined, type: undefined, binding: undefined, reactive: false, reflect: undefined, observe: undefined, init: undefined},
        });
        protoChain = new ProtoChain(MockIoNode2);
        expect(Object.keys(protoChain.properties)).to.be.eql(['prop1', 'prop2']);
        expect(protoChain.properties).to.be.eql({
          prop1:{value: undefined, type: undefined, binding: undefined, reactive: false, reflect: undefined, observe: true, init: undefined},
          prop2:{value: undefined, type: undefined, binding: undefined, reactive: undefined, reflect: undefined, observe: undefined, init: undefined},
        });
      });
      it('Should include all properties declared in Property decorator', () => {
        let protoChain = new ProtoChain(IoNode1);
        expect(Object.keys(protoChain.properties)).to.be.eql(['lazy', 'prop2', 'prop1']);
        expect(protoChain.properties).to.be.eql({
          lazy:{value: false, type: Boolean, binding: undefined, reactive: false, reflect: true, observe: undefined, init: undefined},
          prop1:{value: undefined, type: undefined, binding: undefined, reactive: false, reflect: undefined, observe: undefined, init: undefined},
          prop2:{value: undefined, type: Object, binding: undefined, reactive: undefined, reflect: undefined, observe: true, init: undefined},
        });
        protoChain = new ProtoChain(IoNode3);
        expect(Object.keys(protoChain.properties)).to.be.eql(['lazy', 'prop2', 'prop1', 'prop3']);
        expect(protoChain.properties).to.be.eql({
          lazy:{value: false, type: Boolean, binding: undefined, reactive: false, reflect: true, observe: undefined, init: undefined},
          prop1:{value: undefined, type: undefined, binding: undefined, reactive: true, reflect: true, observe: true, init: undefined},
          prop2:{value: 'foo', type: String, binding: undefined, reactive: undefined, reflect: false, observe: false, init: undefined},
          prop3:{value: undefined, type: undefined, binding: undefined, reactive: undefined, reflect: true, observe: undefined, init: undefined},
        });
      });
      it('Should not override properties declared in Property decorator with inherited `static get Properties()` return oject', () => {
        const protoChain = new ProtoChain(IoNode4);
        expect(Object.keys(protoChain.properties)).to.be.eql(['lazy', 'prop2', 'prop1']);
        expect(protoChain.properties).to.be.eql({
          lazy:{value: false, type: Boolean, binding: undefined, reactive: false, reflect: true, observe: undefined, init: undefined},
          prop1:{value: undefined, type: undefined, binding: undefined, reactive: true, reflect: undefined, observe: undefined, init: undefined},
          prop2:{value: undefined, type: Object, binding: undefined, reactive: undefined, reflect: undefined, observe: false, init: undefined},
        });
      });
      it('Should include all listners declared in `static get Listeners()` return oject', () => {
        let protoChain = new ProtoChain(MockIoNode1);
        expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4']);
        expect(protoChain.listeners['listener1']).to.be.eql([['function1']]);
        expect(protoChain.listeners['listener3']).to.be.eql([['_onFunction1', {capture: true}]]);
        expect(String(protoChain.listeners['listener4'])).to.be.eql(String([[() => { }]]));
        protoChain = new ProtoChain(MockIoNode2);
        expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4', 'listener2']);
        expect(protoChain.listeners['listener1']).to.be.eql([['function1'], ['_onFunction2']]);
        expect(protoChain.listeners['listener2']).to.be.eql([['function2', {capture: true, passive: true}]]);
        expect(protoChain.listeners['listener3']).to.be.eql([['_onFunction1', {capture: true, passive: true}]]);
        expect(String(protoChain.listeners['listener4'])).to.be.eql(String([[() => { }]]));
      });
      it('Should include all style strings declared in `static get Style()` return string', () => {
        let protoChain = new ProtoChain(MockIoNode1);
        expect(protoChain.styles).to.be.equal('a\n');
        protoChain = new ProtoChain(MockIoNode2);
        expect(protoChain.styles).to.be.equal('a\nb\n');
        protoChain = new ProtoChain(MockIoNode3);
        expect(protoChain.styles).to.be.equal('a\nb\n');
      });
      it('Should include all property names of observed object properties', () => {
        let protoChain = new ProtoChain(MockIoNode1);
        expect(protoChain.observedObjectProperties).to.be.eql([]);
        protoChain = new ProtoChain(MockIoNode2);
        expect(protoChain.observedObjectProperties).to.be.eql(['prop1']);
      });
    });
  }
}
