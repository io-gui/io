import { ProtoChain, IoNode, IoNodeMixin, Property, PropertyDefinitions, ListenerDefinitions, IoElement, Register, Binding } from '../../iogui.js';

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
        init: false
      },
      prop2: {}
    };
  }

  @Property({type: Object})
  declare prop2: Object;
}

@Register
class IoNode3 extends IoNode1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        init: true,
        reflect: true
      }
    };
  }

  @Property({init: true})
  declare prop1: any;

  @Property({value: 'foo', reflect: false})
  declare prop2: any;

  @Property({reflect: true})
  declare prop3: any;
}

@Register
class IoNode4 extends IoNode1 {
  @Property({init: true})
  declare prop1: any;

  @Property({})
  declare prop2: any;
}

class IoElement1 extends IoElement {}
class IoNode2 extends IoNodeMixin(Object3) {}

class MockIoNode1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        init: false
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
        type: Object,
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
      it('Should include all properties declared in `static get Properties()` return oject', () => {
        let protoChain = new ProtoChain(MockIoNode1);
        expect(Object.keys(protoChain.properties)).to.be.eql(['prop1']);
        expect(protoChain.properties).to.be.eql({
          prop1:{value: undefined, type: undefined, binding: undefined, reflect: undefined, init: false},
        });
        protoChain = new ProtoChain(MockIoNode2);
        expect(Object.keys(protoChain.properties)).to.be.eql(['prop1', 'prop2']);
        expect(protoChain.properties).to.be.eql({
          prop1:{value: undefined, type: Object, binding: undefined, reflect: undefined, init: false},
          prop2:{value: undefined, type: undefined, binding: undefined, reflect: undefined, init: undefined},
        });
      });
      it('Should include all properties declared in Property decorator', () => {
        let protoChain = new ProtoChain(IoNode1);
        expect(Object.keys(protoChain.properties)).to.be.eql(['lazy', 'prop2', 'prop1']);
        expect(protoChain.properties).to.be.eql({
          lazy:{value: false, type: Boolean, binding: undefined, reflect: true, init: undefined},
          prop1:{value: undefined, type: undefined, binding: undefined, reflect: undefined, init: false},
          prop2:{value: undefined, type: Object, binding: undefined, reflect: undefined, init: undefined},
        });
        protoChain = new ProtoChain(IoNode3);
        expect(Object.keys(protoChain.properties)).to.be.eql(['lazy', 'prop2', 'prop1', 'prop3']);
        expect(protoChain.properties).to.be.eql({
          lazy:{value: false, type: Boolean, binding: undefined, reflect: true, init: undefined},
          prop1:{value: undefined, type: undefined, binding: undefined, reflect: true, init: true},
          prop2:{value: 'foo', type: Object, binding: undefined, reflect: false, init: undefined},
          prop3:{value: undefined, type: undefined, binding: undefined, reflect: true, init: undefined},
        });
      });
      it('Should not override properties declared in Property decorator with inherited `static get Properties()` return oject', () => {
        const protoChain = new ProtoChain(IoNode4);
        expect(Object.keys(protoChain.properties)).to.be.eql(['lazy', 'prop2', 'prop1']);
        expect(protoChain.properties).to.be.eql({
          lazy:{value: false, type: Boolean, binding: undefined, reflect: true, init: undefined},
          prop1:{value: undefined, type: undefined, binding: undefined, reflect: undefined, init: true},
          prop2:{value: undefined, type: Object, binding: undefined, reflect: undefined, init: undefined},
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
      it('Should include an array of handler names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding', () => {
        let protoChain = new ProtoChain(IoNode1);
        expect(protoChain.handlers).to.be.eql([]);
        protoChain = new ProtoChain(MockIoNode1);
        expect(protoChain.handlers).to.be.eql(['onFunction1', '_onFunction1']);
        protoChain = new ProtoChain(MockIoNode2);
        expect(protoChain.handlers).to.be.eql(['onFunction2', '_onFunction2', 'onFunction1', '_onFunction1']);
      });
      it('Should bind auto-binding functions with `.autobindHandlers(node)` function', () => {
        const protoChain = new ProtoChain(MockIoNode2);
        const node = new MockIoNode2();
        protoChain.autobindHandlers(node as unknown as IoNode);
        expect(node.function1.name).to.be.equal('function1');
        expect(node.onFunction1.name).to.be.equal('bound onFunction1');
        expect(node._onFunction1.name).to.be.equal('bound _onFunction1');
        expect(node.function2.name).to.be.equal('function2');
        expect(node.onFunction2.name).to.be.equal('bound onFunction2');
        expect(node._onFunction2.name).to.be.equal('bound _onFunction2');
      });
      it('serializeProperties() should return a unique fingerprint of the properties object', () => {
        const protoChain = new ProtoChain(MockIoNode1);
        const node = new IoNode1();
        const element = new IoElement();
        const binding = new Binding(node, 'prop1');
        binding.addTarget(element, 'lazy');
        let hash = protoChain.serializeProperties({
          prop1: {
              value: node,
              type: Object,
              reflect: true,
              init: [0, 1, 2],
          }
        });
        expect(hash).to.be.equal('{"prop1":{"value":"IoNode1","type":"Object","reflect":true,"init":[0,1,2]}}');
        hash = protoChain.serializeProperties({
          prop1: {
              type: Object,
              binding: binding,
              reflect: true,
              init: [0, 1, 2],
          }
        });
        expect(hash).to.be.equal('{"prop1":{"type":"Object","reflect":true,"init":[0,1,2],"binding":{"node":"IoNode1","property":"prop1","targets":["IoElement"],"targetProperties":{"IoElement":["lazy"]}}}}');
      });
      it('Should include property names of mutation-observed object properties', () => {
        let protoChain = new ProtoChain(MockIoNode1);
        expect(protoChain.mutationObservedProperties).to.be.eql([]);
        protoChain = new ProtoChain(MockIoNode2);
        expect(protoChain.mutationObservedProperties).to.be.eql(['prop1']);
      });
    });
  }
}
