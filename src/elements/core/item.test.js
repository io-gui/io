import {IoItem} from '../../io-elements.js';

export default class {
  constructor() {
    this.element = new IoItem();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoItem', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.value).to.equal(undefined);
          chai.expect(this.element.disabled).to.equal(false);
          chai.expect(this.element.label).to.equal('');
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          chai.expect(this.element.innerText).to.equal('undefined');
          this.element.value = false;
          chai.expect(this.element.innerText).to.equal('false');
          this.element.value = {};
          chai.expect(this.element.innerText).to.equal('Object');
          this.element.value = [0, 1, 2, 3];
          chai.expect(this.element.innerText).to.equal('Array(4)');
          this.element.label = 'label';
          chai.expect(this.element.innerText).to.equal('label');
          this.element.label = {};
          chai.expect(this.element.innerText).to.equal('[object Object]');
          this.element.value = undefined;
          this.element.label = '';
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('aria-label')).to.equal(null);
          this.element.label = 'label';
          chai.expect(this.element.getAttribute('aria-label')).to.equal('label');
          this.element.label = '';
          chai.expect(this.element.getAttribute('aria-label')).to.equal(null);
          this.element.disabled = true;
          chai.expect(this.element.getAttribute('aria-disabled')).to.equal('');
          this.element.disabled = false;
        });
        it('has title attribute', () => {
          this.element.label = 'click here';
          chai.expect(this.element.getAttribute('title')).to.equal('click here');
          this.element.label = '';
        });
      });
    });
  }
}
