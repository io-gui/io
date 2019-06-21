import {IoInspector} from "../../build/io.min.js";

const testValue = {
  "number": 0.5,
  "string": "hello",
  "boolean": true,
  "null": null,
  "object": {"prop": "prop"},
  "array": [1, 2, 3]
};

export default class {
  constructor() {
    this.element = new IoInspector();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  reset() {
    this.element.labeled = true;
    this.element.value = {};
    this.element.config = {};
    this.element.properties = [];
    this.element.crumbs = [];
  }
  run() {
    describe('IoInspector', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.labeled).to.equal(true);
          chai.expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
          chai.expect(JSON.stringify(this.element.properties)).to.equal(JSON.stringify([]));
          chai.expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}));
          chai.expect(JSON.stringify(this.element.crumbs)).to.equal(JSON.stringify([]));
        });
      });
      // describe('innerText', () => {
      //   it('matches values', () => {
      //     // this.element.value = testValue;
      //     // chai.expect(this.element.children[0].localName).to.equal('io-boolean');
      //     // chai.expect(this.element.children[1]).to.equal(undefined);
      //     // this.element.expanded = true;
      //     // const properties = this.element.children[1];
      //     // chai.expect(properties.localName).to.equal('io-properties');
      //     // chai.expect(properties.children[0].children[0].innerHTML).to.equal('number:');
      //     // chai.expect(properties.children[0].children[1].localName).to.equal('io-number');
      //     // chai.expect(properties.children[1].children[0].innerHTML).to.equal('string:');
      //     // chai.expect(properties.children[1].children[1].localName).to.equal('io-string');
      //     // chai.expect(properties.children[2].children[0].innerHTML).to.equal('boolean:');
      //     // chai.expect(properties.children[2].children[1].localName).to.equal('io-boolean');
      //     // chai.expect(properties.children[3].children[0].innerHTML).to.equal('null:');
      //     // chai.expect(properties.children[3].children[1].localName).to.equal('io-string');
      //     // chai.expect(properties.children[4].children[0].innerHTML).to.equal('object:');
      //     // chai.expect(properties.children[4].children[1].localName).to.equal('io-object');
      //     // chai.expect(properties.children[5].children[0].innerHTML).to.equal('array:');
      //     // chai.expect(properties.children[5].children[1].localName).to.equal('io-object');
      //     this.reset();
      //   });
      //   it('matches value with labels disabled', () => {
      //     // this.element.value = testValue;
      //     // this.element.labeled = false;
      //     // this.element.expanded = true;
      //     // const properties = this.element.children[1];
      //     // chai.expect(properties.children[0].children[0].localName).to.equal('io-number');
      //     // chai.expect(properties.children[1].children[0].localName).to.equal('io-string');
      //     // chai.expect(properties.children[2].children[0].localName).to.equal('io-boolean');
      //     // chai.expect(properties.children[3].children[0].localName).to.equal('io-string');
      //     // chai.expect(properties.children[4].children[0].localName).to.equal('io-object');
      //     // chai.expect(properties.children[5].children[0].localName).to.equal('io-object');
      //     this.reset();
      //   });
      //   it('matches value with labels disabled', () => {
      //     // this.element.value = testValue;
      //     // chai.expect(this.element.children[0].innerHTML).to.equal('Object')
      //     // this.element.label = 'test';
      //     // chai.expect(this.element.children[0].innerHTML).to.equal('test')
      //     this.reset();
      //   });
      //   it('matches value with custom properties', () => {
      //     // this.element.value = testValue;
      //     // this.element.properties = ['number', 'boolean'];
      //     // this.element.expanded = true;
      //     // const properties = this.element.children[1];
      //     // chai.expect(properties.children[0].children[0].innerHTML).to.equal('number:');
      //     // chai.expect(properties.children[1].children[0].innerHTML).to.equal('boolean:');
      //     // chai.expect(properties.children[3]).to.equal(undefined);
      //     this.reset();
      //   });
      //   it('matches value with custom config', () => {
      //     // this.element.value = testValue;
      //     // this.element.config = {
      //     //   'number': ['io-slider', {step: 1}],
      //     //   'type:boolean': ['io-switch'],
      //     // }
      //     // this.element.expanded = true;
      //     // const properties = this.element.children[1];
      //     // chai.expect(properties.children[0].children[1].localName).to.equal('io-slider');
      //     // chai.expect(properties.children[0].children[1].step).to.equal(1);
      //     // chai.expect(properties.children[2].children[1].localName).to.equal('io-switch');
      //     this.reset();
      //   });
      // });
    });
  }
}
