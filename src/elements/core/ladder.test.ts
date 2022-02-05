import '../../iogui.js';
import { IoLadder } from './ladder.js';
// TODO: test with src element.

export default class {
  element = new IoLadder();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.conversion = 1;
    this.element.step = 0.0001;
    this.element.min = -Infinity;
    this.element.max = Infinity;
  }
  run() {
    describe('IoLadder', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.label).to.equal('');
          chai.expect(this.element.conversion).to.equal(1);
          chai.expect(this.element.expanded).to.equal(false);
          chai.expect(this.element.min).to.equal(-Infinity);
          chai.expect(this.element.max).to.equal(Infinity);
          chai.expect(this.element.step).to.equal(0.0001);
        });
      });
      describe('steps innerText', () => {
        const $ = (selector: string) => { return this.element.querySelector(selector); };
        it('matches values', () => {
          chai.expect($('.io-up1').value).to.equal(1);
          chai.expect($('.io-up1').textContent).to.equal('1');
          chai.expect($('.io-up2').textContent).to.equal('10');
          chai.expect($('.io-up3').textContent).to.equal('100');
          chai.expect($('.io-up4').textContent).to.equal('1000');
          chai.expect($('.io-down1').value).to.equal(0.1);
          chai.expect($('.io-down1').textContent).to.equal('0.1');
          chai.expect($('.io-down2').textContent).to.equal('0.01');
          chai.expect($('.io-down3').textContent).to.equal('0.001');
          chai.expect($('.io-down4').textContent).to.equal('0.0001');
        });

        it('matches value with custom step settings', () => {
          this.element.step = 0.2;
          chai.expect($('.io-up1').value).to.equal(2);
          chai.expect($('.io-up1').textContent).to.equal('2');
          chai.expect($('.io-up2').textContent).to.equal('20');
          chai.expect($('.io-up3').textContent).to.equal('200');
          chai.expect($('.io-up4').textContent).to.equal('2000');
          chai.expect($('.io-down1').value).to.equal(0.2);
          chai.expect($('.io-down1').textContent).to.equal('0.2');
          chai.expect($('.io-down2')).to.equal(null);
          chai.expect($('.io-down3')).to.equal(null);
          chai.expect($('.io-down4')).to.equal(null);
          this.element.step = 0.02;
          chai.expect($('.io-down1').textContent).to.equal('0.2');
          chai.expect($('.io-down2').textContent).to.equal('0.02');
          chai.expect($('.io-down3')).to.equal(null);
          this.reset();
        });
        it('matches value with custom min/max settings', () => {
          this.element.min = 0;
          this.element.max = 100;
          chai.expect($('.io-up1').value).to.equal(1);
          chai.expect($('.io-up1').textContent).to.equal('1');
          chai.expect($('.io-up2').textContent).to.equal('10');
          chai.expect($('.io-up3').textContent).to.equal('100');
          chai.expect($('.io-up4')).to.equal(null);
          this.element.max = 1000;
          chai.expect($('.io-up4').textContent).to.equal('1000');
          this.reset();
        });
        it('matches value with conversion factor', () => {
          this.element.conversion = 20;
          chai.expect($('.io-up2').value).to.equal(10);
          chai.expect($('.io-up2').textContent).to.equal('200');
          this.element.step = 0.2;
          chai.expect($('.io-up2').value).to.equal(20);
          chai.expect($('.io-up2').textContent).to.equal('400');
          this.reset();
        });
      });
      describe('attributes', () => {
        const $ = (selector: string) => { return this.element.querySelector(selector); };
        it('steps have tabindex attribute', () => {
          chai.expect($('.io-up1').getAttribute('tabindex')).to.equal('0');
          chai.expect($('.io-down1').getAttribute('tabindex')).to.equal('0');
        });
        it('has a11y attributes', () => {
          chai.expect(this.element.getAttribute('role')).to.equal('list');
        });
        it('steps have a11y attributes', () => {
          chai.expect($('.io-up1').getAttribute('role')).to.equal('spinbutton');
          chai.expect($('.io-up1').getAttribute('type')).to.equal('number');
          chai.expect($('.io-up1').getAttribute('aria-label')).to.equal('1');
          // chai.expect($('.io-up1').getAttribute('aria-valuemax')).to.equal('Infinity');
          // chai.expect($('.io-up1').getAttribute('aria-valuemin')).to.equal('-Infinity');
          // TODO: test with src element
          // chai.expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('0');
          // this.element.value = 3;
          // chai.expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('3');
          this.element.step = 0.5;
          chai.expect($('.io-up1').getAttribute('aria-label')).to.equal('5');
        });
      });
    });
  }
}
