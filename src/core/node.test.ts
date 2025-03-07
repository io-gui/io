import { Change, Binding, ProtoChain, IoNode, Register, PropertyDefinitions, IoElement } from '../iogui.js';
import { expect } from 'chai';

// TODO: test lazy reactivity!

async function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve();
    });
  });
}

export default class {
  run() {
    describe('IoNode', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          const node = new IoNode();
          expect(node.setProperty).to.be.a('function');
          expect(node.applyProperties).to.be.a('function');
          expect(node.setProperties).to.be.a('function');
          expect(node.inputValue).to.be.a('function');
          expect(node.changed).to.be.a('function');
          expect(node.queue).to.be.a('function');
          expect(node.dispatchQueue).to.be.a('function');
          expect(node.dispatchQueueSync).to.be.a('function');
          expect(node.throttle).to.be.a('function');
          expect(node.onObjectMutated).to.be.a('function');
          expect(node.objectMutated).to.be.a('function');
          expect(node.bind).to.be.a('function');
          expect(node.unbind).to.be.a('function');
          expect(node.addEventListener).to.be.a('function');
          expect(node.removeEventListener).to.be.a('function');
          expect(node.dispatchEvent).to.be.a('function');
          expect(node.dispose).to.be.a('function');
          node.dispose();
        });
        it('Should register property definitions correctly', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
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

          const node = new TestNode();

          expect(node.prop0).to.be.equal('');
          expect(node.prop1).to.be.equal(false);
          expect(node.prop2).to.be.equal(-1);
          expect(node.prop3).to.be.equal(0);
          expect(node.prop4).to.be.deep.equal({});
          expect(node.prop5).to.be.deep.equal([0, 1, 2]);

          node.dispose();
        });
        it('Should aggregate property definitions from protochain', () => {
          @Register
          class Object1 extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: {
                  value: 0
                },
                prop2: null
              };
            }
          }

          @Register
          class Object2 extends Object1 {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: {
                  value: {},
                  reactive: false,
                  observe: true,
                },
                prop2: {
                  reactive: true,
                },
                prop3: ''
              };
            }
          }

          const node1 = new Object1();
          const node2 = new Object2();

          const protoProps1 = node1._protochain.properties;
          const protoProps2 = node2._protochain.properties;

          expect(Array.from(node1._properties.keys())).to.be.eql(['lazy', 'prop1', 'prop2']);
          expect(Array.from(node2._properties.keys())).to.be.eql(['lazy', 'prop1', 'prop2', 'prop3']);

          expect(protoProps1.prop1.value).to.be.equal(0);
          expect(node1._properties.get('prop1')).to.be.eql({
            value: 0,
            type: Number,
            binding: undefined,
            reactive: true,
            reflect: false,
            observe: false,
            init: undefined,
          });

          expect(protoProps2.prop1.value).to.be.eql({});
          expect(node2._properties.get('prop1')).to.be.eql({
            value: {},
            type: Object,
            binding: undefined,
            reactive: false,
            reflect: false,
            observe: true,
            init: undefined,
          });

          expect(node2._properties.get('prop2')).to.be.eql({
            value: null,
            type: undefined,
            binding: undefined,
            reactive: true,
            reflect: false,
            observe: false,
            init: undefined,
          });
        });
        it('Should favor explicit property definitions over implicit', () => {
          class Object1 {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: {
                  value: {},
                  reactive: false,
                  reflect: true,
                  observe: true,
                },
              };
            }
          }

          class Object2 extends Object1 {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: [1, 2, 3],
              };
            }
          }

          const protochain = new ProtoChain(Object2);
          const props = protochain.properties;

          expect(props.prop1.value).to.be.eql([1, 2, 3]);
          expect(props.prop1.type).to.be.equal(Array);
          expect(props.prop1.reactive).to.be.equal(false);
          expect(props.prop1.reflect).to.be.equal(true);
          expect(props.prop1.observe).to.be.equal(true);
        });
        it('Should correctly register properties with bindigs', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): any {
              return {
                label: ''
              };
            }
          }

          const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
          const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');
          const binding3 = new Binding(new TestNode({label: 'binding3'}), 'label');

          @Register
          class Object1 extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: binding1,
              };
            }
          }

          @Register
          class Object2 extends Object1 {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: {
                  binding: binding2
                },
                prop3: binding3
              };
            }
          }

          const node1 = new Object1();
          const node2 = new Object2();


          expect(node1._properties.get('prop1')!.binding).to.be.equal(binding1);
          expect(node2._properties.get('prop1')!.binding).to.be.equal(binding2);
          expect(node2._properties.get('prop3')!.binding).to.be.equal(binding3);

          expect((binding1).targets[0]).to.be.equal(node1);
          expect((binding2).targets[0]).to.be.equal(node2);
          expect((binding3).targets[0]).to.be.equal(node2);

          expect(node1._properties.get('prop1')!.value).to.be.equal('binding1');
          expect(node2._properties.get('prop1')!.value).to.be.equal('binding2');
          expect(node2._properties.get('prop3')!.value).to.be.equal('binding3');
        });
      });
      describe('Construction', () => {
      });
      describe('Properties', () => {
        it('Should correctly get/set properties', () => {

          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: {
                  value: 1
                },
              };
            }
          }

          const node = new TestNode();

          expect(node._properties.get('prop1')!.value).to.be.equal(1);
          expect(node.prop1).to.be.equal(1);
          node.setProperty('prop1', 0);
          expect(node._properties.get('prop1')!.value).to.be.equal(0);
          expect(node.prop1).to.be.equal(0);
        });
        it('Should correctly get/set bound properties', () => {

          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                label: '',
              };
            }
          }

          const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
          const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');

          @Register
          class TestNode2 extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: binding1
              };
            }
          }

          const node = new TestNode2();

          expect(node._properties.get('prop1')!.value).to.be.equal('binding1');
          expect(node.prop1).to.be.equal('binding1');

          expect(node._properties.get('prop1')!.binding).to.be.equal(binding1);
          expect((binding1).targets[0]).to.be.equal(node);

          binding1.removeTarget(node, 'prop1');
          const prop = node._properties.get('prop1');
          if (prop) prop.binding = undefined;

          node.setProperty('prop1', binding2);
          expect(node._properties.get('prop1')!.value).to.be.equal('binding2');
          expect(node.prop1).to.be.equal('binding2');

          expect((binding1).targets[0]).to.be.equal(undefined);
          expect((binding2).targets[0]).to.be.equal(node);
        });
        it('Should execute attribute reflection on IoElement', () => {
          @Register
          class TestElementReflection extends IoElement {
            static get Properties(): PropertyDefinitions {
              return {
                label: {
                  value: 'label1',
                  reflect: true
                }
              };
            }
          }

          const element = new TestElementReflection();
          expect(element.getAttribute('label')).to.be.equal('label1');
          element.label = 'label2';
          expect(element.getAttribute('label')).to.be.equal('label2');
          element.setProperty('label', 'label3');
          expect(element.getAttribute('label')).to.be.equal('label3');
        });
        it('Should dipatch queue on object value initialization and value set', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop: Object,
              };
            }
          }

          const node = new TestNode();

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          node.addEventListener('prop-changed', ((event: CustomEvent) => {
            expect('This should not execute').to.be.eql(true);
          }) as EventListener);

          node.removeEventListener('prop-changed');

          node.addEventListener('prop-changed', ((event: CustomEvent) => {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            expect(value).to.be.eql({});
            expect(oldValue).to.be.eql({});
          }) as EventListener);

          node.prop = {};

          node.addEventListener('prop-changed', () => {
            expect('This should never happen!').to.be.equal(true);
          });

          node.setProperty('prop', {}, true);

          node.removeEventListener('prop-changed');

          node.prop = {};
        });
        it('Should connect/disconnect IoNode-property-values on construction and value set', () => {
          @Register
          class TestSubNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop: 0,
                propChangeCounter: 0,
              };
            }
            propChanged() {
              this.propChangeCounter++;
            }
          }

          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop: TestSubNode
              };
            }
          }

          const node = new TestNode();
          const subIoNode1 = node.prop;
          expect(subIoNode1.propChangeCounter).to.be.equal(0);

          subIoNode1.prop = 1;
          subIoNode1.prop = 2;
          expect(subIoNode1.propChangeCounter).to.be.equal(2);
          subIoNode1.prop = 3;
          expect(subIoNode1.propChangeCounter).to.be.equal(3);

          const subIoNode2 = new TestSubNode();
          node.prop = subIoNode2;
          subIoNode1.prop = 4;

          expect(subIoNode1.propChangeCounter).to.be.equal(4);
          expect(subIoNode2.propChangeCounter).to.be.equal(0);
        });
      });
      describe('Reactivity', () => {
        it('Should corectly invoke handler functions on change', () => {
          @Register
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

          const node = new TestNode();

          expect(node._changedCounter).to.equal(0);
          expect(node._prop1ChangedCounter).to.equal(0);
          expect(node._prop2ChangedCounter).to.equal(0);
          expect(node._prop1Change?.property).to.equal(undefined);
          expect(node._prop1Change?.oldValue).to.equal(undefined);
          expect(node._prop1Change?.value).to.equal(undefined);
          expect(node._prop2ChangedCounter).to.equal(0);
          expect(node._prop2Change?.property).to.equal(undefined);
          expect(node._prop2Change?.oldValue).to.equal(undefined);
          expect(node._prop2Change?.value).to.equal(undefined);

          node.prop1 = 'one';
          expect(node._changedCounter).to.equal(1);
          expect(node._prop1ChangedCounter).to.equal(1);
          expect(node._prop2ChangedCounter).to.equal(0);
          expect(node._prop1Change?.property).to.equal('prop1');
          expect(node._prop1Change?.oldValue).to.equal('');
          expect(node._prop1Change?.value).to.equal('one');

          node.prop1 = 'two';
          node.prop2 = 'test';
          expect(node._changedCounter).to.equal(3);
          expect(node._prop1ChangedCounter).to.equal(2);
          expect(node._prop1Change?.property).to.equal('prop1');
          expect(node._prop1Change?.oldValue).to.equal('one');
          expect(node._prop1Change?.value).to.equal('two');
          expect(node._prop2ChangedCounter).to.equal(1);
          expect(node._prop2Change?.property).to.equal('prop2');
          expect(node._prop2Change?.oldValue).to.equal('');
          expect(node._prop2Change?.value).to.equal('test');

          node.setProperties({
            'prop1': 'three',
            'prop2': '',
          });
          expect(node._changedCounter).to.equal(4);
          expect(node._prop1ChangedCounter).to.equal(3);
          expect(node._prop1Change?.property).to.equal('prop1');
          expect(node._prop1Change?.oldValue).to.equal('two');
          expect(node._prop1Change?.value).to.equal('three');
          expect(node._prop2ChangedCounter).to.equal(2);
          expect(node._prop2Change?.property).to.equal('prop2');
          expect(node._prop2Change?.oldValue).to.equal('test');
          expect(node._prop2Change?.value).to.equal('');

          node.dispose();
        });
        it('should invoke property mutation handler functions on mutation event', async () => {
          @Register
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

          const node = new TestNode();

          expect(node._changedCounter).to.equal(0);
          expect(node._obj1MutatedCounter).to.equal(0);

          node.dispatchEvent('object-mutated', {object: node.obj1}, false, window);

          await nextTick();

          expect(node._changedCounter).to.equal(1);
          expect(node._obj1MutatedCounter).to.equal(1);
          expect(node._obj2MutatedCounter).to.equal(0);

          node.dispatchEvent('object-mutated', {object: node.obj2}, false, window);

          await nextTick();

          node.dispose();
        });
        it('should fire change events', () => {
          @Register
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

          const node = new TestNode();

          node.prop1 = 'one';
          expect(node._onProp1ChangedCounter).to.equal(1);
          expect(node._onProp1Change.detail.property).to.equal('prop1');
          expect(node._onProp1Change.detail.oldValue).to.equal('');
          expect(node._onProp1Change.detail.value).to.equal('one');

          node.dispatchEvent('custom-event', {value: 'hello'});
          expect(node._onCustomEventCounter).to.equal(1);
          expect(node._onCustomEven.path[0]).to.equal(node);
          expect(node._onCustomEven.detail.value).to.equal('hello');
        });
      });
      describe('Binding', () => {
        it('should correctly bind properties', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }

          const node = new TestNode();

          const binding = node.bind('prop1');
          expect(binding).to.be.instanceof(Binding);
          expect(binding.node).to.be.equal(node);
          expect(binding.property).to.be.equal('prop1');

          const boundNode1 = new TestNode({prop1: binding});
          const boundNode2 = new TestNode({prop1: binding});
          boundNode2.prop2 = binding;

          expect(binding.targets[0]).to.be.equal(boundNode1);
          expect(binding.targets[1]).to.be.equal(boundNode2);
          expect(binding.targetProperties.get(boundNode1)![0]).to.be.equal('prop1');
          expect(binding.targetProperties.get(boundNode1)![1]).to.be.equal(undefined);
          expect(binding.targetProperties.get(boundNode2)![0]).to.be.equal('prop1');
          expect(binding.targetProperties.get(boundNode2)![1]).to.be.equal('prop2');

          node.prop1 = 'one';
          expect(boundNode1.prop1).to.be.equal('one');
          expect(boundNode1.prop2).to.be.equal('');
          expect(boundNode2.prop1).to.be.equal('one');
          expect(boundNode2.prop2).to.be.equal('one');

          boundNode1.prop1 = 'two';
          expect(node.prop1).to.be.equal('two');
          expect(boundNode2.prop1).to.be.equal('two');

          expect(binding.targets.length).to.be.equal(2);

          boundNode1.dispose();
          expect(binding.targets.length).to.be.equal(1);

          boundNode2.dispose();
          expect(binding.targets.length).to.be.equal(0);

          node.dispose();
        });
        it('Should add/remove targets and targetProperties when assigned to values', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }

          const srcNode = new TestNode();
          const binding0 = new Binding(srcNode, 'prop1');
          const binding1 = new Binding(srcNode, 'prop2');

          const dstNode0 = new TestNode();
          dstNode0.prop1 = binding0;
          dstNode0.prop2 = binding1;

          const dstNode1 = new TestNode({prop1: binding0});
          const dstNode3 = new TestNode({prop1: binding0, prop2: binding0});

          expect(binding0.targets[0]).to.be.equal(dstNode0);
          expect(binding0.targets[1]).to.be.equal(dstNode1);
          expect(binding0.targets[2]).to.be.equal(dstNode3);

          expect(binding0.targetProperties.get(dstNode0)).to.be.eql(['prop1']);
          expect(binding0.targetProperties.get(dstNode1)).to.be.eql(['prop1']);
          expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop1', 'prop2']);

          dstNode0.dispose();
          dstNode1.unbind('prop1');
          dstNode3.unbind('prop1');

          expect(binding0.targetProperties.get(dstNode0)).to.be.eql([]);
          expect(binding0.targetProperties.get(dstNode1)).to.be.eql([]);
          expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop2']);

          dstNode1.prop2 = binding0;
          dstNode1.prop1 = binding0;

          dstNode3.prop1 = binding0;

          expect(binding0.targetProperties.get(dstNode1)).to.be.eql(['prop2', 'prop1']);
          expect(binding0.targetProperties.get(dstNode3)).to.be.eql(['prop2', 'prop1']);
        });
        it('Should return existing binding or create a new on "bind()"', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }
          const node = new TestNode();
          const binding0 = node.bind('prop1');
          expect(binding0).to.be.equal(node._bindings.get('prop1'));
          expect(binding0).to.be.equal(node.bind('prop1'));
        });
        it('Should dispose bindings correctly', () => {
          @Register
          class TestNode extends IoNode {
            static get Properties(): PropertyDefinitions {
              return {
                prop1: String,
                prop2: String,
              };
            }
          }
          const node1 = new TestNode();
          const binding0 = node1.bind('prop1');
          node1.unbind('prop1');
          expect(node1._bindings.get('prop1')).to.be.equal(undefined);
          expect(binding0.node).to.be.equal(undefined);

          const node2 = new TestNode();
          const binding1 = node2.bind('prop1');
          node2.dispose();
          expect(node2._bindings).to.be.equal(undefined);
          expect(binding1.node).to.be.equal(undefined);
          expect(binding1.property).to.be.equal(undefined);
          expect(binding1.targets).to.be.equal(undefined);
          expect(binding1.targetProperties).to.be.equal(undefined);
        });
      });
    });
  }
}
