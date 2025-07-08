import { ioString } from 'io-inputs';
import { ioSlider } from 'io-sliders';
import { IoObject } from '../index.js';

const testValue = {
  'number': 0.5,
  'string': 'hello',
  'boolean': true,
  'null': null,
  'object': {'prop': 'prop'},
  'array': [1, 2, 3]
};

export default class {
  element = new IoObject();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.label = '';
    this.element.labeled = true;
    this.element.expanded = false;
    this.element.value = {};
    this.element.config = new Map();
    this.element.properties = [];
  }
  run() {
    describe('IoObject', () => {
      it('has default values', () => {
        expect(this.element.label).to.equal('');
        expect(this.element.labeled).to.equal(true);
        expect(this.element.expanded).to.equal(false);
        expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
        expect(JSON.stringify(this.element.properties)).to.equal(JSON.stringify([]));
        expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}));
      });
      it('matches values', () => {
        this.element.value = testValue;
        expect(this.element.children[0].localName).to.equal('io-boolean');
        expect(this.element.children[1]).to.equal(undefined);
        this.element.expanded = true;
        const properties = this.element.children[1];
        expect(properties.localName).to.equal('io-property-editor');
        expect(properties.children[0].textContent).to.equal('number:');
        expect(properties.children[1].localName).to.equal('io-number');
        expect(properties.children[2].textContent).to.equal('string:');
        expect(properties.children[3].localName).to.equal('io-string');
        expect(properties.children[4].textContent).to.equal('boolean:');
        expect(properties.children[5].localName).to.equal('io-boolean');
        expect(properties.children[6].textContent).to.equal('null:');
        expect(properties.children[7].localName).to.equal('io-string');
        expect(properties.children[8].textContent).to.equal('object:');
        expect(properties.children[9].localName).to.equal('io-object');
        expect(properties.children[10].textContent).to.equal('array:');
        expect(properties.children[11].localName).to.equal('io-object');
        this.reset();
      });
      it('matches value with labels disabled', () => {
        this.element.value = testValue;
        this.element.labeled = false;
        this.element.expanded = true;
        const properties = this.element.children[1];
        expect(properties.children[0].localName).to.equal('io-number');
        expect(properties.children[1].localName).to.equal('io-string');
        expect(properties.children[2].localName).to.equal('io-boolean');
        expect(properties.children[3].localName).to.equal('io-string');
        expect(properties.children[4].localName).to.equal('io-object');
        expect(properties.children[5].localName).to.equal('io-object');
        this.reset();
      });
      it('matches value with labels disabled', () => {
        this.element.value = testValue;
        expect(this.element.children[0].textContent).to.equal('▸ Object');
        this.element.label = 'test';
        expect(this.element.children[0].textContent).to.equal('▸ test');
        this.reset();
        expect(this.element.children[0].textContent).to.equal('▸ Object');
      });
      it('matches value with custom properties', () => {
        this.element.value = testValue;
        this.element.properties = ['number', 'boolean'];
        this.element.expanded = true;
        const properties = this.element.children[1];
        expect(properties.children[0].textContent).to.equal('number:');
        expect(properties.children[2].textContent).to.equal('boolean:');
        expect(properties.children[4]).to.equal(undefined);
        this.reset();
      });
      it('matches value with custom config', () => {
        this.element.value = testValue;
        this.element.config = new Map([
          [Object, [
            ['number', ioSlider({step: 1})],
            ['boolean', ioString()],
          ]]
        ]);
        this.element.expanded = true;
        const properties = this.element.children[1];
        expect(properties.children[1].localName).to.equal('io-slider');
        expect((properties.children[1] as any).step).to.equal(1);
        expect(properties.children[5].localName).to.equal('io-string');
        this.reset();
      });
    });
  }
}
