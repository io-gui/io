import { IoOptionMenu, MenuOptions } from '../../iogui.js';
const element = new IoOptionMenu();
document.body.appendChild(element);
element.style.display = 'none';
export default class {
    // reset() {
    //   element.value = undefined;
    //   element.label = '';
    //   element.options  = [];
    //   element.expanded = false;
    // }
    run() {
        describe('IoOptionMenu', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(element.value).to.equal(undefined);
                    chai.expect(element.label).to.equal('');
                    chai.expect(JSON.stringify(element.options)).to.equal(JSON.stringify([]));
                    chai.expect(element.expanded).to.equal(false);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    chai.expect(element.textContent).to.equal('undefined ▾');
                    element.value = 2;
                    chai.expect(element.textContent).to.equal('2 ▾');
                    element.setProperties({
                        options: new MenuOptions([{ value: 1, label: 'one' }]),
                        value: 1,
                        label: 'label'
                    });
                    chai.expect(element.textContent).to.equal('label');
                    element.label = '';
                    chai.expect(element.textContent).to.equal('one ▾');
                    element.options = new MenuOptions();
                    chai.expect(element.textContent).to.equal('1 ▾');
                    // this.reset();
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(element.getAttribute('role')).to.equal('button');
                    chai.expect(element.getAttribute('aria-haspopup')).to.equal('listbox');
                    chai.expect(element.getAttribute('aria-expanded')).to.equal('false');
                    element.expanded = true;
                    chai.expect(element.getAttribute('aria-expanded')).to.equal('true');
                    // this.reset();
                });
            });
        });
    }
}
//# sourceMappingURL=io-option-menu.test.js.map