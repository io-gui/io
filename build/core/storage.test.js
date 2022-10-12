import { IoStorageFactory, IoStorage, Binding } from '../iogui.js';
export default class {
    run() {
        describe('IoStorage', () => {
            describe('Initialization', () => {
                const node = new IoStorage({ key: 'test', value: 'foo', storage: 'local' });
                it('Should have core API functions defined', () => {
                    chai.expect(node.loadStorageValue).to.be.a('function');
                });
                it('Should register property definitions correctly', () => {
                    chai.expect(node.key).to.be.equal('test');
                    chai.expect(node.value).to.be.equal('foo');
                    chai.expect(node.default).to.be.equal('foo');
                    chai.expect(node.storage).to.be.equal('local');
                    chai.expect(node._properties.key).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: String,
                        value: 'test',
                    });
                    chai.expect(node._properties.value).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: undefined,
                        value: 'foo',
                    });
                    chai.expect(node._properties.default).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: undefined,
                        value: 'foo',
                    });
                    chai.expect(node._properties.storage).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: String,
                        value: 'local',
                    });
                });
                it('Should initialize property value from localStorage store if exists', () => {
                    localStorage.setItem('io-storage:test2', '"asd"');
                    const node = new IoStorage({ key: 'test2', value: 'buzz', storage: 'local' });
                    chai.expect(node.key).to.be.equal('test2');
                    chai.expect(node.value).to.be.equal('asd');
                    chai.expect(node.default).to.be.equal('buzz');
                    chai.expect(node.storage).to.be.equal('local');
                });
                it('Should initialize property value from location.hash store if exists', () => {
                    const hash = self.location.hash;
                    self.location.hash = self.location.hash + '&testhash=foo';
                    const node = new IoStorage({ key: 'testhash', value: 'buzz', storage: 'hash' });
                    chai.expect(node.key).to.be.equal('testhash');
                    // chai.expect(node.value).to.be.equal('foo');
                    chai.expect(node.default).to.be.equal('buzz');
                    chai.expect(node.storage).to.be.equal('hash');
                    self.location.hash = hash;
                });
                it('Should return a new instance only if key and store are unique', () => {
                    const node1 = new IoStorage({ key: 'test3', storage: 'local' });
                    const node2 = new IoStorage({ key: 'test3', storage: 'local' });
                    const node3 = new IoStorage({ key: 'test3', storage: 'hash' });
                    const node4 = new IoStorage({ key: 'test4', storage: 'local' });
                    chai.expect(node1).to.be.equal(node2);
                    chai.expect(node1).to.not.be.equal(node3);
                    chai.expect(node1).to.not.be.equal(node4);
                });
            });
            describe('Reactivity', () => {
            });
        });
        describe('IoStorageFactory', () => {
            describe('Initialization', () => {
                it('Should return binding to IoStorage Node', () => {
                    const storage = IoStorageFactory({ key: 'test', storage: 'local' });
                    chai.expect(storage).to.be.instanceOf(Binding);
                    //     chai.expect(node.applyProperties).to.be.a('function');
                    //     chai.expect(node.setProperties).to.be.a('function');
                    //     chai.expect(node.inputValue).to.be.a('function');
                    //     chai.expect(node.changed).to.be.a('function');
                    //     chai.expect(node.queue).to.be.a('function');
                    //     chai.expect(node.dispatchQueue).to.be.a('function');
                    //     chai.expect(node.dispatchQueueSync).to.be.a('function');
                    //     chai.expect(node.throttle).to.be.a('function');
                    //     chai.expect(node.onObjectMutated).to.be.a('function');
                    //     chai.expect(node.objectMutated).to.be.a('function');
                    //     chai.expect(node.bind).to.be.a('function');
                    //     chai.expect(node.unbind).to.be.a('function');
                    //     chai.expect(node.addEventListener).to.be.a('function');
                    //     chai.expect(node.removeEventListener).to.be.a('function');
                    //     chai.expect(node.dispatchEvent).to.be.a('function');
                    //     chai.expect(node.dispose).to.be.a('function');
                    //     node.dispose();
                });
                //   it('Should register property definitions correctly', () => {
                //     @RegisterIoNode
                //     class TestNode extends IoNode {
                //       static get Properties(): any {
                //         return {
                //           prop0: { type: String },
                //           prop1: { value: false },
                //           prop2: -1,
                //           prop3: Number,
                //           prop4: Object,
                //           prop5: [0, 1, 2],
                //         };
                //       }
                //     }
                //     const node = new TestNode();
                //     chai.expect(node.prop0).to.be.equal('');
                //     chai.expect(node.prop1).to.be.equal(false);
                //     chai.expect(node.prop2).to.be.equal(-1);
                //     chai.expect(node.prop3).to.be.equal(0);
                //     chai.expect(node.prop4).to.be.deep.equal({});
                //     chai.expect(node.prop5).to.be.deep.equal([0, 1, 2]);
                //     node.dispose();
                //   });
                //   it('Should aggregate property definitions from protochain', () => {
                //     @RegisterIoNode
                //     class Object1 extends IoNode {
                //       static get Properties(): PropertyDeclarations {
                //         return {
                //           prop1: {
                //             value: 0
                //           },
                //           prop2: null
                //         };
                //       }
                //     }
                //     @RegisterIoNode
                //     class Object2 extends Object1 {
                //       static get Properties(): PropertyDeclarations {
                //         return {
                //           prop1: {
                //             value: {},
                //             notify: false,
                //             observe: true,
                //           },
                //           prop2: {
                //             notify: true,
                //           },
                //           prop3: ''
                //         };
                //       }
                //     }
                //     const node1 = new Object1();
                //     const node2 = new Object2();
                //     const protoProps1 = node1._protochain.properties;
                //     const protoProps2 = node2._protochain.properties;
                //     const props1 = node1._properties;
                //     const props2 = node2._properties;
                //     chai.expect(Object.keys(props1)).to.be.eql(['lazy', 'prop1', 'prop2']);
                //     chai.expect(Object.keys(props2)).to.be.eql(['lazy', 'prop1', 'prop2', 'prop3']);
                //     chai.expect(protoProps1.prop1.value).to.be.equal(0);
                //     chai.expect(props1['prop1'].value).to.be.equal(0);
                //     chai.expect(props1['prop1'].type).to.be.equal(Number);
                //     chai.expect(props1['prop1'].notify).to.be.equal(true);
                //     chai.expect(props1['prop1'].reflect).to.be.equal('none');
                //     chai.expect(props1['prop1'].observe).to.be.equal(false);
                //     chai.expect(protoProps2.prop1.value).to.be.eql({});
                //     chai.expect(props2['prop1'].value).to.be.eql({});
                //     chai.expect(props2['prop1'].type).to.be.equal(Object);
                //     chai.expect(props2['prop1'].notify).to.be.equal(false);
                //     chai.expect(props2['prop1'].reflect).to.be.equal('none');
                //     chai.expect(props2['prop1'].observe).to.be.equal(true);
                //     chai.expect(props2['prop2'].value).to.be.equal(null);
                //     chai.expect(props2['prop2'].type).to.be.equal(undefined);
                //     chai.expect(props2['prop2'].notify).to.be.equal(true);
                //     chai.expect(props2['prop2'].observe).to.be.equal(false);
                //   });
                //   it('Should favor explicit property definitions over implicit', () => {
                //     class Object1 {
                //       static get Properties(): PropertyDeclarations {
                //         return {
                //           prop1: {
                //             value: {},
                //             notify: false,
                //             reflect: 'both',
                //             observe: true,
                //           },
                //         };
                //       }
                //     }
                //     class Object2 extends Object1 {
                //       static get Properties(): PropertyDeclarations {
                //         return {
                //           prop1: [1, 2, 3],
                //         };
                //       }
                //     }
                //     const protochain = new ProtoChain(Object2);
                //     const props = protochain.properties;
                //     chai.expect(props.prop1.value).to.be.eql([1, 2, 3]);
                //     chai.expect(props.prop1.type).to.be.equal(Array);
                //     chai.expect(props.prop1.notify).to.be.equal(false);
                //     chai.expect(props.prop1.reflect).to.be.equal('both');
                //     chai.expect(props.prop1.observe).to.be.equal(true);
                //   });
                //   it('Should correctly register properties with bindigs', () => {
                //     @RegisterIoNode
                //     class TestNode extends IoNode {
                //       static get Properties(): any {
                //         return {
                //           label: ''
                //         };
                //       }
                //     }
                //     const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
                //     const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');
                //     const binding3 = new Binding(new TestNode({label: 'binding3'}), 'label');
                //     @RegisterIoNode
                //     class Object1 extends IoNode {
                //       static get Properties(): PropertyDeclarations {
                //         return {
                //           prop1: binding1,
                //         };
                //       }
                //     }
                //     @RegisterIoNode
                //     class Object2 extends Object1 {
                //       static get Properties(): PropertyDeclarations {
                //         return {
                //           prop1: {
                //             binding: binding2
                //           },
                //           prop3: binding3
                //         };
                //       }
                //     }
                //     const node1 = new Object1();
                //     const node2 = new Object2();
                //     const props1 = node1._properties;
                //     const props2 = node2._properties;
                //     chai.expect(props1['prop1'].binding).to.be.equal(binding1);
                //     chai.expect(props2['prop1'].binding).to.be.equal(binding2);
                //     chai.expect(props2['prop3'].binding).to.be.equal(binding3);
                //     chai.expect((binding1 as any).targets[0]).to.be.equal(node1);
                //     chai.expect((binding2 as any).targets[0]).to.be.equal(node2);
                //     chai.expect((binding3 as any).targets[0]).to.be.equal(node2);
                //     chai.expect(props1['prop1'].value).to.be.equal('binding1');
                //     chai.expect(props2['prop1'].value).to.be.equal('binding2');
                //     chai.expect(props2['prop3'].value).to.be.equal('binding3');
                //   });
            });
            // describe('Construction', () => {
            // });
            // describe('Properties', () => {
            //   it('Should correctly get/set properties', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           prop1: {
            //             value: 1
            //           },
            //         };
            //       }
            //     }
            //     const node = new TestNode();
            //     const properties = node._properties;
            //     chai.expect(properties['prop1'].value).to.be.equal(1);
            //     chai.expect(node.prop1).to.be.equal(1);
            //     node.setProperty('prop1', 0);
            //     chai.expect(properties['prop1'].value).to.be.equal(0);
            //     chai.expect(node.prop1).to.be.equal(0);
            //   });
            //   it('Should correctly get/set bound properties', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           label: '',
            //         };
            //       }
            //     }
            //     const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
            //     const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');
            //     @RegisterIoNode
            //     class TestNode2 extends IoNode {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           prop1: binding1
            //         };
            //       }
            //     }
            //     const node = new TestNode2();
            //     const properties = node._properties;
            //     chai.expect(properties['prop1'].value).to.be.equal('binding1');
            //     chai.expect(node.prop1).to.be.equal('binding1');
            //     chai.expect(properties['prop1'].binding).to.be.equal(binding1);
            //     chai.expect((binding1 as any).targets[0]).to.be.equal(node);
            //     binding1.removeTarget(node, 'prop1');
            //     node._properties['prop1'].binding = undefined;
            //     node.setProperty('prop1', binding2);
            //     chai.expect(properties['prop1'].value).to.be.equal('binding2');
            //     chai.expect(node.prop1).to.be.equal('binding2');
            //     chai.expect((binding1 as any).targets[0]).to.be.equal(undefined);
            //     chai.expect((binding2 as any).targets[0]).to.be.equal(node);
            //   });
            //   it('Should execute attribute reflection on IoElement', () => {
            //     @RegisterIoElement
            //     class TestElementReflection extends IoElement {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           label: {
            //             value: 'label1',
            //             reflect: 'prop'
            //           }
            //         };
            //       }
            //     }
            //     const element = new TestElementReflection();
            //     chai.expect(element.getAttribute('label')).to.be.equal('label1');
            //     element.label = 'label2';
            //     chai.expect(element.getAttribute('label')).to.be.equal('label2');
            //     element.setProperty('label', 'label3');
            //     chai.expect(element.getAttribute('label')).to.be.equal('label3');
            //   });
            //   it('Should dipatch queue on object value initialization and value set', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           prop: Object,
            //         };
            //       }
            //     }
            //     const node = new TestNode();
            //     node.addEventListener('prop-changed', ((event: CustomEvent) => {
            //       chai.expect('This should not execute').to.be.eql(true);
            //     }) as EventListener);
            //     node.removeEventListener('prop-changed');
            //     node.addEventListener('prop-changed', ((event: CustomEvent) => {
            //       const value = event.detail.value;
            //       const oldValue = event.detail.oldValue;
            //       chai.expect(value).to.be.eql({});
            //       chai.expect(oldValue).to.be.eql({});
            //     }) as EventListener);
            //     node.prop = {};
            //     node.addEventListener('prop-changed', () => {
            //       chai.expect('This should never happen!').to.be.equal(true);
            //     });
            //     node.setProperty('prop', {}, true);
            //     node.removeEventListener('prop-changed');
            //     node.prop = {};
            //   });
            //   it('Should connect/disconnect IoNode-property-values on construction and value set', () => {
            //     @RegisterIoNode
            //     class TestSubNode extends IoNode {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           prop: 0,
            //           propChangeCounter: 0,
            //         };
            //       }
            //       propChanged() {
            //         this.propChangeCounter++;
            //       }
            //     }
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): PropertyDeclarations {
            //         return {
            //           prop: TestSubNode
            //         };
            //       }
            //     }
            //     const node = new TestNode();
            //     const subIoNode1 = node.prop;
            //     chai.expect(subIoNode1.propChangeCounter).to.be.equal(0);
            //     subIoNode1.prop = 1;
            //     subIoNode1.prop = 2;
            //     chai.expect(subIoNode1.propChangeCounter).to.be.equal(2);
            //     subIoNode1.prop = 3;
            //     chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
            //     const subIoNode2 = new TestSubNode();
            //     node.prop = subIoNode2;
            //     subIoNode1.prop = 4;
            //     chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);
            //     chai.expect(subIoNode2.propChangeCounter).to.be.equal(0);
            //   });
            // });
            // describe('Reactivity', () => {
            //   it('Should corectly invoke handler functions on change', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       _changedCounter = 0;
            //       _prop1ChangedCounter = 0;
            //       _prop1Change: Change | null = null;
            //       _prop2ChangedCounter = 0;
            //       _prop2Change: Change | null = null;
            //       static get Properties(): any {
            //         return {
            //           prop1: String,
            //           prop2: String,
            //         };
            //       }
            //       changed() {
            //         this._changedCounter++;
            //       }
            //       prop1Changed(change: Change) {
            //         this._prop1ChangedCounter++;
            //         this._prop1Change = change;
            //       }
            //       prop2Changed(change: Change) {
            //         this._prop2ChangedCounter++;
            //         this._prop2Change = change;
            //       }
            //     }
            //     const node = new TestNode();
            //     chai.expect(node._changedCounter).to.equal(0);
            //     chai.expect(node._prop1ChangedCounter).to.equal(0);
            //     chai.expect(node._prop2ChangedCounter).to.equal(0);
            //     chai.expect(node._prop1Change?.property).to.equal(undefined);
            //     chai.expect(node._prop1Change?.oldValue).to.equal(undefined);
            //     chai.expect(node._prop1Change?.value).to.equal(undefined);
            //     chai.expect(node._prop2ChangedCounter).to.equal(0);
            //     chai.expect(node._prop2Change?.property).to.equal(undefined);
            //     chai.expect(node._prop2Change?.oldValue).to.equal(undefined);
            //     chai.expect(node._prop2Change?.value).to.equal(undefined);
            //     node.prop1 = 'one';
            //     chai.expect(node._changedCounter).to.equal(1);
            //     chai.expect(node._prop1ChangedCounter).to.equal(1);
            //     chai.expect(node._prop2ChangedCounter).to.equal(0);
            //     chai.expect(node._prop1Change?.property).to.equal('prop1');
            //     chai.expect(node._prop1Change?.oldValue).to.equal('');
            //     chai.expect(node._prop1Change?.value).to.equal('one');
            //     node.prop1 = 'two';
            //     node.prop2 = 'test';
            //     chai.expect(node._changedCounter).to.equal(3);
            //     chai.expect(node._prop1ChangedCounter).to.equal(2);
            //     chai.expect(node._prop1Change?.property).to.equal('prop1');
            //     chai.expect(node._prop1Change?.oldValue).to.equal('one');
            //     chai.expect(node._prop1Change?.value).to.equal('two');
            //     chai.expect(node._prop2ChangedCounter).to.equal(1);
            //     chai.expect(node._prop2Change?.property).to.equal('prop2');
            //     chai.expect(node._prop2Change?.oldValue).to.equal('');
            //     chai.expect(node._prop2Change?.value).to.equal('test');
            //     node.setProperties({
            //       'prop1': 'three',
            //       'prop2': '',
            //     });
            //     chai.expect(node._changedCounter).to.equal(4);
            //     chai.expect(node._prop1ChangedCounter).to.equal(3);
            //     chai.expect(node._prop1Change?.property).to.equal('prop1');
            //     chai.expect(node._prop1Change?.oldValue).to.equal('two');
            //     chai.expect(node._prop1Change?.value).to.equal('three');
            //     chai.expect(node._prop2ChangedCounter).to.equal(2);
            //     chai.expect(node._prop2Change?.property).to.equal('prop2');
            //     chai.expect(node._prop2Change?.oldValue).to.equal('test');
            //     chai.expect(node._prop2Change?.value).to.equal('');
            //     node.dispose();
            //   });
            //   it('should invoke property mutation handler functions on mutation event', async () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       _changedCounter = 0;
            //       _obj1MutatedCounter = 0;
            //       _obj2MutatedCounter = 0;
            //       static get Properties(): any {
            //         return {
            //           obj1: {
            //             type: Object,
            //             observe: true,
            //           },
            //           obj2: {
            //             type: Object,
            //             observe: true,
            //           },
            //         };
            //       }
            //       changed() {
            //         this._changedCounter++;
            //       }
            //       obj1Mutated() {
            //         this._obj1MutatedCounter++;
            //       }
            //       obj2Mutated() {
            //         this._obj2MutatedCounter++;
            //       }
            //     }
            //     const node = new TestNode();
            //     chai.expect(node._changedCounter).to.equal(0);
            //     chai.expect(node._obj1MutatedCounter).to.equal(0);
            //     node.dispatchEvent('object-mutated', {object: node.obj1}, false, window);
            //     await nextTick();
            //     chai.expect(node._changedCounter).to.equal(1);
            //     chai.expect(node._obj1MutatedCounter).to.equal(1);
            //     chai.expect(node._obj2MutatedCounter).to.equal(0);
            //     node.dispatchEvent('object-mutated', {object: node.obj2}, false, window);
            //     await nextTick();
            //     node.dispose();
            //   });
            //   it('should fire change events when connected', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): any {
            //         return {
            //           prop1: String,
            //           _onProp1ChangedCounter: 0,
            //           _onProp1Change: null,
            //           _onCustomEventCounter: 0,
            //           _onCustomEven: null,
            //         };
            //       }
            //       static get Listeners() {
            //         return {
            //           'prop1-changed': 'onProp1Changed',
            //           'custom-event': 'onCustomEvent',
            //         };
            //       }
            //       onProp1Changed(event: Event) {
            //         this._onProp1ChangedCounter++;
            //         this._onProp1Change = event;
            //       }
            //       onCustomEvent(event: Event) {
            //         this._onCustomEventCounter++;
            //         this._onCustomEven = event;
            //       }
            //     }
            //     const node = new TestNode();
            //     node.prop1 = 'one';
            //     chai.expect(node._onProp1ChangedCounter).to.equal(1);
            //     chai.expect(node._onProp1Change.detail.property).to.equal('prop1');
            //     chai.expect(node._onProp1Change.detail.oldValue).to.equal('');
            //     chai.expect(node._onProp1Change.detail.value).to.equal('one');
            //     node.dispatchEvent('custom-event', {value: 'hello'});
            //     chai.expect(node._onCustomEventCounter).to.equal(1);
            //     chai.expect(node._onCustomEven.path[0]).to.equal(node);
            //     chai.expect(node._onCustomEven.detail.value).to.equal('hello');
            //   });
            // });
            // describe('Binding', () => {
            //   it('should correctly bind properties', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): any {
            //         return {
            //           prop1: String,
            //           prop2: String,
            //         };
            //       }
            //     }
            //     const node = new TestNode();
            //     const binding = node.bind('prop1') as any;
            //     chai.expect(binding).to.be.instanceof(Binding);
            //     chai.expect(binding.node).to.be.equal(node);
            //     chai.expect(binding.property).to.be.equal('prop1');
            //     const boundNode1 = new TestNode({prop1: binding});
            //     const boundNode2 = new TestNode({prop1: binding});
            //     boundNode2.prop2 = binding;
            //     chai.expect(binding.targets[0]).to.be.equal(boundNode1);
            //     chai.expect(binding.targets[1]).to.be.equal(boundNode2);
            //     chai.expect(binding.targetProperties.get(boundNode1)[0]).to.be.equal('prop1');
            //     chai.expect(binding.targetProperties.get(boundNode1)[1]).to.be.equal(undefined);
            //     chai.expect(binding.targetProperties.get(boundNode2)[0]).to.be.equal('prop1');
            //     chai.expect(binding.targetProperties.get(boundNode2)[1]).to.be.equal('prop2');
            //     node.prop1 = 'one';
            //     chai.expect(boundNode1.prop1).to.be.equal('one');
            //     chai.expect(boundNode1.prop2).to.be.equal('');
            //     chai.expect(boundNode2.prop1).to.be.equal('one');
            //     chai.expect(boundNode2.prop2).to.be.equal('one');
            //     boundNode1.prop1 = 'two';
            //     chai.expect(node.prop1).to.be.equal('two');
            //     chai.expect(boundNode2.prop1).to.be.equal('two');
            //     chai.expect(binding.targets.length).to.be.equal(2);
            //     boundNode1.dispose();
            //     chai.expect(binding.targets.length).to.be.equal(1);
            //     boundNode2.dispose();
            //     chai.expect(binding.targets.length).to.be.equal(0);
            //     node.dispose();
            //   });
            //   it('Should add/remove targets and targetProperties when assigned to values', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): any {
            //         return {
            //           prop1: String,
            //           prop2: String,
            //         };
            //       }
            //     }
            //     const srcNode = new TestNode();
            //     const binding0 = new Binding(srcNode, 'prop1') as any;
            //     const binding1 = new Binding(srcNode, 'prop2') as any;
            //     const dstNode0 = new TestNode();
            //     dstNode0.prop1 = binding0;
            //     dstNode0.prop2 = binding1;
            //     const dstNode1 = new TestNode({prop1: binding0});
            //     const dstNode3 = new TestNode({prop1: binding0, prop2: binding0});
            //     chai.expect(binding0.targets[0]).to.be.equal(dstNode0);
            //     chai.expect(binding0.targets[1]).to.be.equal(dstNode1);
            //     chai.expect(binding0.targets[2]).to.be.equal(dstNode3);
            //     chai.expect(binding0.targetProperties.get(dstNode0)).to.be.eql(['prop1']);
            //     chai.expect(binding0.targetProperties.get(dstNode1)).to.be.eql(['prop1']);
            //     chai.expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop1', 'prop2']);
            //     dstNode0.dispose();
            //     dstNode1.unbind('prop1');
            //     dstNode3.unbind('prop1');
            //     chai.expect(binding0.targetProperties.get(dstNode0)).to.be.eql([]);
            //     chai.expect(binding0.targetProperties.get(dstNode1)).to.be.eql([]);
            //     chai.expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop2']);
            //     dstNode1.prop2 = binding0;
            //     dstNode1.prop1 = binding0;
            //     dstNode3.prop1 = binding0;
            //     chai.expect(binding0.targetProperties.get(dstNode1)).to.be.eql(['prop2', 'prop1']);
            //     chai.expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop2', 'prop1']);
            //   });
            //   it('Should return existing binding or create a new on "bind()"', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): any {
            //         return {
            //           prop1: String,
            //           prop2: String,
            //         };
            //       }
            //     }
            //     const node = new TestNode();
            //     const binding0 = node.bind('prop1');
            //     chai.expect(binding0).to.be.equal(node._bindings['prop1']);
            //     chai.expect(binding0).to.be.equal(node.bind('prop1'));
            //   });
            //   it('Should dispose bindings correctly', () => {
            //     @RegisterIoNode
            //     class TestNode extends IoNode {
            //       static get Properties(): any {
            //         return {
            //           prop1: String,
            //           prop2: String,
            //         };
            //       }
            //     }
            //     const node1 = new TestNode();
            //     const binding0 = node1.bind('prop1') as any;
            //     node1.unbind('prop1');
            //     chai.expect(node1._bindings.prop1).to.be.equal(undefined);
            //     chai.expect(binding0.prop1).to.be.equal(undefined);
            //     const node2 = new TestNode();
            //     const binding1 = node2.bind('prop1') as any;
            //     node2.dispose();
            //     chai.expect(node2._bindings).to.be.eql({});
            //     chai.expect(binding1.prop1).to.be.equal(undefined);
            //   });
            // });
        });
    }
}
//# sourceMappingURL=storage.test.js.map