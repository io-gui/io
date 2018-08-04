import {html, IoElement, IoNode} from "../build/io.js";

import "../node_modules/chai/chai.js";
import "../node_modules/mocha/mocha.js";

mocha.setup('bdd');

export class TestElement extends IoElement {
  static get properties() {
    return {
      _changeCount: 0
    };
  }
  changed() {
    this._changeCount++;
  }
}
TestElement.Register();

export class TestNode extends IoNode {
  static get properties() {
    return {
      _changeCount: 0
    };
  }
  changed() {
    this._changeCount++;
  }
}
TestNode.Register();

export class IoTest extends TestElement {
  constructor() {
    super();
    this.template([['test-element', {id: 'element', 'on-function': this.changed, 'on-string': 'changed'}]]);
    this.appendChild(this.element = new TestElement({'on-function': this.changed, 'on-string': 'changed'}));

    this.node = new TestNode({'on-function': this.changed, 'on-string': 'changed'});
    this.node.connect();
  }
  connectedCallback() {
    super.connectedCallback();
    this.run();
    mocha.checkLeaks();
    mocha.run();
  }
  run() {

    describe('IoElement: Check listeners from constructor', () => {
      it('listens function handler', () => {
        chai.expect(this.element.__listeners['function'][0]).to.equal(this.changed);
      });
      it('listens string handler', () => {
        chai.expect(this.element.__listeners['string'][0]).to.equal(this.element.changed);
      });
      it('calls handler when event fires', () => {
        this._changeCount = 1;
        this.element._changeCount = 1;
        this.$.element._changeCount = 1;
        this.element.dispatchEvent('string');
        chai.expect(this.element._changeCount).to.equal(2);
        this.element.dispatchEvent('function');
        chai.expect(this._changeCount).to.equal(2);
        this.$.element.dispatchEvent('string');
        chai.expect(this.$.element._changeCount).to.equal(2);
        this.$.element.dispatchEvent('function');
        chai.expect(this._changeCount).to.equal(3);
      });
      it('stops listening when disconnected', () => {
        this.removeChild(this.element);
        chai.expect(this.element.__listeners['function'][0]).to.equal(undefined);
        chai.expect(this.element.__listeners['string'][0]).to.equal(undefined);
        // TODO: redundant?
        this._changeCount = 1;
        this.element._changeCount = 1;
        this.element.dispatchEvent('string');
        chai.expect(this.element._changeCount).to.equal(1);
        this.element.dispatchEvent('function');
        chai.expect(this._changeCount).to.equal(1);

      });
      it('starts listening when reconnected', () => {
        this.appendChild(this.element);
        chai.expect(this.element.__listeners['function'][0]).to.equal(this.changed);
        chai.expect(this.element.__listeners['string'][0]).to.equal(this.element.changed);
        // TODO: redundant?
        this._changeCount = 1;
        this.element._changeCount = 1;
        this.element.dispatchEvent('string');
        chai.expect(this.element._changeCount).to.equal(2);
        this.element.dispatchEvent('function');
        chai.expect(this._changeCount).to.equal(2);
      });
    });

    describe('IoElement: Check listeners from template', () => {
      it('listens function handler', () => {
        chai.expect(this.$.element.__listeners['function'][0]).to.equal(this.changed);
      });
      it('listens string handler', () => {
        chai.expect(this.$.element.__listeners['string'][0]).to.equal(this.$.element.changed);
      });
      it('stops listening when disconnected', () => {
        this.removeChild(this.$.element);
        chai.expect(this.$.element.__listeners['function'][0]).to.equal(undefined);
        chai.expect(this.$.element.__listeners['string'][0]).to.equal(undefined);
      });
      it('starts listening when reconnected', () => {
        this.appendChild(this.$.element);
        chai.expect(this.$.element.__listeners['function'][0]).to.equal(this.changed);
        chai.expect(this.$.element.__listeners['string'][0]).to.equal(this.$.element.changed);
      });
      it('calls handler when event fires', () => {
        this._changeCount = 1;
        this.$.element._changeCount = 1;
        this.$.element.dispatchEvent('string');
        chai.expect(this.$.element._changeCount).to.equal(2);
        this.$.element.dispatchEvent('function');
        chai.expect(this._changeCount).to.equal(2);
      });
    });

    describe('IoNode: Check listeners', () => {
      it('listens function handler', () => {
        chai.expect(this.node.__listeners['function'][0]).to.equal(this.changed);
      });
      it('listens string handler', () => {
        chai.expect(this.node.__listeners['string'][0]).to.equal(this.node.changed);
      });
      it('stops listening when disconnected', () => {
        this.node.disconnect();
        chai.expect(this.node.__listeners['function'][0]).to.equal(undefined);
        chai.expect(this.node.__listeners['string'][0]).to.equal(undefined);
      });
      it('starts listening when reconnected', () => {
        this.node.connect();
        chai.expect(this.node.__listeners['function'][0]).to.equal(this.changed);
        chai.expect(this.node.__listeners['string'][0]).to.equal(this.node.changed);
      });
    });

    // TODO: test style in property
  }
}

IoTest.Register();
