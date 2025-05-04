import { ProtoChain, Node, NodeMixin, Property, PropertyDefinitions, ListenerDefinitions, IoElement, Register } from '../index';

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
class Node1 extends Node {
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
class Node3 extends Node1 {
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
class Node4 extends Node1 {
  @Property({init: true})
  declare prop1: any;

  @Property({})
  declare prop2: any;
}

class IoElement1 extends IoElement {}
class Node2 extends NodeMixin(Object3) {}

class MockNode1 {
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
  changed() {}
  function1() {}
  onFunction1() {}
  _onFunction1() {}
}

class MockNode2 extends MockNode1 {
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
class MockNode3 extends MockNode2 {}

class MockNode4 extends MockNode2 {
  static get Properties(): PropertyDefinitions {
    return {
      prop3: {
        type: Node,
      },
      prop4: {
        value: new Node(),
      }
    };
  }
}

export default class {
  run() {
    describe('ProtoChain', () => {
      it('Should include an array of inherited class constructors', () => {
        let constructors = new ProtoChain(Array3).constructors;
        expect(constructors).to.be.eql([Array3, Array2, Array1]);
        constructors = new ProtoChain(Object3).constructors;
        expect(constructors).to.be.eql([Object3, Object2, Object1]);
        constructors = new ProtoChain(HTMLElement3).constructors;
        expect(constructors).to.be.eql([HTMLElement3, HTMLElement2, HTMLElement1]);
        constructors = new ProtoChain(Node).constructors;
        expect(constructors).to.be.eql([Node, Object.getPrototypeOf(Node)]);
        constructors = new ProtoChain(Node1).constructors;
        expect(constructors).to.be.eql([Node1, Node, Object.getPrototypeOf(Node)]);
        constructors = new ProtoChain(IoElement1).constructors;
        expect(constructors).to.be.eql([IoElement1, IoElement, Object.getPrototypeOf(IoElement)]);
        constructors = new ProtoChain(Node2).constructors;
        expect(constructors).to.be.eql([Node2, Object.getPrototypeOf(Node2), Object3, Object2, Object1]);
      });
      it('Should include all properties declared in `static get Properties()` return oject', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(Object.keys(protoChain.properties)).to.be.eql(['prop1']);
        expect(protoChain.properties).to.be.eql({
          prop1:{init: false},
        });
        protoChain = new ProtoChain(MockNode2);
        expect(Object.keys(protoChain.properties)).to.be.eql(['prop1', 'prop2']);
        expect(protoChain.properties).to.be.eql({
          prop1:{type: Object, init: false},
          prop2:{},
        });
      });
      it('Should include all properties declared in Property decorator', () => {
        let protoChain = new ProtoChain(Node1);
        expect(Object.keys(protoChain.properties)).to.be.eql(['reactivity', 'prop2', 'prop1']);
        expect(protoChain.properties).to.be.eql({
          reactivity:{value: 'immediate', type: String},
          prop1:{init: false},
          prop2:{type: Object},
        });
        protoChain = new ProtoChain(Node3);
        expect(Object.keys(protoChain.properties)).to.be.eql(['reactivity', 'prop2', 'prop1', 'prop3']);
        expect(protoChain.properties).to.be.eql({
          reactivity:{value: 'immediate', type: String},
          prop1:{reflect: true, init: true},
          prop2:{value: 'foo', type: Object, reflect: false},
          prop3:{reflect: true},
        });
      });
      it('Should not override properties declared in Property decorator with inherited `static get Properties()` return oject', () => {
        const protoChain = new ProtoChain(Node4);
        expect(Object.keys(protoChain.properties)).to.be.eql(['reactivity', 'prop2', 'prop1']);
        expect(protoChain.properties).to.be.eql({
          reactivity:{value: 'immediate', type: String},
          prop1:{init: true},
          prop2:{type: Object},
        });
      });
      it('Should include all listners declared in `static get Listeners()` return oject', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4']);
        expect(protoChain.listeners['listener1']).to.be.eql([['function1']]);
        expect(protoChain.listeners['listener3']).to.be.eql([['_onFunction1', {capture: true}]]);
        expect(String(protoChain.listeners['listener4'])).to.be.eql(String([[() => { }]]));
        protoChain = new ProtoChain(MockNode2);
        expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4', 'listener2']);
        expect(protoChain.listeners['listener1']).to.be.eql([['function1'], ['_onFunction2']]);
        expect(protoChain.listeners['listener2']).to.be.eql([['function2', {capture: true, passive: true}]]);
        expect(protoChain.listeners['listener3']).to.be.eql([['_onFunction1', {capture: true, passive: true}]]);
        expect(String(protoChain.listeners['listener4'])).to.be.eql(String([[() => { }]]));
      });
      it('Should include all style strings declared in `static get Style()` return string', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(protoChain.styles).to.be.equal('a\n');
        protoChain = new ProtoChain(MockNode2);
        expect(protoChain.styles).to.be.equal('a\nb\n');
        protoChain = new ProtoChain(MockNode3);
        expect(protoChain.styles).to.be.equal('a\nb\n');
      });
      it('Should include an array of handler names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding', () => {
        let protoChain = new ProtoChain(Node1);
        expect(protoChain.handlers).to.be.eql(['changed', 'onPropertyMutated']);
        protoChain = new ProtoChain(MockNode1);
        expect(protoChain.handlers).to.be.eql(['changed', 'onFunction1', '_onFunction1']);
        protoChain = new ProtoChain(MockNode2);
        expect(protoChain.handlers).to.be.eql(['onFunction2', '_onFunction2', 'changed', 'onFunction1', '_onFunction1']);
      });
      it('Should bind auto-binding functions with `.autobindHandlers(node)` function', () => {
        const protoChain = new ProtoChain(MockNode2);
        const node = new MockNode2();
        protoChain.autobindHandlers(node as unknown as Node);
        expect(node.function1.name).to.be.equal('function1');
        expect(node.onFunction1.name).to.be.equal('bound onFunction1');
        expect(node._onFunction1.name).to.be.equal('bound _onFunction1');
        expect(node.function2.name).to.be.equal('function2');
        expect(node.onFunction2.name).to.be.equal('bound onFunction2');
        expect(node._onFunction2.name).to.be.equal('bound _onFunction2');
      });
      it('Should include property names of mutation-observed object properties', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(protoChain.observedObjectProperties).to.be.eql([]);
        protoChain = new ProtoChain(MockNode2);
        expect(protoChain.observedObjectProperties).to.be.eql(['prop1']);
        protoChain = new ProtoChain(MockNode4);
        expect(protoChain.observedObjectProperties).to.be.eql(['prop1']);
        expect(protoChain.observedNodeProperties).to.be.eql(['prop3', 'prop4']);
      });
    });
  }
}
