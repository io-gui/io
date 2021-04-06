import { Node, RegisterIoNode } from '../node.js';
class TestNode extends Node {
    static get Properties() {
        return {
            prop1: 0,
            prop2: 0,
            prop1ChangeCounter: 0,
            prop2ChangeCounter: 0
        };
    }
    prop1Changed() {
        this.prop1ChangeCounter++;
    }
    prop2Changed() {
        this.prop2ChangeCounter++;
    }
}
RegisterIoNode(TestNode);
const string = (object) => {
    return JSON.stringify(object);
};
export default class {
    run() {
        describe('Binding', () => {
            describe('Binding', () => {
                it('Should initialize with node and node property', () => {
                    const node = new TestNode();
                    const binding1 = node.bind('prop1');
                    chai.expect(binding1.__node).to.be.equal(node);
                    chai.expect(binding1.__property).to.be.equal('prop1');
                });
                it('Should set/return source prop value', () => {
                    const node = new TestNode();
                    const binding1 = node.bind('prop1');
                    node.prop1 = 1;
                    chai.expect(binding1.value).to.be.equal(1);
                    node.prop1 = 2;
                    chai.expect(binding1.value).to.be.equal(2);
                    binding1.value = 3;
                    chai.expect(node.prop1).to.be.equal(3);
                });
                it('Should add/remove targets and __targetProperties when assigned to values', () => {
                    const srcNode = new TestNode();
                    const binding1 = srcNode.bind('prop1');
                    const binding2 = srcNode.bind('prop2');
                    const dstNode1 = new TestNode();
                    dstNode1.connect();
                    dstNode1.prop1 = binding1;
                    dstNode1.prop2 = binding2;
                    const dstNode2 = new TestNode({ prop1: binding1 });
                    dstNode2.connect();
                    const dstNode3 = new TestNode({ prop1: binding1, prop2: binding1 });
                    dstNode3.connect();
                    chai.expect(binding1.__targets[0]).to.be.equal(dstNode1);
                    chai.expect(binding1.__targets[1]).to.be.equal(dstNode2);
                    chai.expect(binding1.__targets[2]).to.be.equal(dstNode3);
                    chai.expect(string(binding1.__targetProperties.get(dstNode1))).to.be.equal(string(['prop1']));
                    chai.expect(string(binding1.__targetProperties.get(dstNode2))).to.be.equal(string(['prop1']));
                    chai.expect(string(binding1.__targetProperties.get(dstNode3))).to.be.equal(string(['prop1', 'prop2']));
                    dstNode1.dispose();
                    dstNode2.disconnect();
                    dstNode3.unbind('prop1');
                    chai.expect(string(binding1.__targetProperties.get(dstNode1))).to.be.equal(string([]));
                    chai.expect(string(binding1.__targetProperties.get(dstNode2))).to.be.equal(string([]));
                    chai.expect(string(binding1.__targetProperties.get(dstNode3))).to.be.equal(string(['prop2']));
                    dstNode2.prop2 = binding1;
                    dstNode2.connect();
                    dstNode3.prop1 = binding1;
                    chai.expect(string(binding1.__targetProperties.get(dstNode2))).to.be.equal(string(['prop2', 'prop1']));
                    chai.expect(string(binding1.__targetProperties.get(dstNode3))).to.be.equal(string(['prop2', 'prop1']));
                });
            });
            describe('BindingManager', () => {
                it('Should return existing binding or create a new on "bind()"', () => {
                    const node = new TestNode();
                    const binding1 = node.bind('prop1');
                    chai.expect(binding1).to.be.equal(node.__bindingManager.__bindings.prop1);
                    chai.expect(binding1).to.be.equal(node.bind('prop1'));
                });
                it('Should dispose bindings correctly', () => {
                    const node1 = new TestNode();
                    const binding1 = node1.bind('prop1');
                    node1.unbind('prop1');
                    chai.expect(undefined).to.be.equal(node1.__bindingManager.__bindings.prop1);
                    chai.expect(binding1.prop1).to.be.equal(undefined);
                    const node2 = new TestNode();
                    const binding2 = node2.bind('prop1');
                    node2.__bindingManager.dispose();
                    chai.expect(undefined).to.be.equal(node2.__bindingManager.__bindings);
                    chai.expect(binding2.prop1).to.be.equal(undefined);
                });
            });
        });
    }
}
//# sourceMappingURL=bindingManager.test.js.map