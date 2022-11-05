import {IoSlider} from '../../iogui.js';

const element = new IoSlider();
element.lazy = false;

export default class {
  run() {
    describe('IoSlider', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.value).to.equal(0);
          chai.expect(element.step).to.equal(0.01);
          chai.expect(element.min).to.equal(0);
          chai.expect(element.max).to.equal(1);
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('tabindex')).to.equal('0');
          chai.expect(element.getAttribute('contenteditable')).to.equal(null);
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
        it('has a11y attributes', () => {
          chai.expect(element.getAttribute('role')).to.equal('slider');
          element.value = 0.1;
          chai.expect(element.getAttribute('aria-valuenow')).to.equal('0.1');
          element.min = 0;
          chai.expect(element.getAttribute('aria-valuemin')).to.equal('0');
          element.max = 1;
          chai.expect(element.getAttribute('aria-valuemax')).to.equal('1');
        });
      });
    });
  }
}