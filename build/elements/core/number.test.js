import { IoNumber } from '../../iogui.js';
export default class {
    element = new IoNumber();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.value = 0;
        this.element.conversion = 1;
        this.element.step = 0.001;
        this.element.min = -Infinity;
        this.element.max = Infinity;
    }
    run() {
        describe('IoNumber', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(0);
                    chai.expect(this.element.conversion).to.equal(1);
                    chai.expect(this.element.step).to.equal(0.001);
                    chai.expect(this.element.min).to.equal(-Infinity);
                    chai.expect(this.element.max).to.equal(Infinity);
                    chai.expect(this.element.ladder).to.equal(false);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = 0;
                    this.element.step = 1;
                    chai.expect(this.element.textContent).to.equal('0');
                    this.element.step = 0.1;
                    chai.expect(this.element.textContent).to.equal('0');
                    this.element.value = 'hello';
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = false;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = null;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = undefined;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = NaN;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = 123;
                    chai.expect(this.element.textContent).to.equal('123');
                    this.reset();
                });
                it('matches value with custom step settings', () => {
                    this.element.step = 0.000000001;
                    this.element.value = 0.012345678;
                    chai.expect(this.element.textContent).to.equal('0.012345678');
                    this.element.step = 0.000001;
                    chai.expect(this.element.textContent).to.equal('0.012346');
                    this.element.step = 0.01;
                    chai.expect(this.element.textContent).to.equal('0.01');
                    this.reset();
                });
                it('matches value with custom min/max settings', () => {
                    this.element.step = 1;
                    this.element.min = 2;
                    this.element.max = 5;
                    this.element.textNode = 10;
                    this.element._setFromTextNode();
                    chai.expect(this.element.value).to.equal(5);
                    this.element.textNode = 0;
                    this.element._setFromTextNode();
                    chai.expect(this.element.value).to.equal(2);
                    this.reset();
                });
                it('matches value with conversion factor', () => {
                    this.element.conversion = 0.1;
                    this.element.value = 1;
                    chai.expect(this.element.textContent).to.equal('0.1');
                    this.element.conversion = 0.01;
                    chai.expect(this.element.textContent).to.equal('0.01');
                    this.element.textNode = 10;
                    this.element._setFromTextNode();
                    chai.expect(this.element.value).to.equal(1000);
                    this.reset();
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attributes', () => {
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.getAttribute('type')).to.equal('number');
                    chai.expect(this.element.getAttribute('pattern')).to.equal('pattern="[0-9]*"');
                    chai.expect(this.element.getAttribute('inputmode')).to.equal('numeric');
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.getAttribute('spellcheck')).to.equal('false');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('textbox');
                    this.element.value = '';
                    chai.expect(this.element.getAttribute('aria-invalid')).to.equal('true');
                    this.element.value = 0;
                    chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
                    this.reset();
                });
                it('has title attribute', () => {
                    this.element.label = 'Enter text';
                    chai.expect(this.element.getAttribute('title')).to.equal('Enter text');
                    this.element.label = '';
                });
            });
        });
    }
}
//# sourceMappingURL=number.test.js.map