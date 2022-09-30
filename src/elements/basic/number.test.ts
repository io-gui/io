import { IoNumber, IoNumberLadder } from '../../iogui.js';

const element = new IoNumber();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

const ladder = new IoNumberLadder();
ladder.style.display = 'none';
document.body.appendChild(ladder as unknown as HTMLElement);

export default class {
  element = new IoNumber();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.value = 0;
    this.element.conversion = 1;
    this.element.step = 0.0001;
    this.element.min = -Infinity;
    this.element.max = Infinity;
  }
  run() {
    describe('IoNumber', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.role).to.equal('textbox');
          chai.expect(element.value).to.equal(0);
          chai.expect(element.conversion).to.equal(1);
          chai.expect(element.step).to.equal(0.0001);
          chai.expect(element.min).to.equal(-Infinity);
          chai.expect(element.max).to.equal(Infinity);
          chai.expect(element.ladder).to.equal(false);
          chai.expect(element.type).to.equal('number');
          chai.expect(element.pattern).to.equal('pattern="[0-9]*"');
          chai.expect(element.inputmode).to.equal('numeric');
          chai.expect(element.spellcheck).to.equal('false');
          chai.expect(element._properties.conversion).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: 1,
          });
          chai.expect(element._properties.step).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: 0.0001,
          });
          chai.expect(element._properties.min).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: -Infinity,
          });
          chai.expect(element._properties.max).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: Infinity,
          });
          chai.expect(element._properties.type).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: 'number',
          });
          chai.expect(element._properties.pattern).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: 'pattern="[0-9]*"',
          });
          chai.expect(element._properties.inputmode).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: 'numeric',
          });
          chai.expect(element._properties.spellcheck).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: 'false',
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('value')).to.equal('0');
          chai.expect(element.getAttribute('role')).to.equal('textbox');
          chai.expect(element.getAttribute('type')).to.equal('number');
          chai.expect(element.getAttribute('pattern')).to.equal('pattern="[0-9]*"');
          chai.expect(element.getAttribute('inputmode')).to.equal('numeric');
          chai.expect(element.getAttribute('spellcheck')).to.equal('false');
          chai.expect(element.getAttribute('positive')).to.equal('');
          chai.expect(element.getAttribute('aria-valuenow')).to.equal('0');
          chai.expect(element.getAttribute('aria-valuemin')).to.equal('-Infinity');
          chai.expect(element.getAttribute('aria-valuemax')).to.equal('Infinity');
          chai.expect(element.getAttribute('aria-valuestep')).to.equal('0.0001');
          chai.expect(element.getAttribute('aria-invalid')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          chai.expect(element.innerHTML).to.equal('0');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          element.value = 0;
          element.step = 1;
          chai.expect(element.textContent).to.equal('0');
          element.step = 0.1;
          chai.expect(element.textContent).to.equal('0');
          (element as any).value = 'hello';
          chai.expect(element.textContent).to.equal('NaN');
          (element as any).value = false;
          chai.expect(element.textContent).to.equal('NaN');
          (element as any).value = null;
          chai.expect(element.textContent).to.equal('NaN');
          (element as any).value = undefined;
          chai.expect(element.textContent).to.equal('NaN');
          element.value = NaN;
          chai.expect(element.textContent).to.equal('NaN');
          element.value = 123;
          chai.expect(element.textContent).to.equal('123');
          element.step = 0.0001;
          element.value = 0;
        });
        it('should set innerText to match value with custom step settings', () => {
          element.step = 0.000000001;
          element.value = 0.012345678;
          chai.expect(element.textContent).to.equal('0.012345678');
          element.step = 0.000001;
          chai.expect(element.textContent).to.equal('0.012346');
          element.step = 0.01;
          chai.expect(element.textContent).to.equal('0.01');
          element.step = 0.0001;
          element.value = 0;
        });
        it('should set innerText to match value with custom min/max settings', () => {
          element.step = 1;
          element.min = 2;
          element.max = 5;
          element.textNode = 10;
          element._setFromTextNode();
          chai.expect(element.value).to.equal(5);
          element.textNode = 0;
          element._setFromTextNode();
          chai.expect(element.value).to.equal(2);
          element.step = 0.0001;
          element.value = 0;
          element.min = -Infinity;
          element.max = Infinity;
        });
        it('should set innerText to match value with conversion factor', () => {
          element.conversion = 0.1;
          element.value = 1;
          chai.expect(element.textContent).to.equal('0.1');
          element.conversion = 0.01;
          chai.expect(element.textContent).to.equal('0.01');
          element.textNode = 10;
          element._setFromTextNode();
          chai.expect(element.value).to.equal(1000);
          element.value = 0;
          element.conversion = 1;
        });
        it('has reactive attributes', () => {
          element.value = 1;
          chai.expect(element.getAttribute('value')).to.equal('1');
          chai.expect(element.getAttribute('positive')).to.equal('');
          element.value = -2;
          chai.expect(element.getAttribute('value')).to.equal('-2');
          chai.expect(element.getAttribute('positive')).to.equal(null);
          element.value = 0;
          chai.expect(element.getAttribute('value')).to.equal('0');
          chai.expect(element.getAttribute('positive')).to.equal('');
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          (element as any).value = '';
          chai.expect(element.getAttribute('aria-invalid')).to.equal('true');
          element.value = 0;
          chai.expect(element.getAttribute('aria-invalid')).to.equal(null);
          element.value = 12;
          element.min = 0;
          element.max = 24;
          element.step = 2;
          chai.expect(element.getAttribute('aria-valuenow')).to.equal('12');
          chai.expect(element.getAttribute('aria-valuemin')).to.equal('0');
          chai.expect(element.getAttribute('aria-valuemax')).to.equal('24');
          chai.expect(element.getAttribute('aria-valuestep')).to.equal('2');
          element.value = 0;
          element.min = -Infinity;
          element.max = Infinity;
          element.step = 0.0001;
        });
      });
    });
    describe('IoNumberLadderStep', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          // chai.expect(element.role).to.equal('textbox');
          // chai.expect(element.value).to.equal(0);
          // chai.expect(element.conversion).to.equal(1);
          // chai.expect(element.step).to.equal(0.0001);
          // chai.expect(element.min).to.equal(-Infinity);
          // chai.expect(element.max).to.equal(Infinity);
          // chai.expect(element.ladder).to.equal(false);
          // chai.expect(element.type).to.equal('number');
          // chai.expect(element.pattern).to.equal('pattern="[0-9]*"');
          // chai.expect(element.inputmode).to.equal('numeric');
          // chai.expect(element.spellcheck).to.equal('false');
          // chai.expect(element._properties.conversion).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: 1,
          // });
          // chai.expect(element._properties.step).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: 0.0001,
          // });
          // chai.expect(element._properties.min).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: -Infinity,
          // });
          // chai.expect(element._properties.max).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: Infinity,
          // });
          // chai.expect(element._properties.type).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'number',
          // });
          // chai.expect(element._properties.pattern).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'pattern="[0-9]*"',
          // });
          // chai.expect(element._properties.inputmode).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'numeric',
          // });
          // chai.expect(element._properties.spellcheck).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'false',
          // });
        });
        it('has correct default attributes', () => {
          // chai.expect(element.getAttribute('value')).to.equal('0');
          // chai.expect(element.getAttribute('role')).to.equal('textbox');
          // chai.expect(element.getAttribute('type')).to.equal('number');
          // chai.expect(element.getAttribute('pattern')).to.equal('pattern="[0-9]*"');
          // chai.expect(element.getAttribute('inputmode')).to.equal('numeric');
          // chai.expect(element.getAttribute('spellcheck')).to.equal('false');
          // chai.expect(element.getAttribute('positive')).to.equal('');
          // chai.expect(element.getAttribute('aria-valuenow')).to.equal('0');
          // chai.expect(element.getAttribute('aria-valuemin')).to.equal('-Infinity');
          // chai.expect(element.getAttribute('aria-valuemax')).to.equal('Infinity');
          // chai.expect(element.getAttribute('aria-valuestep')).to.equal('0.0001');
          // chai.expect(element.getAttribute('aria-invalid')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          // chai.expect(element.innerHTML).to.equal(`0`);
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          // element.value = 0;
          // element.step = 1;
          // chai.expect(element.textContent).to.equal('0');
          // element.step = 0.1;
          // chai.expect(element.textContent).to.equal('0');
          // (element as any).value = 'hello';
          // chai.expect(element.textContent).to.equal('NaN');
          // (element as any).value = false;
          // chai.expect(element.textContent).to.equal('NaN');
          // (element as any).value = null;
          // chai.expect(element.textContent).to.equal('NaN');
          // (element as any).value = undefined;
          // chai.expect(element.textContent).to.equal('NaN');
          // element.value = NaN;
          // chai.expect(element.textContent).to.equal('NaN');
          // element.value = 123;
          // chai.expect(element.textContent).to.equal('123');
          // element.step = 0.0001;
          // element.value = 0;
        });
        it('should set innerText to match value with custom step settings', () => {
          // element.step = 0.000000001;
          // element.value = 0.012345678;
          // chai.expect(element.textContent).to.equal('0.012345678');
          // element.step = 0.000001;
          // chai.expect(element.textContent).to.equal('0.012346');
          // element.step = 0.01;
          // chai.expect(element.textContent).to.equal('0.01');
          // element.step = 0.0001;
          // element.value = 0;
        });
        it('should set innerText to match value with custom min/max settings', () => {
          // element.step = 1;
          // element.min = 2;
          // element.max = 5;
          // element.textNode = 10;
          // element._setFromTextNode();
          // chai.expect(element.value).to.equal(5);
          // element.textNode = 0;
          // element._setFromTextNode();
          // chai.expect(element.value).to.equal(2);
          // element.step = 0.0001;
          // element.value = 0;
          // element.min = -Infinity;
          // element.max = Infinity;
        });
        it('should set innerText to match value with conversion factor', () => {
          // element.conversion = 0.1;
          // element.value = 1;
          // chai.expect(element.textContent).to.equal('0.1');
          // element.conversion = 0.01;
          // chai.expect(element.textContent).to.equal('0.01');
          // element.textNode = 10;
          // element._setFromTextNode();
          // chai.expect(element.value).to.equal(1000);
          // element.value = 0;
          // element.conversion = 1;
        });
        it('has reactive attributes', () => {
          // element.value = 1;
          // chai.expect(element.getAttribute('value')).to.equal('1');
          // chai.expect(element.getAttribute('positive')).to.equal('');
          // element.value = -2;
          // chai.expect(element.getAttribute('value')).to.equal('-2');
          // chai.expect(element.getAttribute('positive')).to.equal(null);
          // element.value = 0;
          // chai.expect(element.getAttribute('value')).to.equal('0');
          // chai.expect(element.getAttribute('positive')).to.equal('');
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          // (element as any).value = '';
          // chai.expect(element.getAttribute('aria-invalid')).to.equal('true');
          // element.value = 0;
          // chai.expect(element.getAttribute('aria-invalid')).to.equal(null);
          // element.value = 12;
          // element.min = 0;
          // element.max = 24;
          // element.step = 2;
          // chai.expect(element.getAttribute('aria-valuenow')).to.equal('12');
          // chai.expect(element.getAttribute('aria-valuemin')).to.equal('0');
          // chai.expect(element.getAttribute('aria-valuemax')).to.equal('24');
          // chai.expect(element.getAttribute('aria-valuestep')).to.equal('2');
          // element.value = 0;
          // element.min = -Infinity;
          // element.max = Infinity;
          // element.step = 0.0001;
        });
      });
    });
    describe('IoNumberLadder', () => {
      // TODO: test with src element.
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          // chai.expect(element.role).to.equal('textbox');
          // chai.expect(element.value).to.equal(0);
          // chai.expect(element.conversion).to.equal(1);
          // chai.expect(element.step).to.equal(0.0001);
          // chai.expect(element.min).to.equal(-Infinity);
          // chai.expect(element.max).to.equal(Infinity);
          // chai.expect(element.ladder).to.equal(false);
          // chai.expect(element.type).to.equal('number');
          // chai.expect(element.pattern).to.equal('pattern="[0-9]*"');
          // chai.expect(element.inputmode).to.equal('numeric');
          // chai.expect(element.spellcheck).to.equal('false');
          // chai.expect(element._properties.conversion).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: 1,
          // });
          // chai.expect(element._properties.step).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: 0.0001,
          // });
          // chai.expect(element._properties.min).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: -Infinity,
          // });
          // chai.expect(element._properties.max).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'none',
          //   type: Number,
          //   value: Infinity,
          // });
          // chai.expect(element._properties.type).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'number',
          // });
          // chai.expect(element._properties.pattern).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'pattern="[0-9]*"',
          // });
          // chai.expect(element._properties.inputmode).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'numeric',
          // });
          // chai.expect(element._properties.spellcheck).to.eql({
          //   binding: undefined,
          //   notify: true,
          //   observe: false,
          //   reflect: 'prop',
          //   type: String,
          //   value: 'false',
          // });
        });
        it('has correct default attributes', () => {
          // chai.expect(element.getAttribute('value')).to.equal('0');
          // chai.expect(element.getAttribute('role')).to.equal('textbox');
          // chai.expect(element.getAttribute('type')).to.equal('number');
          // chai.expect(element.getAttribute('pattern')).to.equal('pattern="[0-9]*"');
          // chai.expect(element.getAttribute('inputmode')).to.equal('numeric');
          // chai.expect(element.getAttribute('spellcheck')).to.equal('false');
          // chai.expect(element.getAttribute('positive')).to.equal('');
          // chai.expect(element.getAttribute('aria-valuenow')).to.equal('0');
          // chai.expect(element.getAttribute('aria-valuemin')).to.equal('-Infinity');
          // chai.expect(element.getAttribute('aria-valuemax')).to.equal('Infinity');
          // chai.expect(element.getAttribute('aria-valuestep')).to.equal('0.0001');
          // chai.expect(element.getAttribute('aria-invalid')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          // chai.expect(element.innerHTML).to.equal(`0`);
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          // element.value = 0;
          // element.step = 1;
          // chai.expect(element.textContent).to.equal('0');
          // element.step = 0.1;
          // chai.expect(element.textContent).to.equal('0');
          // (element as any).value = 'hello';
          // chai.expect(element.textContent).to.equal('NaN');
          // (element as any).value = false;
          // chai.expect(element.textContent).to.equal('NaN');
          // (element as any).value = null;
          // chai.expect(element.textContent).to.equal('NaN');
          // (element as any).value = undefined;
          // chai.expect(element.textContent).to.equal('NaN');
          // element.value = NaN;
          // chai.expect(element.textContent).to.equal('NaN');
          // element.value = 123;
          // chai.expect(element.textContent).to.equal('123');
          // element.step = 0.0001;
          // element.value = 0;
        });
        it('should set innerText to match value with custom step settings', () => {
          // element.step = 0.000000001;
          // element.value = 0.012345678;
          // chai.expect(element.textContent).to.equal('0.012345678');
          // element.step = 0.000001;
          // chai.expect(element.textContent).to.equal('0.012346');
          // element.step = 0.01;
          // chai.expect(element.textContent).to.equal('0.01');
          // element.step = 0.0001;
          // element.value = 0;
        });
        it('should set innerText to match value with custom min/max settings', () => {
          // element.step = 1;
          // element.min = 2;
          // element.max = 5;
          // element.textNode = 10;
          // element._setFromTextNode();
          // chai.expect(element.value).to.equal(5);
          // element.textNode = 0;
          // element._setFromTextNode();
          // chai.expect(element.value).to.equal(2);
          // element.step = 0.0001;
          // element.value = 0;
          // element.min = -Infinity;
          // element.max = Infinity;
        });
        it('should set innerText to match value with conversion factor', () => {
          // element.conversion = 0.1;
          // element.value = 1;
          // chai.expect(element.textContent).to.equal('0.1');
          // element.conversion = 0.01;
          // chai.expect(element.textContent).to.equal('0.01');
          // element.textNode = 10;
          // element._setFromTextNode();
          // chai.expect(element.value).to.equal(1000);
          // element.value = 0;
          // element.conversion = 1;
        });
        it('has reactive attributes', () => {
          // element.value = 1;
          // chai.expect(element.getAttribute('value')).to.equal('1');
          // chai.expect(element.getAttribute('positive')).to.equal('');
          // element.value = -2;
          // chai.expect(element.getAttribute('value')).to.equal('-2');
          // chai.expect(element.getAttribute('positive')).to.equal(null);
          // element.value = 0;
          // chai.expect(element.getAttribute('value')).to.equal('0');
          // chai.expect(element.getAttribute('positive')).to.equal('');
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          // (element as any).value = '';
          // chai.expect(element.getAttribute('aria-invalid')).to.equal('true');
          // element.value = 0;
          // chai.expect(element.getAttribute('aria-invalid')).to.equal(null);
          // element.value = 12;
          // element.min = 0;
          // element.max = 24;
          // element.step = 2;
          // chai.expect(element.getAttribute('aria-valuenow')).to.equal('12');
          // chai.expect(element.getAttribute('aria-valuemin')).to.equal('0');
          // chai.expect(element.getAttribute('aria-valuemax')).to.equal('24');
          // chai.expect(element.getAttribute('aria-valuestep')).to.equal('2');
          // element.value = 0;
          // element.min = -Infinity;
          // element.max = Infinity;
          // element.step = 0.0001;
        });
      });
    });
  }
}

