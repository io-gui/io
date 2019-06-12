import {IoString} from "../../build/io.min.js";

export default class {
  constructor() {
    this.element = new IoString();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoString', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.value).to.equal('');
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.element.value = 'hello';
          chai.expect(this.element.innerHTML).to.equal('hello');
          this.element.value = false;
          chai.expect(this.element.innerHTML).to.equal('false');
          this.element.value = null;
          chai.expect(this.element.innerHTML).to.equal('null');
          this.element.value = undefined;
          chai.expect(this.element.innerHTML).to.equal('undefined');
          this.element.value = NaN;
          chai.expect(this.element.innerHTML).to.equal('NaN');
          this.element.value = 123;
          chai.expect(this.element.innerHTML).to.equal('123');
          this.element.value = 0;
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has contenteditable attribute', () => {
          chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('textbox');
          this.element.value = 0;
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal('');
          this.element.value = '';
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
        });
      });
    });
  }
}
