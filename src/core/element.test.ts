import { Change, IoNode, RegisterIoNode, IoElement, RegisterIoElement } from '../iogui.js';

// TODO: COMPLETE TEST COVERAGE

const element = new IoElement();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

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
  _changedCounter = 0;
  element: TestElement;
  constructor() {
    this._changedCounter = 0;
    this.element = new TestElement({'on-prop0-changed': this.changed.bind(this), 'on-prop1-changed': 'onProp1ChangeAlt'});
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  changed(event: CustomEvent) {
    if (event.target === this.element as unknown as HTMLElement) {
      this._changedCounter++;
    }
  }
  run() {
    describe('IoElement', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(element.template).to.be.a('function');
          chai.expect(element.disposeDeep).to.be.a('function');
          chai.expect(element.traverse).to.be.a('function');
          chai.expect(element.setAttribute).to.be.a('function');
          chai.expect(element.focusTo).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          // Default properties
          chai.expect(element.$).to.be.a('object');
          chai.expect(element.tabindex).to.be.equal('');
          chai.expect(element.contenteditable).to.be.equal(false);
          chai.expect(element.class).to.be.equal('');
          chai.expect(element.role).to.be.equal('');
          chai.expect(element.label).to.be.equal('');
          chai.expect(element.name).to.be.equal('');
          chai.expect(element.title).to.be.equal('');
          chai.expect(element.id).to.be.equal('');
          chai.expect(element.hidden).to.be.equal(false);
          chai.expect(element.disabled).to.be.equal(false);

          chai.expect(element._properties.$).to.eql({
            binding: undefined,
            notify: false,
            observe: false,
            reflect: 'none',
            type: Object,
            value: {},
          });
          chai.expect(element._properties.tabindex).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.contenteditable).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
          chai.expect(element._properties.class).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.role).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.label).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.name).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.title).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.id).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.hidden).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
          chai.expect(element._properties.disabled).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('tabindex')).to.equal(null);
          chai.expect(element.getAttribute('contenteditable')).to.equal(null);
          chai.expect(element.getAttribute('class')).to.equal(null);
          chai.expect(element.getAttribute('role')).to.equal(null);
          chai.expect(element.getAttribute('label')).to.equal(null);
          chai.expect(element.getAttribute('name')).to.equal(null);
          chai.expect(element.getAttribute('title')).to.equal(null);
          chai.expect(element.getAttribute('id')).to.equal(null);
          chai.expect(element.getAttribute('hidden')).to.equal(null);
          chai.expect(element.getAttribute('disabled')).to.equal(null);
        });
      });
      describe('Reactivity', () => {
        it('has reactive attributes', () => {
          element.tabindex = '1';
          chai.expect(element.getAttribute('tabindex')).to.equal('1');
          element.tabindex = '';
          element.contenteditable = true;
          chai.expect(element.getAttribute('contenteditable')).to.equal('');
          element.contenteditable = false;
          element.class = 'foo';
          chai.expect(element.getAttribute('class')).to.equal('foo');
          element.class = '';
          element.role = 'button';
          chai.expect(element.getAttribute('role')).to.equal('button');
          element.role = '';
          element.label = 'text';
          chai.expect(element.getAttribute('label')).to.equal('text');
          element.label = '';
          element.name = 'name';
          chai.expect(element.getAttribute('name')).to.equal('name');
          element.name = '';
          element.title = 'title';
          chai.expect(element.getAttribute('title')).to.equal('title');
          element.title = '';
          element.id = 'one';
          chai.expect(element.getAttribute('id')).to.equal('one');
          element.id = '';
          element.hidden = true;
          chai.expect(element.getAttribute('hidden')).to.equal('');
          element.hidden = false;
          element.disabled = true;
          chai.expect(element.getAttribute('disabled')).to.equal('');
          element.disabled = false;
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          chai.expect(element.getAttribute('aria-label')).to.equal(null);
          element.label = 'label';
          chai.expect(element.getAttribute('aria-label')).to.equal('label');
          element.label = '';
          chai.expect(element.getAttribute('aria-label')).to.equal(null);
          element.disabled = true;
          chai.expect(element.getAttribute('aria-disabled')).to.equal('');
          element.disabled = false;
        });
      });
    });
    describe('IoElement API', () => {

      class TestIoElement1 extends IoElement {
        static get Properties(): any {
          return {
            prop0: -1,
            prop1: {
              value: 'default',
            },
          }
        }
      }
      RegisterIoElement(TestIoElement1);

      class TestIoElement2 extends IoElement {
        static get Properties(): any {
          return {
            prop0: {
              value: 0,
              notify: false
            },
            prop1: 0,
          };
        }
      }
      RegisterIoElement(TestIoElement2);

      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          const element1 = new TestIoElement1();
          const element2 = new TestIoElement2();

          chai.expect(element1.prop0).to.equal(-1);
          chai.expect(element1.prop1).to.equal('default');
          chai.expect(element2.prop0).to.equal(0);
          chai.expect(element2.prop1).to.equal(0);

          chai.expect(element1._properties.prop0).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: -1,
          });
          chai.expect(element1._properties.prop1).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: String,
            value: 'default',
          });

          chai.expect(element2._properties.prop0).to.eql({
            binding: undefined,
            notify: false,
            observe: false,
            reflect: 'none',
            type: Number,
            value: 0,
          });
          chai.expect(element2._properties.prop1).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: 0,
          });
        });
      });
      describe('Reactivity', () => {

        class TestIoElement3 extends TestIoElement1 {
          _changedCounter = 0;
          _prop1ChangedCounter = 0;
          _prop1AltCounter = 0;
          _prop1ChangeEvent: any = null;
          static get Listeners() {
            return {
              'prop0-changed': 'onProp1Change',
              'custom-event': 'onCustomEvent',
            };
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
        RegisterIoElement(TestIoElement3);

        let _changedCounter = 0;
        function onChange() {
          _changedCounter++;
        }

        it('Should corectly invoke handler functions on change', () => {
          const element = new TestIoElement3({'on-prop0-changed': onChange, 'on-prop1-changed': 'onProp1ChangeAlt'});
          element.prop0 = 1;
          element.prop1 = 'test';
          chai.expect(element._prop1AltCounter).to.equal(1);
          chai.expect(element._changedCounter).to.equal(2);
          chai.expect(_changedCounter).to.equal(1);
        });
        it('Should dispatch correct event payloads to handlers', () => {
          const element = new TestIoElement3();
          element.prop0 = 1;
          element.prop0 = 0;
          console.log(element._prop1ChangeEvent);
          // chai.expect(element._prop1ChangeEvent.srcElement).to.equal(element);
          chai.expect(element._prop1ChangeEvent.detail.value).to.equal(0);
          element.$.subelement.prop0 = 2;
          // chai.expect(element._prop1ChangeEvent.detail.oldValue).to.equal(0);
          // chai.expect(element._prop1ChangeEvent.detail.value).to.equal(2);
          // element.dispatchEvent('custom-event', {data: 'io'});
          // chai.expect(element._customHandlerChangeEvent.detail.data).to.equal('io');
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