// export default class {
//   run() {
//     describe('IoNumberLadder', () => {
//       describe('default values', () => {
//         it('has default values', () => {
//           chai.expect(this.element.label).to.equal('');
//           chai.expect(this.element.conversion).to.equal(1);
//           chai.expect(this.element.expanded).to.equal(false);
//           chai.expect(this.element.min).to.equal(-Infinity);
//           chai.expect(this.element.max).to.equal(Infinity);
//           chai.expect(this.element.step).to.equal(0.0001);
//         });
//       });
//       describe('steps innerText', () => {
//         const $ = (selector: string) => { return this.element.querySelector(selector); };
//         it('matchs values', () => {
//           chai.expect($('.io-up1').value).to.equal(1);
//           chai.expect($('.io-up1').textContent).to.equal('1');
//           chai.expect($('.io-up2').textContent).to.equal('10');
//           chai.expect($('.io-up3').textContent).to.equal('100');
//           chai.expect($('.io-up4').textContent).to.equal('1000');
//           chai.expect($('.io-down1').value).to.equal(0.1);
//           chai.expect($('.io-down1').textContent).to.equal('0.1');
//           chai.expect($('.io-down2').textContent).to.equal('0.01');
//           chai.expect($('.io-down3').textContent).to.equal('0.001');
//           chai.expect($('.io-down4').textContent).to.equal('0.0001');
//         });

