import {IoSlider} from '../../iogui.js';
import { expect } from 'chai';

const element = new IoSlider();

async function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(()=>{
      resolve();
    });
  });
}


export default class {
  run() {
    describe('IoSlider', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(element.value).to.equal(0);
          expect(element.step).to.equal(0.01);
          expect(element.min).to.equal(0);
          expect(element.max).to.equal(1);
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('tabindex')).to.equal('0');
          expect(element.getAttribute('contenteditable')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
        });
      });
      describe('Reactivity', () => {
        it('should render innerHTML', () => {
        });
        it('should change...', () => {
        });
        it('has reactive attributes', () => {
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', async () => {
          expect(element.getAttribute('role')).to.equal('slider');
          element.value = 0.1;
          await nextTick();
          expect(element.getAttribute('aria-valuenow')).to.equal('0.1');
          element.min = 0;
          await nextTick();
          expect(element.getAttribute('aria-valuemin')).to.equal('0');
          element.max = 1;
          await nextTick();
          expect(element.getAttribute('aria-valuemax')).to.equal('1');
        });
      });
    });
  }
}