import {IoNumber} from "../../build/io.min.js";

export default class {
  constructor() {
    this.element = new IoNumber();
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
        });
      });
      describe('innerText', () => {
        it('matches value', () => {
          this.element.value = 0;
          this.element.step = 1;
          chai.expect(this.element.innerHTML).to.equal('0');
          this.element.step = 0.1;
          chai.expect(this.element.innerHTML).to.equal('0');
          this.element.value = 'hello';
          chai.expect(this.element.innerHTML).to.equal('NaN');
          this.element.value = false;
          chai.expect(this.element.innerHTML).to.equal('NaN');
          this.element.value = null;
          chai.expect(this.element.innerHTML).to.equal('NaN');
          this.element.value = undefined;
          chai.expect(this.element.innerHTML).to.equal('NaN');
          this.element.value = NaN;
          chai.expect(this.element.innerHTML).to.equal('NaN');
          this.element.value = 123;
          chai.expect(this.element.innerHTML).to.equal('123');
          this.reset();
        });
        it('matches value with custom step settings', () => {
          this.element.step = 0.000000001;
          this.element.value = 0.012345678;
          chai.expect(this.element.innerHTML).to.equal('0.012345678');
          this.element.step = 0.000001;
          chai.expect(this.element.innerHTML).to.equal('0.012346');
          this.element.step = 0.01;
          chai.expect(this.element.innerHTML).to.equal('0.01');
          this.reset();
        });
        it('matches value with custom min/max settings', () => {
          this.element.step = 1;
          this.element.min = 2;
          this.element.max = 5;
          this.element.setFromText(1);
          chai.expect(this.element.innerHTML).to.equal('2');
          this.element.setFromText(10);
          chai.expect(this.element.innerHTML).to.equal('5');
          chai.expect(this.element.value).to.equal(5);
          this.reset();
        });
        it('matches value with conversion factor', () => {
          this.element.conversion = 0.1;
          this.element.value = 1;
          chai.expect(this.element.innerHTML).to.equal('0.1');
          this.element.conversion = 0.01;
          chai.expect(this.element.innerHTML).to.equal('0.01');
          this.reset();
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('textbox');
          this.element.value = '';
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal('');
          this.element.value = 0;
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
        });
        it('has contenteditable attribute', () => {
          chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
        });
      });
    });
  }
}
