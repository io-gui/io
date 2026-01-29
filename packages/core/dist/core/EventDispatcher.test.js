var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { describe, it, expect } from 'vitest';
import { ReactiveNode, Register, EventDispatcher } from '@io-gui/core';
const handlerFunction = (event) => {
    event.target.eventStack.push(`handlerFunction ${event.detail}`);
};
let MockNode1 = class MockNode1 extends ReactiveNode {
    eventStack = [];
    static get Listeners() {
        return {
            'event1': 'event1Handler',
        };
    }
    event1Handler(event) {
        this.eventStack.push(`event1Handler ${event.detail}`);
    }
};
MockNode1 = __decorate([
    Register
], MockNode1);
let MockNode2 = class MockNode2 extends MockNode1 {
    eventStack = [];
    static get Listeners() {
        return {
            'event2': ['event2Handler', { capture: true }],
        };
    }
    event2Handler(event) {
        this.eventStack.push(`event2Handler ${event.detail}`);
    }
};
MockNode2 = __decorate([
    Register
], MockNode2);
let MockNode3 = class MockNode3 extends MockNode2 {
    eventStack = [];
    static get Listeners() {
        return {
            'event1': 'event3Handler',
            'event2': [handlerFunction, { passive: true }],
            'event3': handlerFunction
        };
    }
    event3Handler(event) {
        this.eventStack.push(`event3Handler ${event.detail}`);
    }
};
MockNode3 = __decorate([
    Register
], MockNode3);
class TestDiv extends HTMLElement {
    eventStack = [];
    event1Handler(event) {
        this.eventStack.push(`event1Handler ${event.detail}`);
    }
}
window.customElements.define('test-div', TestDiv);
describe('EventDispatcher', () => {
    it('Should initialize with correct values', () => {
        const node = new MockNode1();
        const eventDispatcher = new EventDispatcher(node);
        expect(eventDispatcher.node).toBe(node);
        expect(eventDispatcher.protoListeners).toEqual({ event1: [[node.event1Handler]] });
        expect(eventDispatcher.propListeners).toEqual({});
        expect(eventDispatcher.addedListeners).toEqual({});
        expect(eventDispatcher.nodeIsEventTarget).toEqual(false);
    });
    it('Should initialize listeners from ProtoChain', () => {
        const node1 = new MockNode1();
        let eventDispatcher = new EventDispatcher(node1);
        expect(eventDispatcher.protoListeners).toEqual({
            event1: [[node1.event1Handler]],
        });
        const node2 = new MockNode2();
        eventDispatcher = new EventDispatcher(node2);
        expect(eventDispatcher.protoListeners).toEqual({
            event1: [[node1.event1Handler]],
            event2: [[node2.event2Handler, { capture: true }]]
        });
        const node3 = new MockNode3();
        eventDispatcher = new EventDispatcher(node3);
        expect(eventDispatcher.protoListeners).toEqual({
            event1: [[node3.event3Handler]],
            event2: [[handlerFunction, { passive: true }]],
            event3: [[handlerFunction]]
        });
    });
    it('Should applyPropListeners() correctly', () => {
        const node3 = new MockNode3();
        const eventDispatcher = new EventDispatcher(node3);
        const handler4 = () => { };
        const handler5 = () => { };
        eventDispatcher.applyPropListeners({ '@event3': 'event3Handler', '@event4': handler4 });
        expect(eventDispatcher.propListeners).toEqual({
            event3: [[node3.event3Handler]], event4: [[handler4]]
        });
        eventDispatcher.applyPropListeners({ '@event5': ['event3Handler'], '@event6': [handler4] });
        expect(eventDispatcher.propListeners).toEqual({
            event5: [[node3.event3Handler]], event6: [[handler4]]
        });
        eventDispatcher.applyPropListeners({ '@event7': [node3.event3Handler, { capture: true }], '@event8': [handler5, { capture: true }] });
        expect(eventDispatcher.propListeners).toEqual({
            event7: [[node3.event3Handler, { capture: true }]], event8: [[handler5, { capture: true }]]
        });
        eventDispatcher.applyPropListeners({});
        expect(eventDispatcher.propListeners).toEqual({});
    });
    it('Should add/remove listeners correctly', () => {
        const node2 = new MockNode2();
        const eventDispatcher = new EventDispatcher(node2);
        const listener1 = () => { };
        const listener2 = () => { };
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, { capture: true });
        expect(eventDispatcher.addedListeners).toEqual({
            event1: [[listener1], [listener2, { capture: true }]]
        });
        eventDispatcher.removeEventListener('event1', listener1);
        expect(eventDispatcher.addedListeners).toEqual({
            event1: [[listener2, { capture: true }]]
        });
        eventDispatcher.removeEventListener('event1');
        expect(eventDispatcher.addedListeners).toEqual({});
    });
    it('Should not add listeners if already added', () => {
        const node2 = new MockNode2();
        const eventDispatcher = new EventDispatcher(node2);
        const listener1 = () => { };
        const listener2 = () => { };
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, { capture: true });
        expect(eventDispatcher.addedListeners).toEqual({
            event1: [[listener1], [listener2, { capture: true }]]
        });
    });
    it('Should remove correct listener', () => {
        const node2 = new MockNode2();
        const eventDispatcher = new EventDispatcher(node2);
        const listener1 = () => { };
        const listener2 = () => { };
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, { capture: true });
        eventDispatcher.removeEventListener('event1', listener2);
        expect(eventDispatcher.addedListeners).toEqual({
            event1: [[listener1]]
        });
        eventDispatcher.removeEventListener('event1', listener1);
        expect(eventDispatcher.addedListeners).toEqual({});
    });
    it('Should dispatch added events with correct payloads', () => {
        const node3 = new MockNode3();
        const eventDispatcher = new EventDispatcher(node3);
        const handler4 = (event) => {
            event.target.eventStack.push(`handler4 ${event.detail}`);
        };
        const handler5 = (event) => {
            event.target.eventStack.push(`handler5 ${event.detail}`);
        };
        eventDispatcher.applyPropListeners({ '@event3': 'event3Handler', '@event4': handler4 });
        eventDispatcher.addEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1', 1);
        eventDispatcher.dispatchEvent('event2', 2);
        eventDispatcher.dispatchEvent('event3', 3);
        eventDispatcher.dispatchEvent('event4', 4);
        eventDispatcher.dispatchEvent('event5', 5);
        expect(node3.eventStack).toEqual(['event3Handler 1', 'handlerFunction 2', 'handlerFunction 3', 'event3Handler 3', 'handler4 4', 'handler5 5']);
        node3.eventStack = [];
        eventDispatcher.applyPropListeners({ '@event4': handler4 });
        eventDispatcher.removeEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1', 1);
        eventDispatcher.dispatchEvent('event2', 2);
        eventDispatcher.dispatchEvent('event3', 3);
        eventDispatcher.dispatchEvent('event4', 4);
        eventDispatcher.dispatchEvent('event5', 5);
        expect(node3.eventStack).toEqual(['event3Handler 1', 'handlerFunction 2', 'handlerFunction 3', 'handler4 4']);
    });
    it('Should add/remove/dispatch events on HTML elements', () => {
        const element = document.createElement('test-div');
        const eventDispatcher = new EventDispatcher(element);
        const handler2 = (event) => {
            event.target.eventStack.push(`handler2 ${event.detail}`);
        };
        const handler3 = (event) => {
            event.target.eventStack.push(`handler3 ${event.detail}`);
        };
        eventDispatcher.applyPropListeners({ '@event1': 'event1Handler', '@event2': handler2 });
        eventDispatcher.addEventListener('event3', handler3);
        element.dispatchEvent(new CustomEvent('event1', { detail: 1 }));
        element.dispatchEvent(new CustomEvent('event2', { detail: 2 }));
        element.dispatchEvent(new CustomEvent('event3', { detail: 3 }));
        expect(element.eventStack).toEqual(['event1Handler 1', 'handler2 2', 'handler3 3']);
        element.eventStack = [];
        eventDispatcher.applyPropListeners({});
        eventDispatcher.removeEventListener('event3', handler3);
        element.dispatchEvent(new CustomEvent('event1', { detail: 1 }));
        element.dispatchEvent(new CustomEvent('event2', { detail: 2 }));
        element.dispatchEvent(new CustomEvent('event3', { detail: 3 }));
        expect(element.eventStack).toEqual([]);
    });
    it('Should bubble events if specified', () => {
        const element = document.createElement('test-div');
        element.id = 'element';
        const parentElement = document.createElement('test-div');
        parentElement.id = 'parentElement';
        parentElement.appendChild(element);
        const eventDispatcher = new EventDispatcher(element);
        const parentEventDispatcher = new EventDispatcher(parentElement);
        const handler2 = function (event) {
            this.eventStack.push(`handler2 ${event.detail}`);
        };
        eventDispatcher.applyPropListeners({ '@event1': 'event1Handler' });
        eventDispatcher.addEventListener('event2', handler2.bind(element));
        parentEventDispatcher.applyPropListeners({ '@event1': 'event1Handler' });
        parentEventDispatcher.addEventListener('event2', handler2.bind(parentElement));
        eventDispatcher.dispatchEvent('event1', 1, false);
        eventDispatcher.dispatchEvent('event2', 2, false);
        expect(element.eventStack).toEqual(['event1Handler 1', 'handler2 2']);
        expect(parentElement.eventStack).toEqual([]);
        element.eventStack = [];
        parentElement.eventStack = [];
        eventDispatcher.dispatchEvent('event1', 1, true);
        eventDispatcher.dispatchEvent('event2', 2, true);
        expect(element.eventStack).toEqual(['event1Handler 1', 'handler2 2']);
        expect(parentElement.eventStack).toEqual(['event1Handler 1', 'handler2 2']);
    });
    it('Should emit event from specified target', () => {
        const element = document.createElement('div');
        const eventDispatcher = new EventDispatcher(element);
        const element2 = document.createElement('test-div');
        const eventDispatcher2 = new EventDispatcher(element2);
        eventDispatcher2.applyPropListeners({ '@event1': 'event1Handler' });
        let path = null;
        let target = null;
        eventDispatcher2.addEventListener('event1', (event) => {
            path = event.composedPath();
            target = event.target;
        });
        eventDispatcher.dispatchEvent('event1', 1, false, element2);
        expect(element2.eventStack).toEqual(['event1Handler 1']);
        expect(path).toEqual([element2]);
        expect(target).toEqual(element2);
    });
    it('Should dispose correctly', () => {
        const node = new MockNode1();
        const eventDispatcher = new EventDispatcher(node);
        eventDispatcher.dispose();
        expect(eventDispatcher.node).toBe(undefined);
        expect(eventDispatcher.protoListeners).toBe(undefined);
        expect(eventDispatcher.propListeners).toBe(undefined);
        expect(eventDispatcher.addedListeners).toBe(undefined);
    });
    it('Should not dispatch bubbling events to disposed parents', () => {
        const parent = new MockNode1();
        const child = new MockNode1();
        child.addParent(parent);
        const parentHandler = (event) => {
            parent.eventStack.push(`parentHandler ${event.detail}`);
        };
        const childHandler = (event) => {
            child.eventStack.push(`childHandler ${event.detail}`);
        };
        parent._eventDispatcher.addEventListener('test-event', parentHandler);
        child._eventDispatcher.addEventListener('test-event', childHandler);
        // Dispatch bubbling event - parent should receive it
        child._eventDispatcher.dispatchEvent('test-event', 1, true);
        expect(child.eventStack).toEqual(['childHandler 1']);
        expect(parent.eventStack).toEqual(['parentHandler 1']);
        // Reset stacks
        child.eventStack = [];
        parent.eventStack = [];
        // Dispose the parent (simulates parent being removed from layout)
        parent.dispose();
        // Child still has parent in _parents array but parent is disposed
        // Dispatch bubbling event - should not error and should not reach disposed parent
        child._eventDispatcher.dispatchEvent('test-event', 2, true);
        expect(child.eventStack).toEqual(['childHandler 2']);
        // Parent should not have received event (disposed)
        expect(parent.eventStack).toEqual([]);
    });
    it('Should handle complex parent-child disposal scenarios', () => {
        // Simulates IoSplit scenario: grandparent > parent > child
        // Parent gets disposed when child moves to drawer
        const grandparent = new MockNode1();
        const parent = new MockNode1();
        const child = new MockNode1();
        parent.addParent(grandparent);
        child.addParent(parent);
        const stacks = { grandparent: [], parent: [], child: [] };
        grandparent._eventDispatcher.addEventListener('bubble-event', () => {
            stacks.grandparent.push('received');
        });
        parent._eventDispatcher.addEventListener('bubble-event', () => {
            stacks.parent.push('received');
        });
        child._eventDispatcher.addEventListener('bubble-event', () => {
            stacks.child.push('received');
        });
        // Normal bubbling works
        child._eventDispatcher.dispatchEvent('bubble-event', null, true);
        expect(stacks).toEqual({ grandparent: ['received'], parent: ['received'], child: ['received'] });
        // Reset
        stacks.grandparent = [];
        stacks.parent = [];
        stacks.child = [];
        // Dispose parent (middle of chain)
        parent.dispose();
        // Child dispatches - should reach child but skip disposed parent
        // Grandparent won't receive because parent (the link) is disposed
        child._eventDispatcher.dispatchEvent('bubble-event', null, true);
        expect(stacks.child).toEqual(['received']);
        expect(stacks.parent).toEqual([]); // Disposed
        expect(stacks.grandparent).toEqual([]); // Not reachable (parent link broken)
    });
});
//# sourceMappingURL=EventDispatcher.test.js.map