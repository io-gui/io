import {IoBoolean} from "../../src/elements/boolean.js";

export default class {
  constructor() {
    this.element = new IoBoolean();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoBoolean: default values', () => {
      it('has default values', () => {
        chai.expect(this.element.value).to.equal(false);
        chai.expect(this.element.true).to.equal('true');
        chai.expect(this.element.false).to.equal('false');
      });
    });
    describe('IoBoolean: innerText', () => {
      it('matches value', () => {
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
      });
    });
    describe('IoBoolean: attribute', () => {
      it('has tabindex attribute', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
      });
      it('has attribute when value is true', () => {
        this.element.value = false;
        chai.expect(this.element.hasAttribute('value')).to.equal(false);
        chai.expect(this.element.getAttribute('value')).to.equal(null);
        this.element.value = true;
        chai.expect(this.element.hasAttribute('value')).to.equal(true);
        chai.expect(this.element.getAttribute('value')).to.equal('');
      });
    });
  }
}
