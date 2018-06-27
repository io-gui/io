import {IoString} from "../elements/string.js";
import {IoTestMixin} from "../mixins/test.js";

export class IoStringTest extends IoTestMixin(IoString) {
  run() {
    describe('io-string', () => {
      it('value', () => {
        this.element.value = 'hello';
        chai.expect(this.element.innerHTML).to.equal('hello');
        this.element.value = false;
        chai.expect(this.element.innerHTML).to.equal('false');
        this.element.value = null;
        chai.expect(this.element.innerHTML).to.equal('null');
        this.element.value = undefined;
        chai.expect(this.element.innerHTML).to.equal('undefined');
        this.element.value = NaN;
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = 123;
        chai.expect(this.element.innerHTML).to.equal('123');
      });
      it('attributes', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
      });
      it('listeners', () => {
        chai.expect(this.element.__listeners['focus'][0]).to.equal(this.element._onFocus);
      });
    });
  }
}

IoStringTest.Register();
