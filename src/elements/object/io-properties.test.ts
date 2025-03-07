import {IoProperties} from '../../iogui.js';
import { expect } from 'chai';

const testValue = {
  'number': 0.5,
  'string': 'hello',
  'boolean': true,
  'null': null,
  'object': {'prop': 'prop'},
  'array': [1, 2, 3]
};

export default class {
  element = new IoProperties();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
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
          expect(this.element.labeled).to.equal(true);
          expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
          expect(JSON.stringify(this.element.properties)).to.equal(JSON.stringify([]));
          expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}));
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.element.value = testValue;
          expect(this.element.children[0].textContent).to.equal('number:');
          expect(this.element.children[1].localName).to.equal('io-number');
          expect(this.element.children[2].textContent).to.equal('string:');
          expect(this.element.children[3].localName).to.equal('io-string');
          expect(this.element.children[4].textContent).to.equal('boolean:');
          expect(this.element.children[5].localName).to.equal('io-boolean');
          expect(this.element.children[6].textContent).to.equal('null:');
          expect(this.element.children[7].localName).to.equal('io-string');
          expect(this.element.children[8].textContent).to.equal('object:');
          expect(this.element.children[9].localName).to.equal('io-object');
          expect(this.element.children[10].textContent).to.equal('array:');
          expect(this.element.children[11].localName).to.equal('io-object');
          this.reset();
        });
        it('matches value with labels disabled', () => {
          this.element.value = testValue;
          this.element.labeled = false;
          expect(this.element.children[0].localName).to.equal('io-number');
          expect(this.element.children[1].localName).to.equal('io-string');
          expect(this.element.children[2].localName).to.equal('io-boolean');
          expect(this.element.children[3].localName).to.equal('io-string');
          expect(this.element.children[4].localName).to.equal('io-object');
          expect(this.element.children[5].localName).to.equal('io-object');
          this.reset();
        });
        it('matches value with custom properties', () => {
          this.element.value = testValue;
          this.element.properties = ['number', 'boolean'];
          expect(this.element.children[0].textContent).to.equal('number:');
          expect(this.element.children[2].textContent).to.equal('boolean:');
          expect(this.element.children[4]).to.equal(undefined);
          this.reset();
        });
        it('matches value with custom config', () => {
          this.element.value = testValue;
          this.element.config = {
            'number': ['io-slider', {step: 1}],
            'type:boolean': ['io-string'],
          };
          expect(this.element.children[1].localName).to.equal('io-slider');
          expect(this.element.children[1].step).to.equal(1);
          expect(this.element.children[5].localName).to.equal('io-string');
          this.reset();
        });
      });
    });
  }
}
