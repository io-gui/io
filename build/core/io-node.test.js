import { Binding, ProtoChain, IoNode, RegisterIoNode, IoElement, RegisterIoElement } from '../iogui.js';
async function waitTick() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        });
    });
}
class TestIoNode extends IoNode {
    static get Properties() {
        return {
            label: ''
        };
    }
}
RegisterIoNode(TestIoNode);
export default class {
    run() {
        describe('Node', () => {
            it('should have core API defined', () => {
                const node = new IoNode();
                // Lifecycle functions
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
            it('should invoke change handler functions on change', () => {
                class TestNode extends IoNode {
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
                node.dispose();
            });
            it('should invoke property mutation handler functions on mutation event', async () => {
                class TestNode extends IoNode {
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
                chai.expect(node._changedCounter).to.equal(1);
                chai.expect(node._obj1MutatedCounter).to.equal(0);
                node.dispatchEvent('object-mutated', { object: node.obj1 }, false, window);
                // await waitTick();
                chai.expect(node._changedCounter).to.equal(2);
                chai.expect(node._obj1MutatedCounter).to.equal(1);
                chai.expect(node._obj2MutatedCounter).to.equal(0);
                node.dispatchEvent('object-mutated', { object: node.obj2 }, false, window);
                await waitTick();
                // TODO: investigate why this fails on auto-reload sometimes. Possible race condition?
                chai.expect(node._changedCounter).to.equal(3);
                chai.expect(node._obj1MutatedCounter).to.equal(1);
                chai.expect(node._obj2MutatedCounter).to.equal(1);
                // chai.expect(node._prop2ChangedCounter).to.equal(0);
                // chai.expect(node._prop1Change.detail.property).to.equal('prop1');
                // chai.expect(node._prop1Change.detail.oldValue).to.equal('');
                // chai.expect(node._prop1Change.detail.value).to.equal('one');
                node.dispose();
            });
            it('should fire change events when connected', () => {
                class TestNode extends IoNode {
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
                node.prop1 = 'one';
                chai.expect(node._onProp1ChangedCounter).to.equal(1);
                chai.expect(node._onProp1Change.detail.property).to.equal('prop1');
                chai.expect(node._onProp1Change.detail.oldValue).to.equal('');
                chai.expect(node._onProp1Change.detail.value).to.equal('one');
                node.dispatchEvent('custom-event', { value: 'hello' });
                chai.expect(node._onCustomEventCounter).to.equal(1);
                chai.expect(node._onCustomEven.path[0]).to.equal(node);
                chai.expect(node._onCustomEven.detail.value).to.equal('hello');
            });
            it('should have correct property defaults', () => {
                class TestNode extends IoNode {
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
                class TestNode extends IoNode {
                    static get Properties() {
                        return {
                            prop1: String,
                            prop2: String,
                        };
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                const binding = node.bind('prop1');
                chai.expect(binding).to.be.instanceof(Binding);
                chai.expect(binding.node).to.be.equal(node);
                chai.expect(binding.property).to.be.equal('prop1');
                const boundNode1 = new TestNode({ prop1: binding });
                const boundNode2 = new TestNode({ prop1: binding });
                boundNode2.prop2 = binding;
                chai.expect(binding.targets[0]).to.be.equal(boundNode1);
                chai.expect(binding.targets[1]).to.be.equal(boundNode2);
                chai.expect(binding.targetProperties.get(boundNode1)[0]).to.be.equal('prop1');
                chai.expect(binding.targetProperties.get(boundNode1)[1]).to.be.equal(undefined);
                chai.expect(binding.targetProperties.get(boundNode2)[0]).to.be.equal('prop1');
                chai.expect(binding.targetProperties.get(boundNode2)[1]).to.be.equal('prop2');
                node.prop1 = 'one';
                chai.expect(boundNode1.prop1).to.be.equal('one');
                chai.expect(boundNode1.prop2).to.be.equal('');
                chai.expect(boundNode2.prop1).to.be.equal('one');
                chai.expect(boundNode2.prop2).to.be.equal('one');
                boundNode1.prop1 = 'two';
                chai.expect(node.prop1).to.be.equal('two');
                chai.expect(boundNode2.prop1).to.be.equal('two');
                chai.expect(binding.targets.length).to.be.equal(2);
                boundNode1.dispose();
                chai.expect(binding.targets.length).to.be.equal(1);
                boundNode2.dispose();
                chai.expect(binding.targets.length).to.be.equal(0);
                node.dispose();
            });
            // it('Should add/remove targets and targetProperties when assigned to values', () => {
            //   const srcNode = new TestNode();
            //   const binding0 = new Binding(srcNode, 'prop1') as any;
            //   const binding1 = new Binding(srcNode, 'prop2') as any;
            //   const dstNode0 = new TestNode();
            //   dstNode0.prop1 = binding0;
            //   dstNode0.prop2 = binding1;
            //   const dstNode1 = new TestNode({prop1: binding0});
            //   const dstNode3 = new TestNode({prop1: binding0, prop2: binding0});
            //   chai.expect(binding0.targets[0]).to.be.equal(dstNode0);
            //   chai.expect(binding0.targets[1]).to.be.equal(dstNode1);
            //   chai.expect(binding0.targets[2]).to.be.equal(dstNode3);
            //   chai.expect(string(binding0.targetProperties.get(dstNode0))).to.be.equal(string(['prop1']));
            //   chai.expect(string(binding0.targetProperties.get(dstNode1))).to.be.equal(string(['prop1']));
            //   chai.expect(string(binding0.targetProperties.get(dstNode3))).to.be.equal(string(['prop1', 'prop2']));
            //   dstNode0.dispose();
            //   dstNode3.unbind('prop1');
            //   chai.expect(string(binding0.targetProperties.get(dstNode0))).to.be.equal(string([]));
            //   chai.expect(string(binding0.targetProperties.get(dstNode1))).to.be.equal(string([]));
            //   chai.expect(string(binding0.targetProperties.get(dstNode3))).to.be.equal(string(['prop2']));
            //   dstNode1.prop2 = binding0;
            //   dstNode1;
            //   dstNode3.prop1 = binding0;
            //   chai.expect(string(binding0.targetProperties.get(dstNode1))).to.be.equal(string(['prop2', 'prop1']));
            //   chai.expect(string(binding0.targetProperties.get(dstNode3))).to.be.equal(string(['prop2', 'prop1']));
            // });
            // it('Should return existing binding or create a new on "bind()"', () => {
            //   const node = new TestNode();
            //   const binding0 = node.bind('prop1');
            //   chai.expect(binding0).to.be.equal(node.propertyBinder._bindings.prop1);
            //   chai.expect(binding0).to.be.equal(node.bind('prop1'));
            // });
            // it('Should dispose bindings correctly', () => {
            //   const node1 = new TestNode();
            //   const binding0 = node1.bind('prop1') as any;
            //   node1.unbind('prop1');
            //   chai.expect(node1.propertyBinder._bindings.prop1).to.be.equal(undefined);
            //   chai.expect(binding0.prop1).to.be.equal(undefined);
            //   const node2 = new TestNode();
            //   const binding1 = node2.bind('prop1') as any;
            //   node2.propertyBinder.dispose();
            //   chai.expect(node2.propertyBinder._bindings).to.be.equal(undefined);
            //   chai.expect(binding1.prop1).to.be.equal(undefined);
            // });
        });
        describe('Properties', () => {
            it('Should correctly initialize properties from protochain', () => {
                class Object1 extends IoNode {
                    static get Properties() {
                        return {
                            prop1: {
                                value: 0
                            },
                            prop2: null
                        };
                    }
                }
                RegisterIoNode(Object1);
                class Object2 extends Object1 {
                    static get Properties() {
                        return {
                            prop1: {
                                value: {},
                                notify: false,
                                observe: true,
                            },
                            prop2: {
                                notify: true,
                            },
                            prop3: ''
                        };
                    }
                }
                RegisterIoNode(Object2);
                const node1 = new Object1();
                const node2 = new Object2();
                const protoProps1 = node1._protochain.properties;
                const protoProps2 = node2._protochain.properties;
                const props1 = node1._properties;
                const props2 = node2._properties;
                chai.expect(Object.keys(props1)).to.be.eql(['lazy', 'prop1', 'prop2']);
                chai.expect(Object.keys(props2)).to.be.eql(['lazy', 'prop1', 'prop2', 'prop3']);
                chai.expect(protoProps1.prop1.value).to.be.equal(0);
                chai.expect(props1['prop1'].value).to.be.equal(0);
                chai.expect(props1['prop1'].type).to.be.equal(Number);
                chai.expect(props1['prop1'].notify).to.be.equal(true);
                chai.expect(props1['prop1'].reflect).to.be.equal(0);
                chai.expect(props1['prop1'].observe).to.be.equal(false);
                chai.expect(protoProps2.prop1.value).to.be.eql({});
                chai.expect(props2['prop1'].value).to.be.eql({});
                chai.expect(props2['prop1'].type).to.be.equal(Object);
                chai.expect(props2['prop1'].notify).to.be.equal(false);
                chai.expect(props2['prop1'].reflect).to.be.equal(0);
                chai.expect(props2['prop1'].observe).to.be.equal(true);
                chai.expect(props2['prop2'].value).to.be.equal(null);
                chai.expect(props2['prop2'].type).to.be.equal(undefined);
                chai.expect(props2['prop2'].notify).to.be.equal(true);
                chai.expect(props2['prop2'].observe).to.be.equal(false);
            });
            it('Should not override explicit property options with implicit', () => {
                class Object1 {
                    static get Properties() {
                        return {
                            prop1: {
                                value: {},
                                notify: false,
                                reflect: 2,
                                observe: true,
                            },
                        };
                    }
                }
                class Object2 extends Object1 {
                    static get Properties() {
                        return {
                            prop1: [1, 2, 3],
                        };
                    }
                }
                const protochain = new ProtoChain(Object2);
                const props = protochain.properties;
                chai.expect(props.prop1.value).to.be.eql([1, 2, 3]);
                chai.expect(props.prop1.type).to.be.equal(Array);
                chai.expect(props.prop1.notify).to.be.equal(false);
                chai.expect(props.prop1.reflect).to.be.equal(2);
                chai.expect(props.prop1.observe).to.be.equal(true);
            });
            it('Should correctly initialize bound properties', () => {
                const binding1 = new Binding(new TestIoNode({ label: 'binding1' }), 'label');
                const binding2 = new Binding(new TestIoNode({ label: 'binding2' }), 'label');
                const binding3 = new Binding(new TestIoNode({ label: 'binding3' }), 'label');
                class Object1 extends IoNode {
                    static get Properties() {
                        return {
                            prop1: binding1,
                        };
                    }
                }
                RegisterIoNode(Object1);
                class Object2 extends Object1 {
                    static get Properties() {
                        return {
                            prop1: {
                                binding: binding2
                            },
                            prop3: binding3
                        };
                    }
                }
                RegisterIoNode(Object2);
                const node1 = new Object1();
                const node2 = new Object2();
                const props1 = node1._properties;
                const props2 = node2._properties;
                chai.expect(props1['prop1'].binding).to.be.equal(binding1);
                chai.expect(props2['prop1'].binding).to.be.equal(binding2);
                chai.expect(props2['prop3'].binding).to.be.equal(binding3);
                chai.expect(binding1.targets[0]).to.be.equal(node1);
                chai.expect(binding2.targets[0]).to.be.equal(node2);
                chai.expect(binding3.targets[0]).to.be.equal(node2);
                chai.expect(props1['prop1'].value).to.be.equal('binding1');
                chai.expect(props2['prop1'].value).to.be.equal('binding2');
                chai.expect(props2['prop3'].value).to.be.equal('binding3');
            });
            it('Should correctly get/set properties', () => {
                class TestIoNode extends IoNode {
                    static get Properties() {
                        return {
                            prop1: {
                                value: 1
                            },
                        };
                    }
                }
                RegisterIoNode(TestIoNode);
                const node = new TestIoNode();
                const properties = node._properties;
                chai.expect(properties['prop1'].value).to.be.equal(1);
                chai.expect(node.prop1).to.be.equal(1);
                node.setProperty('prop1', 0);
                chai.expect(properties['prop1'].value).to.be.equal(0);
                chai.expect(node.prop1).to.be.equal(0);
            });
            it('Should correctly get/set bound properties', () => {
                class TestIoNode extends IoNode {
                    static get Properties() {
                        return {
                            label: '',
                        };
                    }
                }
                RegisterIoNode(TestIoNode);
                const binding1 = new Binding(new TestIoNode({ label: 'binding1' }), 'label');
                const binding2 = new Binding(new TestIoNode({ label: 'binding2' }), 'label');
                class TestIoNode2 extends IoNode {
                    static get Properties() {
                        return {
                            prop1: binding1
                        };
                    }
                }
                RegisterIoNode(TestIoNode2);
                const node = new TestIoNode2();
                const properties = node._properties;
                chai.expect(properties['prop1'].value).to.be.equal('binding1');
                chai.expect(node.prop1).to.be.equal('binding1');
                chai.expect(properties['prop1'].binding).to.be.equal(binding1);
                chai.expect(binding1.targets[0]).to.be.equal(node);
                node.setProperty('prop1', binding2);
                chai.expect(properties['prop1'].value).to.be.equal('binding2');
                chai.expect(node.prop1).to.be.equal('binding2');
                chai.expect(binding1.targets[0]).to.be.equal(undefined);
                chai.expect(binding2.targets[0]).to.be.equal(node);
            });
            it('Should execute attribute reflection on IoElement', () => {
                class TestElementReflection extends IoElement {
                    static get Properties() {
                        return {
                            label: {
                                value: 'label1',
                                reflect: 1
                            }
                        };
                    }
                }
                RegisterIoElement(TestElementReflection);
                const element = new TestElementReflection();
                chai.expect(element.getAttribute('label')).to.be.equal('label1');
                element.label = 'label2';
                chai.expect(element.getAttribute('label')).to.be.equal('label2');
                element.setProperty('label', 'label3');
                chai.expect(element.getAttribute('label')).to.be.equal('label3');
            });
            it('Should dipatch queue on object value initialization and value set', () => {
                class TestIoNode extends IoNode {
                    static get Properties() {
                        return {
                            prop: Object,
                        };
                    }
                }
                RegisterIoNode(TestIoNode);
                const node = new TestIoNode();
                node.addEventListener('prop-changed', ((event) => {
                    const value = event.detail.value;
                    const oldValue = event.detail.oldValue;
                    chai.expect(value).to.be.eql({});
                    chai.expect(oldValue).to.be.equal(undefined);
                }));
                node;
                node.removeEventListener('prop-changed');
                node.addEventListener('prop-changed', ((event) => {
                    const value = event.detail.value;
                    const oldValue = event.detail.oldValue;
                    chai.expect(value).to.be.eql({});
                    chai.expect(oldValue).to.be.eql({});
                }));
                node.prop = {};
                node.removeEventListener('prop-changed');
                node.addEventListener('prop-changed', () => {
                    chai.expect('This should never happen!').to.be.equal(true);
                });
                node.setProperty('prop', {}, true);
            });
            it('Should connect/disconnect node value on initialization and value set', () => {
                class TestIoNodeValue extends IoNode {
                    static get Properties() {
                        return {
                            prop: Object,
                            propChangeCounter: 0,
                        };
                    }
                    propChanged() {
                        this.propChangeCounter++;
                    }
                }
                RegisterIoNode(TestIoNodeValue);
                class TestIoNode extends IoNode {
                    static get Properties() {
                        return {
                            prop: TestIoNodeValue
                        };
                    }
                }
                RegisterIoNode(TestIoNode);
                const node = new TestIoNode();
                const subIoNode1 = node.prop;
                // chai.expect(subIoNode1.propChangeCounter).to.be.equal(0);
                // node;
                chai.expect(subIoNode1.propChangeCounter).to.be.equal(1);
                subIoNode1.prop = {};
                subIoNode1.prop = {};
                chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
                subIoNode1.prop = {};
                chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);
                node.prop = new TestIoNodeValue();
                const subIoNode2 = node.prop;
                subIoNode1.prop = {};
                // TODO
                // chai.expect(subIoNode1.propChangeCounter).to.be.equal(5);
                chai.expect(subIoNode2.propChangeCounter).to.be.equal(1);
            });
        });
    }
}
//# sourceMappingURL=io-node.test.js.map