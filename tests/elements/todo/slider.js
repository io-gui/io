import {IoSlider} from "../../build/io.min.js";

export default class {
  constructor() {
    this.element = new IoSlider();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoSlider: default values', () => {
      it('value', () => {
        this.element.value = 0;
        chai.expect(this.element.$.number.innerText).to.equal('0.000');
        this.element.value = 1;
        chai.expect(this.element.$.number.innerText).to.equal('1.000');
      });
    });
    describe('IoSlider: attribute', () => {
      it('has tabindex attribute on number field', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal(null);
        chai.expect(this.element.$.number.getAttribute('tabindex')).to.equal('0');
      });
      it('has contenteditable attribute on number field', () => {
        chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
        chai.expect(this.element.$.number.getAttribute('contenteditable')).to.equal('');
      });
    });
  }
}
