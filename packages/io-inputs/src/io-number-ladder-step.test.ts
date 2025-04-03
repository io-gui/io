import { IoNumberLadderStep } from './index.js';

const step = new IoNumberLadderStep();
step.style.display = 'none';
document.body.appendChild(step as unknown as HTMLElement);

export default class {
  run() {
    describe('io-number-ladder-step.test', () => {
      it('Should initialize property definitions correctly', () => {
        expect(step.value).to.equal(1);
        expect(step.role).to.equal('spinbutton');
        expect(step.type).to.equal('number');
        expect(step._properties.get('type')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: true,
          type: String,
          value: 'number',
        });
      });
      it('has correct default attributes', () => {
        expect(step.getAttribute('value')).to.equal(null);
        expect(step.getAttribute('role')).to.equal('spinbutton');
        expect(step.getAttribute('type')).to.equal('number');
      });
      it('has correct default innerHTML', () => {
        expect(step.innerHTML).to.equal('<io-text label="1" aria-label="1">1</io-text>');
      });
      it('should set innerText to match value property', () => {
        step.value = 0;
        expect(step.textContent).to.equal('0');
        step.value = 1;
      });
      it('has no reactive attributes', () => {
        step.value = 2;
        expect(step.getAttribute('value')).to.equal(null);
        step.value = 1;
      });
    });
  }
}
