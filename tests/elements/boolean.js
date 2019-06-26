import {IoBoolean} from "../../build/io.min.js";

export default class {
  constructor() {
    this.element = new IoBoolean();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoBoolean', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.value).to.equal(false);
          chai.expect(this.element.true).to.equal('true');
          chai.expect(this.element.false).to.equal('false');
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.element.value = false;
          chai.expect(this.element.innerText).to.equal(this.element.false);
          this.element.toggle();
          chai.expect(this.element.innerText).to.equal(this.element.true);
        });
        it('matches value with custom strings', () => {
          this.element.value = true;
          this.element.true = 'yes';
          this.element.false = 'no';
          chai.expect(this.element.innerHTML).to.equal('yes');
          this.element.toggle();
          chai.expect(this.element.innerHTML).to.equal('no');
          this.element.value = false;
          this.element.true = 'true';
          this.element.false = 'false';
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('switch');
          this.element.value = 0;
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
        });
      });
    });
  }
}
