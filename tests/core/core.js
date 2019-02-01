import {IoCore} from "../../src/io.js";

class TestNode extends IoCore {
  static get properties() {
    return {
      prop0: {
        type: String,
        observer: 'handler0'
      },
      prop1: {
        value: false
      },
      prop2: -1,
      prop3: Number,
      // Internal counters
      _changedCounter: 0,
      _handler0Counter: 0,
      _handler1Counter: 0,
      _handler2Counter: 0,
      _customHandlerCounter: 0,
    }
  }
  static get listeners() {
    return {
      'prop1-changed': 'handler1',
      'custom-event': 'customHandler',
    };
  }
  reset() {
    this.prop0 = '';
    this.prop1 = false;
    this.prop2 = -1;
    this.prop3 = 0;
    this._changedCounter = 0;
    this._handler0Counter = 0;
    this._handler1Counter = 0;
    this._handler2Counter = 0;
    this._customHandlerCounter = 0;
    this._handler0Payload = null;
    this._handler1Payload = null;
    // this._handler2Payload = null;
    this._customHandlerPayload = null;
  }
  changed() {
    this._changedCounter++;
    // this._changedPayload = event;
  }
  handler0(event) {
    this._handler0Counter++;
    this._handler0Payload = event;
  }
  handler1(event) {
    this._handler1Counter++;
    this._handler1Payload = event;
  }
  handler2(event) {
    this._handler2Counter++;
    this._handler2Payload = event;
  }
  customHandler(event) {
    this._customHandlerCounter++;
    this._customHandlerPayload = event;
  }
  constructor(props) {
    super(props);
  }
}

TestNode.Register();

