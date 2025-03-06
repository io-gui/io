import {IoSlider2d} from '../../iogui.js';
import * as chai from 'chai';
const element = new IoSlider2d();

export default class {
  run() {
    describe('IoSlider2d', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(element.value).to.eql([0, 0]);
          chai.expect(element.step).to.eql([0.01, 0.01]);
          chai.expect(element.min).to.eql([-1, -1]);
          chai.expect(element.max).to.eql([1, 1]);
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(element.getAttribute('tabindex')).to.equal('0');
        });
        it('has contenteditable attribute on number field', () => {
          chai.expect(element.getAttribute('contenteditable')).to.equal(null);
        });
        it('has a11y attributes', () => {
          chai.expect(element.getAttribute('role')).to.equal('slider');
          element.value = [0.1, 0.1];
          chai.expect(element.getAttribute('aria-valuenow')).to.equal('0.1');
          element.min = [0, 0];
          chai.expect(element.getAttribute('aria-valuemin')).to.equal('0');
          element.max = [1, 1];
          chai.expect(element.getAttribute('aria-valuemax')).to.equal('1');
        });
      });
    });
  }
}
