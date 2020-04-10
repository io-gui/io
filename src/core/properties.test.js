import {ProtoChain} from './protochain.js';
import {Binding} from './binding.js';
import {IoNode} from './io-node.js';
import {IoElement} from './io-element.js';
import {ProtoProperty, ProtoProperties, Property} from './properties.js';

const string = (object) => {
  return JSON.stringify(object);
};

class TestNode extends IoNode {
  static get Properties() {
    return {
      label: ''
    };
  }
}
TestNode.Register();

export default class {
  run() {
    describe('Properties', () => {
      describe('ProtoProperty', () => {
        it('Should initialize value properly', () => {
          let prop;

          prop = new ProtoProperty();
          chai.expect(Object.prototype.hasOwnProperty.call(prop, 'value')).to.be.equal(true);
          chai.expect(prop.value).to.be.equal(undefined);

          prop = new ProtoProperty(null);
          chai.expect(string(prop)).to.be.equal(string({
            value: null,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty(Number);
          chai.expect(string(prop)).to.be.equal(string({
            value: 0,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
          

          prop = new ProtoProperty(String);
          chai.expect(string(prop)).to.be.equal(string({
            value: '',
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty(Boolean);
          chai.expect(string(prop)).to.be.equal(string({
            value: false,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty(Object);
          chai.expect(string(prop)).to.be.equal(string({
            value: {},
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty(Array);
          chai.expect(string(prop)).to.be.equal(string({
            value: [],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty(1);
          chai.expect(string(prop)).to.be.equal(string({
            value: 1,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty('test');
          chai.expect(string(prop)).to.be.equal(string({
            value: 'test',
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty(true);
          chai.expect(string(prop)).to.be.equal(string({
            value: true,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty({});
          chai.expect(string(prop)).to.be.equal(string({
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          prop = new ProtoProperty([]);
          chai.expect(string(prop)).to.be.equal(string({
            value: [],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          class Object1 {
            constructor() {
              this.prop = true;
            }
          }

          prop = new ProtoProperty({type: Object1});
          chai.expect(string(prop)).to.be.equal(string({
            value: new Object1(),
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
        });
        it('Should initialize type properly', () => {
          let prop;

          prop = new ProtoProperty(Number);
          chai.expect(prop.type).to.be.equal(Number);

          prop = new ProtoProperty(String);
          chai.expect(prop.type).to.be.equal(String);

          prop = new ProtoProperty(Boolean);
          chai.expect(prop.type).to.be.equal(Boolean);

          prop = new ProtoProperty(Object);
          chai.expect(prop.type).to.be.equal(Object);

          prop = new ProtoProperty(Array);
          chai.expect(prop.type).to.be.equal(Array);

          prop = new ProtoProperty(1);
          chai.expect(prop.type).to.be.equal(Number);

          prop = new ProtoProperty('test');
          chai.expect(prop.type).to.be.equal(String);

          prop = new ProtoProperty(true);
          chai.expect(prop.type).to.be.equal(Boolean);

          prop = new ProtoProperty({});
          chai.expect(prop.type).to.be.equal(undefined);

          prop = new ProtoProperty([]);
          chai.expect(prop.type).to.be.equal(Array);

          class Object1 {}

          prop = new ProtoProperty({value: new Object1()});
          chai.expect(prop.type).to.be.equal(Object1);
        });
        it('Should initialize binding properly', () => {
          let prop, binding = new Binding(new TestNode({label: 'lorem'}), 'label');

          prop = new ProtoProperty(binding);
          chai.expect(prop.binding).to.be.equal(binding);
          chai.expect(prop.value).to.be.equal('lorem');

          let node = new TestNode({label: 'lorem'});
          binding = new Binding(node, 'label');

          prop = new ProtoProperty({binding: binding});
          chai.expect(prop.binding).to.be.equal(binding);
          chai.expect(prop.value).to.be.equal('lorem');
        });
        it('Should initialize array value properly', () => {
          let prop, cfg = {value: [0, 1, 2, true]};

          prop = new ProtoProperty(cfg);
          chai.expect(prop.value).not.to.be.equal(cfg.value);
          chai.expect(string(prop)).to.be.equal(string({
            value: [0, 1, 2, true],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          cfg = [0, 1, 2, true];
          prop = new ProtoProperty(cfg);
          chai.expect(prop.value).not.to.be.equal(cfg);
          chai.expect(string(prop)).to.be.equal(string({
            value: [0, 1, 2, true],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
        });
        it('Should initialize empty object value properly', () => {
          let prop, cfg = {value: {}};

          prop = new ProtoProperty(cfg);
          chai.expect(prop.value).not.to.be.equal(cfg.value);          
          chai.expect(string(prop)).to.be.equal(string({
            value: {},
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          cfg = {};
          prop = new ProtoProperty(cfg);
          chai.expect(prop.value).not.to.be.equal(cfg);
          chai.expect(string(prop)).to.be.equal(string({
            value: undefined,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
        });
      });
      describe('ProtoProperties', () => {
        it('Should correctly initialize properties from protochain', () => {

          class Object1 {
            static get Properties() {
              return {
                prop1: {
                  value: 0
                },
                _prop: null
              };
            }
          }

          class Object2 extends Object1 {
            static get Properties() {
              return {
                prop1: {
                  value: 2,
                  notify: false,
                  observe: true,
                  enumerable: false,
                },
                _prop: {
                  notify: true,
                  enumerable: true,
                }
              };
            }
          }

          const protochain1 = new ProtoChain(Object1.prototype);
          const protochain2 = new ProtoChain(Object2.prototype);
          const props1 = new ProtoProperties(protochain1);
          const props2 = new ProtoProperties(protochain2);

          chai.expect(string(props1.prop1)).to.be.equal(string({
            value: 0,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          chai.expect(string(props2.prop1)).to.be.equal(string({
            value: 2,
            notify: false,
            reflect: 0,
            observe: true,
            enumerable: false
          }));

          chai.expect(props1._prop.notify).to.be.equal(false);
          chai.expect(props1._prop.enumerable).to.be.equal(false);
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

          const protochain = new ProtoChain(Object2.prototype);
          const props = new ProtoProperties(protochain);

          chai.expect(props.prop1.type).to.be.equal(String);
          chai.expect(props.prop1.notify).to.be.equal(false);
          chai.expect(props.prop1.reflect).to.be.equal(2);
          chai.expect(props.prop1.observe).to.be.equal(true);
          chai.expect(props.prop1.enumerable).to.be.equal(false);
        });
      });
      describe('Property', () => {
        it('Should initialize value properly', () => {
          let prop, protoProp;

          protoProp = new ProtoProperty();
          prop = new Property(protoProp);
          chai.expect(Object.prototype.hasOwnProperty.call(prop, 'value')).to.be.equal(true);
          chai.expect(prop.value).to.be.equal(undefined);

          protoProp = new ProtoProperty(null);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: null,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty(Number);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: 0,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
          

          protoProp = new ProtoProperty(String);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: '',
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty(Boolean);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: false,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty(Object);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: {},
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty(Array);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: [],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty(1);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: 1,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty('test');
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: 'test',
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty(true);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: true,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty({});
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          protoProp = new ProtoProperty([]);
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: [],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          class Object1 {
            constructor() {
              this.prop = true;
            }
          }

          protoProp = new ProtoProperty({type: Object1});
          prop = new Property(protoProp);
          chai.expect(string(prop)).to.be.equal(string({
            value: new Object1(),
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
        });
        it('Should initialize type properly', () => {
          let prop, protoProp;

          protoProp = new ProtoProperty(Number);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Number);

          protoProp = new ProtoProperty(String);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(String);

          protoProp = new ProtoProperty(Boolean);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Boolean);

          protoProp = new ProtoProperty(Object);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Object);

          protoProp = new ProtoProperty(Array);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Array);

          protoProp = new ProtoProperty(1);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Number);

          protoProp = new ProtoProperty('test');
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(String);

          protoProp = new ProtoProperty(true);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Boolean);

          protoProp = new ProtoProperty({});
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(undefined);

          protoProp = new ProtoProperty([]);
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Array);

          class Object1 {}

          protoProp = new ProtoProperty({value: new Object1()});
          prop = new Property(protoProp);
          chai.expect(prop.type).to.be.equal(Object1);
        });
        it('Should initialize binding properly', () => {
          let prop, protoProp, binding = new Binding(new TestNode({label: 'lorem'}), 'label');

          protoProp = new ProtoProperty(binding);
          prop = new Property(protoProp);
          chai.expect(prop.binding).to.be.equal(binding);
          chai.expect(prop.value).to.be.equal('lorem');
          
          protoProp = new ProtoProperty({binding: binding});
          prop = new Property(protoProp);
          chai.expect(prop.binding).to.be.equal(binding);
          chai.expect(prop.value).to.be.equal('lorem');
        });
        it('Should initialize array value properly', () => {
          let prop, protoProp, cfg = {value: [0, 1, 2, true]};

          protoProp = new ProtoProperty(cfg);
          prop = new Property(protoProp);
          chai.expect(prop.value).not.to.be.equal(cfg.value);
          chai.expect(string(prop)).to.be.equal(string({
            value: [0, 1, 2, true],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          cfg = [0, 1, 2, true];
          protoProp = new ProtoProperty(cfg);
          prop = new Property(protoProp);
          chai.expect(prop.value).not.to.be.equal(cfg);
          chai.expect(string(prop)).to.be.equal(string({
            value: [0, 1, 2, true],
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
        });
        it('Should initialize empty object value properly', () => {
          let prop, protoProp, cfg = {value: {}};

          protoProp = new ProtoProperty(cfg);
          prop = new Property(protoProp);
          chai.expect(prop.value).not.to.be.equal(cfg.value);          
          chai.expect(string(prop)).to.be.equal(string({
            value: {},
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          cfg = {};
          protoProp = new ProtoProperty(cfg);
          prop = new Property(protoProp);
          chai.expect(prop.value).not.to.be.equal(cfg);
          chai.expect(string(prop)).to.be.equal(string({
            value: undefined,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));
        });
      });
      describe('Properties', () => {
        it('Should correctly initialize properties', () => {
          class Object1 extends IoNode {
            static get Properties() {
              return {
                prop1: {
                  value: 0,
                  enumerable: true,
                },
                _prop: null
              };
            }
          }
          Object1.Register();
          
          class Object2 extends Object1 {
            static get Properties() {
              return {
                prop1: {
                  value: 2,
                  notify: false,
                  observe: true,
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
          Object2.Register();

          const node1 = new Object1();
          const node2 = new Object2();

          const props1 = node1.__properties;
          const props2 = node2.__properties;

          chai.expect(string(Object.keys(props1))).to.be.equal(string(['lazy', 'prop1']));
          chai.expect(string(Object.keys(props2))).to.be.equal(string(['lazy', 'prop3']));

          chai.expect(props1.__node).to.be.equal(node1);
          chai.expect(props2.__node).to.be.equal(node2);

          chai.expect(string(props1.prop1)).to.be.equal(string({
            value: 0,
            notify: true,
            reflect: 0,
            observe: false,
            enumerable: true
          }));

          chai.expect(string(props2.prop1)).to.be.equal(string({
            value: 2,
            notify: false,
            reflect: 0,
            observe: true,
            enumerable: false
          }));

          chai.expect(props1._prop.notify).to.be.equal(false);
          chai.expect(props1._prop.enumerable).to.be.equal(false);
          chai.expect(props2._prop.notify).to.be.equal(false);
          chai.expect(props2._prop.enumerable).to.be.equal(false);
        });
        it('Should correctly initialize bound properties', () => {
          const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
          const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');
          const binding3 = new Binding(new TestNode({label: 'binding3'}), 'label');

          class Object1 extends IoNode {
            static get Properties() {
              return {
                prop1: binding1,
              };
            }
          }
          Object1.Register();
          
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
          Object2.Register();

          const node1 = new Object1();
          const node2 = new Object2();

          const props1 = node1.__properties;
          const props2 = node2.__properties;

          chai.expect(props1.prop1.binding).to.be.equal(binding1);
          chai.expect(props2.prop1.binding).to.be.equal(binding2);
          chai.expect(props2._prop3.binding).to.be.equal(binding3);

          chai.expect(binding1.targets[0]).to.be.equal(node1);
          chai.expect(binding2.targets[0]).to.be.equal(node2);
          chai.expect(binding3.targets[0]).to.be.equal(node2);

          chai.expect(props1.prop1.value).to.be.equal('binding1');
          chai.expect(props2.prop1.value).to.be.equal('binding2');
          chai.expect(props2._prop3.value).to.be.equal('binding3');
        });
        it('Should correctly get/set properties', () => {
          
          class TestNode extends IoNode {
            static get Properties() {
              return {
                prop1: {
                  value: 1
                },
              };
            }
          }
          TestNode.Register();

          const node = new TestNode();
          const properties = node.__properties;

          chai.expect(properties.get('prop1')).to.be.equal(1);
          chai.expect(node.prop1).to.be.equal(1);
          properties.set('prop1', 0);
          chai.expect(properties.get('prop1')).to.be.equal(0);
          chai.expect(node.prop1).to.be.equal(0);
        });
        it('Should correctly get/set bound properties', () => {

          class TestNode extends IoNode {
            static get Properties() {
              return {
                label: '',
              };
            }
          }
          TestNode.Register();

          const binding1 = new Binding(new TestNode({label: 'binding1'}), 'label');
          const binding2 = new Binding(new TestNode({label: 'binding2'}), 'label');
          
          class TestNode2 extends IoNode {
            static get Properties() {
              return {
                prop1: binding1
              };
            }
          }
          TestNode2.Register();

          const node = new TestNode2();
          const properties = node.__properties;

          chai.expect(properties.get('prop1')).to.be.equal('binding1');
          chai.expect(node.prop1).to.be.equal('binding1');

          chai.expect(properties.prop1.binding).to.be.equal(binding1);
          chai.expect(binding1.targets[0]).to.be.equal(node);
          
          properties.set('prop1', binding2);
          chai.expect(properties.get('prop1')).to.be.equal('binding2');
          chai.expect(node.prop1).to.be.equal('binding2');

          chai.expect(binding1.targets[0]).to.be.equal(undefined);
          chai.expect(binding2.targets[0]).to.be.equal(node);
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
          TestElementReflection.Register();

          const element = new TestElementReflection();
          chai.expect(element.getAttribute('label')).to.be.equal('label1');
          element.label = 'label2';
          chai.expect(element.getAttribute('label')).to.be.equal('label2');
          element.__properties.set('label', 'label3');
          chai.expect(element.getAttribute('label')).to.be.equal('label3');
        });
        it('Should dipatch queue on object value initialization and value set', () => {
          class TestNode extends IoNode {
            static get Properties() {
              return {
                prop: Object,
              };
            }
          }
          TestNode.Register();

          const node = new TestNode();

          node.addEventListener('prop-changed', (event) => {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            chai.expect(string(value)).to.be.equal(string({}));
            chai.expect(oldValue).to.be.equal(undefined);
          });

          node.connect();

          node.removeEventListener('prop-changed');
          
          node.addEventListener('prop-changed', (event) => {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            chai.expect(string(value)).to.be.equal(string({}));
            chai.expect(string(oldValue)).to.be.equal(string({}));
          });
          
          node.prop = {};
          
          node.removeEventListener('prop-changed');
          
          node.addEventListener('prop-changed', () => {
            chai.expect('This should never happen!').to.be.equal(true);
          });

          node.__properties.set('prop', {}, true);

          node.disconnect();
          node.prop = {};

          node.removeEventListener('prop-changed');

          node.addEventListener('prop-changed', (event) => {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            chai.expect(string(value)).to.be.equal(string({}));
            chai.expect(string(oldValue)).to.be.equal(string({}));
          });

          node.connect();
          node.prop = {};
        });
        it('Should connect/disconnect node value on initialization and value set', () => {
          class TestNodeValue extends IoNode {
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
          TestNodeValue.Register();

          class TestNode extends IoNode {
            static get Properties() {
              return {
                prop: TestNodeValue
              };
            }
          }
          TestNode.Register();

          const node = new TestNode();
          const subNode1 = node.prop;
          chai.expect(subNode1.propChangeCounter).to.be.equal(0);
          node.connect();
          chai.expect(subNode1.propChangeCounter).to.be.equal(1);
          subNode1.prop = {};
          subNode1.prop = {};
          chai.expect(subNode1.propChangeCounter).to.be.equal(3);
          node.disconnect();
          subNode1.prop = {};
          subNode1.prop = {};
          subNode1.prop = {};
          chai.expect(subNode1.propChangeCounter).to.be.equal(3);
          node.connect();
          chai.expect(subNode1.propChangeCounter).to.be.equal(4);
          
          node.prop = new TestNodeValue();
          const subNode2 = node.prop;
          subNode1.prop = {};
          
          chai.expect(subNode1.propChangeCounter).to.be.equal(4);
          chai.expect(subNode2.propChangeCounter).to.be.equal(1);
        });
      });
    });
  }
}
