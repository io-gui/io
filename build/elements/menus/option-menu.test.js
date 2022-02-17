import { IoOptionMenu } from '../../iogui.elements.js';
/*

 **/
export default class {
    element = new IoOptionMenu();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.value = undefined;
        this.element.label = '';
        this.element.options = [];
        this.element.expanded = false;
    }
    run() {
        describe('IoOptionMenu', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(undefined);
                    chai.expect(this.element.label).to.equal('');
                    chai.expect(JSON.stringify(this.element.options)).to.equal(JSON.stringify([]));
                    chai.expect(this.element.expanded).to.equal(false);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    chai.expect(this.element.textContent).to.equal('undefined ▾');
                    this.element.value = 2;
                    chai.expect(this.element.textContent).to.equal('2 ▾');
                    this.element.setProperties({
                        options: [{ value: 1, label: 'one' }],
                        value: 1,
                        label: 'label'
                    });
                    chai.expect(this.element.textContent).to.equal('label');
                    this.element.label = '';
                    chai.expect(this.element.textContent).to.equal('one ▾');
                    this.element.options = [];
                    chai.expect(this.element.textContent).to.equal('1 ▾');
                    this.reset();
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('button');
                    chai.expect(this.element.getAttribute('aria-haspopup')).to.equal('listbox');
                    chai.expect(this.element.getAttribute('aria-expanded')).to.equal('false');
                    this.element.expanded = true;
                    chai.expect(this.element.getAttribute('aria-expanded')).to.equal('true');
                    this.reset();
                });
            });
        });
    }
}
//# sourceMappingURL=option-menu.test.js.map