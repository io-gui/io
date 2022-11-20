import { IoField, IoIconsetSingleton } from '../../iogui.js';

const element = new IoField();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoField', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(element.getCaretPosition).to.be.a('function');
          chai.expect(element.setCaretPosition).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.tabindex).to.equal('0');
          chai.expect(element.value).to.equal(undefined);
          chai.expect(element.icon).to.equal('');
          chai.expect(element.stroke).to.equal(false);
          chai.expect(element.reverse).to.equal(false);
          chai.expect(element.selected).to.equal(false);

          chai.expect(element._properties.get('value')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: undefined,
            value: undefined,
          });
          chai.expect(element._properties.get('stroke')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Boolean,
            value: false,
          });
          chai.expect(element._properties.get('reverse')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
          chai.expect(element._properties.get('selected')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('tabindex')).to.equal('0');
          chai.expect(element.getAttribute('icon')).to.equal(null);
          chai.expect(element.getAttribute('stroke')).to.equal(null);
          chai.expect(element.getAttribute('value')).to.equal(null);
          chai.expect(element.getAttribute('reverse')).to.equal(null);
          chai.expect(element.getAttribute('selected')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          chai.expect(element.innerHTML).to.equal('');
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value and/or label property', () => {
          chai.expect(element.innerText).to.equal('');
          element.value = false;
          chai.expect(element.innerText).to.equal('false');
          element.value = {};
          chai.expect(element.innerText).to.equal('Object');
          element.value = [0, 1, 2, 3];
          chai.expect(element.innerText).to.equal('Array(4)');
          element.label = 'label';
          chai.expect(element.innerText).to.equal('label');
          element.value = undefined;
          chai.expect(element.innerText).to.equal('label');
          element.label = '';
          chai.expect(element.innerText).to.equal('undefined');
        });
        it('should set icon to match icon property', () => {
          element.icon = 'icons:checkmark';
          chai.expect(element.innerHTML).to.equal(`<io-icon icon="${element.icon}">${IoIconsetSingleton.getIcon(element.icon)}</io-icon><io-label label="${element.value}" aria-label="${element.value}">${element.value}</io-label>`);
          element.icon = '';
          chai.expect(element.innerHTML).to.equal(`<io-label label="${element.value}" aria-label="${element.value}">${element.value}</io-label>`);
        });
        it('has reactive attributes', () => {
          chai.expect(element.getAttribute('reverse')).to.equal(null);
          element.reverse = true;
          chai.expect(element.getAttribute('reverse')).to.equal('');
          element.reverse = false;
          chai.expect(element.getAttribute('selected')).to.equal(null);
          element.selected = true;
          chai.expect(element.getAttribute('selected')).to.equal('');
          element.selected = false;
        });
      });
    });
  }
}
