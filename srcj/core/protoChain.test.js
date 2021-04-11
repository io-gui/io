import { ProtoChain } from './protoChain.js';
import { IoNode } from '../components/io-node.js';
import { IoElement } from '../components/io-element.js';
class Array1 extends Array {
}
class Array2 extends Array1 {
}
class Array3 extends Array2 {
}
class Object1 {
}
class Object2 extends Object1 {
}
class Object3 extends Object2 {
}
class HTMLElement1 extends HTMLElement {
}
class HTMLElement2 extends HTMLElement1 {
}
class HTMLElement3 extends HTMLElement2 {
}
class IoNode1 extends IoNode {
}
class IoElement1 extends IoElement {
}
export default class {
    run() {
        describe('ProtoChain', () => {
            it('Should have all prototypes from the inheritance chain', () => {
                let protochain = new ProtoChain(Array3);
                chai.expect(protochain[0]).to.be.equal(Array3);
                chai.expect(protochain[1]).to.be.equal(Array2);
                chai.expect(protochain[2]).to.be.equal(Array1);
                protochain = new ProtoChain(Object3);
                chai.expect(protochain[0]).to.be.equal(Object3);
                chai.expect(protochain[1]).to.be.equal(Object2);
                chai.expect(protochain[2]).to.be.equal(Object1);
                protochain = new ProtoChain(HTMLElement3);
                chai.expect(protochain[0]).to.be.equal(HTMLElement3);
                chai.expect(protochain[1]).to.be.equal(HTMLElement2);
                chai.expect(protochain[2]).to.be.equal(HTMLElement1);
                protochain = new ProtoChain(IoNode1);
                chai.expect(protochain[0]).to.be.equal(IoNode1);
                chai.expect(protochain[1]).to.be.equal(IoNode);
                protochain = new ProtoChain(IoElement1);
                chai.expect(protochain[0]).to.be.equal(IoElement1);
                chai.expect(protochain[1]).to.be.equal(IoElement);
                chai.expect(String(protochain[2])).to.be.equal(String(IoNode.__proto__));
            });
            it('Should terminate at `HTMLElement`, `Object` or `Array`', () => {
                let protochain = new ProtoChain(Array3);
                chai.expect(protochain[3]).to.be.equal(undefined);
                protochain = new ProtoChain(Object3);
                chai.expect(protochain[3]).to.be.equal(undefined);
                protochain = new ProtoChain(HTMLElement3);
                chai.expect(protochain[3]).to.be.equal(undefined);
                protochain = new ProtoChain(IoNode1);
                chai.expect(protochain[2]).to.be.equal(undefined);
                protochain = new ProtoChain(IoElement1);
                chai.expect(protochain[4]).to.be.equal(undefined);
            });
        });
    }
}
//# sourceMappingURL=protoChain.test.js.map