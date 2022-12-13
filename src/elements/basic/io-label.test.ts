import {IoLabel} from '../../iogui.js';

const element = new IoLabel();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoLabel', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.label).to.equal('');
          chai.expect(element._properties.get('label')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: true,
            type: String,
            value: '',
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('label')).to.equal(null);
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match label property', () => {
          element.label = 'label';
          chai.expect(element.innerText).to.equal('label');
          element.label = '';
          chai.expect(element.innerText).to.equal('');
        });
        it('has reactive attributes', () => {
          element.label = 'text';
          chai.expect(element.getAttribute('label')).to.equal('text');
          element.label = '';
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          chai.expect(element.getAttribute('aria-label')).to.equal(null);
          element.label = 'label';
          chai.expect(element.getAttribute('aria-label')).to.equal('label');
          element.label = '';
          chai.expect(element.getAttribute('aria-label')).to.equal(null);
        });
      });
    });
  }
}
