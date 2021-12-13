import { Binding } from './propertyBinder.js';
import { ProtoChain } from './protoChain.js';
import { ProtoProperty, ProtoProperties, Property } from './properties.js';
import { IoNode, RegisterIoNode } from '../io-node.js';
import { IoElement, RegisterIoElement } from '../io-element.js';
const string = (object) => {
    return JSON.stringify(object);
};
class Object1 {
    prop = true;
}
class TestIoNode extends IoNode {
    static get Properties() {
        return {
            label: ''
        };
    }
}
RegisterIoNode(TestIoNode);
export default class {
    run() {
        describe('Properties', () => {
            describe('Property', () => {
                it('Should initialize properly', () => {
                    let protoProp, prop;
                    protoProp = new ProtoProperty();
                    prop = new Property(protoProp);
                    chai.expect(JSON.stringify(protoProp)).to.be.equal(JSON.stringify(prop)).to.be.equal('{"reflect":0,"notify":true,"observe":false,"readonly":false,"strict":false,"enumerable":true}');
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(undefined);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with null argument
                    protoProp = new ProtoProperty(null);
                    prop = new Property(protoProp);
                    chai.expect(JSON.stringify(protoProp)).to.be.equal(JSON.stringify(prop)).to.be.equal('{"value":null,"reflect":0,"notify":true,"observe":false,"readonly":false,"strict":false,"enumerable":true}');
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(null);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an empty object argument
                    protoProp = new ProtoProperty({});
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(undefined);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Number argument
                    protoProp = new ProtoProperty(Number);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal(0);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Number);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with String argument
                    protoProp = new ProtoProperty(String);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal('');
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(String);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Boolean argument
                    protoProp = new ProtoProperty(Boolean);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal(false);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Boolean);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Object argument
                    protoProp = new ProtoProperty(Object);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal({});
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Array argument
                    protoProp = new ProtoProperty(Array);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal([]);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Array);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with custom Object1 argument
                    protoProp = new ProtoProperty(Object1);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal(new Object1());
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object1);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with number argument
                    protoProp = new ProtoProperty(1);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(1);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Number);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with string argument
                    protoProp = new ProtoProperty('test');
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal('test');
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(String);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with boolean argument
                    protoProp = new ProtoProperty(true);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(true);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Boolean);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with object value property
                    const object = { prop: true };
                    protoProp = new ProtoProperty({ value: object });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(object);
                    chai.expect(prop.value).to.be.deep.equal(object);
                    chai.expect(prop.value).not.to.be.equal(object);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with object value property
                    const array = [1, 2, 3];
                    protoProp = new ProtoProperty({ value: array });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(array);
                    chai.expect(prop.value).to.be.deep.equal(array);
                    chai.expect(prop.value).not.to.be.equal(array);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Array);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with custom object1 value property
                    const object1 = new Object1();
                    protoProp = new ProtoProperty({ value: object1 });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(object1);
                    chai.expect(prop.value).to.be.equal(object1);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object1);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with custom Object1 type property
                    protoProp = new ProtoProperty({ type: Object1 });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal(new Object1());
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object1);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                });
                it('Should initialize binding properly', () => {
                    let protoProp, prop;
                    let binding = new Binding(new TestIoNode({ label: 'lorem' }), 'label');
                    protoProp = new ProtoProperty(binding);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal('lorem');
                    const node = new TestIoNode({ label: 'lorem' });
                    binding = new Binding(node, 'label');
                    protoProp = new ProtoProperty({ binding: binding, value: 'ipsum' });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                    chai.expect(protoProp.value).to.be.equal('ipsum');
                    chai.expect(prop.value).to.be.equal('lorem');
                });
            });
            describe('Properties', () => {
                it('Should correctly initialize properties from protochain', () => {
                    class Object1 extends IoNode {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 0
                                },
                                _prop: null
                            };
                        }
                    }
                    RegisterIoNode(Object1);
                    class Object2 extends Object1 {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 2,
                                    notify: false,
                                    observe: true,
                                    strict: false,
                                    enumerable: false,
                                },
                                _prop: {
                                    notify: true,
                                    enumerable: true,
                                },
                                prop3: ''
                            };
                        }
                    }
                    RegisterIoNode(Object2);
                    const node1 = new Object1();
                    const node2 = new Object2();
                    const protoProps1 = node1.__protoProperties;
                    const protoProps2 = node2.__protoProperties;
                    const props1 = node1.__properties;
                    const props2 = node2.__properties;
                    chai.expect(string(Object.keys(props1))).to.be.equal(string(['lazy', 'prop1']));
                    chai.expect(string(Object.keys(props2))).to.be.equal(string(['lazy', 'prop3']));
                    chai.expect(props1.__node).to.be.equal(node1);
                    chai.expect(props2.__node).to.be.equal(node2);
                    chai.expect(protoProps1.prop1.value).to.be.equal(0);
                    chai.expect(props1.prop1.value).to.be.equal(0);
                    chai.expect(props1.prop1.type).to.be.equal(Number);
                    chai.expect(props1.prop1.notify).to.be.equal(true);
                    chai.expect(props1.prop1.reflect).to.be.equal(0);
                    chai.expect(props1.prop1.observe).to.be.equal(false);
                    chai.expect(props1.prop1.strict).to.be.equal(false);
                    chai.expect(props1.prop1.enumerable).to.be.equal(true);
                    chai.expect(protoProps2.prop1.value).to.be.equal(2);
                    chai.expect(props2.prop1.value).to.be.equal(2);
                    chai.expect(props2.prop1.type).to.be.equal(Number);
                    chai.expect(props2.prop1.notify).to.be.equal(false);
                    chai.expect(props2.prop1.reflect).to.be.equal(0);
                    chai.expect(props2.prop1.observe).to.be.equal(true);
                    chai.expect(props2.prop1.strict).to.be.equal(false);
                    chai.expect(props2.prop1.enumerable).to.be.equal(false);
                    chai.expect(props1._prop.value).to.be.equal(null);
                    chai.expect(props1._prop.notify).to.be.equal(false);
                    chai.expect(props1._prop.enumerable).to.be.equal(false);
                    chai.expect(props2._prop.value).to.be.equal(null);
                    chai.expect(props2._prop.notify).to.be.equal(false);
                    chai.expect(props2._prop.enumerable).to.be.equal(false);
                });
                it('Should not override explicit property options with implicit', () => {
                    class Object1 {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 2,
                                    notify: false,
                                    reflect: 2,
                                    observe: true,
                                    strict: false,
                                    enumerable: false,
                                },
                            };
                        }
                    }
                    class Object2 extends Object1 {
                        static get Properties() {
                            return {
                                prop1: 'hello',
                            };
                        }
                    }
                    const protochain = new ProtoChain(Object2);
                    const props = new ProtoProperties(protochain);
                    chai.expect(props.prop1.type).to.be.equal(String);
                    chai.expect(props.prop1.notify).to.be.equal(false);
                    chai.expect(props.prop1.reflect).to.be.equal(2);
                    chai.expect(props.prop1.observe).to.be.equal(true);
                    chai.expect(props.prop1.enumerable).to.be.equal(false);
                });
                it('Should correctly initialize bound properties', () => {
                    const binding1 = new Binding(new TestIoNode({ label: 'binding1' }), 'label');
                    const binding2 = new Binding(new TestIoNode({ label: 'binding2' }), 'label');
                    const binding3 = new Binding(new TestIoNode({ label: 'binding3' }), 'label');
                    class Object1 extends IoNode {
                        static get Properties() {
                            return {
                                prop1: binding1,
                            };
                        }
                    }
                    RegisterIoNode(Object1);
                    class Object2 extends Object1 {
                        static get Properties() {
                            return {
                                prop1: {
                                    binding: binding2
                                },
                                _prop3: binding3
                            };
                        }
                    }
                    RegisterIoNode(Object2);
                    const node1 = new Object1();
                    const node2 = new Object2();
                    const props1 = node1.__properties;
                    const props2 = node2.__properties;
                    chai.expect(props1.prop1.binding).to.be.equal(binding1);
                    chai.expect(props2.prop1.binding).to.be.equal(binding2);
                    chai.expect(props2._prop3.binding).to.be.equal(binding3);
                    chai.expect(binding1.__targets[0]).to.be.equal(node1);
                    chai.expect(binding2.__targets[0]).to.be.equal(node2);
                    chai.expect(binding3.__targets[0]).to.be.equal(node2);
                    chai.expect(props1.prop1.value).to.be.equal('binding1');
                    chai.expect(props2.prop1.value).to.be.equal('binding2');
                    chai.expect(props2._prop3.value).to.be.equal('binding3');
                });
                it('Should correctly get/set properties', () => {
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 1
                                },
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const node = new TestIoNode();
                    const properties = node.__properties;
                    chai.expect(properties.get('prop1')).to.be.equal(1);
                    chai.expect(node.prop1).to.be.equal(1);
                    properties.set('prop1', 0);
                    chai.expect(properties.get('prop1')).to.be.equal(0);
                    chai.expect(node.prop1).to.be.equal(0);
                });
                it('Should correctly get/set bound properties', () => {
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                label: '',
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const binding1 = new Binding(new TestIoNode({ label: 'binding1' }), 'label');
                    const binding2 = new Binding(new TestIoNode({ label: 'binding2' }), 'label');
                    class TestIoNode2 extends IoNode {
                        static get Properties() {
                            return {
                                prop1: binding1
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode2);
                    const node = new TestIoNode2().connect();
                    const properties = node.__properties;
                    chai.expect(properties.get('prop1')).to.be.equal('binding1');
                    chai.expect(node.prop1).to.be.equal('binding1');
                    chai.expect(properties.prop1.binding).to.be.equal(binding1);
                    chai.expect(binding1.__targets[0]).to.be.equal(node);
                    properties.set('prop1', binding2);
                    chai.expect(properties.get('prop1')).to.be.equal('binding2');
                    chai.expect(node.prop1).to.be.equal('binding2');
                    chai.expect(binding1.__targets[0]).to.be.equal(undefined);
                    chai.expect(binding2.__targets[0]).to.be.equal(node);
                });
                it('Should execute attribute reflection on IoElement', () => {
                    class TestElementReflection extends IoElement {
                        static get Properties() {
                            return {
                                label: {
                                    value: 'label1',
                                    reflect: 1
                                }
                            };
                        }
                    }
                    RegisterIoElement(TestElementReflection);
                    const element = new TestElementReflection();
                    chai.expect(element.getAttribute('label')).to.be.equal('label1');
                    element.label = 'label2';
                    chai.expect(element.getAttribute('label')).to.be.equal('label2');
                    element.__properties.set('label', 'label3');
                    chai.expect(element.getAttribute('label')).to.be.equal('label3');
                });
                it('Should dipatch queue on object value initialization and value set', () => {
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                prop: Object,
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const node = new TestIoNode();
                    node.addEventListener('prop-changed', ((event) => {
                        const value = event.detail.value;
                        const oldValue = event.detail.oldValue;
                        chai.expect(string(value)).to.be.equal(string({}));
                        chai.expect(oldValue).to.be.equal(undefined);
                    }));
                    node.connect();
                    node.removeEventListener('prop-changed');
                    node.addEventListener('prop-changed', ((event) => {
                        const value = event.detail.value;
                        const oldValue = event.detail.oldValue;
                        chai.expect(string(value)).to.be.equal(string({}));
                        chai.expect(string(oldValue)).to.be.equal(string({}));
                    }));
                    node.prop = {};
                    node.removeEventListener('prop-changed');
                    node.addEventListener('prop-changed', () => {
                        chai.expect('This should never happen!').to.be.equal(true);
                    });
                    node.__properties.set('prop', {}, true);
                    node.disconnect();
                    node.prop = {};
                    node.removeEventListener('prop-changed');
                    node.addEventListener('prop-changed', ((event) => {
                        const value = event.detail.value;
                        const oldValue = event.detail.oldValue;
                        chai.expect(string(value)).to.be.equal(string({}));
                        chai.expect(string(oldValue)).to.be.equal(string({}));
                    }));
                    node.connect();
                    node.prop = {};
                });
                it('Should connect/disconnect node value on initialization and value set', () => {
                    class TestIoNodeValue extends IoNode {
                        static get Properties() {
                            return {
                                prop: Object,
                                propChangeCounter: 0,
                            };
                        }
                        propChanged() {
                            this.propChangeCounter++;
                        }
                    }
                    RegisterIoNode(TestIoNodeValue);
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                prop: TestIoNodeValue
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const node = new TestIoNode();
                    const subIoNode1 = node.prop;
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(0);
                    node.connect();
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(1);
                    subIoNode1.prop = {};
                    subIoNode1.prop = {};
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
                    node.disconnect();
                    subIoNode1.prop = {};
                    subIoNode1.prop = {};
                    subIoNode1.prop = {};
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
                    node.connect();
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);
                    node.prop = new TestIoNodeValue();
                    const subIoNode2 = node.prop;
                    subIoNode1.prop = {};
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);
                    chai.expect(subIoNode2.propChangeCounter).to.be.equal(1);
                });
            });
        });
    }
}
//# sourceMappingURL=properties.test.js.map