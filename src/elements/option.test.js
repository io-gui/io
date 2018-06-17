import {IoOption} from "./option.js";
import {IoTestMixin} from "../core/testMixin.js";

export class IoOptionTest extends IoTestMixin(IoOption) {
  run() {
    describe('io-option', () => {
      it('value', () => {
        let span = this.element.querySelector("span");
        chai.expect(span.innerHTML).to.equal("");
        // this.element.value = "hello";
        // chai.expect(this.element.innerHTML).to.equal("hello");
        // this.element.value = false;
        // chai.expect(this.element.innerHTML).to.equal("false");
        // this.element.value = null;
        // chai.expect(this.element.innerHTML).to.equal("null");
        // this.element.value = undefined;
        // chai.expect(this.element.innerHTML).to.equal("undefined");
        // this.element.value = NaN;
        // chai.expect(this.element.innerHTML).to.equal("NaN");
        // this.element.value = 123;
        // chai.expect(this.element.innerHTML).to.equal("123");
      });
      it('attributes', () => {
        chai.expect(this.element.getAttribute("tabindex")).to.equal("0");
      });
      it('listeners', () => {
        chai.expect(this.element.__listeners['mousedown'][0]).to.equal(this.element._onDown);
        chai.expect(this.element.__listeners['touchstart'][0]).to.equal(this.element._onDown);
        chai.expect(this.element.__listeners['keydown'][0]).to.equal(this.element._onDown);
      });
    });
  }
}

IoOptionTest.Register();
