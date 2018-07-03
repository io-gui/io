import {IoLabel} from "../elements/label.js";
import {IoTest} from "./test.js";

export class IoLabelTest extends IoTest(IoLabel) {
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
