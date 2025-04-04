import { IoInputBase } from './index';
import { IoIconsetSingleton } from 'io-icons';

const element = new IoInputBase();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('io-input-base.test', () => {
      it('Should have core API functions defined', () => {
        expect(element.getCaretPosition).to.be.a('function');
        expect(element.setCaretPosition).to.be.a('function');
      });
      it('Should initialize properties correctly', () => {
        expect(element.tabindex).to.equal('0');
        expect(element.value).to.equal('');
        expect(element.selected).to.equal(false);

        expect(element._properties.get('value')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: false,
          type: undefined,
          value: '',
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
      it('has reactive attributes', () => {
        expect(element.getAttribute('selected')).to.equal(null);
        element.selected = true;
        expect(element.getAttribute('selected')).to.equal('');
        element.selected = false;
      });
    });
  }
}
