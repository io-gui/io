import {ProtoChain} from './protochain.js';
import {ProtoProperty, ProtoProperties} from './properties.js';

const string = (object) => {
  return JSON.stringify(object);
};

export default class {
  run() {
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
      it('Should initialize array value properly', () => {
        let prop;
        let cfg = {value: [0, 1, 2, true]};

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
  }
}
