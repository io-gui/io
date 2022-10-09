import { Change, IoNode, RegisterIoNode, IoElement, RegisterIoElement } from '../iogui.js';

const element = new IoElement();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoElement', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(element.template).to.be.a('function');
          chai.expect(element.disposeDeep).to.be.a('function');
          chai.expect(element.traverse).to.be.a('function');
          chai.expect(element.setAttribute).to.be.a('function');
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

      class TestIoNode1 extends IoNode {
        static get Properties(): any {
          return {
            prop0: -1,
            prop1: {
              value: 'default',
            },
          };
        }
      }
      RegisterIoNode(TestIoNode1);

      class TestIoElement1 extends IoElement {
        static get Properties(): any {
          return {
            prop0: -1,
            prop1: {
              value: 'default',
            },
          };
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
          _prop0ChangedCounter = 0;
          _prop0ChangedChange?: Change;
          _prop1ChangedCounter = 0;
          _prop1ChangedChange?: Change;
          _prop1ChangeEventCounter = 0;
          _prop1ChangeEvent: any = null;
          _customEventCounter = 0;
          _customEvent: any = null;
          static get Listeners() {
            return {
              'prop1-changed': 'onProp1ChangeEvent',
              'custom-event': 'onCustomEvent',
            };
          }
          changed() {
            this._changedCounter++;
          }
          prop0Changed(change: Change) {
            this._prop0ChangedCounter++;
            this._prop0ChangedChange = change;
          }
          prop1Changed(change: Change) {
            this._prop1ChangedCounter++;
            this._prop1ChangedChange = change;
          }
          onProp1ChangeEvent(event: CustomEvent) {
            this._prop1ChangeEventCounter++;
            this._prop1ChangeEvent = event;
          }
          onCustomEvent(event: CustomEvent) {
            this._customEventCounter++;
            this._customEvent = event;
          }
        }
        RegisterIoElement(TestIoElement3);

        let _changedCounter = 0;

        function onChange() {
          _changedCounter++;
        }

        it('Should corectly invoke handler functions on change', () => {
          const element = new TestIoElement3({'on-prop0-changed': onChange, 'on-prop1-changed': 'onProp1ChangeAlt'});
          element.dispatchEvent('custom-event');
          element.prop0 = 1;
          element.prop1 = 'test';
          chai.expect(_changedCounter).to.equal(1);
          chai.expect(element._changedCounter).to.equal(2);
          chai.expect(element._prop0ChangedCounter).to.equal(1);
          chai.expect(element._prop1ChangedCounter).to.equal(1);
          chai.expect(element._prop1ChangeEventCounter).to.equal(1);
          chai.expect(element._customEventCounter).to.equal(1);
        });
        it('Should dispatch correct event payloads to handlers', () => {
          const element = new TestIoElement3();
          element.dispatchEvent('custom-event', {asd: ''});
          element.prop0 = 1;
          element.prop1 = 'foo';
          chai.expect(element._prop0ChangedChange).to.eql({oldValue: -1, property: 'prop0', value: 1});
          chai.expect(element._prop1ChangedChange).to.eql({oldValue: 'default', property: 'prop1', value: 'foo'});
          chai.expect(element._prop1ChangedChange).to.eql({oldValue: 'default', property: 'prop1', value: 'foo'});
          chai.expect(element._prop1ChangeEvent.detail).to.eql({property: 'prop1', value: 'foo', oldValue: 'default'});
        });
      });
      describe('Binding', () => {
        const element = new TestIoElement1();
        const node = new TestIoNode1();
        element.template([
          ['test-io-element1', {id: 'subelement', prop0: element.bind('prop0')}]
        ]);
        it('Should update bound values correctly', () => {
          element.prop0 = Infinity;
          console.log(element.$.subelement);
          chai.expect(element.$.subelement.prop0).to.equal(Infinity);
          element.$.subelement.prop0 = -2;
          chai.expect(element.prop0).to.equal(-2);
        });
        it('Should bind to Node node', () => {
          node.prop1 = element.bind('prop1');
          node.prop1 = 'a';
          chai.expect(element.prop1).to.equal('a');
          element.prop1 = 'b';
          chai.expect(element.prop1).to.equal('b');
        });
      });
    });
  }
}
