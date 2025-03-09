import { IoNode, Register, ListenerDefinitions, EventDispatcher, IoElement } from '../../iogui.js';
import { expect } from 'chai';

const handlerFunction = (event: CustomEvent) => {
  (event.target as unknown as MockIoNode1).eventStack.push(`handlerFunction ${event.detail}`);
};

@Register
class MockIoNode1 extends IoNode {
  eventStack: string[] = [];
  static get Listeners(): ListenerDefinitions {
    return {
      'event1': 'event1Handler',
    };
  }
  event1Handler(event: CustomEvent) {
    this.eventStack.push(`event1Handler ${event.detail}`);
  }
}

@Register
class MockIoNode2 extends MockIoNode1 {
  eventStack: string[] = [];
  static get Listeners(): ListenerDefinitions {
    return {
      'event2': ['event2Handler', {capture: true}],
    };
  }
  event2Handler(event: CustomEvent) {
    this.eventStack.push(`event2Handler ${event.detail}`);
  }
}

@Register
class MockIoNode3 extends MockIoNode2 {
  eventStack: string[] = [];
  static get Listeners(): ListenerDefinitions {
    return {
      'event1': 'event3Handler',
      'event2': [handlerFunction, {passive: true}],
      'event3': handlerFunction
    };
  }
  event3Handler(event: CustomEvent) {
    this.eventStack.push(`event3Handler ${event.detail}`);
  }
}

class TestDiv extends HTMLElement {
  eventStack: string[] = [];
  event1Handler(event: CustomEvent) {
    this.eventStack.push(`event1Handler ${event.detail}`);
  }
}
window.customElements.define('test-div', TestDiv);

