import {IoButton} from "../../io-core.js";

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
          chai.expect(this.element.value).to.equal(undefined);
          chai.expect(this.element.label).to.equal('Button');
          chai.expect(this.element.action).to.equal(undefined);
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          this.element.value = false;
          chai.expect(this.element.innerText).to.equal('Button');
          this.element.label = 'click me';
          chai.expect(this.element.innerText).to.equal('click me');
          this.element.value = undefined;
          this.element.label = 'Button';
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('button');
          chai.expect(this.element.getAttribute('aria-label')).to.equal('Button');
          this.element.label = 'click here';
          chai.expect(this.element.getAttribute('aria-label')).to.equal('click here');
          this.element.label = 'Button';
          chai.expect(this.element.getAttribute('aria-label')).to.equal('Button');
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
