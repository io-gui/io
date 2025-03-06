import { IoButton, IoIconsetSingleton } from '../../iogui.js';
import * as chai from 'chai';
const element = new IoButton();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoButton', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.action).to.equal(undefined);
          chai.expect(element.value).to.equal(undefined);
          chai.expect(element.pressed).to.equal(false);
          chai.expect(element.role).to.equal('button');
          chai.expect(element._properties.get('action')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: undefined,
            value: undefined,
          });
          chai.expect(element._properties.get('value')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: undefined,
            value: undefined,
          });
          chai.expect(element._properties.get('pressed')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('role')).to.equal('button');
          chai.expect(element.getAttribute('pressed')).to.equal(null);
          chai.expect(element.getAttribute('aria-pressed')).to.equal('false');
        });
        it('has correct default innerHTML', () => {
          chai.expect(element.innerHTML).to.equal('');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match label property', () => {
          chai.expect(element.innerText).to.equal('');
          element.label = 'click me';
          chai.expect(element.innerText).to.equal('click me');
          element.label = '';
        });
        it('should set icon to match icon property', () => {
          element.icon = 'icons:checkmark';
          chai.expect(element.innerHTML).to.equal(`<io-icon icon="${element.icon}">${IoIconsetSingleton.getIcon(element.icon)}</io-icon>`);
          element.icon = '';
          chai.expect(element.innerHTML).to.equal('');
        });
        it('has reactive attributes', () => {
          element.pressed = false;
          chai.expect(element.getAttribute('aria-pressed')).to.equal('false');
          element.pressed = true;
          chai.expect(element.getAttribute('aria-pressed')).to.equal('true');
          element.pressed = false;
        });
      });
    });
  }
}
