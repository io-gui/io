import {IoButton} from "../elements/button.js";
import {IoTestMixin} from "../mixins/test.js";

export class IoButtonTest extends IoTestMixin(IoButton) {
  run() {
    describe('io-button', () => {
      it('label', () => {
        this.element.label = 'button';
        chai.expect(this.element.innerHTML).to.equal('button');
      });
      it('attributes', () => {
        this.element.pressed = false;
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        chai.expect(this.element.getAttribute('pressed')).to.equal(null);
        this.element.pressed = true;
        chai.expect(this.element.getAttribute('pressed')).to.equal('');
      });
      it('listeners', () => {
        chai.expect(this.element.__listeners['mousedown'][0]).to.equal(this.element._onDown);
        chai.expect(this.element.__listeners['touchstart'][0]).to.equal(this.element._onDown);
        chai.expect(this.element.__listeners['keydown'][0]).to.equal(this.element._onDown);
      });
    });
  }
}

IoButtonTest.Register();
