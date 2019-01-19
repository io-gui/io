import {IoElement} from "../../src/io.js";
import {IoNode} from "../../src/io.js";

import {TestSubelement} from "./element.js";

export class TestNode extends IoNode {
  static get properties() {
    return {
      number: 1337,
      string: {value: 'default', observer: 'customObserver'},
      _changedFired: 0,
      _stringChangedFired: 0,
      _customHandlerFired: 0,
      _customObserverFired: 0,
      _defaultHandlerEvent: null,
    };
  }
  static get listeners() {
    return {
      'number-changed': 'defaultHandler',
      'custom-event': 'defaultHandler',
    };
  }
  constructor(initProps) {
    super(initProps);
    this.subnode = new TestSubnode({number: this.bind('number')});
    // this.subnode.connect(); // TODO: is this not necessary?
    this.subelement = new TestSubelement({number: this.bind('number')});
    document.body.appendChild(this.subelement); // TODO: is this not necessary
  }
  // TODO: test arguments
  changed() {
    this._changedFired++;
  }
  stringChanged() {
    this._stringChangedFired++;
  }
  customHandler() {
    this._customHandlerFired++;
  }
  customObserver() {
    this._customObserverFired++;
  }
  defaultHandler(event) {
    this._defaultHandlerEvent = event;
  }
}
TestNode.Register();

export class TestSubnode extends IoNode {
  static get properties() {
    return {
      number: 0,
    };
  }
}
TestSubnode.Register();

export default class {
  constructor() {
    this._changedFired = 0;
    this.changed = this.changed.bind(this);
    this.node = new TestNode({'on-number-changed': this.changed, 'on-string-changed': 'customHandler'});
    this.node.connect(); // TODO: is this necessary or not?
  }
  changed(event) {
    if (event.target == this.node) {
      this._changedFired++;
    }
  }
  run() {
    describe('IoNode: Default values', () => {
      it('has default values', () => {
        chai.expect(this.node.number).to.equal(1337);
        chai.expect(this.node.string).to.equal('default');
      });
    });
    describe('IoNode: Listeners', () => {
      it('executes string handler', () => {
        this.node.string = '';
        this.node._customHandlerFired = 0;
        this.node.string = 'test';
        chai.expect(this.node._customHandlerFired).to.equal(1);
      });
      it('executes external function handler', () => {
        this.node.number = 0;
        this._changedFired = 0;
        this.node.number = 1;
        chai.expect(this._changedFired).to.equal(1);
      });
      it('disconnected doesen\'t execute string handler', () => {
        this.node.string = '';
        this.node._customHandlerFired = 0;
        this.node.disconnect();
        this.node.string = 'test';
        chai.expect(this.node._customHandlerFired).to.equal(0);
        this.node.connect();
        this.node.string = 'test2';
        chai.expect(this.node._customHandlerFired).to.equal(1);
      });
      it('disconnected doesen\'t execute function handler', () => {
        this.node.number = 0;
        this._changedFired = 0;
        this.node.disconnect();
        this.node.number = 1;
        chai.expect(this._changedFired).to.equal(0);
        this.node.connect();
        this.node.number = 2;
        chai.expect(this._changedFired).to.equal(1);
      });
    });
    describe('IoNode: Observers', () => {
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
    describe('IoNode: Binding', () => {
      it('node and subnode have bound values', () => {
        this.node.number = Infinity;
        chai.expect(this.node.subnode.number).to.equal(Infinity);
        this.node.subnode.number = 0;
        chai.expect(this.node.number).to.equal(0);
      });
      it('disconnecting node disconnects bindngs', () => {
        this.node.number = Infinity;
        chai.expect(this.node.subnode.number).to.equal(Infinity);
        this.node.subnode.disconnect();
        this.node.subnode.number = 0;
        chai.expect(this.node.number).to.equal(Infinity);
        this.node.subnode.connect();
        this.node.subnode.number = 2;
        chai.expect(this.node.number).to.equal(2);
      });
    });

    describe('IoNode: Binding to IoElement', () => {
      it('node and element have bound values', () => {
        this.node.number = Infinity;
        chai.expect(this.node.subelement.number).to.equal(Infinity);
        this.node.subelement.number = 0;
        chai.expect(this.node.number).to.equal(0);
      });
      it('disconnecting element disconnects bindngs', () => {
        this.node.number = Infinity;
        chai.expect(this.node.subelement.number).to.equal(Infinity);
        document.body.removeChild(this.node.subelement);
        this.node.number = 0;
        chai.expect(this.node.subelement.number).to.equal(Infinity);
        document.body.appendChild(this.node.subelement);
        this.node.subelement.number = 2;
        chai.expect(this.node.number).to.equal(2);
      });
    });

    describe('IoNode: Default listeners', () => {
      it('catches correct event payloads', () => {
        this.node.number = 1;
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
