import { IoIconsetSingleton } from 'io-gui';
import { IoButton } from './index';
import { expect } from 'chai';

const element = new IoButton();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoButton', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(element.action).to.equal(undefined);
          expect(element.value).to.equal(undefined);
          expect(element.pressed).to.equal(false);
          expect(element.role).to.equal('button');
          expect(element._properties.get('action')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: undefined,
            value: undefined,
          });
          expect(element._properties.get('value')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: undefined,
            value: undefined,
          });
          expect(element._properties.get('pressed')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('role')).to.equal('button');
          expect(element.getAttribute('pressed')).to.equal(null);
          expect(element.getAttribute('aria-pressed')).to.equal('false');
        });
        it('has correct default innerHTML', () => {
          expect(element.innerHTML).to.equal('');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match label property', () => {
          expect(element.innerText).to.equal('');
          element.label = 'click me';
          expect(element.innerText).to.equal('click me');
          element.label = '';
        });
        it('should set icon to match icon property', () => {
          element.icon = 'icons:io_logo';
          expect(element.innerHTML).to.equal(`<io-icon icon="${element.icon}">${IoIconsetSingleton.getIcon(element.icon)}</io-icon>`);
          element.icon = '';
          expect(element.innerHTML).to.equal('');
        });
        it('has reactive attributes', () => {
          element.pressed = false;
          expect(element.getAttribute('aria-pressed')).to.equal('false');
          element.pressed = true;
          expect(element.getAttribute('aria-pressed')).to.equal('true');
          element.pressed = false;
        });
      });
    });
  }
}
