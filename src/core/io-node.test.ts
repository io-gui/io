import { Change, Binding, ProtoChain, IoNode, RegisterIoNode, PropertiesDeclaration, IoElement, RegisterIoElement } from '../iogui.js';
import { nextTick } from '../iogui.test.js';

// TODO: fully test core API

export default class {
  run() {
    describe('IoNode', () => {
      describe('Registration', () => {
        it('Should have core API functions defined', () => {
          const node = new IoNode();
          chai.expect(node.setProperty).to.be.a('function');
          chai.expect(node.applyProperties).to.be.a('function');
          chai.expect(node.setProperties).to.be.a('function');
          chai.expect(node.setValue).to.be.a('function');
          chai.expect(node.changed).to.be.a('function');
          chai.expect(node.queue).to.be.a('function');
          chai.expect(node.dispatchQueue).to.be.a('function');
          chai.expect(node.dispatchQueueImmediately).to.be.a('function');
          chai.expect(node.throttle).to.be.a('function');
          chai.expect(node.onObjectMutated).to.be.a('function');
          chai.expect(node.objectMutated).to.be.a('function');
          chai.expect(node.bind).to.be.a('function');
          chai.expect(node.unbind).to.be.a('function');
          chai.expect(node.addEventListener).to.be.a('function');
          chai.expect(node.removeEventListener).to.be.a('function');
          chai.expect(node.dispatchEvent).to.be.a('function');
          chai.expect(node.dispose).to.be.a('function');
          node.dispose();
        });
        it('Should register property definitions correctly', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
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
        it('Should aggregate property definitions from protochain', () => {
          class Object1 extends IoNode {
            static get Properties(): PropertiesDeclaration {
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
            static get Properties(): PropertiesDeclaration {
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
        it('Should favor explicit property definitions over implicit', () => {
          class Object1 {
            static get Properties(): PropertiesDeclaration {
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
            static get Properties(): PropertiesDeclaration {
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
        it('Should correctly register properties with bindigs', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
              return {
                label: ''
              };
            }
          }
          RegisterIoNode(TestNode);

          const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
          const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');
          const binding3 = new Binding(new TestNode({label: 'binding3'}), 'label');

          class Object1 extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                prop1: binding1,
              };
            }
          }
          RegisterIoNode(Object1);

          class Object2 extends Object1 {
            static get Properties(): PropertiesDeclaration {
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

          chai.expect((binding1 as any).targets[0]).to.be.equal(node1);
          chai.expect((binding2 as any).targets[0]).to.be.equal(node2);
          chai.expect((binding3 as any).targets[0]).to.be.equal(node2);

          chai.expect(props1['prop1'].value).to.be.equal('binding1');
          chai.expect(props2['prop1'].value).to.be.equal('binding2');
          chai.expect(props2['prop3'].value).to.be.equal('binding3');
        });
      });
      describe('Construction', () => {
      });
      describe('Properties', () => {
        it('Should correctly get/set properties', () => {

          class TestNode extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                prop1: {
                  value: 1
                },
              };
            }
          }
          RegisterIoNode(TestNode);

          const node = new TestNode();
          const properties = node._properties;

          chai.expect(properties['prop1'].value).to.be.equal(1);
          chai.expect(node.prop1).to.be.equal(1);
          node.setProperty('prop1', 0);
          chai.expect(properties['prop1'].value).to.be.equal(0);
          chai.expect(node.prop1).to.be.equal(0);
        });
        it('Should correctly get/set bound properties', () => {

          class TestNode extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                label: '',
              };
            }
          }
          RegisterIoNode(TestNode);

          const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
          const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');

          class TestNode2 extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                prop1: binding1
              };
            }
          }
          RegisterIoNode(TestNode2);

          const node = new TestNode2();
          const properties = node._properties;

          chai.expect(properties['prop1'].value).to.be.equal('binding1');
          chai.expect(node.prop1).to.be.equal('binding1');

          chai.expect(properties['prop1'].binding).to.be.equal(binding1);
          chai.expect((binding1 as any).targets[0]).to.be.equal(node);

          node.setProperty('prop1', binding2);
          chai.expect(properties['prop1'].value).to.be.equal('binding2');
          chai.expect(node.prop1).to.be.equal('binding2');

          chai.expect((binding1 as any).targets[0]).to.be.equal(undefined);
          chai.expect((binding2 as any).targets[0]).to.be.equal(node);
        });
        it('Should execute attribute reflection on IoElement', () => {
          class TestElementReflection extends IoElement {
            static get Properties(): PropertiesDeclaration {
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
          class TestNode extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                prop: Object,
              };
            }
          }
          RegisterIoNode(TestNode);

          const node = new TestNode();

          node.addEventListener('prop-changed', ((event: CustomEvent) => {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            chai.expect(value).to.be.eql({});
            chai.expect(oldValue).to.be.equal(undefined);
          }) as EventListener);

          node;

          node.removeEventListener('prop-changed');

          node.addEventListener('prop-changed', ((event: CustomEvent) => {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            chai.expect(value).to.be.eql({});
            chai.expect(oldValue).to.be.eql({});
          }) as EventListener);

          node.prop = {};

          node.removeEventListener('prop-changed');

          node.addEventListener('prop-changed', () => {
            chai.expect('This should never happen!').to.be.equal(true);
          });

          node.setProperty('prop', {}, true);
        });
        it('Should connect/disconnect IoNode-property-values on construction and value set', () => {
          class TestNodeValue extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                prop: Object,
                propChangeCounter: 0,
              };
            }
            propChanged() {
              this.propChangeCounter++;
            }
          }
          RegisterIoNode(TestNodeValue);

          class TestNode extends IoNode {
            static get Properties(): PropertiesDeclaration {
              return {
                prop: TestNodeValue
              };
            }
          }
          RegisterIoNode(TestNode);

          const node = new TestNode();
          const subIoNode1 = node.prop;
          // chai.expect(subIoNode1.propChangeCounter).to.be.equal(0);
          // node;
          chai.expect(subIoNode1.propChangeCounter).to.be.equal(1);
          subIoNode1.prop = {};
          subIoNode1.prop = {};
          chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
          subIoNode1.prop = {};
          chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);

