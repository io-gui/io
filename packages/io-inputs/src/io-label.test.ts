import { IoLabel } from './index';;

const element = new IoLabel();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoLabel', () => {
      describe('Initialization', () => {
        it('Should initialize property definitions correctly', () => {
          expect(element.value).to.equal('');
          expect(element._properties.get('value')).to.eql({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: String,
            value: '',
          });
        });
        it('has correct default attributes', () => {
          expect(element.getAttribute('value')).to.equal(null);
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value property', () => {
          element.value = 'value';
          expect(element.innerText).to.equal('value');
          element.value = '';
          expect(element.innerText).to.equal('');
        });
        it('has reactive attributes', () => {
          element.value = 'text';
          expect(element.getAttribute('value')).to.equal('text');
          element.value = '';
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          expect(element.getAttribute('aria-value')).to.equal(null);
          element.value = 'value';
          expect(element.getAttribute('aria-value')).to.equal('value');
          element.value = '';
          expect(element.getAttribute('aria-value')).to.equal(null);
        });
      });
    });
  }
}
