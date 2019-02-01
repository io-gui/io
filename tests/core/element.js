import {IoElement, IoCore} from "../../src/io.js";

// import {TestSubnode} from "./node.js";

export class TestElement extends IoElement {
  static get properties() {
    return {
      number: 1337,
      string: {value: 'default', observer: 'customObserver'},
      _changedFired: 0,
      _stringChangedFired: 0,
      _customHandlerFired: 0,
      _customObserverFired: 0,
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
    this.template([['test-subelement', {id: 'subelement', number: this.bind('number')}]]);
    this.subnode = new TestSubnode({number: this.bind('number')});
    // this.subnode.connect(); // TODO: is this not necessary?
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
TestElement.Register();

export class TestSubelement extends IoElement {
  static get properties() {
    return {
      number: 0,
    };
  }
}
TestSubelement.Register();

export default class {
  constructor() {
    this._changedFired = 0;
    this.changed = this.changed.bind(this);
    this.element = new TestElement({'on-number-changed': this.changed, 'on-string-changed': 'customHandler'});
    document.body.appendChild(this.element);
  }
  changed(event) {
    if (event.target == this.element) {
      this._changedFired++;
    }
  }
  run() {
    describe('IoElement: Default values', () => {
      it('has default values', () => {
        chai.expect(this.element.number).to.equal(1337);
        chai.expect(this.element.string).to.equal('default');
      });
    });
    describe('IoElement: Listeners', () => {
      it('executes string handler', () => {
        this.element.string = '';
        this.element._customHandlerFired = 0;
        this.element.string = 'test';
        chai.expect(this.element._customHandlerFired).to.equal(1);
      });
      it('executes external function handler', () => {
        this.element.number = 0;
        this._changedFired = 0;
        this.element.number = 1;
        chai.expect(this._changedFired).to.equal(1);
      });
      it('disconnected doesen\'t execute string handler', () => {
        this.element.string = '';
        this.element._customHandlerFired = 0;
        document.body.removeChild(this.element);
        this.element.string = 'test';
        chai.expect(this.element._customHandlerFired).to.equal(0);
        document.body.appendChild(this.element);
        this.element.string = 'test2';
        chai.expect(this.element._customHandlerFired).to.equal(1);
      });
      it('disconnected doesen\'t execute function handler', () => {
        this.element.number = 0;
        this._changedFired = 0;
        document.body.removeChild(this.element);
        this.element.number = 1;
        chai.expect(this._changedFired).to.equal(0);
        document.body.appendChild(this.element);
        this.element.number = 2;
        chai.expect(this._changedFired).to.equal(1);
      });
    });
    describe('IoElement: Observers', () => {
      // it('executes default observers on init values', () => {
      //   let element = new TestElement({string: this.element.bind('string')});
      //   document.body.appendChild(element);
      //   chai.expect(element._changedFired).to.equal(1);
      //   chai.expect(element._stringChangedFired).to.equal(1);
      // });
      it('executes default observers', () => {
        this.element.string = '';
        this.element._changedFired = 0;
        this.element._stringChangedFired = 0;
        this.element.string = 'test';
        chai.expect(this.element._changedFired).to.equal(1);
        chai.expect(this.element._stringChangedFired).to.equal(1);
      });
      it('executes custom observer', () => {
        this.element.string = '';
        this.element._customObserverFired = 0;
        this.element.string = 'test';
        chai.expect(this.element._customObserverFired).to.equal(1);
      });
    });
    describe('IoElement: Binding', () => {
      it('element and child have bound values', () => {
        this.element.number = Infinity;
        chai.expect(this.element.$.subelement.number).to.equal(Infinity);
        this.element.$.subelement.number = 0;
        chai.expect(this.element.number).to.equal(0);
      });
      it('disconnecting child disconnects bindngs', () => {
        this.element.number = Infinity;
        chai.expect(this.element.$.subelement.number).to.equal(Infinity);
        this.element.removeChild(this.element.$.subelement);
        this.element.$.subelement.number = 0;
        chai.expect(this.element.number).to.equal(Infinity);
        this.element.appendChild(this.element.$.subelement);
        this.element.$.subelement.number = 2;
        chai.expect(this.element.number).to.equal(2);
      });
    });
    describe('IoElement: Binding to IoCore', () => {
      it('element and node have bound values', () => {
        this.element.number = Infinity;
        chai.expect(this.element.subnode.number).to.equal(Infinity);
        this.element.subnode.number = 0;
        chai.expect(this.element.number).to.equal(0);
      });
      it('disconnecting node disconnects bindngs', () => {
        this.element.number = Infinity;
        chai.expect(this.element.subnode.number).to.equal(Infinity);
        this.element.subnode.disconnect();
        this.element.number = 0;
        chai.expect(this.element.subnode.number).to.equal(Infinity);
        this.element.subnode.connect();
        this.element.subnode.number = 2;
        chai.expect(this.element.number).to.equal(2);
      });
    });
    describe('IoElement: Default listeners', () => {
      it('catches correct event payloads', () => {
        this.element.number = 1;
        this.element.number = 0;
        chai.expect(this.element._defaultHandlerEvent.path[0]).to.equal(this.element);
        chai.expect(this.element._defaultHandlerEvent.detail.value).to.equal(0);
        this.element.$.subelement.number = 2;
        chai.expect(this.element._defaultHandlerEvent.path[0]).to.equal(this.element.$.subelement);
        chai.expect(this.element._defaultHandlerEvent.detail.oldValue).to.equal(0);
        chai.expect(this.element._defaultHandlerEvent.detail.value).to.equal(2);
        this.element.dispatchEvent('custom-event', {data: 'io'});
        chai.expect(this.element._defaultHandlerEvent.detail.data).to.equal('io');
      });
    });
  }
}
