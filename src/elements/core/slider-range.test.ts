import {IoSliderRange} from '../../iogui.js';

export default class {
  element = new IoSliderRange();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
    this.element.lazy = false;
  }
  reset() {
    this.element.value = [0, 1];
    this.element.step = 0.01;
    this.element.min = 0;
    this.element.max = 1;
  }
  run() {
    describe('IoSliderRange', () => {
      describe('default values', () => {
        it('has default values', () => {
          this.reset();
          chai.expect(this.element.value[0]).to.equal(0);
          chai.expect(this.element.value[1]).to.equal(1);
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
          this.reset();
          chai.expect(this.element.getAttribute('role')).to.equal('slider');
          this.element.min = 0;
          chai.expect(this.element.getAttribute('aria-valuemin')).to.equal('0');
          this.element.max = 1;
          chai.expect(this.element.getAttribute('aria-valuemax')).to.equal('1');
        });
      });
    });
  }
}
