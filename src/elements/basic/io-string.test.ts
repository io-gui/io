import {IoString} from '../../iogui.js';

export default class {
  element = new IoString();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
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
          chai.expect(this.element.textContent).to.equal('hello');
          (this.element as any).value = false;
          chai.expect(this.element.textContent).to.equal('false');
          (this.element as any).value = null;
          chai.expect(this.element.textContent).to.equal('null');
          (this.element as any).value = undefined;
          chai.expect(this.element.textContent).to.equal('undefined');
          (this.element as any).value = NaN;
          chai.expect(this.element.textContent).to.equal('NaN');
          (this.element as any).value = 123;
          chai.expect(this.element.textContent).to.equal('123');
          this.element.value = '';
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
          (this.element as any).value = 0;
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal('true');
          this.element.value = '';
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
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
