import {IoButton} from "../src/io.js";

import "../lib/chai.js";

export default class {
  constructor() {
    this.element = new IoButton();
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoButton: default values', () => {
      it('has default values', () => {
        this.element.innerHTML = 'button';
        chai.expect(this.element.innerHTML).to.equal('button');
      });
    });
    describe('IoButton: attribute', () => {
      it('has tabindex attribute', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
      });
      it('has pressed attribute', () => {
        this.element.pressed = false;
        chai.expect(this.element.hasAttribute('pressed')).to.equal(false);
        chai.expect(this.element.getAttribute('pressed')).to.equal(null);
        this.element.pressed = true;
        chai.expect(this.element.hasAttribute('pressed')).to.equal(true);
        chai.expect(this.element.getAttribute('pressed')).to.equal('');
      });
    });
  }
}
