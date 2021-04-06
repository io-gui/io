import { Node, RegisterIoNode } from '../node.js';
import { Binding, BindingManager } from './bindingManager.js';
class TestNode extends Node {
    static get Properties() {
        return {
            prop1: 0,
            prop2: 0,
        };
    }
}
RegisterIoNode(TestNode);
export default class {
    run() {
        describe('BindingManager', () => {
            it('Should initialize with correct default values', () => {
                const node = new TestNode();
                const binding = new Binding(node, 'prop1');
                chai.expect(binding.__node).to.be.equal(node);
                chai.expect(binding.__property).to.be.equal('prop1');
                chai.expect(binding.__targets instanceof Array).to.be.equal(true);
                chai.expect(binding.__targets.length).to.be.equal(0);
                chai.expect(binding.__targetProperties instanceof WeakMap).to.be.equal(true);
                const bindingManager = new BindingManager(node);
                chai.expect(bindingManager.__node).to.be.equal(node);
                chai.expect(JSON.stringify(bindingManager.__bindings)).to.be.equal('{}');
            });
            it('Should dispose correctly', () => {
                const node = new TestNode();
                const binding = new Binding(node, 'prop1');
                binding.dispose();
                chai.expect(binding.__node).to.be.equal(undefined);
                chai.expect(binding.__property).to.be.equal(undefined);
                chai.expect(binding.__targets).to.be.equal(undefined);
                chai.expect(binding.__targetProperties).to.be.equal(undefined);
                const bindingManager = new BindingManager(node);
                const binding2 = bindingManager.bind('prop1');
                bindingManager.dispose();
                chai.expect(bindingManager.__node).to.be.equal(undefined);
                chai.expect(bindingManager.__bindings).to.be.equal(undefined);
                chai.expect(binding2.__node).to.be.equal(undefined);
                chai.expect(binding2.__property).to.be.equal(undefined);
                chai.expect(binding2.__targets).to.be.equal(undefined);
                chai.expect(binding2.__targetProperties).to.be.equal(undefined);
            });
            it('Should get and set property value on source node with `value` getter/setter', () => {
                const node = new TestNode();
                const binding = new Binding(node, 'prop1');
                node.prop1 = 1;
                chai.expect(binding.value).to.be.equal(1);
                node.prop1 = 2;
                chai.expect(binding.value).to.be.equal(2);
                binding.value = 3;
                chai.expect(node.prop1).to.be.equal(3);
                const bindingManager = new BindingManager(node);
                const binding2 = bindingManager.bind('prop1');
                node.prop1 = 1;
                chai.expect(binding2.value).to.be.equal(1);
                node.prop1 = 2;
                chai.expect(binding2.value).to.be.equal(2);
                binding2.value = 3;
                chai.expect(node.prop1).to.be.equal(3);
            });
            it('Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`', () => {
                const srcNode = new TestNode();
                const binding0 = new Binding(srcNode, 'prop1');
                const binding1 = new Binding(srcNode, 'prop2');
                const dstNode0 = new TestNode();
                const dstNode1 = new TestNode();
                binding0.addTarget(dstNode0, 'prop1');
                binding1.addTarget(dstNode0, 'prop2');
                binding1.addTarget(dstNode1, 'prop1');
                binding1.addTarget(dstNode1, 'prop2');
                chai.expect(binding0.__targets[0]).to.be.equal(dstNode0);
                chai.expect(binding0.__targets[1]).to.be.equal(undefined);
                chai.expect(binding1.__targets[0]).to.be.equal(dstNode0);
                chai.expect(binding1.__targets[1]).to.be.equal(dstNode1);
                const binding0target0Props = binding0._getTargetProperties(dstNode0);
                const binding0target1Props = binding0._getTargetProperties(dstNode1);
                chai.expect(binding0target0Props[0]).to.be.equal('prop1');
                chai.expect(binding0target0Props.length).to.be.equal(1);
                chai.expect(binding0target1Props.length).to.be.equal(0);
                const binding1target0Props = binding1._getTargetProperties(dstNode0);
                const binding1target1Props = binding1._getTargetProperties(dstNode1);
                chai.expect(binding1target0Props[0]).to.be.equal('prop2');
                chai.expect(binding1target0Props.length).to.be.equal(1);
                chai.expect(binding1target1Props[0]).to.be.equal('prop1');
                chai.expect(binding1target1Props[1]).to.be.equal('prop2');
                chai.expect(binding1target1Props.length).to.be.equal(2);
                binding1.removeTarget(dstNode1, 'prop1');
                chai.expect(binding1target1Props[0]).to.be.equal('prop2');
                chai.expect(binding1target1Props.length).to.be.equal(1);
                binding1.addTarget(dstNode1, 'prop1');
                binding1.removeTarget(dstNode1);
                chai.expect(binding1target1Props.length).to.be.equal(0);
            });
        });
    }
}
//# sourceMappingURL=bindingManager.test.js.map