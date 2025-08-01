import { Change, Binding, Node, Register, ReactivePropertyDefinitions, IoElement, ListenerDefinitions, nextQueue } from '../index.js';

export default class {
  run() {
    describe('Node', () => {
      it('Should have all core API functions defined', () => {
        const node = new Node();
        expect(node.setProperty).to.be.a('function');
        expect(node.applyProperties).to.be.a('function');
        expect(node.setProperties).to.be.a('function');
        expect(node.changed).to.be.a('function');
        expect(node.queue).to.be.a('function');
        expect(node.dispatchQueue).to.be.a('function');
        expect(node.throttle).to.be.a('function');
        expect(node.debounce).to.be.a('function');
        expect(node.onPropertyMutated).to.be.a('function');
        expect(node.bind).to.be.a('function');
        expect(node.unbind).to.be.a('function');
        expect(node.addEventListener).to.be.a('function');
        expect(node.removeEventListener).to.be.a('function');
        expect(node.dispatch).to.be.a('function');
        expect(node.dispose).to.be.a('function');
        node.dispose();
      });
      it('Should register reactive property definitions with correct defaults', () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop0: { type: String },
              prop1: { value: false },
              prop2: -1,
              prop3: Number,
              prop4: {type: Object, init: null},
              prop5: [0, 1, 2],
              prop6: { value: 'hello', type: String },
              prop7: { value: true, type: Boolean },
              prop8: { value: 1, type: Number },
              prop9: { type: Array, init: [1, 2, 3] },
              prop10: { type: Array, init: null },
            };
          }
        }

        const node = new TestNode() as any;

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
        expect(node.prop10).to.be.eql([]);

        expect(node._reactiveProperties.get('prop0')).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop1')).to.be.eql({
          value: false,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop2')).to.be.eql({
          value: -1,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop3')).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop4')).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: false,
          init: null,
        });
        expect(node._reactiveProperties.get('prop5')).to.be.eql({
          value: [0, 1, 2],
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop6')).to.be.eql({
          value: 'hello',
          type: String,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop7')).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop8')).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(node._reactiveProperties.get('prop9')).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: false,
          init: [1, 2, 3],
        });
        expect(node._reactiveProperties.get('prop10')).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: false,
          init: null,
        });
        node.dispose();
      });
      it('Should aggregate reactive property definitions from prototype chain', () => {
        @Register
        class Object1 extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
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
          static get ReactiveProperties(): ReactivePropertyDefinitions {
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

        const protoProps1 = node1._protochain.reactiveProperties;
        const protoProps2 = node2._protochain.reactiveProperties;

        expect(Array.from(node1._reactiveProperties.keys())).to.be.eql(['reactivity', 'prop1', 'prop2', 'prop3']);
        expect(Array.from(node2._reactiveProperties.keys())).to.be.eql(['reactivity', 'prop1', 'prop2', 'prop3']);

        expect(protoProps1.prop1.value).to.be.equal(0);
        expect(node1._reactiveProperties.get('prop1')).to.be.eql({
          value: 0,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });

        expect(protoProps2.prop1.value).to.be.eql('asd');
        expect(node2._reactiveProperties.get('prop1')).to.be.eql({
          value: 'asd',
          type: undefined,
          binding: undefined,
          reflect: false,
          init: false,
        });
        expect(node2._reactiveProperties.get('prop2')).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: true,
        });
        expect(node2._reactiveProperties.get('prop3')).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: true,
          init: undefined,
        });
      });
      it('Should correctly register properties with bindings', () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): any {
            return {
              label: ''
            };
          }
          constructor(args?: any) {super(args);}
        }

        const binding1 = new Binding(new TestNode({label: 'label1'}), 'label');
        const binding2 = new Binding(new TestNode({label: 'label2'}), 'label');
        const binding3 = new Binding(new TestNode({label: 'label3'}), 'label');

        @Register
        class Object1 extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: binding1,
            };
          }
        }

        @Register
        class Object2 extends Object1 {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
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

        expect(node1._reactiveProperties.get('prop1')!.binding).to.be.equal(binding1);
        expect(node2._reactiveProperties.get('prop1')!.binding).to.be.equal(binding2);
        expect(node2._reactiveProperties.get('prop3')!.binding).to.be.equal(binding3);

        expect((binding1).targets[0]).to.be.equal(node1);
        expect((binding2).targets[0]).to.be.equal(node2);
        expect((binding3).targets[0]).to.be.equal(node2);

        expect(node1._reactiveProperties.get('prop1')!.value).to.be.equal('label1');
        expect(node2._reactiveProperties.get('prop1')!.value).to.be.equal('label2');
        expect(node2._reactiveProperties.get('prop3')!.value).to.be.equal('label3');
      });
      it('Should correctly get/set properties', () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: {
                value: 1
              },
            };
          }
        }

        const node = new TestNode() as any;

        expect(node._reactiveProperties.get('prop1')!.value).to.be.equal(1);
        expect(node.prop1).to.be.equal(1);
        node.setProperty('prop1', 0);
        expect(node._reactiveProperties.get('prop1')!.value).to.be.equal(0);
        expect(node.prop1).to.be.equal(0);
      });
      it('Should correctly get/set bound properties', () => {

        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              label: '',
            };
          }
          constructor(args?: any) {super(args);}
        }

        const binding1 = new Binding(new TestNode({label: 'label1'}), 'label');
        const binding2 = new Binding(new TestNode({label: 'label2'}), 'label');

        @Register
        class TestNode2 extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: binding1
            };
          }
        }

        const node = new TestNode2() as any;

        expect(node._reactiveProperties.get('prop1')!.value).to.be.equal('label1');
        expect(node.prop1).to.be.equal('label1');

        expect(node._reactiveProperties.get('prop1')!.binding).to.be.equal(binding1);
        expect((binding1).targets[0]).to.be.equal(node);

        node.setProperty('prop1', binding2);
        expect(node._reactiveProperties.get('prop1')!.value).to.be.equal('label2');
        expect(node.prop1).to.be.equal('label2');

        expect((binding1).targets[0]).to.be.equal(undefined);
        expect((binding2).targets[0]).to.be.equal(node);
      });
      it('Should execute attribute reflection on IoElement', () => {
        @Register
        class TestElementReflection extends IoElement {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              label: {
                value: 'label1',
                reflect: true
              },
              label2: 'label2',
            };
          }
        }

        const element = new TestElementReflection() as any;
        expect(element.getAttribute('label')).to.be.equal('label1');
        expect(element.getAttribute('label2')).to.be.equal(null);
        element.label = 'label2';
        expect(element.getAttribute('label')).to.be.equal('label2');
        element.setProperty('label', 'label3');
        expect(element.getAttribute('label')).to.be.equal('label3');
      });
      it('Should dispatch "[propName]-changed" events correctly', async () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              propChangedEvents: {type: Array, init: null},
              prop: Number,
            };
          }
          declare propChangedEvents: Change[];
          static get Listeners(): ListenerDefinitions {
            return {
              'prop-changed': 'onPropChanged',
            };
          }
          constructor(args?: any) {super(args);}
          onPropChanged(event: CustomEvent) {
            this.propChangedEvents.push(event.detail);
          }
        }

        const node = new TestNode() as any;
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

        await nextQueue();

        expect(node.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: 1,
        },
        {
          oldValue: 1,
          property: 'prop',
          value: 2,
        }
      ]);

        node.setProperty('prop', 3, true);
        node.prop = 4;

        await nextQueue();

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
        }) as any;

        expect(node3.propChangedEvents).to.be.eql([{
          oldValue: 0,
          property: 'prop',
          value: -1,
        }]);

        node3.propChangedEvents.length = 0;
        node3.reactivity = 'debounced';
        node3.prop = 10;

        expect(node3.propChangedEvents).to.be.eql([]);

        await nextQueue();

        expect(node3.propChangedEvents).to.be.eql([{
          oldValue: -1,
          property: 'prop',
          value: 10,
        }]);

        node3.propChangedEvents.length = 0;
        node3.reactivity = 'none';
        node3.prop = 20;

        expect(node3.propChangedEvents).to.be.eql([]);

        await nextQueue();

        expect(node3.propChangedEvents).to.be.eql([]);
      });
      it('Should execute throttle/debounce queue in FIFO order', async () => {
        let order: number[] = [];
        const node = new Node();
        node.debounce(() => {
          order.push(1);
        });
        node.debounce(() => {
          order.push(2);
        });
        const throttleFuc = () => {
          order.push(0);
        };
        node.throttle(throttleFuc);
        node.throttle(throttleFuc);

        await nextQueue();
        expect(order).to.be.eql([0, 1, 2, 0]);
      });
      it('Should add/remove "io-object-mutation" event listeners to properties of Node type', async () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop: Number,
            };
          }
          constructor(args?: any) {super(args);}
        }

        const subnode = new TestNode();
        const node = new TestNode({
          prop: subnode,
        }) as any;

        expect(subnode._eventDispatcher.addedListeners['io-object-mutation'][0][0]).to.be.equal(node.onPropertyMutated);

        node.prop = null;

        expect(subnode._eventDispatcher.addedListeners['io-object-mutation']).to.be.equal(undefined);

        const subnode2 = new TestNode();
        node.prop = subnode2;

        expect(subnode2._eventDispatcher.addedListeners['io-object-mutation'][0][0]).to.be.equal(node.onPropertyMutated);

        @Register
        class TestNode2 extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop: {type: TestNode, init: null},
            };
          }
        }

        const node2 = new TestNode2() as any;
        const subnode3 = node2.prop;

        expect(subnode3._eventDispatcher.addedListeners['io-object-mutation'][0][0]).to.be.equal(node2.onPropertyMutated);

        node2.dispose();

        expect(subnode3._eventDispatcher.addedListeners['io-object-mutation']).to.be.equal(undefined);

        const node3 = new TestNode2() as any;
        const subnode4 = node3.prop;

        node3.prop = null;

        expect(subnode4._eventDispatcher.addedListeners['io-object-mutation']).to.be.equal(undefined);

        const node4 = new TestNode2() as any;
        const node5 = new TestNode2() as any;
        const subnode5 = node4.prop;
        const subnode6 = node5.prop;

        node4.prop = new Binding(node5, 'prop');

        expect(subnode5._eventDispatcher.addedListeners['io-object-mutation']).to.be.equal(undefined);
        expect(subnode6._eventDispatcher.addedListeners['io-object-mutation'][0][0]).to.be.equal(node5.onPropertyMutated);
        expect(subnode6._eventDispatcher.addedListeners['io-object-mutation'][1][0]).to.be.equal(node4.onPropertyMutated);

      });
      it('Should correctly invoke handler functions on property changes', async () => {
        @Register
        class TestNode extends Node {
          changedCounter = 0;
          prop1Changes: Change[] = [];
          prop2Changes: Change[] = [];
          static get ReactiveProperties(): any {
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

        const node = new TestNode() as any;

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

        await nextQueue();

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

        node.dispose();
      });
      it('Should invoke property mutation handler functions on mutation events', async () => {
        @Register
        class TestSubNode extends Node {
          static get ReactiveProperties(): any {
            return {
              a: {
                value: 0,
              },
            };
          }
        }

        @Register
        class TestNode extends Node {
          changedCounter = 0;
          obj1MutatedCounter = 0;
          obj2MutatedCounter = 0;
          static get ReactiveProperties(): any {
            return {
              obj1: {
                type: TestSubNode, init: null,
              },
              obj2: {
                type: TestSubNode, init: null,
              },
            };
          }
          obj1Mutated() {
            this.obj1MutatedCounter++;
          }
          obj2Mutated() {
            this.obj2MutatedCounter++;
          }
        }

        const node = new TestNode() as any;

        expect(node.changedCounter).to.equal(0);
        expect(node.obj1MutatedCounter).to.equal(0);

        node.obj1.a = 1;

        await nextQueue();

        expect(node.obj1MutatedCounter).to.equal(1);
        expect(node.obj2MutatedCounter).to.equal(0);

        node.obj2.a = 1;

        expect(node.obj2MutatedCounter).to.equal(1);

        await nextQueue();

        node.obj1 = new TestNode();

        await nextQueue();

        expect(node.obj1MutatedCounter).to.equal(1);

        node.obj1.obj1 = {a: 1};

        await nextQueue();

        expect(node.obj1MutatedCounter).to.equal(2);

        node.dispose();
      });
      it('Should correctly bind properties using binding system', () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: String,
              prop2: String,
            };
          }
          constructor(args?: any) {super(args);}
        }

        const node = new TestNode() as any;

        const binding = node.bind('prop1');
        expect(binding).to.be.instanceof(Binding);
        expect(binding.node).to.be.equal(node);
        expect(binding.property).to.be.equal('prop1');

        const boundNode1 = new TestNode({prop1: binding}) as any;
        const boundNode2 = new TestNode({prop1: binding}) as any;
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
      it('Should correctly handle multiple binding re-assignments in setProperties()', async () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: 'subnode1',
              prop2: 'subnode2',
              prop3: 'subnode3',
            };
          }
          constructor(args?: any) {super(args);}
        }

        @Register
        class TestNodeTarget extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              subnode: {type: TestNode, init: null},
              prop1: 'target1',
              prop2: 'target2',
              prop3: 'target3',
            };
          }
          declare subnode: TestNode;
          ready() {
            this.changed();
          }
          changed() {
            this.subnode.setProperties({
              prop1: this.bind('prop1'),
              prop2: this.bind('prop2'),
              prop3: this.bind('prop3'),
            });
          }
        }

        const targetNode = new TestNodeTarget() as any;

        expect(targetNode.subnode.prop1).to.be.equal(targetNode.prop1).to.be.equal('target1');
        expect(targetNode.subnode.prop2).to.be.equal(targetNode.prop2).to.be.equal('target2');
        expect(targetNode.subnode.prop3).to.be.equal(targetNode.prop3).to.be.equal('target3');

        const sourceNode = new TestNode({
          prop1: 'source1',
          prop2: 'source2',
          prop3: 'source3',
        }) as any;

        targetNode.setProperties({
          prop1: sourceNode.bind('prop1'),
          prop2: sourceNode.bind('prop2'),
          prop3: sourceNode.bind('prop3'),
        });

        expect(targetNode.subnode.prop1).to.be.equal(sourceNode.prop1).to.be.equal(targetNode.prop1).to.be.equal('source1');
        expect(targetNode.subnode.prop2).to.be.equal(sourceNode.prop2).to.be.equal(targetNode.prop2).to.be.equal('source2');
        expect(targetNode.subnode.prop3).to.be.equal(sourceNode.prop3).to.be.equal(targetNode.prop3).to.be.equal('source3');

        sourceNode.prop1 = 'test1';
        targetNode.prop2 = 'test2';
        targetNode.subnode.prop3 = 'test3';

        expect(targetNode.subnode.prop1).to.be.equal(sourceNode.prop1).to.be.equal(targetNode.prop1).to.be.equal('test1');
        expect(targetNode.subnode.prop2).to.be.equal(sourceNode.prop2).to.be.equal(targetNode.prop2).to.be.equal('test2');
        expect(targetNode.subnode.prop3).to.be.equal(sourceNode.prop3).to.be.equal(targetNode.prop3).to.be.equal('test3');

        targetNode.setProperties({
          prop1: 'final1',
          prop2: 'final2',
          prop3: 'final3',
        });

        expect(targetNode.subnode.prop1).to.be.equal(sourceNode.prop1).to.be.equal(targetNode.prop1).to.be.equal('final1');
        expect(targetNode.subnode.prop2).to.be.equal(sourceNode.prop2).to.be.equal(targetNode.prop2).to.be.equal('final2');
        expect(targetNode.subnode.prop3).to.be.equal(sourceNode.prop3).to.be.equal(targetNode.prop3).to.be.equal('final3');
      });
      it('Should correctly manage binding targets and target properties', () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: String,
              prop2: String,
            };
          }
          constructor(args?: any) {super(args);}
        }

        const srcNode = new TestNode();
        const binding0 = new Binding(srcNode, 'prop1');
        const binding1 = new Binding(srcNode, 'prop2');

        const dstNode0 = new TestNode() as any;
        dstNode0.prop1 = binding0;
        dstNode0.prop2 = binding1;

        const dstNode1 = new TestNode({prop1: binding0}) as any;
        const dstNode3 = new TestNode({prop1: binding0, prop2: binding0}) as any;

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
      it('Should return existing binding or create new one on bind()', () => {
        @Register
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
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
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
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
