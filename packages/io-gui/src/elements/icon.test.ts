import { IoIcon, IoIconsetSingleton } from '../index';;

const element = new IoIcon();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoIcon', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(element.icon).to.equal('');
          expect(element.stroke).to.equal(false);
          expect(element._properties.get('icon')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: String,
            value: '',
          });
          expect(element._properties.get('stroke')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('icon')).to.equal(null);
          expect(element.getAttribute('stroke')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          expect(element.innerHTML).to.equal('');
        });
      });
      describe('Reactivity', () => {
        it('should set innerHTML to match icon property', () => {
          element.icon = 'icon:check';
          expect(element.innerHTML).to.equal(IoIconsetSingleton.getIcon('icon:check'));
          element.icon = 'iconcheck';
          expect(element.innerHTML).to.equal('iconcheck');
          element.icon = '';
        });
        it('has reactive attributes', () => {
          element.icon = 'text';
          expect(element.getAttribute('icon')).to.equal('text');
          element.icon = '';
          element.stroke = true;
          expect(element.getAttribute('stroke')).to.equal('');
          element.stroke = false;
        });
      });
    });
  }
}
