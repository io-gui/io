import {html, IoElement} from "./core.js";
import "./elements.js";

export class IoTest extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      number: 1337,
      string: "hello",
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      array: [1,2]
    };
  }
  constructor() {
    super();
    this.render([
      ['io-element', {id: 'element', listeners: {'on-something': this.update, 'on-something-else': 'update'}}],
      ['io-string', {id: 'string', value: this.string}],
      ['io-number', {id: 'number', value: this.number}],
      ['io-boolean', {id: 'boolean', value: this.boolean}],
      ['io-string', {id: 'string_bound', value: this.bind('string')}],
      ['io-number', {id: 'number_bound', value: this.bind('number')}],
      ['io-boolean', {id: 'boolean_bound', value: this.bind('boolean')}],
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    mocha.setup('bdd');
    this.runTests();
    mocha.checkLeaks();
    mocha.run();
  }
  runTests() {

    describe('Check default listeners', () => {
      it('io-boolean listens', () => {
        chai.expect(this.$.boolean.__listeners['mousedown'][0]).to.equal(this.$.boolean._onDown);
      });
      it('io-boolean stops listening when disconnected', () => {
        this.removeChild(this.$.boolean);
        chai.expect(this.$.boolean.__listeners['mousedown'][0]).to.equal(undefined);
      });
      it('io-boolean starts listening when reconnected', () => {
        this.appendChild(this.$.boolean);
        chai.expect(this.$.boolean.__listeners['mousedown'][0]).to.equal(this.$.boolean._onDown);
      });
    });

    describe('Check binding listeners', () => {
      it('value-bound io-string listens for value changed', () => {
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(this.__bindings['string'].updateSource);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(this.$.string_bound.__props.value.binding.updateSource);
      });
      it('value-bound io-string stops listening when disconnected', () => {
        this.removeChild(this.$.string_bound);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(undefined);
      });
      it('value-bound io-string starts listening when reconnected', () => {
        this.appendChild(this.$.string_bound);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(this.__bindings['string'].updateSource);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(this.$.string_bound.__props.value.binding.updateSource);
      });
    });

    describe('Check prop listeners', () => {
      it('io-element listens (function handler)', () => {
        chai.expect(this.$.element.__listeners['on-something'][0]).to.equal(this.update);
      });
      it('io-element listens (string handler)', () => {
        chai.expect(this.$.element.__listeners['on-something-else'][0]).to.equal(this.$.element.update);
      });
      it('io-element stops listening when disconnected', () => {
        this.removeChild(this.$.element);
        chai.expect(this.$.element.__listeners['on-something'][0]).to.equal(undefined);
        chai.expect(this.$.element.__listeners['on-something-else'][0]).to.equal(undefined);
      });
      it('io-element starts listening when reconnected', () => {
        this.appendChild(this.$.element);
        chai.expect(this.$.element.__listeners['on-something'][0]).to.equal(this.update);
        chai.expect(this.$.element.__listeners['on-something-else'][0]).to.equal(this.$.element.update);
      });
    });

    describe('Check elements for values', () => {
      it('io-string innerHTML', () => {
        chai.expect(this.$.string.innerHTML).to.equal('hello');
        chai.expect(this.$.string_bound.innerHTML).to.equal('hello');
      });
      it('io-number innerHTML', () => {
        chai.expect(this.$.number.innerHTML).to.equal('1337');
        chai.expect(this.$.number_bound.innerHTML).to.equal('1337');
      });
      it('io-boolean innerHTML', () => {
        chai.expect(this.$.boolean.innerHTML).to.equal('true');
        chai.expect(this.$.boolean_bound.innerHTML).to.equal('true');
      });
    });

    describe('Check elements for values when bound value changed', () => {
      it('io-string innerHTML', () => {
        this.string = 'world';
        chai.expect(this.$.string_bound.innerHTML).to.equal('world');
      });
      it('io-number innerHTML', () => {
        this.number = 0;
        chai.expect(this.$.number_bound.innerHTML).to.equal('0');
      });
      it('io-boolean innerHTML', () => {
        this.boolean = false;
        chai.expect(this.$.boolean_bound.innerHTML).to.equal('false');
      });
    });
  }

}

IoTest.Register();
