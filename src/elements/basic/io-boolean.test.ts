import { IoBoolean, IoIconsetSingleton } from '../../iogui.js';

const element = new IoBoolean();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoBoolean', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(element.toggle).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.value).to.equal(false);
          chai.expect(element.true).to.equal('true');
          chai.expect(element.false).to.equal('false');
          chai.expect(element.role).to.equal('switch');
          chai.expect(element._properties.get('value')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: false,
            reflect: true,
            type: Boolean,
            value: false,
          });
          chai.expect(element._properties.get('true')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: false,
            reflect: false,
            type: String,
            value: 'true',
          });
          chai.expect(element._properties.get('false')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: false,
            reflect: false,
            type: String,
            value: 'false',
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('role')).to.equal('switch');
          chai.expect(element.getAttribute('value')).to.equal(null);
          chai.expect(element.getAttribute('aria-checked')).to.equal('false');
        });
        it('has correct default innerHTML', () => {
          chai.expect(element.innerHTML).to.equal('<io-label label="false" aria-label="false">false</io-label>');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          chai.expect(element.innerText).to.equal(element.false);
          element.toggle();
          chai.expect(element.innerText).to.equal(element.true);
          element.true = 'yes';
          element.false = 'no';
          chai.expect(element.innerText).to.equal('yes');
          element.toggle();
          chai.expect(element.innerText).to.equal('no');
          element.value = false;
          element.true = 'true';
          element.false = 'false';
        });
        it('should set icon to match icon property', () => {
          element.icon = 'icons:checkmark';
          chai.expect(element.innerHTML).to.equal(`<io-icon icon="${element.icon}">${IoIconsetSingleton.getIcon(element.icon)}</io-icon><io-label label="false" aria-label="false">${element.false}</io-label>`);
          element.icon = '';
          chai.expect(element.innerHTML).to.equal(`<io-label label="false" aria-label="false">${element.false}</io-label>`);
        });
        it('should not render innerHTML if no value string is computed', () => {
          element.true = '';
          element.false = '';
          chai.expect(element.innerHTML).to.equal('');
          element.toggle();
          chai.expect(element.innerHTML).to.equal('');
          element.toggle();
          element.true = 'true';
          element.false = 'false';
        });
        it('has reactive attributes', () => {
          element.value = false;
          chai.expect(element.getAttribute('value')).to.equal(null);
          element.value = true;
          chai.expect(element.getAttribute('value')).to.equal('');
          element.value = false;
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          element.value = false;
          chai.expect(element.getAttribute('aria-checked')).to.equal('false');
          element.value = true;
          chai.expect(element.getAttribute('aria-checked')).to.equal('true');
          element.value = false;
        });
      });
    });
  }
}
