import { IoNumberLadderStep } from '../index.js';

const step = new IoNumberLadderStep();
step.style.display = 'none';
document.body.appendChild(step as HTMLElement);

export default class {
  run() {
    describe('IoNumberLadderStep.test', () => {
      it('Should initialize properties correctly', () => {
        expect(step.value).to.equal(1);
        expect(step.role).to.equal('spinbutton');
      });
      it('has correct default attributes', () => {
        expect(step.getAttribute('value')).to.equal(null);
        expect(step.getAttribute('role')).to.equal('spinbutton');
      });
      it('has correct default innerHTML', () => {
        step.label = '1';
        expect(step.innerHTML).to.equal('<span>1</span>');
      });
      it('should set innerText to match label property', () => {
        step.label = '0';
        expect(step.textContent).to.equal('0');
        step.label = '1';
      });
    });
  }
}
