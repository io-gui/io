import { IoOptionSelect, MenuOption } from '@io-gui/menus';
const element = new IoOptionSelect({ value: '', option: new MenuOption({ id: 'test', options: [] }) });
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
        describe('IoOptionSelect', () => {
            it('has default values', () => {
            });
            it('matches values', () => {
                expect(element.textContent).to.equal('');
                element.value = 2;
                // expect(element.textContent).to.equal('2');
                // element.setProperties({
                //   options: new MenuOptions([{value: 1, label: 'one'}]),
                //   value: 1,
                //   label: 'label'
                // });
                // expect(element.textContent).to.equal('label');
                // element.label = '';
                // expect(element.textContent).to.equal('one');
                // element.options = new MenuOptions();
                // expect(element.textContent).to.equal('1 ▾');
                // this.reset();
            });
            it('has tabIndex attribute', () => {
                // expect(element.getAttribute('tabIndex')).to.equal('0');
            });
            it('has a11y attributes', () => {
                // expect(element.getAttribute('role')).to.equal('button');
                // expect(element.getAttribute('aria-haspopup')).to.equal('listbox');
                // expect(element.getAttribute('aria-expanded')).to.equal('false');
                // element.expanded = true;
                // expect(element.getAttribute('aria-expanded')).to.equal('true');
                // this.reset();
            });
        });
    }
}
//# sourceMappingURL=IoOptionSelect.test.js.map