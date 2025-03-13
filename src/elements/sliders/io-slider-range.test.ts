import {IoSliderRange} from '../../iogui.js';
import { expect } from 'chai';

async function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(()=>{
      resolve();
    });
  });
}

export default class {
  element = new IoSliderRange({value: [0, 0]});
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
    describe('IoSliderRange', () => {
      describe('default values', () => {
        it('has default values', () => {
          this.reset();
          expect(this.element.value[0]).to.equal(0);
          expect(this.element.value[1]).to.equal(1);
          expect(this.element.step).to.equal(0.01);
          expect(this.element.min).to.equal(0);
          expect(this.element.max).to.equal(1);
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has contenteditable attribute on number field', () => {
          expect(this.element.getAttribute('contenteditable')).to.equal(null);
        });
        it('has a11y attributes', async () => {
          this.reset();
          expect(this.element.getAttribute('role')).to.equal('slider');
          await nextTick();
          this.element.min = 0;
          expect(this.element.getAttribute('aria-valuemin')).to.equal('0');
          await nextTick();
          this.element.max = 1;
          expect(this.element.getAttribute('aria-valuemax')).to.equal('1');
        });
      });
    });
  }
}
