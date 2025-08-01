//@ts-nocheck
import { Register, IoElement, Node, Change, ReactivePropertyDefinitions } from '../index.js';

const element = new IoElement();
element.style.display = 'none';
document.body.appendChild(element as HTMLElement);

const eventStack: string[] = [];

class TestElement extends IoElement {
  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      prop0: {
        reflect: true,
        value: 0,
      },
    };
  }
}
Register(TestElement);

const terstElement = new TestElement();

export default class {
  run() {
    describe('IoElement', () => {
      it('Should have core API functions defined', () => {
        expect(element.render).to.be.a('function');
        expect(element.traverse).to.be.a('function');
        expect(element.setAttribute).to.be.a('function');
        expect(element.$).to.be.a('object');
      });
      it('Should initialize properties correctly', () => {
        // Default properties
        expect(terstElement.prop0).to.equal(0);
        expect(terstElement.getAttribute('prop0')).to.equal('0');
      });
      it('Invokes change events and functions', () => {
        class TestNode extends Node {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop0: 0,
              prop1: '',
            };
          }
          prop0Changed() {
            eventStack.push('TestNode: prop0Changed ' + this.prop0);
          }
          prop1Changed() {
            eventStack.push('TestNode: prop1Changed ' + this.prop1);
          }
          changed() {
            eventStack.push('TestNode: changed');
          }
        }
        Register(TestNode);

        class TestSubelement extends IoElement {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop0: 0,
              prop1: '',
            };
          }
        }
        Register(TestSubelement);

        class TestElement1 extends IoElement {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop0: -1,
              prop1: {
                value: 'default',
              },
              // Internal counters
              _counter: 0,
              _prop0counter: 0,
              _prop0Change: null,
              _prop1counter: 0,
              _prop1Change: null,
            };
          }
          constructor(...initProps: any[]) {
            super(...initProps);
            this.render([{tag: 'test-subelement', props: {
              id: 'subelement',
              prop0: this.bind('prop0'),
              prop1: this.bind('prop1'),
            }}]);
            this.subnode = new TestNode({
              prop0: this.bind('prop0'),
              prop1: this.bind('prop1'),
            });
          }
          changed() {
            eventStack.push('TestElement1: changed');
            this._counter++;
          }
          prop0Changed(change: Change) {
            eventStack.push('TestElement1: prop0Changed ' + this.prop0);
            this._prop0counter++;
            this._prop0Change = change;
          }
          prop1Changed(change: Change) {
            eventStack.push('TestElement1: prop1Changed ' + this.prop1);
            this._prop1counter++;
            this._prop1Change = change;
          }
        }
        Register(TestElement1);

        eventStack.length = 0;

        const element = new TestElement1();
        expect(element.prop0).to.equal(-1);
        expect(element.subnode.prop0).to.equal(-1);
        expect(element.$.subelement.prop0).to.equal(-1);
        expect(element.$.subelement.prop1).to.equal('default');
        expect(element.subnode.prop0).to.equal(-1);
        expect(element.subnode.prop1).to.equal('default');

        expect(element._counter).to.equal(0);
        expect(element._prop0counter).to.equal(0);
        expect(element._prop0Change).to.equal(null);
        expect(element._prop1counter).to.equal(0);
        expect(element._prop1Change).to.equal(null);

        element.subnode.prop0 = 1;

        expect(element.prop0).to.equal(1);
        expect(element.subnode.prop0).to.equal(1);
        expect(element._counter).to.equal(1);
        expect(element._prop0counter).to.equal(1);
        expect(element._prop0Change).to.eql({property: 'prop0', value: 1, oldValue: -1});
        expect(element._prop1counter).to.equal(0);
        expect(element._prop1Change).to.equal(null);

        element.setProperties({
          prop0: 2,
          prop1: 'foo'
        });

        expect(element.prop0).to.equal(2);
        expect(element.subnode.prop0).to.equal(2);
        expect(element.$.subelement.prop0).to.equal(2);
        expect(element.prop1).to.equal('foo');
        expect(element.subnode.prop1).to.equal('foo');
        expect(element.$.subelement.prop1).to.equal('foo');
        expect(element._counter).to.equal(2);
        expect(element._prop0counter).to.equal(2);
        expect(element._prop0Change).to.eql({property: 'prop0', value: 2, oldValue: 1});
        expect(element._prop1counter).to.equal(1);
        expect(element._prop1Change).to.eql({property: 'prop1', value: 'foo', oldValue: 'default'});

        element.subnode.setProperties({
          prop0: 3,
          prop1: 'buzz',
        });

        expect(element.prop0).to.equal(3);
        expect(element.subnode.prop0).to.equal(3);
        expect(element.$.subelement.prop0).to.equal(3);
        expect(element.$.subelement.prop0).to.equal(3);
        expect(element.prop1).to.equal('buzz');
        expect(element.subnode.prop1).to.equal('buzz');
        expect(element.$.subelement.prop1).to.equal('buzz');

        // // NOTE: element.subnode.setProperties on 2 bound properties causes change() event on element twice.
        // // TODO: Consider fixing // expect(element._counter).to.equal(3);
        expect(element._counter).to.equal(4);

        expect(element._prop0counter).to.equal(3);
        expect(element._prop0Change).to.eql({property: 'prop0', value: 3, oldValue: 2});
        expect(element._prop1counter).to.equal(2);
        expect(element._prop1Change).to.eql({property: 'prop1', value: 'buzz', oldValue: 'foo'});

        expect(eventStack).to.eql(
          ['TestNode: prop0Changed -1', 'TestNode: prop1Changed default', 'TestNode: changed', 'TestNode: prop0Changed 1', 'TestElement1: prop0Changed 1', 'TestElement1: changed', 'TestNode: changed', 'TestElement1: prop0Changed 2', 'TestNode: prop0Changed 2', 'TestNode: changed', 'TestElement1: prop1Changed foo', 'TestNode: prop1Changed foo', 'TestNode: changed', 'TestElement1: changed', 'TestNode: prop0Changed 3', 'TestElement1: prop0Changed 3', 'TestElement1: changed', 'TestNode: prop1Changed buzz', 'TestElement1: prop1Changed buzz', 'TestElement1: changed', 'TestNode: changed']
        );

        eventStack.length = 0;

        class TestElement2 extends IoElement {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop0: -1,
              prop1: {
                value: '',
              },
            };
          }
          changed() {
            this.render([{tag: 'test-subelement', props: {id: 'subelement',
              prop0: this.bind('prop0'),
              prop1: this.bind('prop1'),
            }}]);
          }
        }
        Register(TestElement2);

        const element2 = new TestElement2();
        element2.prop0 = 1;
        element2.prop1 = 'default';

        expect(element2.prop0).to.equal(1);
        expect(element2.$.subelement.prop0).to.equal(1);
        expect(element2.prop1).to.equal('default');
        expect(element2.$.subelement.prop1).to.equal('default');

        element2.setProperties({
          prop0: 2,
          prop1: 'foo'
        });

        expect(element2.prop0).to.equal(2);
        expect(element2.$.subelement.prop0).to.equal(2);
        expect(element2.prop1).to.equal('foo');
        expect(element2.$.subelement.prop1).to.equal('foo');

        element2.$.subelement.setProperties({
          prop0: 3,
          prop1: 'buzz'
        });

        expect(element2.prop0).to.equal(3);
        expect(element2.$.subelement.prop0).to.equal(3);
        expect(element2.prop1).to.equal('buzz');
        expect(element2.$.subelement.prop1).to.equal('buzz');
      });
      it('Should correctly set values when setProperties() is used to re-set multiple bindings', async () => {
        @Register
        class TestBindingElement extends IoElement {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: 'subnode1',
              prop2: 'subnode2',
              prop3: 'subnode3',
            };
          }
        }

        @Register
        class TestBindingElementTarget extends IoElement {
          static get ReactiveProperties(): ReactivePropertyDefinitions {
            return {
              prop1: 'target1',
              prop2: 'target2',
              prop3: 'target3',
            };
          }
          ready() {
            this.changed();
          }
          changed() {
            this.render([{tag: 'test-binding-element', props: {
              id: 'testElement',
              prop1: this.bind('prop1'),
              prop2: this.bind('prop2'),
              prop3: this.bind('prop3'),
            }}]);
          }
        }

        const targetElement = new TestBindingElementTarget();

        expect(targetElement.$.testElement.prop1).to.be.equal(targetElement.prop1).to.be.equal('target1');
        expect(targetElement.$.testElement.prop2).to.be.equal(targetElement.prop2).to.be.equal('target2');
        expect(targetElement.$.testElement.prop3).to.be.equal(targetElement.prop3).to.be.equal('target3');

        const sourceElement = new TestBindingElement({
          prop1: 'source1',
          prop2: 'source2',
          prop3: 'source3',
        });

        targetElement.setProperties({
          prop1: sourceElement.bind('prop1'),
          prop2: sourceElement.bind('prop2'),
          prop3: sourceElement.bind('prop3'),
        });

        expect(targetElement.$.testElement.prop1).to.be.equal(sourceElement.prop1).to.be.equal(targetElement.prop1).to.be.equal('source1');
        expect(targetElement.$.testElement.prop2).to.be.equal(sourceElement.prop2).to.be.equal(targetElement.prop2).to.be.equal('source2');
        expect(targetElement.$.testElement.prop3).to.be.equal(sourceElement.prop3).to.be.equal(targetElement.prop3).to.be.equal('source3');

        sourceElement.prop1 = 'test1';
        targetElement.prop2 = 'test2';
        targetElement.$.testElement.prop3 = 'test3';

        expect(targetElement.$.testElement.prop1).to.be.equal(sourceElement.prop1).to.be.equal(targetElement.prop1).to.be.equal('test1');
        expect(targetElement.$.testElement.prop2).to.be.equal(sourceElement.prop2).to.be.equal(targetElement.prop2).to.be.equal('test2');
        expect(targetElement.$.testElement.prop3).to.be.equal(sourceElement.prop3).to.be.equal(targetElement.prop3).to.be.equal('test3');

        targetElement.setProperties({
          prop1: 'final1',
          prop2: 'final2',
          prop3: 'final3',
        });

        expect(targetElement.$.testElement.prop1).to.be.equal(sourceElement.prop1).to.be.equal(targetElement.prop1).to.be.equal('final1');
        expect(targetElement.$.testElement.prop2).to.be.equal(sourceElement.prop2).to.be.equal(targetElement.prop2).to.be.equal('final2');
        expect(targetElement.$.testElement.prop3).to.be.equal(sourceElement.prop3).to.be.equal(targetElement.prop3).to.be.equal('final3');
      });
      it('Should bind and unbind correctly', () => {
        const element1 = new TestElement();
        const element2 = new TestElement();
        element2.prop0 = element1.bind('prop0') as unknown as string;
        element1.prop0 = 1;
        expect(element1.prop0).to.equal(1);
        expect(element2.prop0).to.equal(1);
        element2.prop0 = 2;
        expect(element1.prop0).to.equal(2);
        expect(element2.prop0).to.equal(2);
        // unbind
        element1.unbind('prop0');
        element1.prop0 = 3;
        expect(element1.prop0).to.equal(3);
        expect(element2.prop0).to.equal(2);
        element2.prop0 = element1.bind('prop0') as unknown as string;
        expect(element2.prop0).to.equal(3);
        element1.prop0 = 4;
        expect(element1.prop0).to.equal(4);
        expect(element2.prop0).to.equal(4);
        element2.unbind('prop0');
        element1.prop0 = 5;
        expect(element1.prop0).to.equal(5);
        expect(element2.prop0).to.equal(4);
      });
      it('Should bind from constructor', () => {
        const element1 = new TestElement();
        const element2 = new TestElement({prop0: element1.bind('prop0')});
        element1.prop0 = 1;
        expect(element2.prop0).to.equal(1);
        element2.unbind('prop0');
        element1.prop0 = 2;
        expect(element1.prop0).to.equal(2);
        expect(element2.prop0).to.equal(1);
      });
    });
  }
}
