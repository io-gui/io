var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { describe, it, expect, vi } from 'vitest';
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
let MockNodeWithThrowingHandler = class MockNodeWithThrowingHandler extends Node {
    changeStack = [];
    prop1Changed() {
        throw new Error('Intentional error in prop1Changed');
    }
    prop2Changed(change) {
        this.changeStack.push(`prop2Changed ${change.property} ${change.value} ${change.oldValue}`);
    }
    dispatch() { }
    changed() {
        this.changeStack.push('changed');
    }
};
MockNodeWithThrowingHandler = __decorate([
    Register
], MockNodeWithThrowingHandler);
let MockNodeWithThrowingChanged = class MockNodeWithThrowingChanged extends Node {
    changeStack = [];
    prop1Changed(change) {
        this.changeStack.push(`prop1Changed ${change.property} ${change.value} ${change.oldValue}`);
    }
    dispatch() { }
    changed() {
        throw new Error('Intentional error in changed');
    }
};
MockNodeWithThrowingChanged = __decorate([
    Register
], MockNodeWithThrowingChanged);
let MockNodeWithCascadingChanges = class MockNodeWithCascadingChanges extends Node {
    changeStack = [];
    prop1Changed(change) {
        this.changeStack.push(`prop1Changed ${change.value}`);
        // Cascading change: prop1 changing triggers prop2 change
        if (change.value === 1) {
            this._changeQueue.queue('prop2', 'cascaded', '');
        }
    }
    prop2Changed(change) {
        this.changeStack.push(`prop2Changed ${change.value}`);
        // Further cascade: prop2 changing triggers prop3 change
        if (change.value === 'cascaded') {
            this._changeQueue.queue('prop3', 'final', '');
        }
    }
    prop3Changed(change) {
        this.changeStack.push(`prop3Changed ${change.value}`);
    }
    dispatch() { }
    changed() {
        this.changeStack.push('changed');
    }
};
MockNodeWithCascadingChanges = __decorate([
    Register
], MockNodeWithCascadingChanges);
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
    it('Should continue processing when a property handler throws an error', () => {
        const node = new MockNodeWithThrowingHandler();
        const changeQueue = new ChangeQueue(node);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        changeQueue.queue('prop1', 1, 0);
        changeQueue.queue('prop2', 2, 0);
        changeQueue.dispatch();
        // prop1Changed throws, but prop2Changed and changed() should still run
        expect(node.changeStack).toEqual(['prop2Changed prop2 2 0', 'changed']);
        // dispatching flag should be reset
        expect(changeQueue.dispatching).toBe(false);
        // Error should have been logged
        expect(consoleSpy).toHaveBeenCalledWith('Error in MockNodeWithThrowingHandler.prop1Changed():', expect.any(Error));
        consoleSpy.mockRestore();
    });
    it('Should reset dispatching flag when changed() throws an error', () => {
        const node = new MockNodeWithThrowingChanged();
        const changeQueue = new ChangeQueue(node);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        changeQueue.queue('prop1', 1, 0);
        changeQueue.dispatch();
        // prop1Changed should have run
        expect(node.changeStack).toEqual(['prop1Changed prop1 1 0']);
        // dispatching flag should be reset even though changed() threw
        expect(changeQueue.dispatching).toBe(false);
        // Error should have been logged
        expect(consoleSpy).toHaveBeenCalledWith('Error in MockNodeWithThrowingChanged.changed():', expect.any(Error));
        consoleSpy.mockRestore();
    });
    it('Should allow subsequent dispatches after a handler error', () => {
        const node = new MockNodeWithThrowingHandler();
        const changeQueue = new ChangeQueue(node);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        // First dispatch with error
        changeQueue.queue('prop1', 1, 0);
        changeQueue.dispatch();
        // Reset for next test
        node.changeStack = [];
        // Second dispatch should work normally
        changeQueue.queue('prop2', 3, 0);
        changeQueue.dispatch();
        expect(node.changeStack).toEqual(['prop2Changed prop2 3 0', 'changed']);
        consoleSpy.mockRestore();
    });
    it('Should process cascading changes added during dispatch in the same cycle', () => {
        const node = new MockNodeWithCascadingChanges();
        // Use the node's own _changeQueue so cascading queue() calls go to the same queue
        const changeQueue = node._changeQueue;
        // Queue initial change
        changeQueue.queue('prop1', 1, 0);
        changeQueue.dispatch();
        // All cascading changes should have been processed in the same dispatch cycle:
        // 1. prop1Changed(1) → queues prop2
        // 2. prop2Changed('cascaded') → queues prop3
        // 3. prop3Changed('final')
        // 4. changed() called once at the end
        expect(node.changeStack).toEqual([
            'prop1Changed 1',
            'prop2Changed cascaded',
            'prop3Changed final',
            'changed'
        ]);
        // Queue should be empty after dispatch
        expect(changeQueue.changes.length).toBe(0);
    });
});
//# sourceMappingURL=ChangeQueue.test.js.map