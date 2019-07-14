import {IoSwitch} from "../../dist/io-elements.js";

export default class {
  constructor() {
    this.element = new IoSwitch();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoSwitch', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.value).to.equal(false);
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('switch');
          this.element.value = '';
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal('true');
          this.element.value = false;
          chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
        });
        it('has value attribute when value is true', () => {
          this.element.value = false;
          chai.expect(this.element.hasAttribute('value')).to.equal(false);
          chai.expect(this.element.getAttribute('value')).to.equal(null);
          chai.expect(this.element.getAttribute('aria-checked')).to.equal('false');
          this.element.value = true;
          chai.expect(this.element.hasAttribute('value')).to.equal(true);
          chai.expect(this.element.getAttribute('value')).to.equal('');
          chai.expect(this.element.getAttribute('aria-checked')).to.equal('true');
          this.element.value = false;
        });
      });
    });
  }
}
