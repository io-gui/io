import { IoNode, RegisterIoNode } from './io-node.js';
import { IoElement, RegisterIoElement } from './io-element.js';
class TestNode extends IoNode {
    static get Properties() {
        return {
            prop0: String,
            prop2: Infinity,
        };
    }
}
RegisterIoNode(TestNode);
export class TestElement extends IoElement {
    static get Properties() {
        return {
            prop0: -1,
            prop1: {
                value: 'default',
            },
            // Internal counters
            _changedCounter: 0,
            _prop1ChangedCounter: 0,
            _prop1AltCounter: 0,
            _prop1ChangeEvent: null,
            debug: true,
        };
    }
    static get Listeners() {
        return {
            'prop0-changed': 'onProp1Change',
            'custom-event': 'onCustomEvent',
        };
    }
    reset() {
        this.prop0 = -1;
        this.prop1 = 'default';
        this._changedCounter = 0;
        this._prop1ChangedCounter = 0;
        this._prop1AltCounter = 0;
        this._prop1Counter = 0;
        this._customHandlerCounter = 0;
        this._prop1AltChangeEvent = null;
        this._prop1ChangeEvent = null;
        this._customHandlerChangeEvent = null;
    }
    constructor(initProps) {
        super(initProps);
        this.template([['test-subelement', { id: 'subelement', prop0: this.bind('prop0') }]]);
        this.subnode = new TestNode({ prop2: this.bind('prop0') });
        this.subnode.connect(window);
    }
    // TODO: test arguments
    changed() {
        this._changedCounter++;
    }
    prop1Changed(change) {
        this._prop1ChangedCounter++;
        this._prop1ChangedChange = change;
    }
    onProp1ChangeAlt(event) {
        this._prop1AltCounter++;
        this._prop1AltChangeEvent = event;
    }
    onProp1Change(event) {
        this._prop1Counter++;
        this._prop1ChangeEvent = event;
    }
    onCustomEvent(event) {
        this._customHandlerCounter++;
        this._customHandlerChangeEvent = event;
    }
}
RegisterIoElement(TestElement);
export class TestSubelement extends IoElement {
    static get Properties() {
        return {
            prop0: 0,
        };
    }
}
RegisterIoElement(TestSubelement);
export default class {
    _changedCounter;
    element;
    constructor() {
        this._changedCounter = 0;
        this.element = new TestElement({ 'on-prop0-changed': this.changed.bind(this), 'on-prop1-changed': 'onProp1ChangeAlt', debug: true });
        document.body.appendChild(this.element);
    }
    changed(event) {
        if (event.target === this.element) {
            this._changedCounter++;
        }
    }
    reset() {
        this.element.reset();
        this._changedCounter = 0;
    }
    run() {
        describe('IoElement', () => {
            describe('Initialized element', () => {
                it('Should have correct property defaults', () => {
                    chai.expect(this.element.prop0).to.equal(-1);
                    chai.expect(this.element.prop1).to.equal('default');
                });
                it('Should have core API functions defined', () => {
                    // Default properties
                    chai.expect(this.element.id).to.be.equal('');
                    chai.expect(this.element.tabindex).to.be.equal('');
                    chai.expect(this.element.contenteditable).to.be.equal(false);
                    chai.expect(this.element.title).to.be.equal('');
                    chai.expect(this.element.$).to.be.a('object');
                    // Template functions
                    chai.expect(this.element.template).to.be.a('function');
                    chai.expect(this.element.traverse).to.be.a('function');
                    // TODO: fully test core API
                });
            });
            describe('Observed properties', () => {
                it('Should corectly invoke handler functions on change', () => {
                    this.reset();
                    this.element.prop0 = 1;
                    this.element.prop1 = 'test';
                    chai.expect(this.element._prop1AltCounter).to.equal(1);
                    chai.expect(this.element._changedCounter).to.equal(2);
                    chai.expect(this._changedCounter).to.equal(1);
                });
                it('Should not invoke handler functions when disconnected', () => {
                    this.reset();
                    document.body.removeChild(this.element);
                    this.element.prop0 = 2;
                    this.element.prop1 = 'test2';
                    chai.expect(this.element._prop1AltCounter).to.equal(0);
                    chai.expect(this.element._changedCounter).to.equal(0);
                    chai.expect(this._changedCounter).to.equal(0);
                    document.body.appendChild(this.element);
                });
                it('Should dispatch correct event payloads to handlers', () => {
                    this.reset();
                    this.element.prop0 = 1;
                    this.element.prop0 = 0;
                    chai.expect(this.element._prop1ChangeEvent.srcElement).to.equal(this.element);
                    chai.expect(this.element._prop1ChangeEvent.detail.value).to.equal(0);
                    this.element.$.subelement.prop0 = 2;
                    chai.expect(this.element._prop1ChangeEvent.detail.oldValue).to.equal(0);
                    chai.expect(this.element._prop1ChangeEvent.detail.value).to.equal(2);
                    this.element.dispatchEvent('custom-event', { data: 'io' });
                    chai.expect(this.element._customHandlerChangeEvent.detail.data).to.equal('io');
                });
            });
            // TODO: Cleanup and improve
            describe('Binding', () => {
                it('Should update bound values correctly', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.$.subelement.prop0).to.equal(Infinity);
                    this.element.$.subelement.prop0 = 0;
                    chai.expect(this.element.prop0).to.equal(0);
                });
                it('Should disconnect binding when element is disconnected', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.$.subelement.prop0).to.equal(Infinity);
                    this.element.removeChild(this.element.$.subelement);
                    this.element.$.subelement.prop0 = 0;
                    chai.expect(this.element.prop0).to.equal(Infinity);
                    this.element.appendChild(this.element.$.subelement);
                    this.element.$.subelement.prop0 = 2;
                    chai.expect(this.element.prop0).to.equal(2);
                });
                it('Should bind to Node node', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.subnode.prop2).to.equal(Infinity);
                    this.element.subnode.prop2 = 0;
                    chai.expect(this.element.prop0).to.equal(0);
                });
                it('Should disconnect binding when Node node is disconnected', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.subnode.prop2).to.equal(Infinity);
                    this.element.subnode.disconnect(window);
                    this.element.prop0 = 0;
                    chai.expect(this.element.subnode.prop2).to.equal(Infinity);
                    this.element.subnode.connect(window);
                    this.element.subnode.prop2 = 2;
                    chai.expect(this.element.prop0).to.equal(2);
                });
            });
            // TODO: test IoElement-specific API
        });
    }
}
//# sourceMappingURL=io-element.test.js.map