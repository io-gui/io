import { IoOptionMenu } from './io-option-menu.js';
import { MenuOptions } from './models/menu-options.js';

const element = new IoOptionMenu();
document.body.appendChild(element as unknown as HTMLElement);
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
          expect(element.value).to.equal(undefined);
          expect(element.label).to.equal('');
          expect(JSON.stringify(element.options)).to.equal(JSON.stringify([]));
          expect(element.expanded).to.equal(false);
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          expect(element.textContent).to.equal('undefined ▾');
          element.value = 2;
          expect(element.textContent).to.equal('2 ▾');
          element.setProperties({
            options: new MenuOptions([{value: 1, label: 'one'}]),
            value: 1,
            label: 'label'
          });
          expect(element.textContent).to.equal('label');
          element.label = '';
          expect(element.textContent).to.equal('one ▾');
          element.options = new MenuOptions();
          expect(element.textContent).to.equal('1 ▾');
          // this.reset();
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          expect(element  .getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          expect(element.getAttribute('role')).to.equal('button');
          expect(element.getAttribute('aria-haspopup')).to.equal('listbox');
          expect(element.getAttribute('aria-expanded')).to.equal('false');
          element.expanded = true;
          expect(element.getAttribute('aria-expanded')).to.equal('true');
          // this.reset();
        });
      });
    });
  }
}
