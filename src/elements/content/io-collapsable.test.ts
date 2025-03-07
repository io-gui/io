import {IoCollapsable} from '../../iogui.js';
import { expect } from 'chai';
export default class {
  element = new IoCollapsable();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  run() {
    describe('IoCollapsable: ', () => {
      describe('default values', () => {
        it('has default values', () => {
          expect(this.element.label).to.equal('');
          expect(this.element.expanded).to.equal(false);
          expect(JSON.stringify(this.element.elements)).to.equal(JSON.stringify([]));
        });
      });
      describe('innerText', () => {
        it('matches values', () => {
          expect(this.element.$.content.textContent).to.equal('');
          this.element.elements = [
            ['div', 'test1'],
            ['div', 'test2'],
          ];
          expect(this.element.$.content.textContent).to.equal('');
          this.element.expanded = true;
          expect(this.element.$.content.innerHTML).to.equal('<div>test1</div><div>test2</div>');
          this.element.elements = [];
          expect(this.element.$.content.textContent).to.equal('');
          this.element.expanded = false;
        });
      });
      describe('attributes', () => {
        it('has tabindex attribute', () => {
          expect(this.element.children[0].getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          expect(this.element.getAttribute('role')).to.equal('region');
        });
      });
    });
  }
}