          node.prop = new TestNodeValue();
          const subIoNode2 = node.prop;
          subIoNode1.prop = {};

          // TODO
          chai.expect(subIoNode1.propChangeCounter).to.be.equal(5);
          chai.expect(subIoNode2.propChangeCounter).to.be.equal(1);
        });
      });
      describe('Reactivity', () => {
        it('Should corectly invoke handler functions on change', () => {
          class TestNode extends IoNode {
            _changedCounter = 0;
            _prop1ChangedCounter = 0;
            _prop1Change: Change | null = null;
            _prop2ChangedCounter = 0;
            _prop2Change: Change | null = null;
            static get Properties(): any {
              return {
                prop1: String,
                prop2: String,
              };
            }
            changed() {
              this._changedCounter++;
            }
            prop1Changed(change: Change) {
              this._prop1ChangedCounter++;
              this._prop1Change = change;
            }
            prop2Changed(change: Change) {
              this._prop2ChangedCounter++;
              this._prop2Change = change;
            }
          }
          RegisterIoNode(TestNode);

          const node = new TestNode();

          chai.expect(node._changedCounter).to.equal(0);
          chai.expect(node._prop1ChangedCounter).to.equal(0);
          chai.expect(node._prop2ChangedCounter).to.equal(0);
          chai.expect(node._prop1Change?.property).to.equal(undefined);
          chai.expect(node._prop1Change?.oldValue).to.equal(undefined);
          chai.expect(node._prop1Change?.value).to.equal(undefined);
          chai.expect(node._prop2ChangedCounter).to.equal(0);
          chai.expect(node._prop2Change?.property).to.equal(undefined);
          chai.expect(node._prop2Change?.oldValue).to.equal(undefined);
          chai.expect(node._prop2Change?.value).to.equal(undefined);

          node.prop1 = 'one';
          chai.expect(node._changedCounter).to.equal(1);
          chai.expect(node._prop1ChangedCounter).to.equal(1);
          chai.expect(node._prop2ChangedCounter).to.equal(0);
          chai.expect(node._prop1Change?.property).to.equal('prop1');
          chai.expect(node._prop1Change?.oldValue).to.equal('');
          chai.expect(node._prop1Change?.value).to.equal('one');

          node.prop1 = 'two';
          node.prop2 = 'test';
          chai.expect(node._changedCounter).to.equal(3);
          chai.expect(node._prop1ChangedCounter).to.equal(2);
          chai.expect(node._prop1Change?.property).to.equal('prop1');
          chai.expect(node._prop1Change?.oldValue).to.equal('one');
          chai.expect(node._prop1Change?.value).to.equal('two');
          chai.expect(node._prop2ChangedCounter).to.equal(1);
          chai.expect(node._prop2Change?.property).to.equal('prop2');
          chai.expect(node._prop2Change?.oldValue).to.equal('');
          chai.expect(node._prop2Change?.value).to.equal('test');

          node.setProperties({
            'prop1': 'three',
            'prop2': '',
          });
          chai.expect(node._changedCounter).to.equal(4);
          chai.expect(node._prop1ChangedCounter).to.equal(3);
          chai.expect(node._prop1Change?.property).to.equal('prop1');
          chai.expect(node._prop1Change?.oldValue).to.equal('two');
          chai.expect(node._prop1Change?.value).to.equal('three');
          chai.expect(node._prop2ChangedCounter).to.equal(2);
          chai.expect(node._prop2Change?.property).to.equal('prop2');
          chai.expect(node._prop2Change?.oldValue).to.equal('test');
          chai.expect(node._prop2Change?.value).to.equal('');

          node.dispose();
        });
        it('should invoke property mutation handler functions on mutation event', async () => {
          class TestNode extends IoNode {
            _changedCounter = 0;
            _obj1MutatedCounter = 0;
            _obj2MutatedCounter = 0;
            static get Properties(): any {
              return {
                obj1: {
                  type: Object,
                  observe: true,
                },
                obj2: {
                  type: Object,
                  observe: true,
                },
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

          chai.expect(node._changedCounter).to.equal(0);
          chai.expect(node._obj1MutatedCounter).to.equal(0);

          node.dispatchEvent('object-mutated', {object: node.obj1}, false, window);

          await nextTick();

          chai.expect(node._changedCounter).to.equal(1);
          chai.expect(node._obj1MutatedCounter).to.equal(1);
          chai.expect(node._obj2MutatedCounter).to.equal(0);

          node.dispatchEvent('object-mutated', {object: node.obj2}, false, window);

          await nextTick();

          node.dispose();
        });
        it('should fire change events when connected', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
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
            onProp1Changed(event: Event) {
              this._onProp1ChangedCounter++;
              this._onProp1Change = event;
            }
            onCustomEvent(event: Event) {
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

          node.dispatchEvent('custom-event', {value: 'hello'});
          chai.expect(node._onCustomEventCounter).to.equal(1);
          chai.expect(node._onCustomEven.path[0]).to.equal(node);
          chai.expect(node._onCustomEven.detail.value).to.equal('hello');
        });
      });
      describe('Binding', () => {
        it('should correctly bind properties', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }
          RegisterIoNode(TestNode);

          const node = new TestNode();

          const binding = node.bind('prop1') as any;
          chai.expect(binding).to.be.instanceof(Binding);
          chai.expect(binding.node).to.be.equal(node);
          chai.expect(binding.property).to.be.equal('prop1');

          const boundNode1 = new TestNode({prop1: binding});
          const boundNode2 = new TestNode({prop1: binding});
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
        it('Should add/remove targets and targetProperties when assigned to values', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }
          RegisterIoNode(TestNode);

          const srcNode = new TestNode();
          const binding0 = new Binding(srcNode, 'prop1') as any;
          const binding1 = new Binding(srcNode, 'prop2') as any;

          const dstNode0 = new TestNode();
          dstNode0.prop1 = binding0;
          dstNode0.prop2 = binding1;

          const dstNode1 = new TestNode({prop1: binding0});
          const dstNode3 = new TestNode({prop1: binding0, prop2: binding0});

          chai.expect(binding0.targets[0]).to.be.equal(dstNode0);
          chai.expect(binding0.targets[1]).to.be.equal(dstNode1);
          chai.expect(binding0.targets[2]).to.be.equal(dstNode3);

          chai.expect(binding0.targetProperties.get(dstNode0)).to.be.eql(['prop1']);
          chai.expect(binding0.targetProperties.get(dstNode1)).to.be.eql(['prop1']);
          chai.expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop1', 'prop2']);

          dstNode0.dispose();
          dstNode1.unbind('prop1');
          dstNode3.unbind('prop1');

          chai.expect(binding0.targetProperties.get(dstNode0)).to.be.eql([]);
          chai.expect(binding0.targetProperties.get(dstNode1)).to.be.eql([]);
          chai.expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop2']);

          dstNode1.prop2 = binding0;
          dstNode1.prop1 = binding0;

          dstNode3.prop1 = binding0;

          chai.expect(binding0.targetProperties.get(dstNode1)).to.be.eql(['prop2', 'prop1']);
          chai.expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop2', 'prop1']);
        });
        it('Should return existing binding or create a new on "bind()"', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }
          RegisterIoNode(TestNode);
          const node = new TestNode();
          const binding0 = node.bind('prop1');
          chai.expect(binding0).to.be.equal(node._bindings['prop1']);
          chai.expect(binding0).to.be.equal(node.bind('prop1'));
        });
        it('Should dispose bindings correctly', () => {
          class TestNode extends IoNode {
            static get Properties(): any {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }
          RegisterIoNode(TestNode);
          const node1 = new TestNode();
          const binding0 = node1.bind('prop1') as any;
          node1.unbind('prop1');
          chai.expect(node1._bindings.prop1).to.be.equal(undefined);
          chai.expect(binding0.prop1).to.be.equal(undefined);

          const node2 = new TestNode();
          const binding1 = node2.bind('prop1') as any;
          node2.dispose();
          chai.expect(node2._bindings).to.be.eql({});
          chai.expect(binding1.prop1).to.be.equal(undefined);
        });
      });
    });
  }
}
