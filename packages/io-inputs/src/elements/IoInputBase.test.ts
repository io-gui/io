import { IoInputBase } from '../index';

const element = new IoInputBase();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoInputBase.test', () => {
      it('Should have core API functions defined', () => {
        expect(element.getCaretPosition).to.be.a('function');
        expect(element.setCaretPosition).to.be.a('function');
      });
      it('Should initialize properties correctly', () => {
        expect(element.tabIndex).to.equal('0');
        expect(element.value).to.equal('');
        expect(element.selected).to.equal(false);

        expect(element._properties.get('value')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: false,
          type: String,
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
        expect(element.getAttribute('tabIndex')).to.equal('0');
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
