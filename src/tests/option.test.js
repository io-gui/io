import {IoOption} from "../elements/option.js";
import {IoTest} from "./test.js";

export class IoOptionTest extends IoTest(IoOption) {
  run() {
    describe('io-option', () => {
      it('value', () => {
        const label = this.element.querySelector('io-label');
        chai.expect(label.innerHTML).to.equal('null');
        this.element.value = undefined;
        chai.expect(label.innerHTML).to.equal('undefined');
        this.element.setProperties({
          options: [{value: 1, label: 'one'}],
          value: 1
        }, true);
        chai.expect(label.innerHTML).to.equal('one');
        this.element.options = undefined;
        chai.expect(label.innerHTML).to.equal('1');
      });
      it('menu', () => {
        this.element.options = [{value: 1, label: 'one'}];
        chai.expect(this.element.$.menu.$.group.options).to.equal(this.element.options);
        this.element.options = [{value: 2, label: 'two'}];
        chai.expect(this.element.$.menu.$.group.options).to.equal(this.element.options);
      });
      it('attributes', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
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
