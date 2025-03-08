import { Binding, IoNode, Register, PropertyDefinitions } from '../../iogui.js';
import { expect } from 'chai';

@Register
class TestIoNode extends IoNode {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: 0,
      prop2: 0,
    };
  }
}

export default class {
  run() {
    describe('binding.test.ts', () => {
      it('Should initialize with correct default values', () => {
        const node = new TestIoNode();
        const binding = new Binding(node, 'prop1');
        expect(binding.node).to.be.equal(node);
        expect(binding.property).to.be.equal('prop1');
        expect(binding.targets instanceof Array).to.be.equal(true);
        expect(binding.targets.length).to.be.equal(0);
        expect(binding.targetProperties instanceof WeakMap).to.be.equal(true);
      });
      it('Should set source and target property values', () => {
        const node = new TestIoNode();
        const binding = new Binding(node, 'prop1');
        node.prop1 = 1;
        expect(binding.value).to.be.equal(1);
        node.prop1 = 2;
        expect(binding.value).to.be.equal(2);
        binding.value = 3;
        expect(node.prop1).to.be.equal(3);
        const targetNode = new TestIoNode();
        binding.addTarget(targetNode, 'prop1');
        expect(targetNode.prop1).to.be.equal(3);
        targetNode.prop1 = 4;
        expect(binding.value).to.be.equal(4);
        node.prop1 = 5;
        expect(targetNode.prop1).to.be.equal(5);
        expect(binding.value).to.be.equal(5);
        binding.value = 6;
        expect(node.prop1).to.be.equal(6);
        expect(targetNode.prop1).to.be.equal(6);
      });
      it('Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`', () => {
        const srcIoNode = new TestIoNode();
        const binding0 = new Binding(srcIoNode, 'prop1');
        const binding1 = new Binding(srcIoNode, 'prop2');

        const dstIoNode0 = new TestIoNode();
        const dstIoNode1 = new TestIoNode();

        binding0.addTarget(dstIoNode0, 'prop1');
        binding1.addTarget(dstIoNode0, 'prop2');
        binding1.addTarget(dstIoNode1, 'prop1');
        binding1.addTarget(dstIoNode1, 'prop2');

        expect(srcIoNode._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding0.onSourceChanged]],
          'prop2-changed': [[binding1.onSourceChanged]]
        });

        expect(dstIoNode0._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding0.onTargetChanged]],
          'prop2-changed': [[binding1.onTargetChanged]]
        });

        expect(dstIoNode1._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding1.onTargetChanged]],
          'prop2-changed': [[binding1.onTargetChanged]]
        });

        expect(binding0.targets[0]).to.be.equal(dstIoNode0);
        expect(binding0.targets[1]).to.be.equal(undefined);
        expect(binding1.targets[0]).to.be.equal(dstIoNode0);
        expect(binding1.targets[1]).to.be.equal(dstIoNode1);
        expect(binding1.targets[2]).to.be.equal(undefined);

        expect(dstIoNode0._properties.get('prop1')!.binding).to.be.equal(binding0);
        expect(dstIoNode0._properties.get('prop2')!.binding).to.be.equal(binding1);
        expect(dstIoNode1._properties.get('prop1')!.binding).to.be.equal(binding1);
        expect(dstIoNode1._properties.get('prop2')!.binding).to.be.equal(binding1);

        const binding0target0Props = binding0.getTargetProperties(dstIoNode0);
        const binding0target1Props = binding0.getTargetProperties(dstIoNode1);
        expect(binding0target0Props[0]).to.be.equal('prop1');
        expect(binding0target0Props.length).to.be.equal(1);
        expect(binding0target1Props.length).to.be.equal(0);

        const binding1target0Props = binding1.getTargetProperties(dstIoNode0);
        const binding1target1Props = binding1.getTargetProperties(dstIoNode1);
        expect(binding1target0Props[0]).to.be.equal('prop2');
        expect(binding1target0Props.length).to.be.equal(1);
        expect(binding1target1Props[0]).to.be.equal('prop1');
        expect(binding1target1Props[1]).to.be.equal('prop2');
        expect(binding1target1Props.length).to.be.equal(2);

        binding1.removeTarget(dstIoNode1, 'prop1');
        expect(binding1target1Props[0]).to.be.equal('prop2');
        expect(binding1target1Props.length).to.be.equal(1);
        expect(dstIoNode1._properties.get('prop1')!.binding).to.be.equal(undefined);

        expect(dstIoNode1._eventDispatcher.addedListeners).to.be.eql({
          'prop2-changed': [[binding1.onTargetChanged]]
        });

        binding1.addTarget(dstIoNode1, 'prop1');
        expect(binding1target1Props.length).to.be.equal(2);
        expect(dstIoNode1._properties.get('prop1')!.binding).to.be.equal(binding1);
        binding1.removeTarget(dstIoNode1);
        expect(binding1target1Props.length).to.be.equal(0);
        expect(dstIoNode1._properties.get('prop1')!.binding).to.be.equal(undefined);
        expect(dstIoNode1._properties.get('prop2')!.binding).to.be.equal(undefined);

        expect(dstIoNode1._eventDispatcher.addedListeners).to.be.eql({});
      });
      it('Should remove existing binding from target if `.addTarget()` causes a binding collision', () => {
        const srcIoNode1 = new TestIoNode();
        const binding1 = new Binding(srcIoNode1, 'prop1');
        const dstIoNode1 = new TestIoNode();
        binding1.addTarget(dstIoNode1, 'prop1');

        const srcIoNode2 = new TestIoNode();
        const binding2 = new Binding(srcIoNode2, 'prop1');

        expect(binding1.targets).to.be.include(dstIoNode1);
        let binding1targetProps = binding1.getTargetProperties(dstIoNode1);
        expect(binding1targetProps.length).to.be.equal(1);
        expect(binding1targetProps[0]).to.be.equal('prop1');

        binding2.addTarget(dstIoNode1, 'prop1');

        expect(binding1.targets).to.be.eql([]);
        binding1targetProps = binding1.getTargetProperties(dstIoNode1);
        expect(binding1targetProps.length).to.be.equal(0);
      });
      it('Should dispose correctly', () => {
        const node = new TestIoNode();
        const dstIoNode = new TestIoNode();
        const binding = new Binding(node, 'prop1');
        binding.addTarget(dstIoNode, 'prop1');

        expect(node._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding.onSourceChanged]]
        });

        expect(dstIoNode._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding.onTargetChanged]],
        });

        binding.dispose();
        expect(binding.node).to.be.equal(undefined);
        expect(binding.property).to.be.equal(undefined);
        expect(binding.targets).to.be.equal(undefined);
        expect(binding.targetProperties).to.be.equal(undefined);
        expect(dstIoNode._properties.get('prop1')!.binding).to.be.equal(undefined);

        expect(node._eventDispatcher.addedListeners).to.be.eql({});

        expect(dstIoNode._eventDispatcher.addedListeners).to.be.eql({});
      });
    });
  }
}
