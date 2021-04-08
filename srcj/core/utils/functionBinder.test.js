import { ProtoChain } from './protoChain.js';
import { FunctionBinder } from './functionBinder.js';
class Node1 {
    function1() { }
    onFunction1() { }
    _function1() { }
}
class Node2 extends Node1 {
    function2() { }
    onFunction2() { }
    _function2() { }
}
export default class {
    run() {
        describe('Functions', () => {
            it('Should include all functions starting with "on" or "_"', () => {
                const protoChain = new ProtoChain(Node2.prototype);
                const functionBinder = new FunctionBinder(protoChain);
                chai.expect(JSON.stringify(functionBinder)).to.be.equal(JSON.stringify(['onFunction1', '_function1', 'onFunction2', '_function2']));
            });
            it('Should bind all "on" and "_" functions to `this` with `.bind()`', () => {
                const protoChain = new ProtoChain(Node2.prototype);
                const functionBinder = new FunctionBinder(protoChain);
                const node = new Node2();
                functionBinder.bind(node);
                chai.expect(node.function1.name).to.be.equal('function1');
                chai.expect(node.onFunction1.name).to.be.equal('bound onFunction1');
                chai.expect(node._function1.name).to.be.equal('bound _function1');
                chai.expect(node.function2.name).to.be.equal('function2');
                chai.expect(node.onFunction2.name).to.be.equal('bound onFunction2');
                chai.expect(node._function2.name).to.be.equal('bound _function2');
            });
        });
    }
}
//# sourceMappingURL=functionBinder.test.js.map