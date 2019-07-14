import {IoButton} from "../../dist/io-elements.js";

export default class {
  constructor() {
    this.element = new IoButton();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoButton', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.label).to.equal('Button');
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('button');
        });
        it('has title attribute', () => {
          this.element.label = 'click here';
          chai.expect(this.element.getAttribute('title')).to.equal('click here');
          this.element.label = 'Button';
        });
      });
    });
  }
}
