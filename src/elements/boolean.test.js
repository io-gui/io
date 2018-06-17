import {IoBoolean} from "./boolean.js";
import {IoTestMixin} from "../core/testMixin.js";

export class IoBooleanTest extends IoTestMixin(IoBoolean) {
  run() {
    describe('io-boolean', () => {
      it('true/false string', () => {
        chai.expect(this.element.innerHTML).to.equal("false");
        this.element.toggle();
        chai.expect(this.element.innerHTML).to.equal("true");
      });
      it('toggle', () => {
        this.element.value = true;
        chai.expect(this.element.value).to.equal(true);
        this.element.toggle();
        chai.expect(this.element.value).to.equal(false);
      });
      it('true/false string', () => {
        this.element.value = true;
        this.element.true = "yes";
        this.element.false = "no";
        chai.expect(this.element.innerHTML).to.equal("yes");
        this.element.toggle();
        chai.expect(this.element.innerHTML).to.equal("no");
      });
      it('has attribute', () => {
        this.element.value = false;
        chai.expect(this.element.hasAttribute("value")).to.equal(false);
        this.element.value = true;
        chai.expect(this.element.hasAttribute("value")).to.equal(true);
        chai.expect(this.element.getAttribute("value")).to.equal("");
      });
    });
  }
}

IoBooleanTest.Register();
