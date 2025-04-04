import { nextQueue } from 'io-gui';
import { IoColorBase } from '../index';

const element = new IoColorBase();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('io-color-base.test', () => {
      it('Should have core API functions defined', () => {
        expect(element.rgbFromHsv).to.be.a('function');
        expect(element.rgbFromHsl).to.be.a('function');
        expect(element.valueFromRgb).to.be.a('function');
      });
      it('Should initialize properties correctly', () => {
        expect(element.reactivity).to.equal('debounced');
        expect(element.value).to.deep.equal({r: 1, g: 1, b: 1, a: 1});
        expect(element.rgba).to.deep.equal([1, 1, 1, 1]);
        expect(element.hsv).to.deep.equal([1, 0, 1]);
        expect(element.hsl).to.deep.equal([1, 1, 1]);
      });
      it('Should convert colors correctly', () => {
        element.hsv = [0.5, 0.5, 0.5];
        expect(element.value).to.deep.equal({r: 1, g: 1, b: 1, a: 1});
        expect(element.rgba).to.deep.equal([1, 1, 1, 1]);
        expect(element.hsl).to.deep.equal([1, 1, 1]);
        element.rgbFromHsv();
        expect(element.value).to.deep.equal({r: 1, g: 1, b: 1, a: 1});
        expect(element.rgba).to.deep.equal([0.25, 0.5, 0.5, 1]);
        element.valueFromRgb();
        expect(element.value).to.deep.equal({r: 0.25, g: 0.5, b: 0.5, a: 1});
      });
      it('Should reactively update on value change', async () => {
        element.value = {r: 0.25, g: 0.75, b: 1, a: 0.5};
        await nextQueue();
        expect(element.rgba).to.deep.equal([0.25, 0.75, 1, 0.5]);
        expect(element.hsv).to.deep.equal([0.5555555555555557, 0.75, 1]);
        expect(element.hsl).to.deep.equal([0.5555555555555556, 1, 0.625]);
        element.value.r = 0.5;
        element.dispatchEvent('object-mutated', {object: element.value}, false, window);
        await nextQueue();
        expect(element.rgba).to.deep.equal([0.5, 0.75, 1, 0.5]);
        expect(element.hsv).to.deep.equal([0.5833333333333334, 0.5, 1]);
        expect(element.hsl).to.deep.equal([0.5833333333333334, 1, 0.75]);
      });
    });
  }
}
