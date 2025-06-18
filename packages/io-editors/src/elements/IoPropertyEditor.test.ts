//@ts-nocheck
import { IoPropertyEditor } from '../index.js';

// const testValue = {
//   'number': 0.5,
//   'string': 'hello',
//   'boolean': true,
//   'null': null,
//   'object': {'prop': 'prop'},
//   'array': [1, 2, 3]
// };

export default class {
  element = new IoPropertyEditor();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.labeled = true;
    this.element.value = {};
    this.element.config = new Map();
    this.element.properties = [];
  }
  run() {
    describe('io-property-editor.test', () => {
      it('has default values', () => {
        expect(this.element.labeled).to.equal(true);
        expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
        expect(JSON.stringify(this.element.properties)).to.equal(JSON.stringify([]));
        expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}));
      });
      it('matches values', async () => {
        // this.element.value = testValue;
        // await nextQueue();
        // const children = this.element.toVDOM().children;

        // TODO: update tests to use vDOM
        // expect(children[0][2][0]).to.eql(ioText('number'));
        // expect(children[0][2][1]).to.eql(ioNumber({
        //   appearance: 'inset',
        //   'aria-valuemax': 'Infinity',
        //   'aria-valuemin': '-Infinity',
        //   'aria-valuenow': '0.5',
        //   'aria-valuestep': '0.01',
        //   inputmode: 'numeric',
        //   pattern: 'pattern="[0-9]*"',
        //   positive: '',
        //   role: 'textbox',
        //   spellcheck: 'false',
        //   tabIndex: '0',
        //   type: 'number',
        //   value: '0.5'},
        // '0.5'));

        // expect(children[1][2][0]).to.eql(ioText('string'));
        // expect(children[1][2][1]).to.eql(ioString({
        //   appearance: 'inset',
        //   role: 'textbox',
        //   spellcheck: 'false',
        //   tabIndex: '0',
        //   type: 'text',
        //   value: 'hello'},
        // 'hello'));

        // expect(this.element.children[1].children[1].textContent).to.equal('hello');
        // expect(this.element.children[1].children[1].localName).to.equal('io-string');

        // expect(this.element.children[2].children[0].textContent).to.equal('boolean');
        // expect(this.element.children[2].children[1].textContent).to.equal('');
        // expect(this.element.children[2].children[1].localName).to.equal('io-switch');

        // expect(this.element.children[6].textContent).to.equal('null:');
        // expect(this.element.children[7].localName).to.equal('io-string');
        // expect(this.element.children[8].textContent).to.equal('object:');
        // expect(this.element.children[9].localName).to.equal('io-object');
        // expect(this.element.children[10].textContent).to.equal('array:');
        // expect(this.element.children[11].localName).to.equal('io-object');
        this.reset();
      });
      // it('matches value with labels disabled', () => {
      //   // this.element.value = testValue;
      //   this.element.labeled = false;
      //   expect(this.element.children[0].localName).to.equal('io-number');
      //   expect(this.element.children[1].localName).to.equal('io-string');
      //   expect(this.element.children[2].localName).to.equal('io-boolean');
      //   expect(this.element.children[3].localName).to.equal('io-string');
      //   expect(this.element.children[4].localName).to.equal('io-object');
      //   expect(this.element.children[5].localName).to.equal('io-object');
      //   this.reset();
      // });
      // it('matches value with custom properties', () => {
      //   this.element.value = testValue;
      //   this.element.properties = ['number', 'boolean'];
      //   expect(this.element.children[0].textContent).to.equal('number:');
      //   expect(this.element.children[2].textContent).to.equal('boolean:');
      //   expect(this.element.children[4]).to.equal(undefined);
      //   this.reset();
      // });
      // it('matches value with custom config', () => {
      //   // this.element.value = testValue;
      //   this.element.config = new Map([
      //     [Object, [
      //       [Number, ioSlider({step: 1})],
      //       [Boolean, ioString()],
      //     ]]
      //   ]);
      //   expect(this.element.children[1].localName).to.equal('io-slider');
      //   expect(this.element.children[1].step).to.equal(1);
      //   expect(this.element.children[5].localName).to.equal('io-string');
      //   this.reset();
      // });
    });
  }
}
