import {IoNode, RegisterIoNode, ListenersDeclaration, EventDispatcher} from '../../iogui.js';

const handlerFunction = () => {};

class IoNode1 extends IoNode {
  handler1Count = 0;
  handler1Detail?: string;
  static get Listeners(): ListenersDeclaration {
    return {
      'event1': 'handler1',
    };
  }
  handler1(event: CustomEvent) {
    this.handler1Count++;
    this.handler1Detail = event.detail;
  }
}
RegisterIoNode(IoNode1);

class IoNode2 extends IoNode1 {
  handler2Count = 0;
  handler3Count = 0;
  handler2Detail?: string;
  handler3Detail?: string;
  static get Listeners(): ListenersDeclaration {
    return {
      'event2': ['handler2', {capture: true}],
    };
  }
  handler2(event: CustomEvent) {
    this.handler2Count++;
    this.handler2Detail = event.detail;
  }
  handler3(event: CustomEvent) {
    this.handler3Count++;
    this.handler3Detail = event.detail;
  }
}
RegisterIoNode(IoNode2);

class IoNode3 extends IoNode2 {
  static get Listeners(): ListenersDeclaration {
    return {
      'event1': 'handler3',
      'event2': [handlerFunction, {passive: true}],
      'event3': handlerFunction
    };
  }
}
RegisterIoNode(IoNode3);

class TestDivEventDispatchElement extends HTMLElement {
  handler3Count = 0;
  handler3Detail?: string;
  handler3(event: CustomEvent) {
    this.handler3Count++;
    this.handler3Detail = event.detail;
  }
}
window.customElements.define('test-div-event-dispatch', TestDivEventDispatchElement);

