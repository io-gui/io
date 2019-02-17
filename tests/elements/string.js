import {IoString} from "../../src/io.js";

export default class {
  constructor() {
    this.element = new IoString();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoString: default values', () => {
      it('has default values', () => {
        chai.expect(this.element.value).to.equal('');
      });
    });
    describe('IoNumber: innerText', () => {
      it('matches value', () => {
        this.element.value = 'hello';
        chai.expect(this.element.innerHTML).to.equal('hello');
        this.element.value = false;
        chai.expect(this.element.innerHTML).to.equal('false');
        this.element.value = null;
        chai.expect(this.element.innerHTML).to.equal('null');
        this.element.value = undefined;
        chai.expect(this.element.innerHTML).to.equal('undefined');
        this.element.value = NaN;
        chai.expect(this.element.innerHTML).to.equal('NaN');
        this.element.value = 123;
        chai.expect(this.element.innerHTML).to.equal('123');
      });
    });
    describe('IoStrnig: attribute', () => {
      it('has tabindex attribute', () => {
        chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
      });
      it('has contenteditable attribute', () => {
        chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
      });
    });
  }
}
