import { IoColorSliderHs } from '../../iogui.js';

const element = new IoColorSliderHs();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoColorSliderHs', () => {
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
