import { IoBoolean, IoIconsetSingleton } from '../../io-gui.js';
import { expect } from 'chai';

const element = new IoBoolean();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoBoolean', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          expect(element.toggle).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          expect(element.value).to.equal(false);
          expect(element.true).to.equal('true');
          expect(element.false).to.equal('false');
          expect(element.role).to.equal('switch');
          expect(element._properties.get('value')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
          expect(element._properties.get('true')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: String,
            value: 'true',
          });
          expect(element._properties.get('false')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: String,
            value: 'false',
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('role')).to.equal('switch');
          expect(element.getAttribute('value')).to.equal(null);
          expect(element.getAttribute('aria-checked')).to.equal('false');
        });
        it('has correct default innerHTML', () => {
          expect(element.innerHTML).to.equal('<io-label label="false" aria-label="false">false</io-label>');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          expect(element.innerText).to.equal(element.false);
          element.toggle();
          expect(element.innerText).to.equal(element.true);
          element.true = 'yes';
          element.false = 'no';
          expect(element.innerText).to.equal('yes');
          element.toggle();
          expect(element.innerText).to.equal('no');
          element.value = false;
          element.true = 'true';
          element.false = 'false';
        });
        it('should set icon to match icon property', () => {
          element.icon = 'icons:io_logo';
          expect(element.innerHTML).to.equal(`<io-icon icon="${element.icon}">${IoIconsetSingleton.getIcon(element.icon)}</io-icon><io-label label="false" aria-label="false">${element.false}</io-label>`);
          element.icon = '';
          expect(element.innerHTML).to.equal(`<io-label label="false" aria-label="false">${element.false}</io-label>`);
        });
        it('should not render innerHTML if no value string is computed', () => {
          element.true = '';
          element.false = '';
          expect(element.innerHTML).to.equal('');
          element.toggle();
          expect(element.innerHTML).to.equal('');
          element.toggle();
          element.true = 'true';
          element.false = 'false';
        });
        it('has reactive attributes', () => {
          element.value = false;
          expect(element.getAttribute('value')).to.equal(null);
          element.value = true;
          expect(element.getAttribute('value')).to.equal('');
          element.value = false;
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          element.value = false;
          expect(element.getAttribute('aria-checked')).to.equal('false');
          element.value = true;
          expect(element.getAttribute('aria-checked')).to.equal('true');
          element.value = false;
        });
      });
    });
  }
}
