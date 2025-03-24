import {IoLabel} from '../../io-gui.js';
import { expect } from 'chai';
const element = new IoLabel();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoLabel', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(element.label).to.equal('');
          expect(element._properties.get('label')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: String,
            value: '',
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('label')).to.equal(null);
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match label property', () => {
          element.label = 'label';
          expect(element.innerText).to.equal('label');
          element.label = '';
          expect(element.innerText).to.equal('');
        });
        it('has reactive attributes', () => {
          element.label = 'text';
          expect(element.getAttribute('label')).to.equal('text');
          element.label = '';
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          expect(element.getAttribute('aria-label')).to.equal(null);
          element.label = 'label';
          expect(element.getAttribute('aria-label')).to.equal('label');
          element.label = '';
          expect(element.getAttribute('aria-label')).to.equal(null);
        });
      });
    });
  }
}
