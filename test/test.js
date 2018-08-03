import {html, IoElement} from "../build/io.js";

import "../node_modules/chai/chai.js";
import "../node_modules/mocha/mocha.js";

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
    this.template([
      ['io-element', {id: 'element', 'on-something': this.changed, 'on-something-else': 'changed'}],
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.run();
    mocha.checkLeaks();
    mocha.run();
  }
  run() {
    describe('Check prop listeners', () => {
      it('io-element listens (function handler)', () => {
        chai.expect(this.$.element.__listeners['something'][0]).to.equal(this.changed);
      });
      it('io-element listens (string handler)', () => {
        chai.expect(this.$.element.__listeners['something-else'][0]).to.equal(this.$.element.changed);
      });
      it('io-element stops listening when disconnected', () => {
        this.removeChild(this.$.element);
        chai.expect(this.$.element.__listeners['something'][0]).to.equal(undefined);
        chai.expect(this.$.element.__listeners['something-else'][0]).to.equal(undefined);
      });
      it('io-element starts listening when reconnected', () => {
        this.appendChild(this.$.element);
        chai.expect(this.$.element.__listeners['something'][0]).to.equal(this.changed);
        chai.expect(this.$.element.__listeners['something-else'][0]).to.equal(this.$.element.changed);
      });
    });

    // TODO: test style in property
    //
  }

}

IoTest.Register();
