import {IoProperties} from "../../../io-object.js";

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
    this.element.labeled = true;
    this.element.value = {};
    this.element.config = {};
    this.element.properties = [];
  }
  run() {
    describe('IoProperties', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.labeled).to.equal(true);
          chai.expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
          chai.expect(JSON.stringify(this.element.properties)).to.equal(JSON.stringify([]));
          chai.expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}));
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.element.value = testValue;
          chai.expect(this.element.children[0].textContent).to.equal('number:');
          chai.expect(this.element.children[1].localName).to.equal('io-number');
          chai.expect(this.element.children[2].textContent).to.equal('string:');
          chai.expect(this.element.children[3].localName).to.equal('io-string');
          chai.expect(this.element.children[4].textContent).to.equal('boolean:');
          chai.expect(this.element.children[5].localName).to.equal('io-boolean');
          chai.expect(this.element.children[6].textContent).to.equal('null:');
          chai.expect(this.element.children[7].localName).to.equal('io-string');
          chai.expect(this.element.children[8].textContent).to.equal('object:');
          chai.expect(this.element.children[9].localName).to.equal('io-object');
          chai.expect(this.element.children[10].textContent).to.equal('array:');
          chai.expect(this.element.children[11].localName).to.equal('io-object');
          this.reset();
        });
        it('matches value with labels disabled', () => {
          this.element.value = testValue;
          this.element.labeled = false;
          chai.expect(this.element.children[0].localName).to.equal('io-number');
          chai.expect(this.element.children[1].localName).to.equal('io-string');
          chai.expect(this.element.children[2].localName).to.equal('io-boolean');
          chai.expect(this.element.children[3].localName).to.equal('io-string');
          chai.expect(this.element.children[4].localName).to.equal('io-object');
          chai.expect(this.element.children[5].localName).to.equal('io-object');
          this.reset();
        });
        it('matches value with custom properties', () => {
          this.element.value = testValue;
          this.element.properties = ['number', 'boolean'];
          chai.expect(this.element.children[0].textContent).to.equal('number:');
          chai.expect(this.element.children[2].textContent).to.equal('boolean:');
          chai.expect(this.element.children[4]).to.equal(undefined);
          this.reset();
        });
        it('matches value with custom config', () => {
          this.element.value = testValue;
          this.element.config = {
            'number': ['io-slider', {step: 1}],
            'type:boolean': ['io-string'],
          };
          chai.expect(this.element.children[1].localName).to.equal('io-slider');
          chai.expect(this.element.children[1].step).to.equal(1);
          chai.expect(this.element.children[5].localName).to.equal('io-string');
          this.reset();
        });
      });
    });
  }
}
