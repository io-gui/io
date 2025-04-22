import { IoNumber, IoNumberLadderSingleton } from '../index.js';

const element = new IoNumber();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

const ladder = IoNumberLadderSingleton;
ladder.expanded = true;
ladder.style.display = 'none';
ladder.src = element;

export default class {
  run() {
    describe('IoNumberLadder.test', () => {
      const $ = (selector: string) => { return ladder.querySelector(selector); };
      it('should set innerText to match value property', () => {
        expect($('.io-up1').value).to.equal(1);
        expect($('.io-up1').textContent).to.equal('1');
        expect($('.io-up2').textContent).to.equal('10');
        expect($('.io-up3').textContent).to.equal('100');
        expect($('.io-up4').textContent).to.equal('1000');
        expect($('.io-down1').value).to.equal(0.1);
        expect($('.io-down1').textContent).to.equal('0.1');
        expect($('.io-down2').textContent).to.equal('0.01');
        expect($('.io-down3').textContent).to.equal('0.001');
        expect($('.io-down4').textContent).to.equal('0.0001');
      });
      it('should set innerText to match value with custom step settings', () => {
        element.step = 0.2;
        ladder.changed();
        expect($('.io-up1').value).to.equal(2);
        expect($('.io-up1').textContent).to.equal('2');
        expect($('.io-up2').textContent).to.equal('20');
        expect($('.io-up3').textContent).to.equal('200');
        expect($('.io-up4').textContent).to.equal('2000');
        expect($('.io-down1').value).to.equal(0.2);
        expect($('.io-down1').textContent).to.equal('0.2');
        expect($('.io-down2')).to.equal(null);
        expect($('.io-down3')).to.equal(null);
        expect($('.io-down4')).to.equal(null);
        element.step = 0.02;
        ladder.changed();
        expect($('.io-down1').textContent).to.equal('0.2');
        expect($('.io-down2').textContent).to.equal('0.02');
        expect($('.io-down3')).to.equal(null);
        element.step = 0.0001;
        ladder.changed();
      });
      it('should set innerText to match value with custom min/max settings', () => {
        element.min = 0;
        element.max = 100;
        ladder.changed();
        expect($('.io-up1').value).to.equal(1);
        expect($('.io-up1').innerText).to.equal('1');
        expect($('.io-up2').innerText).to.equal('10');
        expect($('.io-up3').innerText).to.equal('100');
        expect($('.io-up4')).to.equal(null);
        element.max = 1000;
        ladder.changed();
        expect($('.io-up4').innerText).to.equal('1000');
        element.min = -Infinity;
        element.max = Infinity;
        ladder.changed();
      });
      it('should set innerText to match value with conversion factor', () => {
        element.conversion = 20;
        ladder.changed();
        expect($('.io-up2').value).to.equal(10);
        expect($('.io-up2').innerText).to.equal('200');
        element.step = 0.2;
        ladder.changed();
        expect($('.io-up2').value).to.equal(20);
        expect($('.io-up2').innerText).to.equal('400');
        element.conversion = 1;
        element.step = 0.0001;
        ladder.changed();
      });
      it('steps have tabIndex attribute', () => {
        expect($('.io-up1').getAttribute('tabIndex')).to.equal('0');
        expect($('.io-down1').getAttribute('tabIndex')).to.equal('0');
      });
      it('has a11y attributes', () => {
        expect(ladder.getAttribute('role')).to.equal('list');
      });
      it('steps have a11y attributes', () => {
        expect($('.io-up1').getAttribute('role')).to.equal('spinbutton');
        expect($('.io-up1').getAttribute('aria-label')).to.equal('1');
        expect($('.io-up1').getAttribute('aria-valuemax')).to.equal('Infinity');
        expect($('.io-up1').getAttribute('aria-valuemin')).to.equal('-Infinity');
        expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('0');
        element.value = 3;
        ladder.changed();
        expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('3');
        element.step = 0.5;
        ladder.changed();
        expect($('.io-up1').getAttribute('aria-label')).to.equal('5');
        element.value = 0;
        element.step = 0.0001;
        ladder.changed();
        expect(ladder.getAttribute('aria-invalid')).to.equal(null);
        element.value = NaN;
        ladder.changed();
        expect(ladder.getAttribute('aria-invalid')).to.equal('true');
        element.value = 12;
        ladder.changed();
        element.min = 0;
        element.max = 24;
        element.step = 2;
        ladder.changed();
        expect(ladder.getAttribute('aria-valuenow')).to.equal('12');
        expect(ladder.getAttribute('aria-valuemin')).to.equal('0');
        expect(ladder.getAttribute('aria-valuemax')).to.equal('24');
        expect(ladder.getAttribute('aria-valuestep')).to.equal('2');
        element.min = -Infinity;
        element.max = Infinity;
        element.step = 0.0001;
        ladder.changed();
      });
    });
  }
}
