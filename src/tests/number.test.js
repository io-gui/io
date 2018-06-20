import {IoNumber} from '../elements/number.js';
import {IoTestMixin} from '../core/testMixin.js';

export class IoNumberTest extends IoTestMixin(IoNumber) {
  run() {
    describe('io-number', () => {
      it('value', () => {
        this.element.step = 1;
        chai.expect(this.element.innerHTML).to.equal('0');
        this.element.value = 'hello';
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = false;
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = null;
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = undefined;
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = NaN;
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = 123;
        chai.expect(this.element.innerHTML).to.equal('123');
      });
      it('step', () => {
        this.element.step = 0.000000001;
        this.element.setFromText(0.012345678);
        chai.expect(this.element.innerHTML).to.equal('0.012345678');
        this.element.step = 0.000001;
        chai.expect(this.element.innerHTML).to.equal('0.012346');
        this.element.step = 0.01;
        chai.expect(this.element.innerHTML).to.equal('0.01');
      });
      it('min/max', () => {
        this.element.step = 1;
        this.element.min = 2;
        this.element.max = 5;
        this.element.setFromText(1);
        chai.expect(this.element.innerHTML).to.equal('2');
        this.element.setFromText(10);
        chai.expect(this.element.innerHTML).to.equal('5');
        chai.expect(this.element.value).to.equal(5);
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

IoNumberTest.Register();
