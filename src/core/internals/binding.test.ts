import {Binding, IoNode, RegisterIoNode} from '../../iogui.js';

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
    describe('Binding', () => {
      it('Should initialize with correct default values', () => {
        const node = new TestIoNode();
        const binding = new Binding(node, 'prop1') as any;
        chai.expect(binding.node).to.be.equal(node);
        chai.expect(binding.property).to.be.equal('prop1');
        chai.expect(binding.targets instanceof Array).to.be.equal(true);
        chai.expect(binding.targets.length).to.be.equal(0);
        chai.expect(binding.targetProperties instanceof WeakMap).to.be.equal(true);
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
      });
      it('Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`', () => {
        const srcIoNode = new TestIoNode();
        const binding0 = new Binding(srcIoNode, 'prop1') as any;
        const binding1 = new Binding(srcIoNode, 'prop2') as any;

        const dstIoNode0 = new TestIoNode();
        const dstIoNode1 = new TestIoNode();

        binding0.addTarget(dstIoNode0, 'prop1');
        binding1.addTarget(dstIoNode0, 'prop2');
        binding1.addTarget(dstIoNode1, 'prop1');
        binding1.addTarget(dstIoNode1, 'prop2');

        chai.expect(binding0.targets[0]).to.be.equal(dstIoNode0);
        chai.expect(binding0.targets[1]).to.be.equal(undefined);
        chai.expect(binding1.targets[0]).to.be.equal(dstIoNode0);
        chai.expect(binding1.targets[1]).to.be.equal(dstIoNode1);
        chai.expect(binding1.targets[2]).to.be.equal(undefined);

        const binding0target0Props = binding0.getTargetProperties(dstIoNode0);
        const binding0target1Props = binding0.getTargetProperties(dstIoNode1);
        chai.expect(binding0target0Props[0]).to.be.equal('prop1');
        chai.expect(binding0target0Props.length).to.be.equal(1);
        chai.expect(binding0target1Props.length).to.be.equal(0);

        const binding1target0Props = binding1.getTargetProperties(dstIoNode0);
        const binding1target1Props = binding1.getTargetProperties(dstIoNode1);
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
        const node = new TestIoNode();
        const binding = new Binding(node, 'prop1') as any;
        binding.dispose();
        chai.expect(binding.node).to.be.equal(undefined);
        chai.expect(binding.property).to.be.equal(undefined);
        chai.expect(binding.targets).to.be.equal(undefined);
        chai.expect(binding.targetProperties).to.be.equal(undefined);
      });
    });
  }
}
