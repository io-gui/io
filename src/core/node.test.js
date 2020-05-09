import {Node, Binding} from '../io.js';

export class TestNode extends Node {
  static get Properties() {
    return {
      prop0: {
        type: String,
      },
      prop1: {
        value: false,
      },
      prop2: -1,
      prop3: Number,
      // Internal counters
      _changedCounter: 0,
      _prop1ChangeCounter: 0,
      _prop2ChangeCounter: 0,
      _customHandlerCounter: 0,
    };
  }
  static get Listeners() {
    return {
      'prop1-changed': 'onProp1Change',
      'custom-event': 'onCustomEvent',
    };
  }
  reset() {
    this.prop0 = '';
    this.prop1 = false;
    this.prop2 = -1;
    this.prop3 = 0;
    this._changedCounter = 0;
    this._prop1ChangedCounter = 0;
    this._prop1ChangeCounter = 0;
    this._prop2ChangeCounter = 0;
    this._customHandlerCounter = 0;
    this._prop1ChangePayload = null;
    this._prop2ChangePayload = null;
    this._customHandlerPayload = null;
  }
  changed() {
    this._changedCounter++;
  }
  prop1Changed(event) {
    this._prop1ChangedCounter++;
    this._prop1ChangedPayload = event;
  }
  onProp1Change(event) {
    this._prop1ChangeCounter++;
    this._prop1ChangePayload = event;
  }
  onProp2Change(event) {
    this._prop2ChangeCounter++;
    this._prop2ChangePayload = event;
  }
  onCustomEvent(event) {
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
    this._prop3ChangeCounter = 0;
    this._prop3ChangePayload = null;
    this.prop3Change = (event) => {
      this._prop3ChangeCounter++;
      this._prop3ChangePayload = event;
    };
    this.node = new TestNode({'on-prop2-changed': 'onProp2Change', 'on-prop3-changed': this.prop3Change});
    this.node.connect(window);
  }
  reset() {
    this.node.reset();
    this._prop3ChangeCounter = 0;
    this._prop3ChangePayload = null;
  }
  run() {
    describe('Node', () => {
      it('should have core API defined', () => {
        const node = new Node();
        // Lifecycle functions
        node.connect(window);
        chai.expect(node.connect).to.be.a('function');
        chai.expect(node.disconnect).to.be.a('function');
        chai.expect(node.connectedCallback).to.be.a('function');
        chai.expect(node.disconnectedCallback).to.be.a('function');
        chai.expect(node.dispose).to.be.a('function');
        // Change handler functions
        chai.expect(node.changed).to.be.a('function');
        chai.expect(node.dispatchChange).to.be.a('function');
        chai.expect(node.queue).to.be.a('function');
        chai.expect(node.queueDispatch).to.be.a('function');
        chai.expect(node.queueDispatchLazy).to.be.a('function');
        // Data-binding functions
        chai.expect(node.bind).to.be.a('function');
        chai.expect(node.unbind).to.be.a('function');
        // Property setters
        chai.expect(node.set).to.be.a('function');
        chai.expect(node.setProperties).to.be.a('function');
        chai.expect(node.objectMutated).to.be.a('function');
        chai.expect(node.objectMutatedThrottled).to.be.a('function');
        // Event-related functions
        chai.expect(node.addEventListener).to.be.a('function');
        chai.expect(node.removeEventListener).to.be.a('function');
        chai.expect(node.dispatchEvent).to.be.a('function');
        // TODO: fully test core API
        chai.expect(node.throttle).to.be.a('function');
        chai.expect(node.requestAnimationFrameOnce).to.be.a('function');
        // Utility functions
        chai.expect(node.filterObject).to.be.a('function');
        chai.expect(node.filterObjects).to.be.a('function');
        chai.expect(node.import).to.be.a('function');
        chai.expect(node.preventDefault).to.be.a('function');
        chai.expect(node.stopPropagation).to.be.a('function');
        node.dispose();
      });
      it('should account connections correctly', () => {
        const node = new Node();
        node.connect(window);
        chai.expect(node.__connected).to.be.equal(true);
        node.connect(document);
        chai.expect(node.__listeners.__connected).to.be.equal(true);
        chai.expect(node.__properties.__connected).to.be.equal(true);
        chai.expect(node.__connected).to.be.equal(true);
        chai.expect(node.__connections).to.be.deep.equal([window, document]);
        node.disconnect(window);
        chai.expect(node.__listeners.__connected).to.be.equal(true);
        chai.expect(node.__properties.__connected).to.be.equal(true);
        chai.expect(node.__connected).to.be.equal(true);
        chai.expect(node.__connections).to.be.deep.equal([document]);
        node.disconnect(document);
        chai.expect(node.__connected).to.be.equal(false);
        chai.expect(node.__listeners.__connected).to.be.equal(false);
        chai.expect(node.__properties.__connected).to.be.equal(false);
        chai.expect(node.__connections).to.be.deep.equal([]);
        node.connect(window);
        chai.expect(node.__listeners.__connected).to.be.equal(true);
        chai.expect(node.__properties.__connected).to.be.equal(true);
        chai.expect(node.__connected).to.be.equal(true);
        chai.expect(node.__connections).to.be.deep.equal([window]);
        node.dispose();
        chai.expect(node.__connected).to.be.equal(false);
        chai.expect(node.__listeners.__connected).to.be.equal(false);
        chai.expect(node.__properties.__connected).to.be.equal(false);
        chai.expect(node.__connections).to.be.deep.equal([]);
      });
      it('should invoke change handler functions on change', () => {
        class TestNode extends Node {
          static get Properties() {
            return {
              prop1: String,
              prop2: String,
              _changedCounter: 0,
              _prop1ChangedCounter: 0,
              _prop1ChangedPayload: null,
              _prop2ChangedCounter: 0,
              _prop2ChangedPayload: null,
            };
          }
          changed() {
            this._changedCounter++;
          }
          prop1Changed(event) {
            this._prop1ChangedCounter++;
            this._prop1ChangedPayload = event;
          }
          prop2Changed(event) {
            this._prop2ChangedCounter++;
            this._prop2ChangedPayload = event;
          }
        }
        TestNode.Register();

        const node = new TestNode();
        node.connect(window);

        node.prop1 = 'one';
        chai.expect(node._changedCounter).to.equal(1);
        chai.expect(node._prop1ChangedCounter).to.equal(1);
        chai.expect(node._prop2ChangedCounter).to.equal(0);
        chai.expect(node._prop1ChangedPayload.detail.property).to.equal('prop1');
        chai.expect(node._prop1ChangedPayload.detail.oldValue).to.equal('');
        chai.expect(node._prop1ChangedPayload.detail.value).to.equal('one');

        node.prop1 = 'two';
        node.prop2 = 'test';
        chai.expect(node._changedCounter).to.equal(3);
        chai.expect(node._prop1ChangedCounter).to.equal(2);
        chai.expect(node._prop1ChangedPayload.detail.property).to.equal('prop1');
        chai.expect(node._prop1ChangedPayload.detail.oldValue).to.equal('one');
        chai.expect(node._prop1ChangedPayload.detail.value).to.equal('two');
        chai.expect(node._prop2ChangedCounter).to.equal(1);
        chai.expect(node._prop2ChangedPayload.detail.property).to.equal('prop2');
        chai.expect(node._prop2ChangedPayload.detail.oldValue).to.equal('');
        chai.expect(node._prop2ChangedPayload.detail.value).to.equal('test');

        node.setProperties({
          'prop1': 'three',
          'prop2': '',
        });
        chai.expect(node._changedCounter).to.equal(4);
        chai.expect(node._prop1ChangedCounter).to.equal(3);
        chai.expect(node._prop1ChangedPayload.detail.property).to.equal('prop1');
        chai.expect(node._prop1ChangedPayload.detail.oldValue).to.equal('two');
        chai.expect(node._prop1ChangedPayload.detail.value).to.equal('three');
        chai.expect(node._prop2ChangedCounter).to.equal(2);
        chai.expect(node._prop2ChangedPayload.detail.property).to.equal('prop2');
        chai.expect(node._prop2ChangedPayload.detail.oldValue).to.equal('test');
        chai.expect(node._prop2ChangedPayload.detail.value).to.equal('');

        node.disconnect(window);
        node.setProperties({
          'prop1': 'four',
          'prop2': 'test',
        });
        chai.expect(node._changedCounter).to.equal(4);
        chai.expect(node._prop1ChangedCounter).to.equal(3);
        chai.expect(node._prop1ChangedPayload.detail.property).to.equal('prop1');
        chai.expect(node._prop1ChangedPayload.detail.oldValue).to.equal('two');
        chai.expect(node._prop1ChangedPayload.detail.value).to.equal('three');
        chai.expect(node._prop2ChangedCounter).to.equal(2);
        chai.expect(node._prop2ChangedPayload.detail.property).to.equal('prop2');
        chai.expect(node._prop2ChangedPayload.detail.oldValue).to.equal('test');
        chai.expect(node._prop2ChangedPayload.detail.value).to.equal('');

        node.dispose();
      });
      it('should invoke listener handler functions on events', () => {
        class TestNode extends Node {
          static get Properties() {
            return {
              prop1: String,
              _onProp1ChangedCounter: 0,
              _onProp1ChangedPayload: null,
              _onCustomEventCounter: 0,
              _onCustomEventPayload: null,
            };
          }
          static get Listeners() {
            return {
              'prop1-changed': 'onProp1Changed',
              'custom-event': 'onCustomEvent',
            };
          }
          onProp1Changed(event) {
            this._onProp1ChangedCounter++;
            this._onProp1ChangedPayload = event;
          }
          onCustomEvent(event) {
            this._onCustomEventCounter++;
            this._onCustomEventPayload = event;
          }
        }
        TestNode.Register();

        const node = new TestNode();
        node.connect(window);

        node.prop1 = 'one';
        chai.expect(node._onProp1ChangedCounter).to.equal(1);
        chai.expect(node._onProp1ChangedPayload.detail.property).to.equal('prop1');
        chai.expect(node._onProp1ChangedPayload.detail.oldValue).to.equal('');
        chai.expect(node._onProp1ChangedPayload.detail.value).to.equal('one');

        node.dispatchEvent('custom-event', {value: 'hello'});
        chai.expect(node._onCustomEventCounter).to.equal(1);
        chai.expect(node._onCustomEventPayload.path[0]).to.equal(node);
        chai.expect(node._onCustomEventPayload.detail.value).to.equal('hello');

        node.disconnect(window);

        node.prop1 = 'two';
        chai.expect(node._onProp1ChangedCounter).to.equal(1);
        chai.expect(node._onProp1ChangedPayload.detail.property).to.equal('prop1');
        chai.expect(node._onProp1ChangedPayload.detail.oldValue).to.equal('');
        chai.expect(node._onProp1ChangedPayload.detail.value).to.equal('one');
        
        node.dispatchEvent('custom-event', {value: 'goodbye'});
        chai.expect(node._onCustomEventCounter).to.equal(1);
        chai.expect(node._onCustomEventPayload.path[0]).to.equal(node);
        chai.expect(node._onCustomEventPayload.detail.value).to.equal('hello');

        node.dispose();
      });
      it('should have correct property defaults', () => {
        class TestNode extends Node {
          static get Properties() {
            return {
              prop0: { type: String },
              prop1: { value: false },
              prop2: -1,
              prop3: Number,
              prop4: Object,
              prop5: [0, 1, 2],
            };
          }
        }
        TestNode.Register();

        const node = new TestNode();

        chai.expect(node.prop0).to.be.equal('');
        chai.expect(node.prop1).to.be.equal(false);
        chai.expect(node.prop2).to.be.equal(-1);
        chai.expect(node.prop3).to.be.equal(0);
        chai.expect(node.prop4).to.be.deep.equal({});
        chai.expect(node.prop5).to.be.deep.equal([0, 1, 2]);

        node.dispose();
      });
      it('should correctly bind properties', () => {
        class TestNode extends Node {
          static get Properties() {
            return {
              prop1: String,
              prop2: String,
            };
          }
        }
        TestNode.Register();

        const node = new TestNode();
        node.connect(window);
        
        let binding = node.bind('prop1');
        chai.expect(binding).to.be.instanceof(Binding);
        chai.expect(binding.source).to.be.equal(node);
        chai.expect(binding.sourceProp).to.be.equal('prop1');
        
        const boundNode0 = new TestNode({prop1: binding});
        const boundNode1 = new TestNode({prop1: binding});
        boundNode1.prop2 = binding;
        boundNode0.connect(window);
        boundNode1.connect(window);

        chai.expect(binding.targets[0]).to.be.equal(boundNode0);
        chai.expect(binding.targets[1]).to.be.equal(boundNode1);
        chai.expect(binding.targets.length).to.be.equal(2);
        chai.expect(binding.targetProps.get(boundNode0)[0]).to.be.equal('prop1');
        chai.expect(binding.targetProps.get(boundNode0)[1]).to.be.equal(undefined);
        chai.expect(binding.targetProps.get(boundNode1)[0]).to.be.equal('prop1');
        chai.expect(binding.targetProps.get(boundNode1)[1]).to.be.equal('prop2');

        node.prop1 = 'one';
        chai.expect(boundNode0.prop1).to.be.equal('one');
        chai.expect(boundNode0.prop2).to.be.equal('');
        chai.expect(boundNode1.prop1).to.be.equal('one');
        chai.expect(boundNode1.prop2).to.be.equal('one');
        
        boundNode0.prop1 = 'two';
        chai.expect(node.prop1).to.be.equal('two');
        chai.expect(boundNode1.prop1).to.be.equal('two');

        boundNode0.dispose();
        boundNode1.dispose();
        chai.expect(binding.targets.length).to.be.equal(0);

        node.dispose();
      });
      describe('Binding', () => {

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
