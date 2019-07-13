import {IoCollapsable} from "../../dist/io.js";

export default class {
  constructor() {
    this.element = new IoCollapsable();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoCollapsable: ', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.label).to.equal('');
          chai.expect(this.element.expanded).to.equal(false);
          chai.expect(JSON.stringify(this.element.elements)).to.equal(JSON.stringify([]));
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          chai.expect(this.element.$.content.textContent).to.equal('');
          this.element.elements = [
            ['div', 'test1'],
            ['div', 'test2'],
          ];
          chai.expect(this.element.$.content.textContent).to.equal('');
          this.element.expanded = true;
          chai.expect(this.element.$.content.innerHTML).to.equal('<div>test1</div><div>test2</div>');
          this.element.elements = [];
          chai.expect(this.element.$.content.textContent).to.equal('');
          this.element.expanded = false;
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.children[0].getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('region');
        });
      });
    });
  }
}
