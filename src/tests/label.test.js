import {IoLabel} from '../elements/label.js';
import {IoTestMixin} from '../core/testMixin.js';

export class IoLabelTest extends IoTestMixin(IoLabel) {
  run() {
    describe('io-label', () => {
      it('label', () => {
        chai.expect(this.element.innerHTML).to.equal('');
        this.element.label = 'label';
        chai.expect(this.element.innerHTML).to.equal('label');
      });
    });
  }
}

IoLabelTest.Register();
