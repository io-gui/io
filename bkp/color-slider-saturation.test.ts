import { IoColorSliderSaturation } from '../../iogui.js';

const element = new IoColorSliderSaturation();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoColorSliderSaturation', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
        });
        it('Should initialize property definitions correctly', () => {
        });
        it('has correct default attributes', () => {
        });
        it('has correct default innerHTML', () => {
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
        });
        it('has reactive attributes', () => {
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
        });
      });
    });
  }
}
