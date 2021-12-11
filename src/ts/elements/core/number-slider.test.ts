import {IoNumberSlider} from './number-slider.js';

export default class {
  element = new IoNumberSlider();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
    this.element.$.slider.lazy = false;
  }
  reset() {
    this.element.value = 0;
    this.element.step = 0.001;
    this.element.min = 0;
    this.element.max = 1;
  }
  run() {
    describe('IoNumberSlider', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.value).to.equal(0);
          chai.expect(this.element.step).to.equal(0.01);
          chai.expect(this.element.min).to.equal(0);
          chai.expect(this.element.max).to.equal(1);
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.element.value = 0;
          chai.expect(this.element.$.number.innerText).to.equal('0');
          this.element.value = 1;
          chai.expect(this.element.$.number.innerText).to.equal('1');
          this.element.value = 0.1;
          chai.expect(this.element.$.number.innerText).to.equal('0.1');
          this.element.value = 0.01;
          chai.expect(this.element.$.number.innerText).to.equal('0.01');
          this.element.value = 0.001;
          chai.expect(this.element.$.number.innerText).to.equal('0');
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.$.number.getAttribute('tabindex')).to.equal('0');
          chai.expect(this.element.$.slider.getAttribute('tabindex')).to.equal('0');
        });
        it('has contenteditable attribute on number field', () => {
          chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
          chai.expect(this.element.$.number.getAttribute('contenteditable')).to.equal('');
          chai.expect(this.element.$.slider.getAttribute('contenteditable')).to.equal(null);
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.$.slider.getAttribute('role')).to.equal('slider');
          this.element.value = 0.1;
          chai.expect(this.element.$.slider.getAttribute('aria-valuenow')).to.equal('0.1');
          this.element.min = 0;
          chai.expect(this.element.$.slider.getAttribute('aria-valuemin')).to.equal('0');
          this.element.max = 1;
          chai.expect(this.element.$.slider.getAttribute('aria-valuemax')).to.equal('1');
          this.reset();
        });
      });
    });
  }
}
