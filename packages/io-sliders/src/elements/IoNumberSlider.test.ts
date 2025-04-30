import { nextQueue } from 'io-gui';
import { IoNumberSlider } from '../index';

export default class {
  element = new IoNumberSlider();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.value = 0;
    this.element.step = 0.001;
    this.element.min = 0;
    this.element.max = 1;
  }
  run() {
    describe('IoNumberSlider', () => {
      it('has default values', () => {
        expect(this.element.value).to.equal(0);
        expect(this.element.step).to.equal(0.01);
        expect(this.element.min).to.equal(0);
        expect(this.element.max).to.equal(1);
      });
      it('matches values', async () => {
        this.element.value = 0;
        await nextQueue();
        expect(this.element.$.number.innerText).to.equal('0');
        this.element.value = 1;
        await nextQueue();
        expect(this.element.$.number.innerText).to.equal('1');
        this.element.value = 0.1;
        await nextQueue();
        expect(this.element.$.number.innerText).to.equal('0.1');
        this.element.value = 0.01;
        await nextQueue();
        expect(this.element.$.number.innerText).to.equal('0.01');
        this.element.value = 0.001;
        await nextQueue();
        expect(this.element.$.number.innerText).to.equal('0');
      });
      it('has tabIndex attribute', () => {
        expect(this.element.$.number.getAttribute('tabIndex')).to.equal('0');
        expect(this.element.$.slider.getAttribute('tabIndex')).to.equal('0');
      });
      it('has contenteditable attribute on number field', () => {
        expect(this.element.getAttribute('contenteditable')).to.equal(null);
        expect(this.element.$.number.getAttribute('contenteditable')).to.equal('true');
        expect(this.element.$.slider.getAttribute('contenteditable')).to.equal(null);
      });
      it('has a11y attributes', async () => {
        expect(this.element.$.slider.getAttribute('role')).to.equal('slider');
        this.element.value = 0.1;
        await nextQueue();
        expect(this.element.$.slider.getAttribute('aria-valuenow')).to.equal('0.1');
        this.element.min = 0;
        await nextQueue();
        expect(this.element.$.slider.getAttribute('aria-valuemin')).to.equal('0');
        this.element.max = 1;
        await nextQueue();
        expect(this.element.$.slider.getAttribute('aria-valuemax')).to.equal('1');
        this.reset();
      });
    });
  }
}
