import { IoIcon, IconsetSingleton } from 'io-icons';

const element = new IoIcon({ value: '' });
element.style.display = 'none';
document.body.appendChild(element as HTMLElement);

export default class {
  run() {
    describe('IoIcon.test', () => {
      it('Should initialize properties correctly', () => {
        expect(element.value).to.equal('');
        expect(element.stroke).to.equal(false);
        expect(element._reactiveProperties.get('value')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: true,
          type: String,
          value: '',
        });
        expect(element._reactiveProperties.get('stroke')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: true,
          type: Boolean,
          value: false,
        });
      });
      it('has correct default attributes', () => {
        expect(element.getAttribute('value')).to.equal(null);
        expect(element.getAttribute('stroke')).to.equal(null);
      });
      it('has correct default innerHTML', () => {
        expect(element.innerHTML).to.equal('');
      });
      it('should set innerHTML to match value property', () => {
        element.value = 'io:check';
        expect(element.innerHTML).to.equal(IconsetSingleton.getIcon('io:check'));
        element.value = '#';
        expect(element.innerHTML).to.equal('#');
        element.value = '';
      });
      it('has reactive attributes', () => {
        element.value = 'text';
        expect(element.getAttribute('value')).to.equal('text');
        element.value = '';
        element.stroke = true;
        expect(element.getAttribute('stroke')).to.equal('');
        element.stroke = false;
      });
    });
  }
}
