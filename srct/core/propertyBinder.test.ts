import {Binding, PropertyBinder} from './propertyBinder.js';
import {IoNode, RegisterIoNode} from '../components/io-node.js';

class TestIoNode extends IoNode {
  static get Properties(): any {
    return {
      prop1: 0,
      prop2: 0,
    };
  }
}
RegisterIoNode(TestIoNode);

export default class {
  run() {
    describe('PropertyBinder', () => {
      it('Should initialize with correct default values', () => {
        const node = new TestIoNode();
        const binding = new Binding(node, 'prop1') as any;
        chai.expect(binding.__node).to.be.equal(node);
        chai.expect(binding.__property).to.be.equal('prop1');
        chai.expect(binding.__targets instanceof Array).to.be.equal(true);
        chai.expect(binding.__targets.length).to.be.equal(0);
        chai.expect(binding.__targetProperties instanceof WeakMap).to.be.equal(true);
        const propertyBinder = new PropertyBinder(node) as any;
        chai.expect(propertyBinder.__node).to.be.equal(node);
        chai.expect(JSON.stringify(propertyBinder.__bindings)).to.be.equal('{}');
      });
      it('Should get and set property value on source node with `value` getter/setter', () => {
        const node = new TestIoNode();
        const binding = new Binding(node, 'prop1') as any;
        node.prop1 = 1;
        chai.expect(binding.value).to.be.equal(1);
        node.prop1 = 2;
        chai.expect(binding.value).to.be.equal(2);
        binding.value = 3;
        chai.expect(node.prop1).to.be.equal(3);
        const propertyBinder = new PropertyBinder(node) as any;
        const binding2 = propertyBinder.bind('prop1') as any;
        node.prop1 = 1;
        chai.expect(binding2.value).to.be.equal(1);
        node.prop1 = 2;
        chai.expect(binding2.value).to.be.equal(2);
        binding2.value = 3;
        chai.expect(node.prop1).to.be.equal(3);
      });
      it('Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`', () => {
        const srcIoNode = new TestIoNode().connect();
        const binding0 = new Binding(srcIoNode, 'prop1') as any;
        const binding1 = new Binding(srcIoNode, 'prop2') as any;

        const dstIoNode0 = new TestIoNode().connect();
        const dstIoNode1 = new TestIoNode().connect();

        binding0.addTarget(dstIoNode0, 'prop1');
        binding1.addTarget(dstIoNode0, 'prop2');
        binding1.addTarget(dstIoNode1, 'prop1');
        binding1.addTarget(dstIoNode1, 'prop2');

        chai.expect(binding0.__targets[0]).to.be.equal(dstIoNode0);
        chai.expect(binding0.__targets[1]).to.be.equal(undefined);
        chai.expect(binding1.__targets[0]).to.be.equal(dstIoNode0);
        chai.expect(binding1.__targets[1]).to.be.equal(dstIoNode1);
        chai.expect(binding1.__targets[2]).to.be.equal(undefined);

        const binding0target0Props = binding0._getTargetProperties(dstIoNode0);
        const binding0target1Props = binding0._getTargetProperties(dstIoNode1);
        chai.expect(binding0target0Props[0]).to.be.equal('prop1');
        chai.expect(binding0target0Props.length).to.be.equal(1);
        chai.expect(binding0target1Props.length).to.be.equal(0);

        const binding1target0Props = binding1._getTargetProperties(dstIoNode0);
        const binding1target1Props = binding1._getTargetProperties(dstIoNode1);
        chai.expect(binding1target0Props[0]).to.be.equal('prop2');
        chai.expect(binding1target0Props.length).to.be.equal(1);
        chai.expect(binding1target1Props[0]).to.be.equal('prop1');
        chai.expect(binding1target1Props[1]).to.be.equal('prop2');
        chai.expect(binding1target1Props.length).to.be.equal(2);

        binding1.removeTarget(dstIoNode1, 'prop1');
        chai.expect(binding1target1Props[0]).to.be.equal('prop2');
        chai.expect(binding1target1Props.length).to.be.equal(1);

        binding1.addTarget(dstIoNode1, 'prop1');
        binding1.removeTarget(dstIoNode1);
        chai.expect(binding1target1Props.length).to.be.equal(0);
      });
      it('Should dispose correctly', () => {
        const node = new TestIoNode().connect();
        const binding = new Binding(node, 'prop1') as any;
        binding.dispose();
        chai.expect(binding.__node).to.be.equal(undefined);
        chai.expect(binding.__property).to.be.equal(undefined);
        chai.expect(binding.__targets).to.be.equal(undefined);
        chai.expect(binding.__targetProperties).to.be.equal(undefined);
        const propertyBinder = new PropertyBinder(node) as any;
        const binding2 = propertyBinder.bind('prop1') as any;
        propertyBinder.dispose();
        chai.expect(propertyBinder.__node).to.be.equal(undefined);
        chai.expect(propertyBinder.__bindings).to.be.equal(undefined);
        chai.expect(binding2.__node).to.be.equal(undefined);
        chai.expect(binding2.__property).to.be.equal(undefined);
        chai.expect(binding2.__targets).to.be.equal(undefined);
        chai.expect(binding2.__targetProperties).to.be.equal(undefined);
      });
    });
  }
}
