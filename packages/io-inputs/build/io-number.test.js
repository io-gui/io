import { IoNumber } from './index.js';
const element = new IoNumber();
element.style.display = 'none';
document.body.appendChild(element);
// const ladder = new IoNumberLadder();
// ladder.expanded = true;
// ladder.style.display = 'none';
// ladder.src = element;
// document.body.appendChild(ladder as unknown as HTMLElement);
// const step = new IoNumberLadderStep();
// step.style.display = 'none';
// document.body.appendChild(step as unknown as HTMLElement);
export default class {
    run() {
        describe('io-number.test', () => {
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
                    init: undefined,
                    reflect: false,
                    type: Number,
                    value: 1,
                });
                expect(element._properties.get('step')).to.eql({
                    binding: undefined,
                    init: undefined,
                    reflect: false,
                    type: Number,
                    value: 0.0001,
                });
                expect(element._properties.get('min')).to.eql({
                    binding: undefined,
                    init: undefined,
                    reflect: false,
                    type: Number,
                    value: -Infinity,
                });
                expect(element._properties.get('max')).to.eql({
                    binding: undefined,
                    init: undefined,
                    reflect: false,
                    type: Number,
                    value: Infinity,
                });
                expect(element._properties.get('type')).to.eql({
                    binding: undefined,
                    init: undefined,
                    reflect: true,
                    type: String,
                    value: 'number',
                });
                expect(element._properties.get('pattern')).to.eql({
                    binding: undefined,
                    init: undefined,
                    reflect: true,
                    type: String,
                    value: 'pattern="[0-9]*"',
                });
                expect(element._properties.get('inputmode')).to.eql({
                    binding: undefined,
                    init: undefined,
                    reflect: true,
                    type: String,
                    value: 'numeric',
                });
                expect(element._properties.get('spellcheck')).to.eql({
                    binding: undefined,
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
            it('should set innerText to match value property', () => {
                element.value = 0;
                element.step = 1;
                expect(element.innerText).to.equal('0');
                element.step = 0.1;
                expect(element.innerText).to.equal('0');
                element.value = 'hello';
                expect(element.innerText).to.equal('NaN');
                element.value = false;
                expect(element.innerText).to.equal('NaN');
                element.value = null;
                expect(element.innerText).to.equal('NaN');
                element.value = undefined;
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
            it('has a11y attributes', () => {
                element.value = '';
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
    }
}
//# sourceMappingURL=io-number.test.js.map