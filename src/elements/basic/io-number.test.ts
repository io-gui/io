import { IoNumber, IoNumberLadder, IoNumberLadderStep } from '../../iogui.js';
import { expect } from 'chai';
const element = new IoNumber();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

const ladder = new IoNumberLadder();
ladder.style.display = 'none';
ladder.src = element;
document.body.appendChild(ladder as unknown as HTMLElement);

const step = new IoNumberLadderStep();
step.style.display = 'none';
document.body.appendChild(step as unknown as HTMLElement);

export default class {
  run() {
    describe('IoNumber', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(element.role).to.equal('textbox');
          expect(element.value).to.equal(0);
          expect(element.conversion).to.equal(1);
          expect(element.step).to.equal(0.0001);
          expect(element.min).to.equal(-Infinity);
          expect(element.max).to.equal(Infinity);
          expect(element.ladder).to.equal(false);
          expect(element.type).to.equal('number');
          expect(element.pattern).to.equal('pattern="[0-9]*"');
          expect(element.inputmode).to.equal('numeric');
          expect(element.spellcheck).to.equal('false');
          expect(element._properties.get('conversion')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: Number,
            value: 1,
          });
          expect(element._properties.get('step')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: Number,
            value: 0.0001,
          });
          expect(element._properties.get('min')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: Number,
            value: -Infinity,
          });
          expect(element._properties.get('max')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: Number,
            value: Infinity,
          });
          expect(element._properties.get('type')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: String,
            value: 'number',
          });
          expect(element._properties.get('pattern')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: String,
            value: 'pattern="[0-9]*"',
          });
          expect(element._properties.get('inputmode')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: String,
            value: 'numeric',
          });
          expect(element._properties.get('spellcheck')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: String,
            value: 'false',
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('value')).to.equal('0');
          expect(element.getAttribute('role')).to.equal('textbox');
          expect(element.getAttribute('type')).to.equal('number');
          expect(element.getAttribute('pattern')).to.equal('pattern="[0-9]*"');
          expect(element.getAttribute('inputmode')).to.equal('numeric');
          expect(element.getAttribute('spellcheck')).to.equal('false');
          expect(element.getAttribute('positive')).to.equal('');
          expect(element.getAttribute('aria-valuenow')).to.equal('0');
          expect(element.getAttribute('aria-valuemin')).to.equal('-Infinity');
          expect(element.getAttribute('aria-valuemax')).to.equal('Infinity');
          expect(element.getAttribute('aria-valuestep')).to.equal('0.0001');
          expect(element.getAttribute('aria-invalid')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          expect(element.innerHTML).to.equal('0');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          element.value = 0;
          element.step = 1;
          expect(element.innerText).to.equal('0');
          element.step = 0.1;
          expect(element.innerText).to.equal('0');
          (element as any).value = 'hello';
          expect(element.innerText).to.equal('NaN');
          (element as any).value = false;
          expect(element.innerText).to.equal('NaN');
          (element as any).value = null;
          expect(element.innerText).to.equal('NaN');
          (element as any).value = undefined;
          expect(element.innerText).to.equal('NaN');
          element.value = NaN;
          expect(element.innerText).to.equal('NaN');
          element.value = 123;
          expect(element.innerText).to.equal('123');
          element.step = 0.0001;
          element.value = 0;
        });
        it('should set innerText to match value with custom step settings', () => {
          element.step = 0.000000001;
          element.value = 0.012345678;
          expect(element.innerText).to.equal('0.012345678');
          element.step = 0.000001;
          expect(element.innerText).to.equal('0.012346');
          element.step = 0.01;
          expect(element.innerText).to.equal('0.01');
          element.step = 0.0001;
          element.value = 0;
        });
        it('should set innerText to match value with custom min/max settings', () => {
          element.step = 1;
          element.min = 2;
          element.max = 5;
          element.textNode = 10;
          element._setFromTextNode();
          expect(element.value).to.equal(5);
          element.textNode = 0;
          element._setFromTextNode();
          expect(element.value).to.equal(2);
          element.step = 0.0001;
          element.value = 0;
          element.min = -Infinity;
          element.max = Infinity;
        });
        it('should set innerText to match value with conversion factor', () => {
          element.conversion = 0.1;
          element.value = 1;
          expect(element.innerText).to.equal('0.1');
          element.conversion = 0.01;
          expect(element.innerText).to.equal('0.01');
          element.textNode = 10;
          element._setFromTextNode();
          expect(element.value).to.equal(1000);
          element.value = 0;
          element.conversion = 1;
        });
        it('has reactive attributes', () => {
          element.value = 1;
          expect(element.getAttribute('value')).to.equal('1');
          expect(element.getAttribute('positive')).to.equal('');
          element.value = -2;
          expect(element.getAttribute('value')).to.equal('-2');
          expect(element.getAttribute('positive')).to.equal(null);
          element.value = 0;
          expect(element.getAttribute('value')).to.equal('0');
          expect(element.getAttribute('positive')).to.equal('');
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          (element as any).value = '';
          expect(element.getAttribute('aria-invalid')).to.equal('true');
          element.value = 0;
          expect(element.getAttribute('aria-invalid')).to.equal(null);
          element.value = 12;
          element.min = 0;
          element.max = 24;
          element.step = 2;
          expect(element.getAttribute('aria-valuenow')).to.equal('12');
          expect(element.getAttribute('aria-valuemin')).to.equal('0');
          expect(element.getAttribute('aria-valuemax')).to.equal('24');
          expect(element.getAttribute('aria-valuestep')).to.equal('2');
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
          expect(step.value).to.equal(1);
          expect(step.role).to.equal('spinbutton');
          expect(step.type).to.equal('number');
          expect(step._properties.get('type')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: String,
            value: 'number',
          });
        });
        it('has correct default attributes', () => {
          expect(step.getAttribute('value')).to.equal(null);
          expect(step.getAttribute('role')).to.equal('spinbutton');
          expect(step.getAttribute('type')).to.equal('number');
        });
        it('has correct default innerHTML', () => {
          expect(step.innerHTML).to.equal('<io-label label="1" aria-label="1">1</io-label>');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          step.value = 0;
          expect(step.textContent).to.equal('0');
          step.value = 1;
        });
        it('has no reactive attributes', () => {
          step.value = 2;
          expect(step.getAttribute('value')).to.equal(null);
          step.value = 1;
        });
      });
    });
    describe('IoNumberLadder', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(ladder.role).to.equal('list');
          expect(ladder.src).to.equal(element);
          expect(ladder.conversion).to.equal(1);
          expect(ladder.expanded).to.equal(false);
          expect(ladder.min).to.equal(-Infinity);
          expect(ladder.max).to.equal(Infinity);
          expect(ladder.step).to.equal(0.0001);
          expect(ladder.value).to.equal(0);
          expect(ladder.conversion).to.equal(1);

          expect(ladder._properties.get('src')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: undefined,
            value: element,
          });
          expect(ladder._properties.get('expanded')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          expect(ladder.getAttribute('role')).to.equal('list');
          expect(ladder.getAttribute('expanded')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          expect(ladder.innerHTML).to.equal('<io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-up4" label="1000" aria-label="1000" aria-valuestep="1000" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="1000" aria-label="1000">1000</io-label></io-number-ladder-step><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-up3" label="100" aria-label="100" aria-valuestep="100" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="100" aria-label="100">100</io-label></io-number-ladder-step><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-up2" label="10" aria-label="10" aria-valuestep="10" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="10" aria-label="10">10</io-label></io-number-ladder-step><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-up1" label="1" aria-label="1" aria-valuestep="1" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="1" aria-label="1">1</io-label></io-number-ladder-step><span class="io-number-ladder-center"></span><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-down1" label="0.1" aria-label="0.1" aria-valuestep="0.1" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="0.1" aria-label="0.1">0.1</io-label></io-number-ladder-step><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-down2" label="0.01" aria-label="0.01" aria-valuestep="0.010000000000000002" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="0.01" aria-label="0.01">0.01</io-label></io-number-ladder-step><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-down3" label="0.001" aria-label="0.001" aria-valuestep="0.001" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="0.001" aria-label="0.001">0.001</io-label></io-number-ladder-step><io-number-ladder-step tabindex="0" role="spinbutton" appearance="flush" type="number" class="io-down4" label="0.0001" aria-label="0.0001" aria-valuestep="0.0001" aria-valuemin="-Infinity" aria-valuemax="Infinity" aria-valuenow="0"><io-label label="0.0001" aria-label="0.0001">0.0001</io-label></io-number-ladder-step>');
        });
      });
      describe('Reactivity', () => {
        const $ = (selector: string) => { return ladder.querySelector(selector); };
        it('should set innerText to match value property', () => {
          expect($('.io-up1').value).to.equal(1);
          expect($('.io-up1').textContent).to.equal('1');
          expect($('.io-up2').textContent).to.equal('10');
          expect($('.io-up3').textContent).to.equal('100');
          expect($('.io-up4').textContent).to.equal('1000');
          expect($('.io-down1').value).to.equal(0.1);
          expect($('.io-down1').textContent).to.equal('0.1');
          expect($('.io-down2').textContent).to.equal('0.01');
          expect($('.io-down3').textContent).to.equal('0.001');
          expect($('.io-down4').textContent).to.equal('0.0001');
        });
        it('should set innerText to match value with custom step settings', () => {
          element.step = 0.2;
          ladder.changed();
          expect($('.io-up1').value).to.equal(2);
          expect($('.io-up1').textContent).to.equal('2');
          expect($('.io-up2').textContent).to.equal('20');
          expect($('.io-up3').textContent).to.equal('200');
          expect($('.io-up4').textContent).to.equal('2000');
          expect($('.io-down1').value).to.equal(0.2);
          expect($('.io-down1').textContent).to.equal('0.2');
          expect($('.io-down2')).to.equal(null);
          expect($('.io-down3')).to.equal(null);
          expect($('.io-down4')).to.equal(null);
          element.step = 0.02;
          ladder.changed();
          expect($('.io-down1').textContent).to.equal('0.2');
          expect($('.io-down2').textContent).to.equal('0.02');
          expect($('.io-down3')).to.equal(null);
          element.step = 0.0001;
          ladder.changed();
        });
        it('should set innerText to match value with custom min/max settings', () => {
          element.min = 0;
          element.max = 100;
          ladder.changed();
          expect($('.io-up1').value).to.equal(1);
          expect($('.io-up1').innerText).to.equal('1');
          expect($('.io-up2').innerText).to.equal('10');
          expect($('.io-up3').innerText).to.equal('100');
          expect($('.io-up4')).to.equal(null);
          element.max = 1000;
          ladder.changed();
          expect($('.io-up4').innerText).to.equal('1000');
          element.min = -Infinity;
          element.max = Infinity;
          ladder.changed();
        });
        it('should set innerText to match value with conversion factor', () => {
          element.conversion = 20;
          ladder.changed();
          expect($('.io-up2').value).to.equal(10);
          expect($('.io-up2').innerText).to.equal('200');
          element.step = 0.2;
          ladder.changed();
          expect($('.io-up2').value).to.equal(20);
          expect($('.io-up2').innerText).to.equal('400');
          element.conversion = 1;
          element.step = 0.0001;
          ladder.changed();
        });
          it('steps have tabindex attribute', () => {
            expect($('.io-up1').getAttribute('tabindex')).to.equal('0');
            expect($('.io-down1').getAttribute('tabindex')).to.equal('0');
          });
          it('has a11y attributes', () => {
            expect(ladder.getAttribute('role')).to.equal('list');
          });
          it('steps have a11y attributes', () => {
            expect($('.io-up1').getAttribute('role')).to.equal('spinbutton');
            expect($('.io-up1').getAttribute('type')).to.equal('number');
            expect($('.io-up1').getAttribute('aria-label')).to.equal('1');
            expect($('.io-up1').getAttribute('aria-valuemax')).to.equal('Infinity');
            expect($('.io-up1').getAttribute('aria-valuemin')).to.equal('-Infinity');
            expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('0');
            element.value = 3;
            ladder.changed();
            expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('3');
            element.step = 0.5;
            ladder.changed();
            expect($('.io-up1').getAttribute('aria-label')).to.equal('5');
            element.value = 0;
            element.step = 0.0001;
            ladder.changed();
          });
      });
      describe('Accessibility', () => {
        it('TODO', () => {
          expect(ladder.getAttribute('aria-valuemin')).to.equal('-Infinity');
          expect(ladder.getAttribute('aria-valuemax')).to.equal('Infinity');
          expect(ladder.getAttribute('aria-valuenow')).to.equal('0');
        });
        it('has a11y attributes', () => {
          // TODO: Aria attributes
          expect(ladder.getAttribute('aria-invalid')).to.equal(null);
          element.value = NaN;
          ladder.changed();
          expect(ladder.getAttribute('aria-invalid')).to.equal('true');
          element.value = 12;
          ladder.changed();
          element.min = 0;
          element.max = 24;
          element.step = 2;
          ladder.changed();
          expect(ladder.getAttribute('aria-valuenow')).to.equal('12');
          expect(ladder.getAttribute('aria-valuemin')).to.equal('0');
          expect(ladder.getAttribute('aria-valuemax')).to.equal('24');
          expect(ladder.getAttribute('aria-valuestep')).to.equal('2');
          element.min = -Infinity;
          element.max = Infinity;
          element.step = 0.0001;
          ladder.changed();
        });
      });
    });
  }
}
