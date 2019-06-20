import {IoProperties} from "../../build/io.min.js";


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
    this.element = new IoProperties();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  reset() {
    this.element.value = {}
  }
  set() {
    this.element.value = testValue;
  }
  run() {
    describe('IoProperties', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.set();
          chai.expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify(testValue));
          chai.expect(this.element.children[0].children[0].innerHTML).to.equal('number:');
          chai.expect(this.element.children[0].children[1].localName).to.equal('io-number');
          chai.expect(this.element.children[1].children[0].innerHTML).to.equal('string:');
          chai.expect(this.element.children[1].children[1].localName).to.equal('io-string');
          chai.expect(this.element.children[2].children[0].innerHTML).to.equal('boolean:');
          chai.expect(this.element.children[2].children[1].localName).to.equal('io-boolean');
          chai.expect(this.element.children[3].children[0].innerHTML).to.equal('null:');
          chai.expect(this.element.children[3].children[1].localName).to.equal('io-string');
          chai.expect(this.element.children[4].children[0].innerHTML).to.equal('object:');
          chai.expect(this.element.children[4].children[1].localName).to.equal('io-object');
          chai.expect(this.element.children[5].children[0].innerHTML).to.equal('array:');
          chai.expect(this.element.children[5].children[1].localName).to.equal('io-object');
          this.reset();
        });
        it('matches value with custom config', () => {
          this.set();
          //TODO
          this.reset();
        });
      });
    });
  }
}
