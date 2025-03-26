import { IoString } from './index';
export default class {
    element = new IoString();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoString', () => {
            describe('default values', () => {
                it('has default values', () => {
                    expect(this.element.value).to.equal('');
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = 'hello';
                    expect(this.element.textContent).to.equal('hello');
                    this.element.value = false;
                    expect(this.element.textContent).to.equal('false');
                    this.element.value = null;
                    expect(this.element.textContent).to.equal('null');
                    this.element.value = undefined;
                    expect(this.element.textContent).to.equal('undefined');
                    this.element.value = NaN;
                    expect(this.element.textContent).to.equal('NaN');
                    this.element.value = 123;
                    expect(this.element.textContent).to.equal('123');
                    this.element.value = '';
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attribute', () => {
                    expect(this.element.getAttribute('contenteditable')).to.equal('');
                });
                it('has a11y attributes', () => {
                    expect(this.element.getAttribute('role')).to.equal('textbox');
                    this.element.value = 0;
                    expect(this.element.getAttribute('aria-invalid')).to.equal('true');
                    this.element.value = '';
                    expect(this.element.getAttribute('aria-invalid')).to.equal(null);
                });
                it('has title attribute', () => {
                    this.element.label = 'Enter text';
                    expect(this.element.getAttribute('title')).to.equal('Enter text');
                    this.element.label = '';
                });
            });
        });
    }
}
//# sourceMappingURL=io-string.test.js.map