export default class {
  run() {
    describe('EventDispatcher', () => {
      it('Should initialize with correct values', () => {
        const node = {} as IoNode;
        let eventDispatcher = new EventDispatcher(node);
        chai.expect(eventDispatcher.node).to.be.equal(node);
        chai.expect(eventDispatcher.protoListeners).to.be.eql({});
        chai.expect(eventDispatcher.propListeners).to.be.eql({});
        chai.expect(eventDispatcher.addedListeners).to.be.eql({});
        chai.expect(eventDispatcher.isEventTarget).to.be.eql(false);

        const element = document.createElement('div');
        eventDispatcher = new EventDispatcher(element);
        chai.expect(eventDispatcher.node).to.be.equal(element);
        chai.expect(eventDispatcher.protoListeners).to.be.eql({});
        chai.expect(eventDispatcher.propListeners).to.be.eql({});
        chai.expect(eventDispatcher.addedListeners).to.be.eql({});
        chai.expect(eventDispatcher.isEventTarget).to.be.equal(true);
      });
      it('Should initialize listeners from ProtoChain', () => {
        let node = new IoNode1();
        let eventDispatcher = new EventDispatcher(node);
        chai.expect(eventDispatcher.protoListeners).to.be.eql({
          event1:[[node.handler1]],
        });
        node = new IoNode2();
        eventDispatcher = new EventDispatcher(node);
        chai.expect(eventDispatcher.protoListeners).to.be.eql({
          event1:[[node.handler1]],
          event2:[[node.handler2, {capture:true}]]
        });
        node = new IoNode3();
        eventDispatcher = new EventDispatcher(node);
        chai.expect(eventDispatcher.protoListeners).to.be.eql({
          event1:[[node.handler3]],
          event2:[[handlerFunction, {passive: true}]],
          event3:[[handlerFunction]]
        });
      });
      it('Should set property listeners correctly', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node);
        const handler4 = () => {};
        const handler5 = () => {};
        eventDispatcher.applyPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        chai.expect(eventDispatcher.propListeners).to.be.eql({
          event3:[[node.handler3]], event4:[[handler4]]
        });
        eventDispatcher.applyPropListeners({'on-event5': ['handler3'], 'on-event6': [handler4]});
        chai.expect(eventDispatcher.propListeners).to.be.eql({
          event5:[[node.handler3]], event6:[[handler4]]
        });
        eventDispatcher.applyPropListeners({'on-event7': [node.handler3, {capture: true}], 'on-event8': [handler5, {capture: true}]});
        chai.expect(eventDispatcher.propListeners).to.be.eql({
          event7:[[node.handler3, {capture:true}]], event8:[[handler5, {capture:true}]]
        });
        eventDispatcher.applyPropListeners({});
        chai.expect(eventDispatcher.propListeners).to.be.eql({});
      });
      it('Should add/remove listeners correctly', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node);
        const listener1 = () => {};
        const listener2 = () => {};
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, {capture: true});
        chai.expect(eventDispatcher.addedListeners).to.be.eql({
          event1:[[listener1],[listener2, {capture:true}]]
        });
        eventDispatcher.removeEventListener('event1', listener1);
        chai.expect(eventDispatcher.addedListeners).to.be.eql({
          event1:[[listener2, {capture:true}]]
        });
        eventDispatcher.removeEventListener('event1');
        chai.expect(eventDispatcher.addedListeners).to.be.eql({});
      });
      it('Should dispatch added events', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node);
        let handler4Count = 0;
        const handler4 = () => {
          handler4Count++;
        };
        let handler5Count = 0;
        const handler5 = () => {
          handler5Count++;
        };
        eventDispatcher.applyPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        eventDispatcher.addEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1');
        eventDispatcher.dispatchEvent('event2');
        eventDispatcher.dispatchEvent('event3');
        eventDispatcher.dispatchEvent('event4');
        eventDispatcher.dispatchEvent('event5');
        chai.expect(node.handler1Count).to.be.equal(1);
        chai.expect(node.handler2Count).to.be.equal(1);
        chai.expect(node.handler3Count).to.be.equal(1);
        chai.expect(handler4Count).to.be.equal(1);
        chai.expect(handler5Count).to.be.equal(1);
        // Remove events
        eventDispatcher.applyPropListeners({'on-event4': handler4});
        eventDispatcher.removeEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1');
        eventDispatcher.dispatchEvent('event2');
        eventDispatcher.dispatchEvent('event3');
        eventDispatcher.dispatchEvent('event4');
        eventDispatcher.dispatchEvent('event5');
        chai.expect(node.handler1Count).to.be.equal(2);
        chai.expect(node.handler2Count).to.be.equal(2);
        chai.expect(node.handler3Count).to.be.equal(1);
        chai.expect(handler4Count).to.be.equal(2);
        chai.expect(handler5Count).to.be.equal(1);
      });
      it('Should dispatch events with correct event detail', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node);
        let handler4Detail: any;
        const handler4 = (event: CustomEvent) => {
          handler4Detail = event.detail;
        };
        let handler5Detail: any;
        const handler5 = (event: CustomEvent) => {
          handler5Detail = event.detail;
        };
        eventDispatcher.applyPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        eventDispatcher.addEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1', 'detail1');
        eventDispatcher.dispatchEvent('event2', 'detail2');
        eventDispatcher.dispatchEvent('event3', 'detail3');
        eventDispatcher.dispatchEvent('event4', 'detail4');
        eventDispatcher.dispatchEvent('event5', 'detail5');
        chai.expect(node.handler1Detail).to.be.equal('detail1');
        chai.expect(node.handler2Detail).to.be.equal('detail2');
        chai.expect(node.handler3Detail).to.be.equal('detail3');
        chai.expect(handler4Detail).to.be.equal('detail4');
        chai.expect(handler5Detail).to.be.equal('detail5');
      });
      it('Should add/remove/dispatch events on HTML elements', () => {
        const element = document.createElement('test-div-event-dispatch') as TestDivEventDispatchElement;
        const eventDispatcher = new EventDispatcher(element);
        let handler4Count = 0;
        let handler4Detail: any;
        const handler4 = (event: CustomEvent) => {
          handler4Count++;
          handler4Detail = event.detail;
        };
        let handler5Count = 0;
        let handler5Detail: any;
        const handler5 = (event: CustomEvent) => {
          handler5Count++;
          handler5Detail = event.detail;
        };
        eventDispatcher.applyPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        eventDispatcher.addEventListener('event5', handler5);
        element.dispatchEvent(new CustomEvent('event3', {detail: 'detail3'}));
        element.dispatchEvent(new CustomEvent('event4', {detail: 'detail4'}));
        element.dispatchEvent(new CustomEvent('event5', {detail: 'detail5'}));
        chai.expect(element.handler3Count).to.be.equal(1);
        chai.expect(handler4Count).to.be.equal(1);
        chai.expect(handler5Count).to.be.equal(1);
        chai.expect(element.handler3Detail).to.be.equal('detail3');
        chai.expect(handler4Detail).to.be.equal('detail4');
        chai.expect(handler5Detail).to.be.equal('detail5');
        // Remove event listeners
        eventDispatcher.applyPropListeners({});
        eventDispatcher.removeEventListener('event5', handler5);
        element.dispatchEvent(new CustomEvent('event3', {detail: 'detail3i'}));
        element.dispatchEvent(new CustomEvent('event4', {detail: 'detail4i'}));
        element.dispatchEvent(new CustomEvent('event5', {detail: 'detail5i'}));
        chai.expect(element.handler3Count).to.be.equal(1);
        chai.expect(handler4Count).to.be.equal(1);
        chai.expect(handler5Count).to.be.equal(1);
        chai.expect(element.handler3Detail).to.be.equal('detail3');
        chai.expect(handler4Detail).to.be.equal('detail4');
        chai.expect(handler5Detail).to.be.equal('detail5');
      });
      it('Should bubble events if specified', () => {
        const element = document.createElement('test-div-event-dispatch') as TestDivEventDispatchElement;
        const parentElement = document.createElement('test-div-event-dispatch') as TestDivEventDispatchElement;
        parentElement.appendChild(element);
        const eventDispatcher = new EventDispatcher(element);
        let eventCount = 0;
        parentElement.addEventListener('event', () => {
          eventCount++;
        });
        eventDispatcher.dispatchEvent('event', null, false);
        chai.expect(eventCount).to.be.equal(0);
        eventDispatcher.dispatchEvent('event', null, true);
        chai.expect(eventCount).to.be.equal(1);
        eventDispatcher.dispatchEvent('event');
        chai.expect(eventCount).to.be.equal(2);
      });
      it('Should emit event from specified target', () => {
        const element = document.createElement('div');
        const eventDispatcher = new EventDispatcher(element);

        const element2 = document.createElement('test-div-event-dispatch') as TestDivEventDispatchElement;
        const eventDispatcher2 = new EventDispatcher(element2);
        eventDispatcher2.applyPropListeners({'on-event3': 'handler3'});
        let path: any = null;
        let target: any = null;
        eventDispatcher2.addEventListener('event3', (event: CustomEvent) => {
          path = (event as any).path;
          target = (event as any).target;
        });

        eventDispatcher.dispatchEvent('event3', 'detail', false, element2);
        chai.expect(element2.handler3Detail).to.be.equal('detail');
        chai.expect(path).to.be.eql([element2]);
        chai.expect(target).to.be.eql(target);
      });
      it('Should dispose correctly', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node);
        eventDispatcher.dispose();
        chai.expect(eventDispatcher.node).to.be.equal(undefined);
        chai.expect(eventDispatcher.protoListeners).to.be.equal(undefined);
        chai.expect(eventDispatcher.propListeners).to.be.equal(undefined);
        chai.expect(eventDispatcher.addedListeners).to.be.equal(undefined);
      });
    });
  }
}