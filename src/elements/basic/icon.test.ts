import { IoIcon, IoIconsetSingleton } from '../../iogui.js';

const element = new IoIcon();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoIcon', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.icon).to.equal('');
          chai.expect(element.stroke).to.equal(false);
          chai.expect(element._properties.icon).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '',
          });
          chai.expect(element._properties.stroke).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('icon')).to.equal(null);
          chai.expect(element.getAttribute('stroke')).to.equal(null);
        });
        it('has correct default innerHTML', () => {
          chai.expect(element.innerHTML).to.equal('');
        });
      });
      describe('Reactivity', () => {
        it('should set innerHTML to match icon property', () => {
          element.icon = 'icon:check';
          chai.expect(element.innerHTML).to.equal(IoIconsetSingleton.getIcon('icon:check'));
          element.icon = 'iconcheck';
          chai.expect(element.innerHTML).to.equal('iconcheck');
          element.icon = '';
        });
        it('has reactive attributes', () => {
          element.icon = 'text';
          chai.expect(element.getAttribute('icon')).to.equal('text');
          element.icon = '';
          element.stroke = true;
          chai.expect(element.getAttribute('stroke')).to.equal('');
          element.stroke = false;
        });
      });
    });
  }
}
