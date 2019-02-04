import {IoLite} from "../../src/io-lite.js";

export class TestLite extends IoLite {
  constructor(initProps) {
    super(initProps);
    this.defineProperties({
      number: -1,
      string: {
        value: 'default',
        change: 'customObserver'
      },
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
    describe('IoLite', () => {
      describe('Initialized object', () => {
        it('should have correct property defaults', () => {
          chai.expect(this.node.number).to.equal(-1);
          chai.expect(this.node.string).to.equal('default');
        });
        it('should have core API defined', () => {
          // Core functions
          chai.expect(this.node.defineProperties).to.be.a('function');
          // Data-binding function
          // chai.expect(this.node.bind).to.be.a('function');
          // Built-in property change handlers
          chai.expect(this.node.changed).to.be.a('function');
          // chai.expect(this.node.objectMutated).to.be.a('function');
          // Lifecycle functions
          // chai.expect(this.node.connect).to.be.a('function');
          // chai.expect(this.node.disconnect).to.be.a('function');
          // chai.expect(this.node.connectedCallback).to.be.a('function');
          // chai.expect(this.node.disconnectedCallback).to.be.a('function');
          // chai.expect(this.node.dispose).to.be.a('function');
          // Event-related functions
          chai.expect(this.node.addEventListener).to.be.a('function');
          chai.expect(this.node.removeEventListener).to.be.a('function');
          chai.expect(this.node.hasEventListener).to.be.a('function');
          chai.expect(this.node.removeListeners).to.be.a('function');
          chai.expect(this.node.dispatchEvent).to.be.a('function');
          // chai.expect(this.node.queue).to.be.a('function');
          // chai.expect(this.node.queueDispatch).to.be.a('function');
          // Property setters
          chai.expect(this.node.set).to.be.a('function');
          // chai.expect(this.node.setProperties).to.be.a('function');
          // TODO: fully test core API
        });
      });
      describe('Observed properties', () => {
        it('should corectly fire handler functions on change', () => {
          this.node.string = '';
          this.node._changedFired = 0;
          this.node._stringChangedFired = 0;
          this.node.string = 'test';
          chai.expect(this.node._changedFired).to.equal(1);
          chai.expect(this.node._stringChangedFired).to.equal(1);

          this.node.string = '';
          this.node._customObserverFired = 0;
          this.node.string = 'test';
          chai.expect(this.node._customObserverFired).to.equal(1);
        });
        it('should dispatch correct event payloads to handlers', () => {
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
    });
  }
}
