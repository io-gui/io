import {Node} from '../io.js';

const string = (object) => {
  return JSON.stringify(object);
};

class Node1 extends Node {
  function1() {}
  onFunction1() {}
  _function1() {}
}
Node1.Register();

class Node2 extends Node1 {
  function2() {}
  onFunction2() {}
  _function2() {}
}
Node2.Register();

export default class {
  run() {
    describe('Functions', () => {
      it('Should include all functions starting with "on" or "_"', () => {
        const node = new Node2();
        chai.expect(string(node.__protoFunctions)).to.be.equal(string(['onFunction1', '_function1', 'onFunction2', '_function2']));
      });
      it('Should bind all "on" and "_" functions to `this` with `.bind()`', () => {
        const node = new Node2();
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
