import {IoSlider} from "../../../src/io-core.js";

export default class {
  constructor() {
    this.element = new IoSlider();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  reset() {
    this.element.value = 0;
    this.element.step = 0.001;
    this.element.min = 0;
    this.element.max = 1;
  }
  run() {
    describe('IoSlider', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.value).to.equal(0);
          chai.expect(this.element.step).to.equal(0.01);
          chai.expect(this.element.min).to.equal(0);
          chai.expect(this.element.max).to.equal(1);
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has contenteditable attribute on number field', () => {
          chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('slider');
          this.element.value = 0.1;
          chai.expect(this.element.getAttribute('aria-valuenow')).to.equal('0.1');
          this.element.min = 0;
          chai.expect(this.element.getAttribute('aria-valuemin')).to.equal('0');
          this.element.max = 1;
          chai.expect(this.element.getAttribute('aria-valuemax')).to.equal('1');
          this.reset();
        });
      });
    })
  }
}
