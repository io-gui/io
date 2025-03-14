import { Change, Binding, IoNode, Register, PropertyDefinitions, IoElement, ListenerDefinitions } from '../iogui.js';
import { expect } from 'chai';

async function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(()=>{
      resolve();
    });
  });
}

export default class {
  run() {
    describe('node.test.ts', () => {
      it('Should have core API functions defined', () => {
        const node = new IoNode();
        expect(node.setProperty).to.be.a('function');
        expect(node.applyProperties).to.be.a('function');
        expect(node.setProperties).to.be.a('function');
        expect(node.inputValue).to.be.a('function');
        expect(node.changed).to.be.a('function');
        expect(node.queue).to.be.a('function');
        expect(node.dispatchQueue).to.be.a('function');
        expect(node.throttle).to.be.a('function');
        expect(node.debounce).to.be.a('function');
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
              prop6: { value: 'hello', type: String },
              prop7: { value: true, type: Boolean },
              prop8: { value: 1, type: Number },
              prop9: { type: Array, init: [1, 2, 3] },
              prop10: { type: Array, init: null },
            };
          }
        }

        const node = new TestNode();

        expect(node.prop0).to.be.equal('');
        expect(node.prop1).to.be.equal(false);
        expect(node.prop2).to.be.equal(-1);
        expect(node.prop3).to.be.equal(0);
        expect(node.prop4).to.be.eql({});
        expect(node.prop5).to.be.eql([0, 1, 2]);
        expect(node.prop6).to.be.equal('hello');
        expect(node.prop7).to.be.equal(true);
        expect(node.prop8).to.be.equal(1);
        expect(node.prop9).to.be.eql([1, 2, 3]);

        expect(node._properties.get('prop0')).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop1')).to.be.eql({
          value: false,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop2')).to.be.eql({
          value: -1,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop3')).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop4')).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop5')).to.be.eql({
          value: [0, 1, 2],
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop6')).to.be.eql({
          value: 'hello',
          type: String,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop7')).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop8')).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._properties.get('prop9')).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: false,
          init: [1, 2, 3],
        });
        expect(node._properties.get('prop10')).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: false,
          init: null,
        });
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
              prop2: null,
              prop3: {
                value: 'test',
                type: String,
                reflect: true
              },
            };
          }
        }

        @Register
        class Object2 extends Object1 {
          static get Properties(): PropertyDefinitions {
            return {
              prop1: {
                value: 'asd',
                init: false,
              },
              prop2: {
                init: true,
              },
              prop3: ''
            };
          }
        }

        const node1 = new Object1();
        const node2 = new Object2();

        const protoProps1 = node1._protochain.properties;
        const protoProps2 = node2._protochain.properties;

        expect(Array.from(node1._properties.keys())).to.be.eql(['reactivity', 'prop1', 'prop2', 'prop3']);
        expect(Array.from(node2._properties.keys())).to.be.eql(['reactivity', 'prop1', 'prop2', 'prop3']);

        expect(protoProps1.prop1.value).to.be.equal(0);
        expect(node1._properties.get('prop1')).to.be.eql({
          value: 0,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });

        expect(protoProps2.prop1.value).to.be.eql('asd');
        expect(node2._properties.get('prop1')).to.be.eql({
          value: 'asd',
          type: undefined,
          binding: undefined,
          reflect: false,
          init: false,
        });
        expect(node2._properties.get('prop2')).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: true,
        });
        expect(node2._properties.get('prop3')).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: true,
          init: undefined,
        });
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

        const binding1 = new Binding(new TestNode({label: 'label1'}), 'label');
        const binding2 = new Binding(new TestNode({label: 'label2'}), 'label');
        const binding3 = new Binding(new TestNode({label: 'label3'}), 'label');

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

        expect(node1._properties.get('prop1')!.value).to.be.equal('label1');
        expect(node2._properties.get('prop1')!.value).to.be.equal('label2');
        expect(node2._properties.get('prop3')!.value).to.be.equal('label3');
      });
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

        const binding1 = new Binding(new TestNode({label: 'label1'}), 'label');
        const binding2 = new Binding(new TestNode({label: 'label2'}), 'label');

        @Register
        class TestNode2 extends IoNode {
          static get Properties(): PropertyDefinitions {
            return {
              prop1: binding1
            };
          }
        }

        const node = new TestNode2();

        expect(node._properties.get('prop1')!.value).to.be.equal('label1');
        expect(node.prop1).to.be.equal('label1');

        expect(node._properties.get('prop1')!.binding).to.be.equal(binding1);
        expect((binding1).targets[0]).to.be.equal(node);

        node.setProperty('prop1', binding2);
        expect(node._properties.get('prop1')!.value).to.be.equal('label2');
        expect(node.prop1).to.be.equal('label2');

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
              },
              label2: 'label2',
            };
          }
        }

        const element = new TestElementReflection();
        expect(element.getAttribute('label')).to.be.equal('label1');
        expect(element.getAttribute('label2')).to.be.equal(null);
        element.label = 'label2';
        expect(element.getAttribute('label')).to.be.equal('label2');
        element.setProperty('label', 'label3');
        expect(element.getAttribute('label')).to.be.equal('label3');
      });
      it('Should dipatch "[propName]-changed" events correctly', async () => {
        @Register
        class TestNode extends IoNode {
          static get Properties(): PropertyDefinitions {
            return {
              propChangedEvents: Array,
              prop: Number,
            };
          }
          static get Listeners(): ListenerDefinitions {
            return {
              'prop-changed': 'onPropChanged',
            };
          }
          onPropChanged(event: CustomEvent) {
            this.propChangedEvents.push(event.detail);
          }
        }

        const node = new TestNode();
        expect(node.propChangedEvents).to.be.eql([]);

        node.addEventListener('prop-changed', (() => {
          expect('This should not execute').to.be.eql(true);
        }));

        node.removeEventListener('prop-changed');

        node.addEventListener('prop-changed', (event: CustomEvent) => {
          const oldValue = event.detail.oldValue;
          const value = event.detail.value;
          expect(oldValue).to.be.eql(0);
          expect(value).to.be.eql(1);
        });

        node.prop = 1;

        node.removeEventListener('prop-changed');

        node.addEventListener('prop-changed', () => {
          expect('This is actually not expected to happen!').to.be.equal(true);
        });

        node.setProperty('prop', 2, true);

        node.removeEventListener('prop-changed');

        expect(node.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: 1,
        }]);

        await nextTick();

        expect(node.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: 1,
        }, {
          oldValue: 1,
          property: 'prop',
          value: 2,
        }]);

        node.setProperty('prop', 3, true);
        node.prop = 4;

        await nextTick();

        expect(node.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: 1,
        }, {
          oldValue: 1,
          property: 'prop',
          value: 2,
        }, {
          oldValue: 2,
          property: 'prop',
          value: 4,
        }]);

        const node2 = new TestNode({
          prop: new Binding(node, 'prop'),
        });

        expect(node2.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: 4,
        }]);

        const node3 = new TestNode({
          prop: -1
        });

        expect(node3.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: -1,
        }]);

        node3.propChangedEvents.length = 0;
        node3.reactivity = 'debounced';
        node3.prop = 10;

        expect(node3.propChangedEvents).to.be.eql([]);

        await nextTick();

        expect(node3.propChangedEvents).to.be.eql([{
          oldValue: -1,
          property: 'prop',
          value: 10,
        }]);

        node3.propChangedEvents.length = 0;
        node3.reactivity = 'none';
        node3.prop = 20;

        expect(node3.propChangedEvents).to.be.eql([]);

        await nextTick();

        expect(node3.propChangedEvents).to.be.eql([]);
      });
      it('Should add/remove "changed" event listeners to properties of IoNode type', async () => {
        @Register
        class TestNode extends IoNode {
          static get Properties(): PropertyDefinitions {
            return {
              prop: Number,
            };
          }
        }

        const subnode = new TestNode();
        const node = new TestNode({
          prop: subnode,
        });

        expect(subnode._eventDispatcher.addedListeners.changed[0][0]).to.be.equal(node.onIoNodePropertyChanged);

        node.prop = null;

        expect(subnode._eventDispatcher.addedListeners.changed).to.be.equal(undefined);

        const subnode2 = new TestNode();
        node.prop = subnode2;

        expect(subnode2._eventDispatcher.addedListeners.changed[0][0]).to.be.equal(node.onIoNodePropertyChanged);

        @Register
        class TestNode2 extends IoNode {
          static get Properties(): PropertyDefinitions {
            return {
              prop: TestNode,
            };
          }
        }

        const node2 = new TestNode2();
        const subnode3 = node2.prop;

        expect(subnode3._eventDispatcher.addedListeners.changed[0][0]).to.be.equal(node2.onIoNodePropertyChanged);

        node2.dispose();

        expect(subnode3._eventDispatcher.addedListeners.changed).to.be.equal(undefined);
      });
      it('Should corectly invoke handler functions on change', async () => {
        @Register
        class TestNode extends IoNode {
          changedCounter = 0;
          prop1Changes: Change[] = [];
          prop2Changes: Change[] = [];
          static get Properties(): any {
            return {
              prop1: String,
              prop2: String,
            };
          }
          changed() {
            this.changedCounter++;
          }
          prop1Changed(change: Change) {
            this.prop1Changes.push(change);
          }
          prop2Changed(change: Change) {
            this.prop2Changes.push(change);
          }
        }

        const node = new TestNode();

        expect(node.changedCounter).to.equal(0);
        expect(node.prop1Changes).to.be.eql([]);
        expect(node.prop2Changes).to.be.eql([]);

        node.prop1 = 'one';
        expect(node.changedCounter).to.equal(1);
        expect(node.prop1Changes).to.be.eql([{
          property: 'prop1',
          oldValue: '',
          value: 'one',
        }]);
        expect(node.prop2Changes).to.be.eql([]);
        node.prop1Changes.length = 0;

        node.prop1 = 'two';
        node.prop2 = 'test';
        expect(node.changedCounter).to.equal(3);
        expect(node.prop1Changes).to.be.eql([{
          property: 'prop1',
          oldValue: 'one',
          value: 'two',
        }]);
        expect(node.prop2Changes).to.be.eql([{
          property: 'prop2',
          oldValue: '',
          value: 'test',
        }]);
        node.prop1Changes.length = 0;
        node.prop2Changes.length = 0;

        node.setProperties({
          'prop1': 'three',
          'prop2': '',
        });
        expect(node.changedCounter).to.equal(4);
        expect(node.prop1Changes).to.be.eql([{
          property: 'prop1',
          oldValue: 'two',
          value: 'three',
        }]);
        expect(node.prop2Changes).to.be.eql([{
          property: 'prop2',
          oldValue: 'test',
          value: '',
        }]);

        node.prop1Changes.length = 0;
        node.prop2Changes.length = 0;

        node.reactivity = 'debounced';

        node.setProperties({
          'prop1': 'four',
          'prop2': 'test2',
        });

        expect(node.prop1Changes).to.be.eql([]);
        expect(node.prop2Changes).to.be.eql([]);

        await nextTick();

        expect(node.prop1Changes).to.be.eql([{
          property: 'prop1',
          oldValue: 'three',
          value: 'four',
        }]);
        expect(node.prop2Changes).to.be.eql([{
          property: 'prop2',
          oldValue: '',
          value: 'test2',
        }]);

        node.prop1Changes.length = 0;
        node.prop2Changes.length = 0;

        node.reactivity = 'none';

        node.setProperties({
          'prop1': 'five',
          'prop2': 'test3',
        });

        await nextTick();

        expect(node.prop1Changes).to.be.eql([]);
        expect(node.prop2Changes).to.be.eql([]);

        node.dispose();
      });
      it('should invoke property mutation handler functions on mutation event', async () => {
        @Register
        class TestNode extends IoNode {
          changedCounter = 0;
          obj1MutatedCounter = 0;
          obj2MutatedCounter = 0;
          static get Properties(): any {
            return {
              obj1: {
                type: Object,
              },
              obj2: {
                type: Object,
              },
            };
          }
          changed() {
            this.changedCounter++;
          }
          obj1Mutated() {
            this.obj1MutatedCounter++;
          }
          obj2Mutated() {
            this.obj2MutatedCounter++;
          }
        }

        const node = new TestNode();

        expect(node.changedCounter).to.equal(0);
        expect(node.obj1MutatedCounter).to.equal(0);

        node.dispatchEvent('object-mutated', {object: node.obj1}, false, window);

        await nextTick();

        expect(node.changedCounter).to.equal(1);
        expect(node.obj1MutatedCounter).to.equal(1);
        expect(node.obj2MutatedCounter).to.equal(0);

        node.dispatchEvent('object-mutated', {object: node.obj2}, false, window);

        expect(node.obj2MutatedCounter).to.equal(1);

        await nextTick();

        node.obj1 = new TestNode();

        await nextTick();

        expect(node.obj1MutatedCounter).to.equal(1);

        node.obj1.obj1 = {a: 1};

        await nextTick();

        expect(node.obj1MutatedCounter).to.equal(2);

        node.dispose();
      });
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
  }
}
