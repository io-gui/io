import {Change, IoNode, RegisterIoNode, IoElement, RegisterIoElement} from '../iogui.js';

// TODO: COMPLETE TEST COVERAGE

@RegisterIoNode
class TestNode extends IoNode {
  static get Properties(): any {
    return {
      prop0: String,
      prop2: Infinity,
    };
  }
}

@RegisterIoElement
export class TestElement extends IoElement {
  static get Properties(): any {
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
  constructor(initProps: any) {
    super(initProps);
    this.template([['test-subelement', {id: 'subelement', prop0: this.bind('prop0')}]]);
    this.subnode = new TestNode({prop2: this.bind('prop0')});
  }
  changed() {
    this._changedCounter++;
  }
  prop1Changed(change: Change) {
    this._prop1ChangedCounter++;
    this._prop1ChangedChange = change;
  }
  onProp1ChangeAlt(event: CustomEvent) {
    this._prop1AltCounter++;
    this._prop1AltChangeEvent = event;
  }
  onProp1Change(event: CustomEvent) {
    this._prop1Counter++;
    this._prop1ChangeEvent = event;
  }
  onCustomEvent(event: CustomEvent) {
    this._customHandlerCounter++;
    this._customHandlerChangeEvent = event;
  }
}

@RegisterIoElement
export class TestSubelement extends IoElement {
  static get Properties(): any {
    return {
      prop0: 0,
    };
  }
}

export default class {
  _changedCounter: number;
  element: TestElement;
  constructor() {
    this._changedCounter = 0;
    this.element = new TestElement({'on-prop0-changed': this.changed.bind(this), 'on-prop1-changed': 'onProp1ChangeAlt', debug: true});
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  changed(event: CustomEvent) {
    if (event.target === this.element as unknown as HTMLElement) {
      this._changedCounter++;
    }
  }
  reset() {
    this.element.reset();
    this._changedCounter = 0;
  }
  run() {
    describe('IoElement', () => {
      describe('Registration', () => {
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
        });
        it('Should initialize property definitions correctly', () => {
          chai.expect(this.element.prop0).to.equal(-1);
          chai.expect(this.element.prop1).to.equal('default');
        });
      });
      describe('Construction', () => {
      });
      describe('Reactivity', () => {
        it('Should corectly invoke handler functions on change', () => {
          this.reset();
          this.element.prop0 = 1;
          this.element.prop1 = 'test';
          chai.expect(this.element._prop1AltCounter).to.equal(1);
          chai.expect(this.element._changedCounter).to.equal(2);
          chai.expect(this._changedCounter).to.equal(1);
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
          this.element.dispatchEvent('custom-event', {data: 'io'});
          chai.expect(this.element._customHandlerChangeEvent.detail.data).to.equal('io');
        });
      });
      describe('Binding', () => {
        it('Should update bound values correctly', () => {
          this.element.prop0 = Infinity;
          chai.expect(this.element.$.subelement.prop0).to.equal(Infinity);
          this.element.$.subelement.prop0 = 0;
          chai.expect(this.element.prop0).to.equal(0);
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
          this.element.subnode.prop2 = 2;
          chai.expect(this.element.prop0).to.equal(2);
        });
      });
    });
  }
}
