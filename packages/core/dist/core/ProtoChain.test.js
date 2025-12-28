var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { describe, it, expect } from 'vitest';
import { ProtoChain, Node, ReactiveProperty, IoElement, Register, Property } from '@io-gui/core';
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
// TODO: Fix init field testing. Based on old implementation.
let Node1 = class Node1 extends Node {
    static get ReactiveProperties() {
        return {
            prop1: {
                init: false
            },
            prop2: {}
        };
    }
    static get Properties() {
        return {
            sprop1: 'foo'
        };
    }
};
__decorate([
    ReactiveProperty({ type: Object, init: null })
], Node1.prototype, "prop2", void 0);
Node1 = __decorate([
    Register
], Node1);
let Node3 = class Node3 extends Node1 {
    static get ReactiveProperties() {
        return {
            prop1: {
                init: true,
                reflect: true
            }
        };
    }
};
__decorate([
    ReactiveProperty({ init: true })
], Node3.prototype, "prop1", void 0);
__decorate([
    ReactiveProperty({ value: 'foo', reflect: false })
], Node3.prototype, "prop2", void 0);
__decorate([
    ReactiveProperty({ reflect: true })
], Node3.prototype, "prop3", void 0);
__decorate([
    Property('bar')
], Node3.prototype, "sprop2", void 0);
Node3 = __decorate([
    Register
], Node3);
let Node4 = class Node4 extends Node1 {
};
__decorate([
    ReactiveProperty({ init: true })
], Node4.prototype, "prop1", void 0);
__decorate([
    ReactiveProperty({})
], Node4.prototype, "prop2", void 0);
__decorate([
    Property('baz')
], Node4.prototype, "sprop1", void 0);
Node4 = __decorate([
    Register
], Node4);
class IoElement1 extends IoElement {
}
class MockNode1 {
    static get ReactiveProperties() {
        return {
            prop1: {
                init: false
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
    changed() { }
    function1() { }
    onFunction1() { }
    _onFunction1() { }
}
class MockNode2 extends MockNode1 {
    function2() { }
    onFunction2() { }
    _onFunction2() { }
    static get ReactiveProperties() {
        return {
            prop1: {
                type: Object,
                init: null
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
class MockNode3 extends MockNode2 {
}
describe('ProtoChain', () => {
    it('Should include an array of inherited class constructors', () => {
        let constructors = new ProtoChain(Array3).constructors;
        expect(constructors).toEqual([Array3, Array2, Array1, Array]);
        constructors = new ProtoChain(Object3).constructors;
        expect(constructors).toEqual([Object3, Object2, Object1]);
        constructors = new ProtoChain(HTMLElement3).constructors;
        expect(constructors).toEqual([HTMLElement3, HTMLElement2, HTMLElement1]);
        constructors = new ProtoChain(Node).constructors;
        expect(constructors).toEqual([Node]);
        constructors = new ProtoChain(Node1).constructors;
        expect(constructors).toEqual([Node1, Node]);
        constructors = new ProtoChain(IoElement1).constructors;
        expect(constructors).toEqual([IoElement1, IoElement]);
    });
    it('Should include properties declared in `static get Properties()` return oject', () => {
        const protoChain = new ProtoChain(Node1);
        expect(Object.keys(protoChain.properties)).toEqual(['sprop1']);
        expect(protoChain.properties).toEqual({
            sprop1: 'foo'
        });
    });
    it('Should include reactive properties declared in `static get ReactiveProperties()` return oject', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(Object.keys(protoChain.reactiveProperties)).toEqual(['prop1']);
        expect(protoChain.reactiveProperties).toEqual({
            prop1: { init: false },
        });
        protoChain = new ProtoChain(MockNode2);
        expect(Object.keys(protoChain.reactiveProperties)).toEqual(['prop1', 'prop2']);
        expect(protoChain.reactiveProperties).toEqual({
            prop1: { type: Object, init: null },
            prop2: {},
        });
    });
    it('Should include properties declared in Property decorator', () => {
        const protoChain = new ProtoChain(Node3);
        expect(Object.keys(protoChain.properties)).toEqual(['sprop1', 'sprop2']);
        expect(protoChain.properties).toEqual({
            sprop1: 'foo',
            sprop2: 'bar'
        });
    });
    it('Should include reactive properties declared in ReactiveProperty decorator', () => {
        let protoChain = new ProtoChain(Node1);
        expect(Object.keys(protoChain.reactiveProperties)).toEqual(['reactivity', 'prop2', 'prop1']);
        expect(protoChain.reactiveProperties).toEqual({
            reactivity: { value: 'immediate', type: String },
            prop1: { init: false },
            prop2: { type: Object, init: null },
        });
        protoChain = new ProtoChain(Node3);
        expect(Object.keys(protoChain.reactiveProperties)).toEqual(['reactivity', 'prop2', 'prop1', 'prop3']);
        expect(protoChain.reactiveProperties).toEqual({
            reactivity: { value: 'immediate', type: String },
            prop1: { reflect: true, init: true },
            prop2: { value: 'foo', init: null, type: Object, reflect: false },
            prop3: { reflect: true },
        });
    });
    it('Should not override properties declared in Property decorator with inherited `static get Properties()` return oject', () => {
        const protoChain = new ProtoChain(Node4);
        expect(Object.keys(protoChain.properties)).toEqual(['sprop1']);
        expect(protoChain.properties).toEqual({
            sprop1: 'baz',
        });
    });
    it('Should not override reactive properties declared in ReactiveProperty decorator with inherited `static get ReactiveProperties()` return oject', () => {
        const protoChain = new ProtoChain(Node4);
        expect(Object.keys(protoChain.reactiveProperties)).toEqual(['reactivity', 'prop2', 'prop1']);
        expect(protoChain.reactiveProperties).toEqual({
            reactivity: { value: 'immediate', type: String },
            prop1: { init: true },
            prop2: { type: Object, init: null },
        });
    });
    it('Should include listners declared in `static get Listeners()` return oject', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(Object.keys(protoChain.listeners)).toEqual(['listener1', 'listener3', 'listener4']);
        expect(protoChain.listeners['listener1']).toEqual([['function1']]);
        expect(protoChain.listeners['listener3']).toEqual([['_onFunction1', { capture: true }]]);
        expect(String(protoChain.listeners['listener4'])).toBe('() => {\n      }');
        protoChain = new ProtoChain(MockNode2);
        expect(Object.keys(protoChain.listeners)).toEqual(['listener1', 'listener3', 'listener4', 'listener2']);
        expect(protoChain.listeners['listener1']).toEqual([['function1'], ['_onFunction2']]);
        expect(protoChain.listeners['listener2']).toEqual([['function2', { capture: true, passive: true }]]);
        expect(protoChain.listeners['listener3']).toEqual([['_onFunction1', { capture: true, passive: true }]]);
        expect(String(protoChain.listeners['listener4'])).toBe('() => {\n      }');
    });
    it('Should include style strings declared in `static get Style()` return string', () => {
        let protoChain = new ProtoChain(MockNode1);
        expect(protoChain.style).toBe('a');
        protoChain = new ProtoChain(MockNode2);
        expect(protoChain.style).toBe('a\nb');
        protoChain = new ProtoChain(MockNode3);
        expect(protoChain.style).toBe('a\nb');
    });
    it('Should include an array of handler names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding', () => {
        let protoChain = new ProtoChain(Node1);
        expect(protoChain.handlers).toEqual(['changed', 'onPropertyMutated']);
        protoChain = new ProtoChain(MockNode1);
        expect(protoChain.handlers).toEqual(['changed', 'onFunction1', '_onFunction1']);
        protoChain = new ProtoChain(MockNode2);
        expect(protoChain.handlers).toEqual(['changed', 'onFunction1', '_onFunction1', 'onFunction2', '_onFunction2']);
    });
    it('Should bind auto-binding functions with `.init(node)` function', () => {
        const protoChain = new ProtoChain(MockNode2);
        const node = new MockNode2();
        protoChain.init(node);
        expect(node.function1.name).toBe('function1');
        expect(node.onFunction1.name).toBe('bound onFunction1');
        expect(node._onFunction1.name).toBe('bound _onFunction1');
        expect(node.function2.name).toBe('function2');
        expect(node.onFunction2.name).toBe('bound onFunction2');
        expect(node._onFunction2.name).toBe('bound _onFunction2');
    });
});
//# sourceMappingURL=ProtoChain.test.js.map