export default class {
  constructor() {
    this._handler3Counter = 0;
    this._handler3Payload = null;
    this.handler3 = (event) => {
      this._handler3Counter++;
      this._handler3Payload = event;
    }
    this.node = new TestNode({'on-prop2-changed': 'handler2', 'on-prop3-changed': this.handler3});
  }
  reset() {
    this.node.reset();
    this._handler3Counter = 0;
    this._handler3Payload = null;
  }
  run() {
    describe('IoCore: ', () => {
      it('Properties defined', () => {
        chai.expect(this.node.prop0).to.be.a('string');
        chai.expect(this.node.prop1).to.be.a('boolean');
        chai.expect(this.node.prop2).to.be.equal(-1);
        chai.expect(this.node.prop3).to.be.equal(0);
      });
      it('Handler functions corectly fired on property change', () => {
        this.reset();
        this.node.prop0 = 'test';
        chai.expect(this.node._changedCounter).to.equal(1);
        chai.expect(this.node._handler0Counter).to.equal(1);
        chai.expect(this.node._handler1Counter).to.equal(0);
        chai.expect(this.node._handler2Counter).to.equal(0);
        chai.expect(this._handler3Counter).to.equal(0);
        chai.expect(this.node._customHandlerCounter).to.equal(0);

        this.reset();
        this.node.prop1 = true;
        chai.expect(this.node._changedCounter).to.equal(1);
        chai.expect(this.node._handler0Counter).to.equal(0);
        chai.expect(this.node._handler1Counter).to.equal(1);
        chai.expect(this.node._handler2Counter).to.equal(0);
        chai.expect(this._handler3Counter).to.equal(0);
        chai.expect(this.node._customHandlerCounter).to.equal(0);

        this.reset();
        this.node.dispatchEvent('custom-event');
        chai.expect(this.node._changedCounter).to.equal(0);
        chai.expect(this.node._handler0Counter).to.equal(0);
        chai.expect(this.node._handler1Counter).to.equal(0);
        chai.expect(this.node._handler2Counter).to.equal(0);
        chai.expect(this._handler3Counter).to.equal(0);
        chai.expect(this.node._customHandlerCounter).to.equal(1);

        this.reset();
        this.node.prop2 = 1;
        chai.expect(this.node._changedCounter).to.equal(1);
        chai.expect(this.node._handler0Counter).to.equal(0);
        chai.expect(this.node._handler1Counter).to.equal(0);
        chai.expect(this.node._handler2Counter).to.equal(1);
        chai.expect(this._handler3Counter).to.equal(0);
        chai.expect(this.node._customHandlerCounter).to.equal(0);

        this.reset();
        this.node.prop3 = 1;
        chai.expect(this.node._changedCounter).to.equal(1);
        chai.expect(this.node._handler0Counter).to.equal(0);
        chai.expect(this.node._handler1Counter).to.equal(0);
        chai.expect(this.node._handler2Counter).to.equal(0);
        chai.expect(this._handler3Counter).to.equal(1);
        chai.expect(this.node._customHandlerCounter).to.equal(0);

        this.reset();
      });
      it('setProperties() fires correct handler functions in batch', () => {
        this.reset();

        this.node.setProperties({
          'prop0': 'test',
          'prop1': true,
          'prop2': 1,
          'prop3': 1,
        });

        chai.expect(this.node._changedCounter).to.equal(1);
        chai.expect(this.node._handler0Counter).to.equal(1);
        chai.expect(this.node._handler1Counter).to.equal(1);
        chai.expect(this.node._handler2Counter).to.equal(1);
        chai.expect(this._handler3Counter).to.equal(1);
        chai.expect(this.node._customHandlerCounter).to.equal(0);

        this.reset();
      });
      it('Stops firing handler functions when disconnected', () => {
        this.reset();
        this.node.disconnect();

        this.node.prop0 = 'test';
        this.node.prop1 = true;
        this.node.prop2 = 1;
        this.node.prop3 = 1;
        this.node.dispatchEvent('custom-event');

        chai.expect(this.node._changedCounter).to.equal(0);
        chai.expect(this.node._handler0Counter).to.equal(0);
        chai.expect(this.node._handler1Counter).to.equal(0);
        chai.expect(this.node._handler2Counter).to.equal(0);
        chai.expect(this._handler3Counter).to.equal(0);
        chai.expect(this.node._customHandlerCounter).to.equal(0);

        this.node.connect();
        this.reset();
      });
      it('Handler functions recieve correct event payloads', () => {
        this.reset();

        this.node.dispatchEvent('custom-event', {value: 'hello'});
        chai.expect(this.node._customHandlerPayload.path[0]).to.equal(this.node);
        chai.expect(this.node._customHandlerPayload.detail.value).to.equal('hello');

        this.node.setProperties({
          'prop0': 'test',
          'prop1': true,
          'prop2': 2,
          'prop3': 2,
        });

        chai.expect(this.node._handler0Payload.detail.property).to.equal('prop0');
        chai.expect(this.node._handler0Payload.detail.oldValue).to.equal('');
        chai.expect(this.node._handler0Payload.detail.value).to.equal('test');
        chai.expect(this.node._handler1Payload.detail.property).to.equal('prop1');
        chai.expect(this.node._handler1Payload.detail.oldValue).to.equal(false);
        chai.expect(this.node._handler1Payload.detail.value).to.equal(true);
        chai.expect(this.node._handler2Payload.detail.property).to.equal('prop2');
        chai.expect(this.node._handler2Payload.detail.oldValue).to.equal(-1);
        chai.expect(this.node._handler2Payload.detail.value).to.equal(2);
        chai.expect(this._handler3Payload.detail.property).to.equal('prop3');
        chai.expect(this._handler3Payload.detail.oldValue).to.equal(0);
        chai.expect(this._handler3Payload.detail.value).to.equal(2);

        this.reset();

        this.node.prop0 = 'test';
        this.node.prop1 = true;
        this.node.prop2 = 2;
        this.node.prop3 = 2;

        chai.expect(this.node._handler0Payload.detail.property).to.equal('prop0');
        chai.expect(this.node._handler0Payload.detail.oldValue).to.equal('');
        chai.expect(this.node._handler0Payload.detail.value).to.equal('test');
        chai.expect(this.node._handler1Payload.detail.property).to.equal('prop1');
        chai.expect(this.node._handler1Payload.detail.oldValue).to.equal(false);
        chai.expect(this.node._handler1Payload.detail.value).to.equal(true);
        chai.expect(this.node._handler2Payload.detail.property).to.equal('prop2');
        chai.expect(this.node._handler2Payload.detail.oldValue).to.equal(-1);
        chai.expect(this.node._handler2Payload.detail.value).to.equal(2);
        chai.expect(this._handler3Payload.detail.property).to.equal('prop3');
        chai.expect(this._handler3Payload.detail.oldValue).to.equal(0);
        chai.expect(this._handler3Payload.detail.value).to.equal(2);

        this.reset();
      });
      it('Functions defined', () => {
        chai.expect(this.node.bind).to.be.a('function');
        chai.expect(this.node.changed).to.be.a('function');

        chai.expect(this.node.connect).to.be.a('function');
        chai.expect(this.node.disconnect).to.be.a('function');
        chai.expect(this.node.connectedCallback).to.be.a('function');
        chai.expect(this.node.disconnectedCallback).to.be.a('function');
        chai.expect(this.node.dispose).to.be.a('function');

        chai.expect(this.node.objectMutated).to.be.a('function');

        chai.expect(this.node.addEventListener).to.be.a('function');
        chai.expect(this.node.removeEventListener).to.be.a('function');
        chai.expect(this.node.hasEventListener).to.be.a('function');
        chai.expect(this.node.removeListeners).to.be.a('function');
        chai.expect(this.node.dispatchEvent).to.be.a('function');

        chai.expect(this.node.queue).to.be.a('function');
        chai.expect(this.node.queueDispatch).to.be.a('function');

        chai.expect(this.node.set).to.be.a('function');
        chai.expect(this.node.setProperties).to.be.a('function');
      });
    });
  }
}
