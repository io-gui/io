import {IoLite} from "../../src/ioLite.js";

import "../../node_modules/chai/chai.js";

export class TestLite extends IoLite {
  constructor(initProps) {
    super(initProps);
    this.defineProperties({
      number: 1337,
      string: {value: 'default', observer: 'customObserver'},
      _changedFired: 0,
      _stringChangedFired: 0,
      _customObserverFired: 0,
      _defaultHandlerEvent: null,
    });
    this.addEventListener('number-changed', this.defaultHandler);
    this.addEventListener('custom-event', this.defaultHandler);
  }
  changed() {
    this._changedFired++;
  }
  stringChanged() {
    this._stringChangedFired++;
  }
  customObserver() {
    this._customObserverFired++;
  }
  defaultHandler(event) {
    this._defaultHandlerEvent = event;
  }
}

export default class {
  constructor() {
    this.node = new TestLite();
  }
  run() {
    describe('IoLite: Default values', () => {
      it('has default values', () => {
        chai.expect(this.node.number).to.equal(1337);
        chai.expect(this.node.string).to.equal('default');
      });
    });
    describe('IoLite: Observers', () => {
      it('executes default observers', () => {
        this.node.string = '';
        this.node._changedFired = 0;
        this.node._stringChangedFired = 0;
        this.node.string = 'test';
        chai.expect(this.node._changedFired).to.equal(1);
        chai.expect(this.node._stringChangedFired).to.equal(1);
      });
      it('executes custom observer', () => {
        this.node.string = '';
        this.node._customObserverFired = 0;
        this.node.string = 'test';
        chai.expect(this.node._customObserverFired).to.equal(1);
      });
    });
    describe('IoLite: Default listeners', () => {
      it('catches correct event payloads', () => {
        this.node.number = 0;
        chai.expect(this.node._defaultHandlerEvent.path[0]).to.equal(this.node);
        chai.expect(this.node._defaultHandlerEvent.detail.value).to.equal(0);
        // TODO: node event bubbling?
        // this.node.subnode.number = 2;
        // chai.expect(this.node._defaultHandlerEvent.path[0]).to.equal(this.node.subnode);
        // chai.expect(this.node._defaultHandlerEvent.detail.oldValue).to.equal(0);
        // chai.expect(this.node._defaultHandlerEvent.detail.value).to.equal(2);
        this.node.dispatchEvent('custom-event', {data: 'io'});
        chai.expect(this.node._defaultHandlerEvent.detail.data).to.equal('io');
      });
    });
  }
}
