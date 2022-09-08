import { ProtoChain, IoNode, IoNodeMixin, IoElement } from '../../iogui.js';
class Array1 extends Array {
}
class Array2 extends Array1 {
}
class Array3 extends Array2 {
}
class Object1 {
}
class Object2 extends Object1 {
}
class Object3 extends Object2 {
}
class HTMLElement1 extends HTMLElement {
}
class HTMLElement2 extends HTMLElement1 {
}
class HTMLElement3 extends HTMLElement2 {
}
class IoNode1 extends IoNode {
}
class IoElement1 extends IoElement {
}
class IoNode2 extends IoNodeMixin(Object3) {
}
class FakeIoNode1 {
    static get Properties() {
        return {
            prop1: {
                notify: false
            }
        };
    }
    static get Listeners() {
        return {
            listener1: 'function1',
            listener2: '',
            listener3: ['_onFunction1', { capture: true }],
            listener4: () => { }
        };
    }
    static get Style() {
        return 'a';
    }
    function1() { }
    onFunction1() { }
    _onFunction1() { }
}
class FakeIoNode2 extends FakeIoNode1 {
    function2() { }
    onFunction2() { }
    _onFunction2() { }
    static get Properties() {
        return {
            prop1: {
                observe: true
            },
            prop2: {}
        };
    }
    static get Listeners() {
        return {
            listener1: '_onFunction2',
            listener2: ['function2', { capture: true, passive: true }],
            listener3: ['_onFunction1', { passive: true }]
        };
    }
    static get Style() {
        return 'b';
    }
}
class FakeIoNode3 extends FakeIoNode2 {
}
export default class {
    run() {
        describe('ProtoChain', () => {
            it('Should include an array of inherited class constructors', () => {
                let constructors = new ProtoChain(Array3).constructors;
                chai.expect(constructors).to.be.eql([Array3, Array2, Array1]);
                constructors = new ProtoChain(Object3).constructors;
                chai.expect(constructors).to.be.eql([Object3, Object2, Object1]);
                constructors = new ProtoChain(HTMLElement3).constructors;
                chai.expect(constructors).to.be.eql([HTMLElement3, HTMLElement2, HTMLElement1]);
                constructors = new ProtoChain(IoNode).constructors;
                chai.expect(constructors).to.be.eql([IoNode, IoNode.__proto__]);
                constructors = new ProtoChain(IoNode1).constructors;
                chai.expect(constructors).to.be.eql([IoNode1, IoNode, IoNode.__proto__]);
                constructors = new ProtoChain(IoElement1).constructors;
                chai.expect(constructors).to.be.eql([IoElement1, IoElement, IoElement.__proto__]);
                constructors = new ProtoChain(IoNode2).constructors;
                chai.expect(constructors).to.be.eql([IoNode2, IoNode2.__proto__, Object3, Object2, Object1]);
            });
            it('Should include an array of function names that start with "on" or "_on" for auto-binding', () => {
                let protoChain = new ProtoChain(IoNode1);
                chai.expect(protoChain.functions).to.be.eql([]);
                protoChain = new ProtoChain(FakeIoNode1);
                chai.expect(protoChain.functions).to.be.eql(['onFunction1', '_onFunction1']);
                protoChain = new ProtoChain(FakeIoNode2);
                chai.expect(protoChain.functions).to.be.eql(['onFunction2', '_onFunction2', 'onFunction1', '_onFunction1']);
            });
            it('Should bind all auto-binding functions from the `.functions` array with `.autobindFunctions(node)` function', () => {
                const protoChain = new ProtoChain(FakeIoNode2);
                const node = new FakeIoNode2();
                protoChain.autobindFunctions(node);
                chai.expect(node.function1.name).to.be.equal('function1');
                chai.expect(node.onFunction1.name).to.be.equal('bound onFunction1');
                chai.expect(node._onFunction1.name).to.be.equal('bound _onFunction1');
                chai.expect(node.function2.name).to.be.equal('function2');
                chai.expect(node.onFunction2.name).to.be.equal('bound onFunction2');
                chai.expect(node._onFunction2.name).to.be.equal('bound _onFunction2');
            });
            it('Should include all property definitions declared in `static get Properties()` return oject', () => {
                let protoChain = new ProtoChain(FakeIoNode1);
                chai.expect(Object.keys(protoChain.properties)).to.be.eql(['prop1']);
                chai.expect(protoChain.properties).to.be.eql({
                    prop1: { value: undefined, type: undefined, binding: undefined, notify: false, reflect: 0, observe: false },
                });
                protoChain = new ProtoChain(FakeIoNode2);
                chai.expect(Object.keys(protoChain.properties)).to.be.eql(['prop1', 'prop2']);
                chai.expect(protoChain.properties).to.be.eql({
                    prop1: { value: undefined, type: undefined, binding: undefined, notify: false, reflect: 0, observe: true },
                    prop2: { value: undefined, type: undefined, binding: undefined, notify: true, reflect: 0, observe: false },
                });
            });
            it('Should include all listner definitions declared in `static get Listeners()` return oject', () => {
                let protoChain = new ProtoChain(FakeIoNode1);
                chai.expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4']);
                chai.expect(protoChain.listeners['listener1']).to.be.eql([['function1']]);
                chai.expect(protoChain.listeners['listener3']).to.be.eql([['_onFunction1', { capture: true }]]);
                chai.expect(String(protoChain.listeners['listener4'])).to.be.eql(String([[() => { }]]));
                protoChain = new ProtoChain(FakeIoNode2);
                chai.expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4', 'listener2']);
                chai.expect(protoChain.listeners['listener1']).to.be.eql([['function1'], ['_onFunction2']]);
                chai.expect(protoChain.listeners['listener2']).to.be.eql([['function2', { capture: true, passive: true }]]);
                chai.expect(protoChain.listeners['listener3']).to.be.eql([['_onFunction1', { capture: true, passive: true }]]);
                chai.expect(String(protoChain.listeners['listener4'])).to.be.eql(String([[() => { }]]));
            });
            it('Should include all style strings declared in `static get Style()` return string', () => {
                let protoChain = new ProtoChain(FakeIoNode1);
                chai.expect(protoChain.style).to.be.equal('a\n');
                protoChain = new ProtoChain(FakeIoNode2);
                chai.expect(protoChain.style).to.be.equal('a\nb\n');
                protoChain = new ProtoChain(FakeIoNode3);
                chai.expect(protoChain.style).to.be.equal('a\nb\n');
            });
            it('Should include all property names of observed object properties', () => {
                let protoChain = new ProtoChain(FakeIoNode1);
                chai.expect(protoChain.observedObjectProperties).to.be.eql([]);
                protoChain = new ProtoChain(FakeIoNode2);
                chai.expect(protoChain.observedObjectProperties).to.be.eql(['prop1']);
            });
        });
    }
}
//# sourceMappingURL=protoChain.test.js.map