var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { describe, it, expect } from 'vitest';
import { ChangeQueue, Node, Register } from '@io-gui/core';
let MockNode = class MockNode extends Node {
    eventStack = [];
    changeStack = [];
    prop1Changed(change) {
        this.changeStack.push(`prop1Changed ${change.property} ${change.value} ${change.oldValue}`);
    }
    prop2Changed(change) {
        this.changeStack.push(`prop2Changed ${change.property} ${change.value} ${change.oldValue}`);
    }
    dispatch(eventName, change) {
        if (change && change.property) {
            this.eventStack.push(`${eventName} ${change.property} ${change.value} ${change.oldValue}`);
        }
        else {
            this.eventStack.push(`${eventName}`);
        }
    }
    changed() {
        this.changeStack.push('changed');
    }
};
MockNode = __decorate([
    Register
], MockNode);
describe('ChangeQueue', () => {
    it('Should initialize with correct default values', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        expect(changeQueue.node).toBe(node);
        expect(JSON.stringify(changeQueue.changes)).toBe('[]');
        expect(changeQueue.changes.length).toBe(0);
        expect(changeQueue.dispatching).toBe(false);
    });
    it('Should keep track of changes correctly', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        changeQueue.queue('prop1', 2, 1);
        expect(JSON.stringify(changeQueue.changes)).toBe('[{"property":"prop1","value":2,"oldValue":0}]');
        changeQueue.dispatch();
        expect(JSON.stringify(changeQueue.changes)).toBe('[]');
    });
    it('Should dispatch change events with correct payloads', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        changeQueue.queue('prop1', 2, 1);
        changeQueue.dispatch();
        expect(JSON.stringify(node.eventStack)).toBe('["prop1-changed prop1 2 0","io-object-mutation"]');
    });
    it('Should invoke handler functions with correct payloads', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        changeQueue.queue('prop1', 2, 1);
        changeQueue.dispatch();
        expect(JSON.stringify(node.changeStack)).toBe('["prop1Changed prop1 2 0","changed"]');
    });
    it('Should handle changes in first-in, first-out (FIFO) order', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        changeQueue.queue('prop1', 3, 1);
        changeQueue.queue('prop2', 2, 0);
        changeQueue.dispatch();
        expect(JSON.stringify(node.changeStack)).toBe('["prop1Changed prop1 3 0","prop2Changed prop2 2 0","changed"]');
        expect(JSON.stringify(node.eventStack)).toBe('["prop1-changed prop1 3 0","prop2-changed prop2 2 0","io-object-mutation"]');
    });
    it('Setting new value to the same value as oldValue should not trigger change event', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 1, 0);
        expect(JSON.stringify(changeQueue.changes)).toBe('[{"property":"prop1","value":1,"oldValue":0}]');
        changeQueue.queue('prop1', 0, 1);
        expect(JSON.stringify(changeQueue.changes)).toBe('[]');
        changeQueue.dispatch();
        expect(JSON.stringify(node.changeStack)).toBe('[]');
        expect(JSON.stringify(node.eventStack)).toBe('[]');
    });
    it('Should skip dispatch if value is same as oldValue', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.queue('prop1', 0, 0);
        changeQueue.dispatch();
        expect(node.changeStack).toEqual([]);
        expect(node.eventStack).toEqual([]);
    });
    it('Should dispose correctly', () => {
        const node = new MockNode();
        const changeQueue = new ChangeQueue(node);
        changeQueue.dispose();
        expect(changeQueue.node).toBe(undefined);
        expect(changeQueue.changes).toBe(undefined);
    });
});
//# sourceMappingURL=ChangeQueue.test.js.map