import {IoOption} from "../../src/io.js";

export default class {
  constructor() {
    this.element = new IoOption();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoOption:', () => {
      it('value', () => {
        // const label = this.element.querySelector('span');
        // chai.expect(label.innerHTML).to.equal('undefined');
        // this.element.value = 2;
        // chai.expect(label.innerHTML).to.equal('2');
        // this.element.setProperties({
        //   options: [{value: 1, label: 'one'}],
        //   value: 1
        // });
        // this.element.changed();
        // chai.expect(label.innerHTML).to.equal('one');
        // this.element.options = undefined;
        // chai.expect(label.innerHTML).to.equal('1');
      });
      it('menu', () => {
        // this.element.options = [{value: 1, label: 'one'}];
        // chai.expect(this.element.$.menu.$.group.options).to.equal(this.element.options);
        // this.element.options = [{value: 2, label: 'two'}];
        // chai.expect(this.element.$.menu.$.group.options).to.equal(this.element.options);
      });
      it('attributes', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
      });
    });
  }
}
