import { IoNode, RegisterIoNode } from '../components/io-node.js';
import { EventDispatcher } from './eventDispatcher.js';
class IoNode11 extends IoNode {
    static get Listeners() {
        return {
            'event1': 'handler1',
        };
    }
    handler1() { }
}
RegisterIoNode(IoNode11);
class IoNode2 extends IoNode11 {
    static get Listeners() {
        return {
            'event2': ['handler2', { capture: true }],
        };
    }
    handler2() { }
    handler3() { }
}
RegisterIoNode(IoNode2);
export default class {
    run() {
        describe('EventDispatcher', () => {
            it('Should initialize with correct default values', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher(node, node.__protoListeners);
                chai.expect(typeof eventDispatcher.__node).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__protoListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__propListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__connectedListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__disconnectedListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__listenerOptions).to.be.equal('object');
                chai.expect(eventDispatcher.__connected).to.be.equal(false);
            });
            it('Should include all listeners from protochain', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher(node, node.__protoListeners);
                chai.expect(JSON.stringify(eventDispatcher.__protoListeners)).to.be.equal('{"event1":["handler1"],"event2":["handler2",{"capture":true}]}');
            });
            it('Should set property listeners correctly', () => {
                const node = new IoNode2();
                const handler4 = () => { };
                const eventDispatcher = new EventDispatcher(node, node.__protoListeners);
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event3":[null],"event4":[null]}');
                chai.expect(eventDispatcher.__propListeners.event3[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__propListeners.event4[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event5': ['handler3'], 'on-event6': [handler4] });
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event5":[null],"event6":[null]}');
                chai.expect(eventDispatcher.__propListeners.event5[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__propListeners.event6[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event7': ['handler3', { capture: true }], 'on-event8': [handler4, { capture: true }] });
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event7":[null,{"capture":true}],"event8":[null,{"capture":true}]}');
                chai.expect(eventDispatcher.__propListeners.event7[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__propListeners.event8[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({});
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{}');
            });
            it('Should connect listeners when connected', () => {
                const node = new IoNode2();
                const handler4 = () => { };
                const eventDispatcher = new EventDispatcher(node, node.__protoListeners);
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{}');
                eventDispatcher.connect();
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{"event1":[null],"event2":[null],"event3":[null],"event4":[null]}');
                chai.expect(eventDispatcher.__connectedListeners.event1[0]).to.be.equal(node.handler1);
                chai.expect(eventDispatcher.__connectedListeners.event2[0]).to.be.equal(node.handler2);
                chai.expect(eventDispatcher.__connectedListeners.event3[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__connectedListeners.event4[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event5': ['handler3'], 'on-event6': [handler4] });
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{"event1":[null],"event2":[null],"event5":[null],"event6":[null]}');
                chai.expect(eventDispatcher.__connectedListeners.event1[0]).to.be.equal(node.handler1);
                chai.expect(eventDispatcher.__connectedListeners.event2[0]).to.be.equal(node.handler2);
                chai.expect(eventDispatcher.__connectedListeners.event5[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__connectedListeners.event6[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event7': ['handler3', { capture: true }], 'on-event8': [handler4, { capture: true }] });
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{"event1":[null],"event2":[null],"event7":[null],"event8":[null]}');
                chai.expect(eventDispatcher.__connectedListeners.event1[0]).to.be.equal(node.handler1);
                chai.expect(eventDispatcher.__connectedListeners.event2[0]).to.be.equal(node.handler2);
                chai.expect(eventDispatcher.__connectedListeners.event7[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__connectedListeners.event8[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({});
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{"event1":[null],"event2":[null]}');
                chai.expect(eventDispatcher.__connectedListeners.event1[0]).to.be.equal(node.handler1);
                chai.expect(eventDispatcher.__connectedListeners.event2[0]).to.be.equal(node.handler2);
            });
            it('Should disconnect listeners when disconnected', () => {
                const node = new IoNode2();
                const handler4 = () => { };
                const eventDispatcher = new EventDispatcher(node, node.__protoListeners).connect();
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{"event1":[null],"event2":[null],"event3":[null],"event4":[null]}');
                eventDispatcher.disconnect();
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{}');
                eventDispatcher.connect();
                eventDispatcher.setPropListeners({ 'on-event5': ['handler3'], 'on-event6': [handler4] });
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{"event1":[null],"event2":[null],"event5":[null],"event6":[null]}');
                eventDispatcher.disconnect();
                chai.expect(JSON.stringify(eventDispatcher.__connectedListeners)).to.be.equal('{}');
            });
        });
        it('Should store listener options in a WeakMap', () => {
            const node = new IoNode2();
            const options1 = { capture: true };
            const options2 = { capture: false };
            const eventDispatcher = new EventDispatcher(node, node.__protoListeners).connect();
            chai.expect(JSON.stringify(eventDispatcher.__listenerOptions.get(node.handler2))).to.be.equal('{"capture":true}');
            eventDispatcher.setPropListeners({ 'on-event3': ['handler3', options1] });
            chai.expect(eventDispatcher.__listenerOptions.get(node.handler3)).to.be.equal(options1);
            eventDispatcher.setPropListeners({ 'on-event3': ['handler3', options2] });
            chai.expect(eventDispatcher.__listenerOptions.get(node.handler3)).to.be.equal(options2);
        });
    }
}
//# sourceMappingURL=eventDispatcher.test.js.map