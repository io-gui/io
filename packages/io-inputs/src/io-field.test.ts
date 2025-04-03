import { IoField } from './index';
import { IoIconsetSingleton } from 'io-icons';

const element = new IoField();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoField', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          expect(element.getCaretPosition).to.be.a('function');
          expect(element.setCaretPosition).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          expect(element.tabindex).to.equal('0');
          expect(element.value).to.equal(undefined);
          expect(element.icon).to.equal('');
          expect(element.stroke).to.equal(false);
          expect(element.selected).to.equal(false);

          expect(element._properties.get('value')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: undefined,
            value: undefined,
          });
          expect(element._properties.get('stroke')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
          expect(element._properties.get('selected')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('tabindex')).to.equal('0');
          expect(element.getAttribute('icon')).to.equal(null);
          expect(element.getAttribute('stroke')).to.equal(null);
          expect(element.getAttribute('value')).to.equal(null);
          expect(element.getAttribute('selected')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          expect(element.innerHTML).to.equal('');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value and/or label property', () => {
          expect(element.innerText).to.equal('');
          element.value = false;
          expect(element.innerText).to.equal('false');
          element.value = {};
          expect(element.innerText).to.equal('Object');
          element.value = [0, 1, 2, 3];
          expect(element.innerText).to.equal('Array(4)');
          element.label = 'label';
          expect(element.innerText).to.equal('label');
          element.value = undefined;
          expect(element.innerText).to.equal('label');
          element.label = '';
          expect(element.innerText).to.equal('');
        });
        it('should set icon to match icon property', () => {
          element.value = 'test';
          element.icon = 'icons:io_logo';
          expect(element.innerHTML).to.equal(`<io-icon icon="${element.icon}">${IoIconsetSingleton.getIcon(element.icon)}</io-icon><io-text label="${element.value}" aria-label="${element.value}">${element.value}</io-text>`);
          element.icon = '';
          expect(element.innerHTML).to.equal(`<io-text label="${element.value}" aria-label="${element.value}">${element.value}</io-text>`);
        });
        it('has reactive attributes', () => {
          expect(element.getAttribute('selected')).to.equal(null);
          element.selected = true;
          expect(element.getAttribute('selected')).to.equal('');
          element.selected = false;
        });
      });
    });
  }
}
