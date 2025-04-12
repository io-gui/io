import { IoSlider2d } from '../index';

const element = new IoSlider2d();

export default class {
  run() {
    describe('IoSlider2d', () => {
      it('has default values', () => {
        expect(element.value).to.eql([0, 0]);
        expect(element.step).to.eql([0.01, 0.01]);
        expect(element.min).to.eql([-1, -1]);
        expect(element.max).to.eql([1, 1]);
      });
      it('has tabindex attribute', () => {
        expect(element.getAttribute('tabindex')).to.equal('0');
      });
      it('has contenteditable attribute on number field', () => {
        expect(element.getAttribute('contenteditable')).to.equal(null);
      });
      it('has a11y attributes', () => {
        expect(element.getAttribute('role')).to.equal('slider');
        element.value = [0.1, 0.1];
        expect(element.getAttribute('aria-valuenow')).to.equal('0.1');
        element.min = [0, 0];
        expect(element.getAttribute('aria-valuemin')).to.equal('0');
        element.max = [1, 1];
        expect(element.getAttribute('aria-valuemax')).to.equal('1');
      });
    });
  }
}
