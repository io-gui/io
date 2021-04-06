import { Node, RegisterIoNode } from './node.js';
import { Binding } from './utils/bindingManager.js';
async function waitTick() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        });
    });
}
export default class {
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
                chai.expect(node.applyCompose).to.be.a('function');
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
                            _prop1Change: null,
                            _prop2ChangedCounter: 0,
                            _prop2Change: null,
                        };
                    }
                    changed() {
                        this._changedCounter++;
                    }
                    prop1Changed(change) {
                        this._prop1ChangedCounter++;
                        this._prop1Change = change;
                    }
                    prop2Changed(change) {
                        this._prop2ChangedCounter++;
                        this._prop2Change = change;
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                node.prop1 = 'one';
                chai.expect(node._changedCounter).to.equal(1);
                chai.expect(node._prop1ChangedCounter).to.equal(1);
                chai.expect(node._prop2ChangedCounter).to.equal(0);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('');
                chai.expect(node._prop1Change.value).to.equal('one');
                node.prop1 = 'two';
                node.prop2 = 'test';
                chai.expect(node._changedCounter).to.equal(3);
                chai.expect(node._prop1ChangedCounter).to.equal(2);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('one');
                chai.expect(node._prop1Change.value).to.equal('two');
                chai.expect(node._prop2ChangedCounter).to.equal(1);
                chai.expect(node._prop2Change.property).to.equal('prop2');
                chai.expect(node._prop2Change.oldValue).to.equal('');
                chai.expect(node._prop2Change.value).to.equal('test');
                node.setProperties({
                    'prop1': 'three',
                    'prop2': '',
                });
                chai.expect(node._changedCounter).to.equal(4);
                chai.expect(node._prop1ChangedCounter).to.equal(3);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('two');
                chai.expect(node._prop1Change.value).to.equal('three');
                chai.expect(node._prop2ChangedCounter).to.equal(2);
                chai.expect(node._prop2Change.property).to.equal('prop2');
                chai.expect(node._prop2Change.oldValue).to.equal('test');
                chai.expect(node._prop2Change.value).to.equal('');
                node.disconnect(window);
                node.setProperties({
                    'prop1': 'four',
                    'prop2': 'test',
                });
                chai.expect(node._changedCounter).to.equal(4);
                chai.expect(node._prop1ChangedCounter).to.equal(3);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('two');
                chai.expect(node._prop1Change.value).to.equal('three');
                chai.expect(node._prop2ChangedCounter).to.equal(2);
                chai.expect(node._prop2Change.property).to.equal('prop2');
                chai.expect(node._prop2Change.oldValue).to.equal('test');
                chai.expect(node._prop2Change.value).to.equal('');
                node.dispose();
            });
            it('should invoke property mutation handler functions on mutation event', async () => {
                class TestNode extends Node {
                    static get Properties() {
                        return {
                            obj1: {
                                type: Object,
                                observe: true,
                            },
                            obj2: {
                                type: Object,
                                observe: true,
                            },
                            _changedCounter: 0,
                            _obj1MutatedCounter: 0,
                            _obj2MutatedCounter: 0,
                        };
                    }
                    changed() {
                        this._changedCounter++;
                    }
                    obj1Mutated() {
                        this._obj1MutatedCounter++;
                    }
                    obj2Mutated() {
                        this._obj2MutatedCounter++;
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                chai.expect(node._changedCounter).to.equal(1);
                chai.expect(node._obj1MutatedCounter).to.equal(0);
                node.dispatchEvent('object-mutated', { object: node.obj1 }, false, window);
                // await waitTick();
                chai.expect(node._changedCounter).to.equal(2);
                chai.expect(node._obj1MutatedCounter).to.equal(1);
                chai.expect(node._obj2MutatedCounter).to.equal(0);
                node.dispatchEvent('object-mutated', { object: node.obj2 }, false, window);
                await waitTick();
                chai.expect(node._changedCounter).to.equal(3);
                chai.expect(node._obj1MutatedCounter).to.equal(1);
                chai.expect(node._obj2MutatedCounter).to.equal(1);
                // chai.expect(node._prop2ChangedCounter).to.equal(0);
                // chai.expect(node._prop1Change.detail.property).to.equal('prop1');
                // chai.expect(node._prop1Change.detail.oldValue).to.equal('');
                // chai.expect(node._prop1Change.detail.value).to.equal('one');
                node.dispose();
            });
            it('should invoke listener handler functions on events', () => {
                class TestNode extends Node {
                    static get Properties() {
                        return {
                            prop1: String,
                            _onProp1ChangedCounter: 0,
                            _onProp1Change: null,
                            _onCustomEventCounter: 0,
                            _onCustomEven: null,
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
                        this._onProp1Change = event;
                    }
                    onCustomEvent(event) {
                        this._onCustomEventCounter++;
                        this._onCustomEven = event;
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                node.prop1 = 'one';
                chai.expect(node._onProp1ChangedCounter).to.equal(1);
                chai.expect(node._onProp1Change.detail.property).to.equal('prop1');
                chai.expect(node._onProp1Change.detail.oldValue).to.equal('');
                chai.expect(node._onProp1Change.detail.value).to.equal('one');
                node.dispatchEvent('custom-event', { value: 'hello' });
                chai.expect(node._onCustomEventCounter).to.equal(1);
                chai.expect(node._onCustomEven.path[0]).to.equal(node);
                chai.expect(node._onCustomEven.detail.value).to.equal('hello');
                node.disconnect(window);
                node.prop1 = 'two';
                chai.expect(node._onProp1ChangedCounter).to.equal(1);
                chai.expect(node._onProp1Change.detail.property).to.equal('prop1');
                chai.expect(node._onProp1Change.detail.oldValue).to.equal('');
                chai.expect(node._onProp1Change.detail.value).to.equal('one');
                node.dispatchEvent('custom-event', { value: 'goodbye' });
                chai.expect(node._onCustomEventCounter).to.equal(1);
                chai.expect(node._onCustomEven.path[0]).to.equal(node);
                chai.expect(node._onCustomEven.detail.value).to.equal('hello');
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
                RegisterIoNode(TestNode);
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
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                let binding = node.bind('prop1');
                chai.expect(binding).to.be.instanceof(Binding);
                chai.expect(binding.__node).to.be.equal(node);
                chai.expect(binding.__property).to.be.equal('prop1');
                const boundNode1 = new TestNode({ prop1: binding });
                const boundNode2 = new TestNode({ prop1: binding });
                boundNode2.prop2 = binding;
                boundNode1.connect(window);
                boundNode2.connect(window);
                chai.expect(binding.__targets[0]).to.be.equal(boundNode1);
                chai.expect(binding.__targets[1]).to.be.equal(boundNode2);
                chai.expect(binding.__targetProperties.get(boundNode1)[0]).to.be.equal('prop1');
                chai.expect(binding.__targetProperties.get(boundNode1)[1]).to.be.equal(undefined);
                chai.expect(binding.__targetProperties.get(boundNode2)[0]).to.be.equal('prop1');
                chai.expect(binding.__targetProperties.get(boundNode2)[1]).to.be.equal('prop2');
                node.prop1 = 'one';
                chai.expect(boundNode1.prop1).to.be.equal('one');
                chai.expect(boundNode1.prop2).to.be.equal('');
                chai.expect(boundNode2.prop1).to.be.equal('one');
                chai.expect(boundNode2.prop2).to.be.equal('one');
                boundNode1.prop1 = 'two';
                chai.expect(node.prop1).to.be.equal('two');
                chai.expect(boundNode2.prop1).to.be.equal('two');
                chai.expect(binding.__targets.length).to.be.equal(2);
                boundNode1.dispose();
                chai.expect(binding.__targets.length).to.be.equal(1);
                boundNode2.dispose();
                chai.expect(binding.__targets.length).to.be.equal(0);
                node.dispose();
            });
            // it('Should add/remove targets and __targetProperties when assigned to values', () => {
            //   const srcNode = new TestNode();
            //   const binding0 = new Binding(srcNode, 'prop1') as any;
            //   const binding1 = new Binding(srcNode, 'prop2') as any;
            //   const dstNode0 = new TestNode().connect();
            //   dstNode0.prop1 = binding0;
            //   dstNode0.prop2 = binding1;
            //   const dstNode1 = new TestNode({prop1: binding0}).connect();
            //   const dstNode3 = new TestNode({prop1: binding0, prop2: binding0}).connect();
            //   chai.expect(binding0.__targets[0]).to.be.equal(dstNode0);
            //   chai.expect(binding0.__targets[1]).to.be.equal(dstNode1);
            //   chai.expect(binding0.__targets[2]).to.be.equal(dstNode3);
            //   chai.expect(string(binding0.__targetProperties.get(dstNode0))).to.be.equal(string(['prop1']));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode1))).to.be.equal(string(['prop1']));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode3))).to.be.equal(string(['prop1', 'prop2']));
            //   dstNode0.dispose();
            //   dstNode1.disconnect();
            //   dstNode3.unbind('prop1');
            //   chai.expect(string(binding0.__targetProperties.get(dstNode0))).to.be.equal(string([]));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode1))).to.be.equal(string([]));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode3))).to.be.equal(string(['prop2']));
            //   dstNode1.prop2 = binding0;
            //   dstNode1.connect();
            //   dstNode3.prop1 = binding0;
            //   chai.expect(string(binding0.__targetProperties.get(dstNode1))).to.be.equal(string(['prop2', 'prop1']));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode3))).to.be.equal(string(['prop2', 'prop1']));
            // });
            // it('Should return existing binding or create a new on "bind()"', () => {
            //   const node = new TestNode();
            //   const binding0 = node.bind('prop1');
            //   chai.expect(binding0).to.be.equal(node.__bindingManager.__bindings.prop1);
            //   chai.expect(binding0).to.be.equal(node.bind('prop1'));
            // });
            // it('Should dispose bindings correctly', () => {
            //   const node1 = new TestNode();
            //   const binding0 = node1.bind('prop1') as any;
            //   node1.unbind('prop1');
            //   chai.expect(node1.__bindingManager.__bindings.prop1).to.be.equal(undefined);
            //   chai.expect(binding0.prop1).to.be.equal(undefined);
            //   const node2 = new TestNode();
            //   const binding1 = node2.bind('prop1') as any;
            //   node2.__bindingManager.dispose();
            //   chai.expect(node2.__bindingManager.__bindings).to.be.equal(undefined);
            //   chai.expect(binding1.prop1).to.be.equal(undefined);
            // });
        });
    }
}
//# sourceMappingURL=node.test.js.map