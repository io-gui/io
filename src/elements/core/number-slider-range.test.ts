import {IoNumberSliderRange} from '../../iogui.js';

export default class {
  element = new IoNumberSliderRange();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.value = [0, 1];
    this.element.step = 0.01;
    this.element.min = 0;
    this.element.max = 1;
  }
  run() {
    describe('IoNumberSliderRange', () => {
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
      describe('innerText', () => {
        it('matches values', () => {
          this.reset();
          this.element.value = [0, 1];
          chai.expect(this.element.$.number0.innerText).to.equal('0');
          this.element.value = [1, 1];
          chai.expect(this.element.$.number0.innerText).to.equal('1');
          chai.expect(this.element.$.number1.innerText).to.equal('1');
          this.element.value = [0, 0.1];
          chai.expect(this.element.$.number1.innerText).to.equal('0.1');
          this.element.value = [0, 0.001];
          chai.expect(this.element.$.number1.innerText).to.equal('0');
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          this.reset();
          chai.expect(this.element.$.number0.getAttribute('tabindex')).to.equal('0');
          chai.expect(this.element.$.slider.getAttribute('tabindex')).to.equal('0');
        });
        it('has contenteditable attribute on number field', () => {
          this.reset();
          chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
          chai.expect(this.element.$.number0.getAttribute('contenteditable')).to.equal('');
          chai.expect(this.element.$.number1.getAttribute('contenteditable')).to.equal('');
          chai.expect(this.element.$.slider.getAttribute('contenteditable')).to.equal(null);
        });
        it('has a11y attributes', () => {
          this.reset();
          chai.expect(this.element.$.slider.getAttribute('role')).to.equal('slider');
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