export default class {
  run() {
    describe('eventDispatcher.test.ts', () => {
      it('Should initialize with correct values', () => {
        const node = new MockIoNode1();
        let eventDispatcher = new EventDispatcher(node);
        expect(eventDispatcher.node).to.be.equal(node);
        expect(eventDispatcher.protoListeners).to.be.eql({event1:[[node.event1Handler]]});
        expect(eventDispatcher.propListeners).to.be.eql({});
        expect(eventDispatcher.addedListeners).to.be.eql({});
        expect(eventDispatcher.isEventTarget).to.be.eql(false);
      });
      it('Should initialize listeners from ProtoChain', () => {
        const node1 = new MockIoNode1();
        let eventDispatcher = new EventDispatcher(node1);
        expect(eventDispatcher.protoListeners).to.be.eql({
          event1:[[node1.event1Handler]],
        });
        const node2 = new MockIoNode2();
        eventDispatcher = new EventDispatcher(node2);
        expect(eventDispatcher.protoListeners).to.be.eql({
          event1:[[node1.event1Handler]],
          event2:[[node2.event2Handler, {capture:true}]]
        });
        const node3 = new MockIoNode3();
        eventDispatcher = new EventDispatcher(node3);
        expect(eventDispatcher.protoListeners).to.be.eql({
          event1:[[node3.event3Handler]],
          event2:[[handlerFunction, {passive: true}]],
          event3:[[handlerFunction]]
        });
      });
      it('Should applyPropListeners() correctly', () => {
        const node3 = new MockIoNode3();
        let eventDispatcher = new EventDispatcher(node3);
        const handler4 = () => {};
        const handler5 = () => {};
        eventDispatcher.applyPropListeners({'@event3': 'event3Handler', '@event4': handler4});
        expect(eventDispatcher.propListeners).to.be.eql({
          event3:[[node3.event3Handler]], event4:[[handler4]]
        });
        eventDispatcher.applyPropListeners({'@event5': ['event3Handler'], '@event6': [handler4]});
        expect(eventDispatcher.propListeners).to.be.eql({
          event5:[[node3.event3Handler]], event6:[[handler4]]
        });
        eventDispatcher.applyPropListeners({'@event7': [node3.event3Handler, {capture: true}], '@event8': [handler5, {capture: true}]});
        expect(eventDispatcher.propListeners).to.be.eql({
          event7:[[node3.event3Handler, {capture:true}]], event8:[[handler5, {capture:true}]]
        });
        eventDispatcher.applyPropListeners({});
        expect(eventDispatcher.propListeners).to.be.eql({});
      });
      it('Should add/remove listeners correctly', () => {
        const node2 = new MockIoNode2();
        let eventDispatcher = new EventDispatcher(node2);
        const listener1 = () => {};
        const listener2 = () => {};
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, {capture: true});
        expect(eventDispatcher.addedListeners).to.be.eql({
          event1:[[listener1],[listener2, {capture:true}]]
        });
        eventDispatcher.removeEventListener('event1', listener1);
        expect(eventDispatcher.addedListeners).to.be.eql({
          event1:[[listener2, {capture:true}]]
        });
        eventDispatcher.removeEventListener('event1');
        expect(eventDispatcher.addedListeners).to.be.eql({});
      });
      it('Should not add listeners if already added', () => {
        const node2 = new MockIoNode2();
        let eventDispatcher = new EventDispatcher(node2);
        const listener1 = () => {};
        const listener2 = () => {};
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, {capture: true});
        expect(eventDispatcher.addedListeners).to.be.eql({
          event1:[[listener1],[listener2, {capture:true}]]
        });
      });
      it('Should remove correct listener', () => {
        const node2 = new MockIoNode2();
        let eventDispatcher = new EventDispatcher(node2);
        const listener1 = () => {};
        const listener2 = () => {};
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, {capture: true});
        eventDispatcher.removeEventListener('event1', listener2);
        expect(eventDispatcher.addedListeners).to.be.eql({
          event1:[[listener1]]
        });
        eventDispatcher.removeEventListener('event1', listener1);
        expect(eventDispatcher.addedListeners).to.be.eql({});
      });
      it('Should dispatch added events with correct payloads', () => {
        const node3 = new MockIoNode3();
        let eventDispatcher = new EventDispatcher(node3);
        const handler4 = (event: CustomEvent) => {
          (event.target as unknown as MockIoNode3).eventStack.push(`handler4 ${event.detail}`);
        };
        const handler5 = (event: CustomEvent) => {
          (event.target as unknown as MockIoNode3).eventStack.push(`handler5 ${event.detail}`);
        };
        eventDispatcher.applyPropListeners({'@event3': 'event3Handler', '@event4': handler4});
        eventDispatcher.addEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1', 1);
        eventDispatcher.dispatchEvent('event2', 2);
        eventDispatcher.dispatchEvent('event3', 3);
        eventDispatcher.dispatchEvent('event4', 4);
        eventDispatcher.dispatchEvent('event5', 5);
        expect(node3.eventStack).to.be.eql(['event3Handler 1', 'handlerFunction 2', 'handlerFunction 3', 'event3Handler 3', 'handler4 4', 'handler5 5']);

        node3.eventStack = [];
        eventDispatcher.applyPropListeners({'@event4': handler4});
        eventDispatcher.removeEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1', 1);
        eventDispatcher.dispatchEvent('event2', 2);
        eventDispatcher.dispatchEvent('event3', 3);
        eventDispatcher.dispatchEvent('event4', 4);
        eventDispatcher.dispatchEvent('event5', 5);
        expect(node3.eventStack).to.be.eql(['event3Handler 1', 'handlerFunction 2', 'handlerFunction 3', 'handler4 4']);
      });
      it('Should add/remove/dispatch events on HTML elements', () => {
        const element = document.createElement('test-div') as TestDiv;
        const eventDispatcher = new EventDispatcher(element);
        const handler2 = (event: CustomEvent) => {
          (event.target as unknown as TestDiv).eventStack.push(`handler2 ${event.detail}`);
        };
        const handler3 = (event: CustomEvent) => {
          (event.target as unknown as TestDiv).eventStack.push(`handler3 ${event.detail}`);
        };
        eventDispatcher.applyPropListeners({'@event1': 'event1Handler', '@event2': handler2});
        eventDispatcher.addEventListener('event3', handler3);
        element.dispatchEvent(new CustomEvent('event1', {detail: 1}));
        element.dispatchEvent(new CustomEvent('event2', {detail: 2}));
        element.dispatchEvent(new CustomEvent('event3', {detail: 3}));
        expect(element.eventStack).to.be.eql(['event1Handler 1', 'handler2 2', 'handler3 3']);

        element.eventStack = [];
        eventDispatcher.applyPropListeners({});
        eventDispatcher.removeEventListener('event3', handler3);
        element.dispatchEvent(new CustomEvent('event1', {detail: 1}));
        element.dispatchEvent(new CustomEvent('event2', {detail: 2}));
        element.dispatchEvent(new CustomEvent('event3', {detail: 3}));
        expect(element.eventStack).to.be.eql([]);
      });
      it('Should bubble events if specified', () => {
        const element = document.createElement('test-div') as TestDiv;
        element.id = 'element';
        const parentElement = document.createElement('test-div') as TestDiv;
        parentElement.id = 'parentElement';
        parentElement.appendChild(element);
        const eventDispatcher = new EventDispatcher(element);
        const parentEventDispatcher = new EventDispatcher(parentElement);
        const handler2 = function(this: TestDiv, event: CustomEvent) {
          this.eventStack.push(`handler2 ${event.detail}`);
        };
        eventDispatcher.applyPropListeners({'@event1': 'event1Handler'});
        eventDispatcher.addEventListener('event2', handler2.bind(element));
        parentEventDispatcher.applyPropListeners({'@event1': 'event1Handler'});
        parentEventDispatcher.addEventListener('event2', handler2.bind(parentElement));

        eventDispatcher.dispatchEvent('event1', 1, false);
        eventDispatcher.dispatchEvent('event2', 2, false);
        expect(element.eventStack).to.be.eql(['event1Handler 1', 'handler2 2']);
        expect(parentElement.eventStack).to.be.eql([]);

        element.eventStack = [];
        parentElement.eventStack = [];
        eventDispatcher.dispatchEvent('event1', 1, true);
        eventDispatcher.dispatchEvent('event2', 2, true);
        expect(element.eventStack).to.be.eql(['event1Handler 1', 'handler2 2']);
        expect(parentElement.eventStack).to.be.eql(['event1Handler 1', 'handler2 2']);
      });
      it('Should emit event from specified target', () => {
        const element = document.createElement('div');
        const eventDispatcher = new EventDispatcher(element);

        const element2 = document.createElement('test-div') as TestDiv;
        const eventDispatcher2 = new EventDispatcher(element2);
        eventDispatcher2.applyPropListeners({'@event1': 'event1Handler'});

        let path = null;
        let target = null;
        eventDispatcher2.addEventListener('event1', (event: CustomEvent) => {
          path = event.composedPath();
          target = event.target;
        });

        eventDispatcher.dispatchEvent('event1', 1, false, element2);
        expect(element2.eventStack).to.be.eql(['event1Handler 1']);
        expect(path).to.be.eql([element2]);
        expect(target).to.be.eql(element2);
      });
      it('Should dispose correctly', () => {
        const node = new MockIoNode1();
        const eventDispatcher = new EventDispatcher(node);
        eventDispatcher.dispose();
        expect(eventDispatcher.node).to.be.equal(undefined);
        expect(eventDispatcher.protoListeners).to.be.equal(undefined);
        expect(eventDispatcher.propListeners).to.be.equal(undefined);
        expect(eventDispatcher.addedListeners).to.be.equal(undefined);
      });
    });
  }
}