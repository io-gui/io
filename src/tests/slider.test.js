import {IoSlider} from '../elements/slider.js';
import {IoTestMixin} from '../core/testMixin.js';

export class IoSliderTest extends IoTestMixin(IoSlider) {
  run() {
    describe('io-slider', () => {
      it('value', () => {
        chai.expect(this.element.$.number.innerHTML).to.equal('0.000');
        this.element.value = 1;
        chai.expect(this.element.$.number.innerHTML).to.equal('1.000');
      });
      it('attributes', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal(null);
        chai.expect(this.element.$.number.getAttribute('tabindex')).to.equal('0');
        chai.expect(this.element.$.number.getAttribute('contenteditable')).to.equal('');
      });
      it('listeners', () => {
        //TODO
      });
    });
  }
}

IoSliderTest.Register();
