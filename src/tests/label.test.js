import {IoLabel} from "../elements/label.js";
import {IoTestMixin} from "../mixins/test.js";

export class IoLabelTest extends IoTestMixin(IoLabel) {
  run() {
    describe('io-label', () => {
      it('label', () => {
        this.element.label = 'label';
        chai.expect(this.element.innerHTML).to.equal('label');
      });
    });
  }
}

IoLabelTest.Register();
