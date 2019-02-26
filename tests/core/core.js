import {IoCore, Binding} from "../../build/io.js";

export class TestNode extends IoCore {
  static get properties() {
    return {
      prop0: {
        type: String,
      },
      prop1: {
        value: false
      },
      prop2: -1,
      prop3: Number,
      // Internal counters
      _changedCounter: 0,
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
    this._prop1ChangedCounter = 0;
    this._handler1Counter = 0;
    this._handler2Counter = 0;
    this._customHandlerCounter = 0;
    this._handler1Payload = null;
    this._handler2Payload = null;
    this._customHandlerPayload = null;
  }
  changed() {
    this._changedCounter++;
  }
  prop1Changed(event) {
    this._prop1ChangedCounter++;
    this._prop1ChangedPayload = event;
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
    describe('IoCore', () => {
      describe('Initialized object', () => {
        it('should have correct property defaults', () => {
          chai.expect(this.node.prop0).to.be.equal('');
          chai.expect(this.node.prop1).to.be.equal(false);
          chai.expect(this.node.prop2).to.be.equal(-1);
          chai.expect(this.node.prop3).to.be.equal(0);
        });
        it('should have core API defined', () => {
          // Data-binding function
          chai.expect(this.node.bind).to.be.a('function');
          // Built-in property change handlers
          chai.expect(this.node.changed).to.be.a('function');
          // Lifecycle functions
          chai.expect(this.node.connect).to.be.a('function');
          chai.expect(this.node.disconnect).to.be.a('function');
          chai.expect(this.node.connectedCallback).to.be.a('function');
          chai.expect(this.node.disconnectedCallback).to.be.a('function');
          chai.expect(this.node.dispose).to.be.a('function');
          // Event-related functions
          chai.expect(this.node.addEventListener).to.be.a('function');
          chai.expect(this.node.removeEventListener).to.be.a('function');
          chai.expect(this.node.dispatchEvent).to.be.a('function');
          chai.expect(this.node.queue).to.be.a('function');
          chai.expect(this.node.queueDispatch).to.be.a('function');
          // Property setters
          chai.expect(this.node.set).to.be.a('function');
          chai.expect(this.node.setProperties).to.be.a('function');
          // TODO: fully test core API
        });
      });
      describe('Observed properties', () => {
        it('should corectly fire handler functions on change', () => {
          this.reset();
          this.node.prop0 = 'test';
          chai.expect(this.node._changedCounter).to.equal(1);
          chai.expect(this.node._prop1ChangedCounter).to.equal(0);
          chai.expect(this.node._handler1Counter).to.equal(0);
          chai.expect(this.node._handler2Counter).to.equal(0);
          chai.expect(this._handler3Counter).to.equal(0);
          chai.expect(this.node._customHandlerCounter).to.equal(0);
          this.reset();
          this.node.prop1 = true;
          chai.expect(this.node._changedCounter).to.equal(1);
          chai.expect(this.node._prop1ChangedCounter).to.equal(1);
          chai.expect(this.node._handler1Counter).to.equal(1);
          chai.expect(this.node._handler2Counter).to.equal(0);
          chai.expect(this._handler3Counter).to.equal(0);
          chai.expect(this.node._customHandlerCounter).to.equal(0);
          this.reset();
          this.node.dispatchEvent('custom-event');
          chai.expect(this.node._changedCounter).to.equal(0);
          chai.expect(this.node._prop1ChangedCounter).to.equal(0);
          chai.expect(this.node._handler1Counter).to.equal(0);
          chai.expect(this.node._handler2Counter).to.equal(0);
          chai.expect(this._handler3Counter).to.equal(0);
          chai.expect(this.node._customHandlerCounter).to.equal(1);
          this.reset();
          this.node.prop2 = 1;
          chai.expect(this.node._changedCounter).to.equal(1);
          chai.expect(this.node._prop1ChangedCounter).to.equal(0);
          chai.expect(this.node._handler1Counter).to.equal(0);
          chai.expect(this.node._handler2Counter).to.equal(1);
          chai.expect(this._handler3Counter).to.equal(0);
          chai.expect(this.node._customHandlerCounter).to.equal(0);
          this.reset();
          this.node.prop3 = 1;
          chai.expect(this.node._changedCounter).to.equal(1);
          chai.expect(this.node._prop1ChangedCounter).to.equal(0);
          chai.expect(this.node._handler1Counter).to.equal(0);
          chai.expect(this.node._handler2Counter).to.equal(0);
          chai.expect(this._handler3Counter).to.equal(1);
          chai.expect(this.node._customHandlerCounter).to.equal(0);
        });
        it('should fire handler functions in batch when set with setProperties()', () => {
          this.reset();
          this.node.setProperties({
            'prop0': 'test',
            'prop1': true,
            'prop2': 1,
            'prop3': 1,
          });
          chai.expect(this.node._changedCounter).to.equal(1);
          chai.expect(this.node._prop1ChangedCounter).to.equal(1);
          chai.expect(this.node._handler1Counter).to.equal(1);
          chai.expect(this.node._handler2Counter).to.equal(1);
          chai.expect(this._handler3Counter).to.equal(1);
          chai.expect(this.node._customHandlerCounter).to.equal(0);
        });
        it('should not fire handler functions when disconnected', () => {
          this.reset();
          this.node.disconnect();
          this.node.prop0 = 'test';
          this.node.prop1 = true;
          this.node.prop2 = 1;
          this.node.prop3 = 1;
          this.node.dispatchEvent('custom-event');
          chai.expect(this.node._changedCounter).to.equal(0);
          chai.expect(this.node._prop1ChangedCounter).to.equal(0);
          chai.expect(this.node._handler1Counter).to.equal(0);
          chai.expect(this.node._handler2Counter).to.equal(0);
          chai.expect(this._handler3Counter).to.equal(0);
          chai.expect(this.node._customHandlerCounter).to.equal(0);
          this.node.connect();
        });
        it('should dispatch correct event payloads to handlers', () => {
          this.reset();
          this.node.dispatchEvent('custom-event', {value: 'hello'});
          chai.expect(this.node._customHandlerPayload.path[0]).to.equal(this.node);
          chai.expect(this.node._customHandlerPayload.detail.value).to.equal('hello');
          this.reset();
          this.node.prop0 = 'test';
          this.node.prop1 = true;
          this.node.prop2 = 2;
          this.node.prop3 = 2;
          chai.expect(this.node._prop1ChangedPayload.detail.property).to.equal('prop1');
          chai.expect(this.node._prop1ChangedPayload.detail.oldValue).to.equal(false);
          chai.expect(this.node._prop1ChangedPayload.detail.value).to.equal(true);
          chai.expect(this.node._handler1Payload.detail.property).to.equal('prop1');
          chai.expect(this.node._handler1Payload.detail.oldValue).to.equal(false);
          chai.expect(this.node._handler1Payload.detail.value).to.equal(true);
          chai.expect(this.node._handler2Payload.detail.property).to.equal('prop2');
          chai.expect(this.node._handler2Payload.detail.oldValue).to.equal(-1);
          chai.expect(this.node._handler2Payload.detail.value).to.equal(2);
          chai.expect(this._handler3Payload.detail.property).to.equal('prop3');
          chai.expect(this._handler3Payload.detail.oldValue).to.equal(0);
          chai.expect(this._handler3Payload.detail.value).to.equal(2);
          this.node.setProperties({
            'prop0': 'test',
            'prop1': true,
            'prop2': 2,
            'prop3': 2,
          });
          chai.expect(this.node._prop1ChangedPayload.detail.property).to.equal('prop1');
          chai.expect(this.node._prop1ChangedPayload.detail.oldValue).to.equal(false);
          chai.expect(this.node._prop1ChangedPayload.detail.value).to.equal(true);
          chai.expect(this.node._handler1Payload.detail.property).to.equal('prop1');
          chai.expect(this.node._handler1Payload.detail.oldValue).to.equal(false);
          chai.expect(this.node._handler1Payload.detail.value).to.equal(true);
          chai.expect(this.node._handler2Payload.detail.property).to.equal('prop2');
          chai.expect(this.node._handler2Payload.detail.oldValue).to.equal(-1);
          chai.expect(this.node._handler2Payload.detail.value).to.equal(2);
          chai.expect(this._handler3Payload.detail.property).to.equal('prop3');
          chai.expect(this._handler3Payload.detail.oldValue).to.equal(0);
          chai.expect(this._handler3Payload.detail.value).to.equal(2);
        });
      });
      describe('Binding', () => {
        it('should return correctly initialized binding object', () => {
          const binding = this.node.bind('prop2');
          chai.expect(binding).to.be.instanceof(Binding);
          chai.expect(binding.source).to.be.equal(this.node);
          chai.expect(binding.sourceProp).to.be.equal('prop2');
          // binding.dispose();
        });
        it('should set binding target correctly when asigned to another property', () => {
          const binding = this.node.bind('prop2');
          const boundNode0 = new TestNode({prop3: binding});
          const boundNode1 = new TestNode({prop2: binding});
          boundNode1.prop3 = binding;
          chai.expect(binding.targets[0]).to.be.equal(boundNode0);
          chai.expect(binding.targets[1]).to.be.equal(boundNode1);
          chai.expect(binding.targets.length).to.be.equal(2);
          chai.expect(binding.targetsMap.get(boundNode0)[0]).to.be.equal('prop3');
          chai.expect(binding.targetsMap.get(boundNode0)[1]).to.be.equal(undefined);
          chai.expect(binding.targetsMap.get(boundNode1)[0]).to.be.equal('prop2');
          chai.expect(binding.targetsMap.get(boundNode1)[1]).to.be.equal('prop3');
          boundNode0.dispose();
          boundNode1.dispose();
          chai.expect(binding.targets.length).to.be.equal(0);
          // binding.dispose();
        });
        it('should update bound values correctly', () => {
          const binding = this.node.bind('prop2');
          const boundNode = new TestNode({prop3: binding});
          const boundNode1 = new TestNode();
          boundNode1.prop3 = binding;
          this.reset();
          this.node.prop2 = 9;
          chai.expect(boundNode.prop3).to.be.equal(9);
          this.reset();
          chai.expect(boundNode.prop3).to.be.equal(-1);
          boundNode.dispose();
          boundNode1.dispose();
          // binding.dispose();
        });
        // Im plement and test binding disconnection and disposal
      });
    });
  }
}
