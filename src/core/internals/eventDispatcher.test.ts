import {IoNode, RegisterIoNode} from '../io-node.js';
import {EventDispatcher, ProtoListenerRecord} from './eventDispatcher.js';

class IoNode1 extends IoNode {
  handler1Count = 0;
  handler1Detail?: string;
  static get Listeners(): ProtoListenerRecord {
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
  static get Listeners(): ProtoListenerRecord {
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
      it('Should initialize with correct default values', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any) as any;
        chai.expect(eventDispatcher.__node).to.be.equal(node);
        chai.expect(typeof eventDispatcher.__protoListeners).to.be.equal('object');
        chai.expect(typeof eventDispatcher.__propListeners).to.be.equal('object');
        chai.expect(typeof eventDispatcher.__addedListeners).to.be.equal('object');
        chai.expect(eventDispatcher.__connected).to.be.equal(false);
      });
      it('Should include all listeners from protochain', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any) as any;
        chai.expect(JSON.stringify(eventDispatcher.__protoListeners)).to.be.equal('{"event1":[null],"event2":[null,{"capture":true}]}');
        chai.expect(eventDispatcher.__protoListeners.event1[0]).to.be.equal(node.handler1);
        chai.expect(eventDispatcher.__protoListeners.event2[0]).to.be.equal(node.handler2);
      });
      it('Should set property listeners correctly', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any) as any;
        const handler4 = () => {};
        eventDispatcher.setPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event3":[null],"event4":[null]}');
        chai.expect(eventDispatcher.__propListeners.event3[0]).to.be.equal(node.handler3);
        chai.expect(eventDispatcher.__propListeners.event4[0]).to.be.equal(handler4);
        eventDispatcher.setPropListeners({'on-event5': ['handler3'], 'on-event6': [handler4]});
        chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event5":[null],"event6":[null]}');
        chai.expect(eventDispatcher.__propListeners.event5[0]).to.be.equal(node.handler3);
        chai.expect(eventDispatcher.__propListeners.event6[0]).to.be.equal(handler4);
        eventDispatcher.setPropListeners({'on-event7': ['handler3', {capture: true}], 'on-event8': [handler4, {capture: true}]});
        chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event7":[null,{"capture":true}],"event8":[null,{"capture":true}]}');
        chai.expect(eventDispatcher.__propListeners.event7[0]).to.be.equal(node.handler3);
        chai.expect(eventDispatcher.__propListeners.event8[0]).to.be.equal(handler4);
        eventDispatcher.setPropListeners({});
        chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{}');
      });
      it('Should add/remove listeners correctly', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any) as any;
        const listener1 = () => {};
        const listener2 = () => {};
        eventDispatcher.addEventListener('event1', listener1);
        eventDispatcher.addEventListener('event1', listener2, {capture: true});
        chai.expect(JSON.stringify(eventDispatcher.__addedListeners)).to.be.equal('{"event1":[[null],[null,{"capture":true}]]}');
        chai.expect(eventDispatcher.__addedListeners.event1[0][0]).to.be.equal(listener1);
        chai.expect(eventDispatcher.__addedListeners.event1[1][0]).to.be.equal(listener2);
        eventDispatcher.removeEventListener('event1', listener1);
        chai.expect(JSON.stringify(eventDispatcher.__addedListeners)).to.be.equal('{"event1":[[null,{"capture":true}]]}');
        chai.expect(eventDispatcher.__addedListeners.event1[0][0]).to.be.equal(listener2);
        eventDispatcher.removeEventListener('event1');
        chai.expect(JSON.stringify(eventDispatcher.__addedListeners)).to.be.equal('{}');
      });
      it('Should dispatch events only when connected', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any) as any;
        let handler4Count = 0;
        const handler4 = () => {
          handler4Count++;
        };
        let handler5Count = 0;
        const handler5 = () => {
          handler5Count++;
        };
        eventDispatcher.setPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        eventDispatcher.addEventListener('event5', handler5);
        eventDispatcher.dispatchEvent('event1');
        eventDispatcher.dispatchEvent('event2');
        eventDispatcher.dispatchEvent('event3');
        eventDispatcher.dispatchEvent('event4');
        eventDispatcher.dispatchEvent('event5');
        chai.expect(node.handler1Count).to.be.equal(0);
        chai.expect(node.handler2Count).to.be.equal(0);
        chai.expect(node.handler3Count).to.be.equal(0);
        chai.expect(handler4Count).to.be.equal(0);
        chai.expect(handler5Count).to.be.equal(0);
        eventDispatcher.connect();
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
        eventDispatcher.disconnect();
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
      });
      it('Should dispatch events with correct event detail', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any).connect() as any;
        let handler4Detail: any;
        const handler4 = (event: CustomEvent) => {
          handler4Detail = event.detail;
        };
        let handler5Detail: any;
        const handler5 = (event: CustomEvent) => {
          handler5Detail = event.detail;
        };
        eventDispatcher.setPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
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
        const eventDispatcher = new EventDispatcher(element) as any;
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
        eventDispatcher.setPropListeners({'on-event3': 'handler3', 'on-event4': handler4});
        eventDispatcher.addEventListener('event5', handler5);
        element.dispatchEvent(new CustomEvent('event3', {detail: 'detail3'}));
        element.dispatchEvent(new CustomEvent('event4', {detail: 'detail4'}));
        element.dispatchEvent(new CustomEvent('event5', {detail: 'detail5'}));
        chai.expect(element.handler3Count).to.be.equal(0);
        chai.expect(handler4Count).to.be.equal(0);
        chai.expect(handler5Count).to.be.equal(0);
        eventDispatcher.connect();
        element.dispatchEvent(new CustomEvent('event3', {detail: 'detail3'}));
        element.dispatchEvent(new CustomEvent('event4', {detail: 'detail4'}));
        element.dispatchEvent(new CustomEvent('event5', {detail: 'detail5'}));
        chai.expect(element.handler3Count).to.be.equal(1);
        chai.expect(handler4Count).to.be.equal(1);
        chai.expect(handler5Count).to.be.equal(1);
        chai.expect(element.handler3Detail).to.be.equal('detail3');
        chai.expect(handler4Detail).to.be.equal('detail4');
        chai.expect(handler5Detail).to.be.equal('detail5');
        eventDispatcher.disconnect();
        element.dispatchEvent(new CustomEvent('event3', {detail: 'detail3'}));
        element.dispatchEvent(new CustomEvent('event4', {detail: 'detail4'}));
        element.dispatchEvent(new CustomEvent('event5', {detail: 'detail5'}));
        chai.expect(element.handler3Count).to.be.equal(1);
        chai.expect(handler4Count).to.be.equal(1);
        chai.expect(handler5Count).to.be.equal(1);
      });
      it('Should dispose correctly', () => {
        const node = new IoNode2();
        const eventDispatcher = new EventDispatcher(node as any) as any;
        eventDispatcher.dispose();
        chai.expect(eventDispatcher.__node).to.be.equal(undefined);
        chai.expect(eventDispatcher.__protoListeners).to.be.equal(undefined);
        chai.expect(eventDispatcher.__propListeners).to.be.equal(undefined);
        chai.expect(eventDispatcher.__addedListeners).to.be.equal(undefined);
        chai.expect(eventDispatcher.__connected).to.be.equal(false);
      });
    });
  }
}