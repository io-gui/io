import {html, IoElement} from "./core.js";
import "./elements.js";

import "../node_modules/chai/chai.js";
import "../node_modules/mocha/mocha.js";

import "./tests/boolean.test.js";
import "./tests/button.test.js";
import "./tests/label.test.js";
import "./tests/menu.test.js";
import "./tests/number.test.js";
import "./tests/object.test.js";
import "./tests/option.test.js";
import "./tests/slider.test.js";
import "./tests/string.test.js";

mocha.setup('bdd');

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
      ['io-boolean-test'],
      ['io-button-test'],
      ['io-label-test'],
      ['io-menu-test'],
      ['io-number-test'],
      ['io-object-test'],
      ['io-option-test'],
      ['io-slider-test'],
      ['io-string-test'],
      ['io-element', {id: 'element', 'on-something': this.update, 'on-something-else': 'update'}],
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
    this.run();
    mocha.checkLeaks();
    mocha.run();
  }
  run() {

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
        chai.expect(this.__bindings['string'].targets.indexOf(this.$.string_bound)).to.equal(0);
      });
      it('value-bound io-string stops listening when disconnected', () => {
        this.removeChild(this.$.string_bound);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(undefined);
        chai.expect(this.__bindings['string'].targets.indexOf(this.$.string_bound)).to.equal(-1);
      });
      it('value-bound io-string starts listening when reconnected', () => {
        this.appendChild(this.$.string_bound);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(this.__bindings['string'].updateSource);
        chai.expect(this.$.string_bound.__listeners['value-changed'][0]).to.equal(this.$.string_bound.__props.value.binding.updateSource);
        chai.expect(this.__bindings['string'].targets.indexOf(this.$.string_bound)).to.equal(0);
      });
    });

    describe('Check prop listeners', () => {
      it('io-element listens (function handler)', () => {
        chai.expect(this.$.element.__listeners['something'][0]).to.equal(this.update);
      });
      it('io-element listens (string handler)', () => {
        chai.expect(this.$.element.__listeners['something-else'][0]).to.equal(this.$.element.update);
      });
      it('io-element stops listening when disconnected', () => {
        this.removeChild(this.$.element);
        chai.expect(this.$.element.__listeners['something'][0]).to.equal(undefined);
        chai.expect(this.$.element.__listeners['something-else'][0]).to.equal(undefined);
      });
      it('io-element starts listening when reconnected', () => {
        this.appendChild(this.$.element);
        chai.expect(this.$.element.__listeners['something'][0]).to.equal(this.update);
        chai.expect(this.$.element.__listeners['something-else'][0]).to.equal(this.$.element.update);
      });
    });

    describe('Check elements for values', () => {
      it('io-string innerHTML', () => {
        chai.expect(this.$.string.innerHTML).to.equal('hello');
        chai.expect(this.$.string_bound.innerHTML).to.equal('hello');
      });
      it('io-number innerHTML', () => {
        chai.expect(this.$.number.innerHTML).to.equal('1337.000');
        chai.expect(this.$.number_bound.innerHTML).to.equal('1337.000');
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
        chai.expect(this.$.number_bound.innerHTML).to.equal('0.000');
      });
      it('io-boolean innerHTML', () => {
        this.boolean = false;
        chai.expect(this.$.boolean_bound.innerHTML).to.equal('false');
      });
    });

    // TODO: test style in property
    //
  }

}

IoTest.Register();
