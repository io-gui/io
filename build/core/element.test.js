import { IoElement, RegisterIoElement, IoNode, RegisterIoNode } from '../iogui.js';
// TODO: COMPLETE TEST COVERAGE
const element = new IoElement();
const eventStack = [];
export default class {
    run() {
        describe('IoElement', () => {
            describe('Initialization', () => {
                it('Should have core API functions defined', () => {
                    chai.expect(element.template).to.be.a('function');
                    chai.expect(element.disposeDeep).to.be.a('function');
                    chai.expect(element.traverse).to.be.a('function');
                    chai.expect(element.setAttribute).to.be.a('function');
                    chai.expect(element.focusTo).to.be.a('function');
                });
                it('Should initialize property definitions correctly', () => {
                    // Default properties
                    chai.expect(element.$).to.be.a('object');
                    chai.expect(element.tabindex).to.be.equal('');
                    chai.expect(element.contenteditable).to.be.equal(false);
                    chai.expect(element.class).to.be.equal('');
                    chai.expect(element.role).to.be.equal('');
                    chai.expect(element.label).to.be.equal('');
                    chai.expect(element.name).to.be.equal('');
                    chai.expect(element.title).to.be.equal('');
                    chai.expect(element.id).to.be.equal('');
                    chai.expect(element.hidden).to.be.equal(false);
                    chai.expect(element.disabled).to.be.equal(false);
                    chai.expect(element._properties.$).to.eql({
                        binding: undefined,
                        notify: false,
                        observe: false,
                        reflect: 'none',
                        type: Object,
                        value: {},
                    });
                    chai.expect(element._properties.tabindex).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.contenteditable).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: Boolean,
                        value: false,
                    });
                    chai.expect(element._properties.class).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.role).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.label).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.name).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.title).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.id).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: String,
                        value: '',
                    });
                    chai.expect(element._properties.hidden).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: Boolean,
                        value: false,
                    });
                    chai.expect(element._properties.disabled).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'prop',
                        type: Boolean,
                        value: false,
                    });
                });
                it('Has correct default attributes', () => {
                    chai.expect(element.getAttribute('tabindex')).to.equal(null);
                    chai.expect(element.getAttribute('contenteditable')).to.equal(null);
                    chai.expect(element.getAttribute('class')).to.equal(null);
                    chai.expect(element.getAttribute('role')).to.equal(null);
                    chai.expect(element.getAttribute('label')).to.equal(null);
                    chai.expect(element.getAttribute('name')).to.equal(null);
                    chai.expect(element.getAttribute('title')).to.equal(null);
                    chai.expect(element.getAttribute('id')).to.equal(null);
                    chai.expect(element.getAttribute('hidden')).to.equal(null);
                    chai.expect(element.getAttribute('disabled')).to.equal(null);
                });
            });
            describe('Reactivity', () => {
                it('Has reactive attributes', () => {
                    element.tabindex = '1';
                    chai.expect(element.getAttribute('tabindex')).to.equal('1');
                    element.tabindex = '';
                    element.contenteditable = true;
                    chai.expect(element.getAttribute('contenteditable')).to.equal('');
                    element.contenteditable = false;
                    element.class = 'foo';
                    chai.expect(element.getAttribute('class')).to.equal('foo');
                    element.class = '';
                    element.role = 'button';
                    chai.expect(element.getAttribute('role')).to.equal('button');
                    element.role = '';
                    element.label = 'text';
                    chai.expect(element.getAttribute('label')).to.equal('text');
                    element.label = '';
                    element.name = 'name';
                    chai.expect(element.getAttribute('name')).to.equal('name');
                    element.name = '';
                    element.title = 'title';
                    chai.expect(element.getAttribute('title')).to.equal('title');
                    element.title = '';
                    element.id = 'one';
                    chai.expect(element.getAttribute('id')).to.equal('one');
                    element.id = '';
                    element.hidden = true;
                    chai.expect(element.getAttribute('hidden')).to.equal('');
                    element.hidden = false;
                    element.disabled = true;
                    chai.expect(element.getAttribute('disabled')).to.equal('');
                    element.disabled = false;
                });
                it('Invokes change events and functions', () => {
                    class TestNode extends IoNode {
                        static get Properties() {
                            return {
                                prop0: 0,
                                prop1: '',
                            };
                        }
                        prop0Changed() {
                            eventStack.push(`TestNode: prop0Changed ${this.prop0}`);
                        }
                        prop1Changed() {
                            eventStack.push('TestNode: prop1Changed', this.prop1);
                        }
                        changed() {
                            eventStack.push('TestNode: changed');
                        }
                    }
                    RegisterIoNode(TestNode);
                    class TestSubelement extends IoElement {
                        static get Properties() {
                            return {
                                prop0: 0,
                                prop1: '',
                            };
                        }
                    }
                    RegisterIoElement(TestSubelement);
                    class TestElement1 extends IoElement {
                        static get Properties() {
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
                        constructor(...initProps) {
                            super(...initProps);
                            this.template([['test-subelement', { id: 'subelement',
                                        prop0: this.bind('prop0'),
                                        prop1: this.bind('prop1'),
                                    }]]);
                            this.subnode = new TestNode({
                                prop0: this.bind('prop0'),
                                prop1: this.bind('prop1'),
                            });
                        }
                        changed() {
                            eventStack.push('TestElement1: changed');
                            this._counter++;
                        }
                        prop0Changed(change) {
                            eventStack.push(`TestElement1: prop0Changed ${this.prop0}`);
                            this._prop0counter++;
                            this._prop0Change = change;
                        }
                        prop1Changed(change) {
                            eventStack.push(`TestElement1: prop1Changed ${this.prop1}`);
                            this._prop1counter++;
                            this._prop1Change = change;
                        }
                    }
                    RegisterIoElement(TestElement1);
                    eventStack.length = 0;
                    const element = new TestElement1();
                    chai.expect(element.prop0).to.equal(-1);
                    chai.expect(element.subnode.prop0).to.equal(-1);
                    chai.expect(element.$.subelement.prop0).to.equal(-1);
                    chai.expect(element.$.subelement.prop1).to.equal('default');
                    chai.expect(element.subnode.prop0).to.equal(-1);
                    chai.expect(element.subnode.prop1).to.equal('default');
                    chai.expect(element._counter).to.equal(0);
                    chai.expect(element._prop0counter).to.equal(0);
                    chai.expect(element._prop0Change).to.equal(null);
                    chai.expect(element._prop1counter).to.equal(0);
                    chai.expect(element._prop1Change).to.equal(null);
                    element.subnode.prop0 = 1;
                    chai.expect(element.prop0).to.equal(1);
                    chai.expect(element.subnode.prop0).to.equal(1);
                    chai.expect(element._counter).to.equal(1);
                    chai.expect(element._prop0counter).to.equal(1);
                    chai.expect(element._prop0Change).to.eql({ property: 'prop0', value: 1, oldValue: -1 });
                    chai.expect(element._prop1counter).to.equal(0);
                    chai.expect(element._prop1Change).to.equal(null);
                    element.setProperties({
                        prop0: 2,
                        prop1: 'foo'
                    });
                    chai.expect(element.prop0).to.equal(2);
                    chai.expect(element.subnode.prop0).to.equal(2);
                    chai.expect(element.$.subelement.prop0).to.equal(2);
                    chai.expect(element.prop1).to.equal('foo');
                    chai.expect(element.subnode.prop1).to.equal('foo');
                    chai.expect(element.$.subelement.prop1).to.equal('foo');
                    chai.expect(element._counter).to.equal(2);
                    chai.expect(element._prop0counter).to.equal(2);
                    chai.expect(element._prop0Change).to.eql({ property: 'prop0', value: 2, oldValue: 1 });
                    chai.expect(element._prop1counter).to.equal(1);
                    chai.expect(element._prop1Change).to.eql({ property: 'prop1', value: 'foo', oldValue: 'default' });
                    element.subnode.setProperties({
                        prop0: 3,
                        prop1: 'buzz',
                    });
                    chai.expect(element.prop0).to.equal(3);
                    chai.expect(element.subnode.prop0).to.equal(3);
                    chai.expect(element.$.subelement.prop0).to.equal(3);
                    chai.expect(element.$.subelement.prop0).to.equal(3);
                    chai.expect(element.prop1).to.equal('buzz');
                    chai.expect(element.subnode.prop1).to.equal('buzz');
                    chai.expect(element.$.subelement.prop1).to.equal('buzz');
                    // NOTE: element.subnode.setProperties on 2 bound properties causes change() event twice.
                    // TODO: Consider fixing // chai.expect(element._counter).to.equal(3);
                    chai.expect(element._counter).to.equal(4);
                    chai.expect(element._prop0counter).to.equal(3);
                    chai.expect(element._prop0Change).to.eql({ property: 'prop0', value: 3, oldValue: 2 });
                    chai.expect(element._prop1counter).to.equal(2);
                    chai.expect(element._prop1Change).to.eql({ property: 'prop1', value: 'buzz', oldValue: 'foo' });
                    chai.expect(eventStack).to.eql(['TestNode: prop0Changed -1', 'TestNode: changed', 'TestNode: prop0Changed -1', 'TestNode: prop1Changed', 'default', 'TestNode: changed', 'TestNode: prop1Changed', 'default', 'TestNode: changed', 'TestNode: prop0Changed 1', 'TestElement1: prop0Changed 1', 'TestElement1: changed', 'TestNode: changed', 'TestElement1: prop0Changed 2', 'TestNode: prop0Changed 2', 'TestNode: changed', 'TestElement1: prop1Changed foo', 'TestNode: prop1Changed', 'foo', 'TestNode: changed', 'TestElement1: changed', 'TestNode: prop0Changed 3', 'TestElement1: prop0Changed 3', 'TestElement1: changed', 'TestNode: prop1Changed', 'buzz', 'TestElement1: prop1Changed buzz', 'TestElement1: changed', 'TestNode: changed']);
                    eventStack.length = 0;
                    class TestElement2 extends IoElement {
                        static get Properties() {
                            return {
                                prop0: -1,
                                prop1: {
                                    value: '',
                                },
                            };
                        }
                        changed() {
                            this.template([['test-subelement', { id: 'subelement',
                                        prop0: this.bind('prop0'),
                                        prop1: this.bind('prop1'),
                                    }]]);
                        }
                    }
                    RegisterIoElement(TestElement2);
                    const element2 = new TestElement2();
                    element2.prop0 = 1;
                    element2.prop1 = 'default';
                    chai.expect(element2.prop0).to.equal(1);
                    chai.expect(element2.$.subelement.prop0).to.equal(1);
                    chai.expect(element2.prop1).to.equal('default');
                    chai.expect(element2.$.subelement.prop1).to.equal('default');
                    element2.setProperties({
                        prop0: 2,
                        prop1: 'foo'
                    });
                    chai.expect(element2.prop0).to.equal(2);
                    chai.expect(element2.$.subelement.prop0).to.equal(2);
                    chai.expect(element2.prop1).to.equal('foo');
                    chai.expect(element2.$.subelement.prop1).to.equal('foo');
                    element2.$.subelement.setProperties({
                        prop0: 3,
                        prop1: 'buzz'
                    });
                    chai.expect(element2.prop0).to.equal(3);
                    chai.expect(element2.$.subelement.prop0).to.equal(3);
                    chai.expect(element2.prop1).to.equal('buzz');
                    chai.expect(element2.$.subelement.prop1).to.equal('buzz');
                });
            });
            describe('Accessibility', () => {
                it('Has a11y attributes', () => {
                    chai.expect(element.getAttribute('aria-label')).to.equal(null);
                    element.label = 'label';
                    chai.expect(element.getAttribute('aria-label')).to.equal('label');
                    element.label = '';
                    chai.expect(element.getAttribute('aria-label')).to.equal(null);
                    element.disabled = true;
                    chai.expect(element.getAttribute('aria-disabled')).to.equal('');
                    element.disabled = false;
                });
            });
            describe('Binding', () => {
                it('Should bind and unbind correctly', () => {
                    const element1 = new IoElement();
                    const element2 = new IoElement();
                    element2.label = element1.bind('label');
                    element1.label = 'one';
                    chai.expect(element1.label).to.equal('one');
                    chai.expect(element2.label).to.equal('one');
                    element2.label = 'two';
                    chai.expect(element1.label).to.equal('two');
                    chai.expect(element2.label).to.equal('two');
                    // unbind
                    element1.unbind('label');
                    element1.label = 'three';
                    chai.expect(element1.label).to.equal('three');
                    chai.expect(element2.label).to.equal('two');
                    element2.label = element1.bind('label');
                    chai.expect(element2.label).to.equal('three');
                    element1.label = 'four';
                    chai.expect(element1.label).to.equal('four');
                    chai.expect(element2.label).to.equal('four');
                    element2.unbind('label');
                    element1.label = 'five';
                    chai.expect(element1.label).to.equal('five');
                    chai.expect(element2.label).to.equal('four');
                });
                it('Should bind from constructor', () => {
                    const element1 = new IoElement();
                    const element2 = new IoElement({ label: element1.bind('label') });
                    element1.label = 'one';
                    chai.expect(element2.label).to.equal('one');
                    element2.unbind('label');
                    element1.label = 'two';
                    chai.expect(element1.label).to.equal('two');
                    chai.expect(element2.label).to.equal('one');
                });
                // TODO: Bind to node
            });
        });
        // Extended IoElement
        describe('Extended IoElement', () => {
            class TestIoElement1 extends IoElement {
                static get Properties() {
                    return {
                        prop0: -1,
                        prop1: {
                            value: 'default',
                        },
                    };
                }
            }
            RegisterIoElement(TestIoElement1);
            class TestIoElement2 extends IoElement {
                static get Properties() {
                    return {
                        prop0: {
                            value: 0,
                            notify: false,
                            reflect: 'prop'
                        },
                        prop1: 0,
                    };
                }
            }
            RegisterIoElement(TestIoElement2);
            describe('Initialization', () => {
                it('Should initialize property definitions correctly', () => {
                    const element1 = new TestIoElement1();
                    const element2 = new TestIoElement2();
                    chai.expect(element1.prop0).to.equal(-1);
                    chai.expect(element1.prop1).to.equal('default');
                    chai.expect(element2.prop0).to.equal(0);
                    chai.expect(element2.prop1).to.equal(0);
                    chai.expect(element1._properties.prop0).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: Number,
                        value: -1,
                    });
                    chai.expect(element1._properties.prop1).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: String,
                        value: 'default',
                    });
                    chai.expect(element2._properties.prop0).to.eql({
                        binding: undefined,
                        notify: false,
                        observe: false,
                        reflect: 'prop',
                        type: Number,
                        value: 0,
                    });
                    chai.expect(element2._properties.prop1).to.eql({
                        binding: undefined,
                        notify: true,
                        observe: false,
                        reflect: 'none',
                        type: Number,
                        value: 0,
                    });
                });
                it('Has correct default attributes', () => {
                    const element1 = new TestIoElement1();
                    const element2 = new TestIoElement2();
                    chai.expect(element1.getAttribute('prop0')).to.equal(null);
                    chai.expect(element1.getAttribute('prop1')).to.equal(null);
                    chai.expect(element2.getAttribute('prop0')).to.equal('0');
                    chai.expect(element2.getAttribute('prop1')).to.equal(null);
                });
            });
            describe('Reactivity', () => {
                it('Has reactive attributes', () => {
                    const element2 = new TestIoElement2();
                    element2.prop0 = 1;
                    chai.expect(element2.getAttribute('prop0')).to.equal('1');
                    element2.prop0 = 0;
                    chai.expect(element2.getAttribute('prop0')).to.equal('0');
                });
            });
        });
    }
}
//# sourceMappingURL=element.test.js.map