//         it('matchs value with custom step settings', () => {
//           this.element.step = 0.2;
//           chai.expect($('.io-up1').value).to.equal(2);
//           chai.expect($('.io-up1').textContent).to.equal('2');
//           chai.expect($('.io-up2').textContent).to.equal('20');
//           chai.expect($('.io-up3').textContent).to.equal('200');
//           chai.expect($('.io-up4').textContent).to.equal('2000');
//           chai.expect($('.io-down1').value).to.equal(0.2);
//           chai.expect($('.io-down1').textContent).to.equal('0.2');
//           chai.expect($('.io-down2')).to.equal(null);
//           chai.expect($('.io-down3')).to.equal(null);
//           chai.expect($('.io-down4')).to.equal(null);
//           this.element.step = 0.02;
//           chai.expect($('.io-down1').textContent).to.equal('0.2');
//           chai.expect($('.io-down2').textContent).to.equal('0.02');
//           chai.expect($('.io-down3')).to.equal(null);
//           this.reset();
//         });
//         it('matchs value with custom min/max settings', () => {
//           this.element.min = 0;
//           this.element.max = 100;
//           chai.expect($('.io-up1').value).to.equal(1);
//           chai.expect($('.io-up1').textContent).to.equal('1');
//           chai.expect($('.io-up2').textContent).to.equal('10');
//           chai.expect($('.io-up3').textContent).to.equal('100');
//           chai.expect($('.io-up4')).to.equal(null);
//           this.element.max = 1000;
//           chai.expect($('.io-up4').textContent).to.equal('1000');
//           this.reset();
//         });
//         it('matchs value with conversion factor', () => {
//           this.element.conversion = 20;
//           chai.expect($('.io-up2').value).to.equal(10);
//           chai.expect($('.io-up2').textContent).to.equal('200');
//           this.element.step = 0.2;
//           chai.expect($('.io-up2').value).to.equal(20);
//           chai.expect($('.io-up2').textContent).to.equal('400');
//           this.reset();
//         });
//       });
//       describe('attributes', () => {
//         const $ = (selector: string) => { return this.element.querySelector(selector); };
//         it('steps have tabindex attribute', () => {
//           chai.expect($('.io-up1').getAttribute('tabindex')).to.equal('0');
//           chai.expect($('.io-down1').getAttribute('tabindex')).to.equal('0');
//         });
//         it('has a11y attributes', () => {
//           chai.expect(this.element.getAttribute('role')).to.equal('list');
//         });
//         it('steps have a11y attributes', () => {
//           chai.expect($('.io-up1').getAttribute('role')).to.equal('spinbutton');
//           chai.expect($('.io-up1').getAttribute('type')).to.equal('number');
//           chai.expect($('.io-up1').getAttribute('aria-label')).to.equal('1');
//           // chai.expect($('.io-up1').getAttribute('aria-valuemax')).to.equal('Infinity');
//           // chai.expect($('.io-up1').getAttribute('aria-valuemin')).to.equal('-Infinity');
//           // TODO: test with src element
//           // chai.expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('0');
//           // this.element.value = 3;
//           // chai.expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('3');
//           this.element.step = 0.5;
//           chai.expect($('.io-up1').getAttribute('aria-label')).to.equal('5');
//         });
//       });
//     });
//   }
// }
