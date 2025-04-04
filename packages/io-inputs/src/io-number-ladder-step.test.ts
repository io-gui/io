import { IoNumberLadderStep } from './index.js';

const step = new IoNumberLadderStep();
step.style.display = 'none';
document.body.appendChild(step as unknown as HTMLElement);

export default class {
  run() {
    describe('io-number-ladder-step.test', () => {
      it('Should initialize properties correctly', () => {
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
        step.label = '1';
        expect(step.innerHTML).to.equal('<io-text>1</io-text>');
      });
      it('should set innerText to match label property', () => {
        step.label = '0';
        expect(step.textContent).to.equal('0');
        step.label = '1';
      });
      it('has no reactive attributes', () => {
        step.label = '2';
        expect(step.getAttribute('label')).to.equal(null);
        step.label = '1';
      });
    });
  }
}
