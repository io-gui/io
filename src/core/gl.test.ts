import { IoGl, IoNode, IoThemeSingleton } from '../iogui';
import { expect } from 'chai';

const element = new IoGl();
element.size = [0, 0];
element.color = [0, 0, 0, 0];
element.pxRatio = 1;
element.style.visibility = 'hidden';
element.style.position = 'fixed';
element.style.left = '0';
element.style.bottom = '0';
element.style.zIndex = '1000000';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('gl.test.ts', () => {
      it('Should have core API functions defined', () => {
        expect(element.initShader).to.be.a('function');
        expect(element.onResized).to.be.a('function');
        expect(element.themeMutated).to.be.a('function');
        expect(element.setShaderProgram).to.be.a('function');
        expect(element.updatePropertyUniform).to.be.a('function');
        expect(element.updateThemeUniforms).to.be.a('function');
        expect(element.setUniform).to.be.a('function');
      });
      it('Should initialize property definitions correctly', () => {
        element.onResized();
        expect(element.size).to.be.eql([0, 0]);
        expect(element.color).to.be.eql([0, 0, 0, 0]);
        expect(element.pxRatio).to.be.equal(window.devicePixelRatio);
        expect(element.theme).to.be.equal(IoThemeSingleton);

        expect(element._properties.get('size')).to.eql({
          binding: undefined,
          init: [0, 0],
          reflect: false,
          type: Array,
          value: [0, 0],
        });

        expect(element._properties.get('color')).to.eql({
          binding: undefined,
          init: [1, 1, 1, 1],
          reflect: false,
          type: Array,
          value: [0, 0, 0, 0],
        });

        expect(element._properties.get('pxRatio')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: false,
          type: Number,
          value: window.devicePixelRatio,
        });

        expect(element._properties.get('theme')).to.eql({
          binding: undefined,
          init: undefined,
          reflect: false,
          type: IoNode,
          value: IoThemeSingleton,
        });
      });
      it('has <canvas> element', () => {
        expect(element.children[0].localName).to.equal('canvas');
        expect((element as IoGl).canvas.localName).to.equal('canvas');
      });
      it('has correct size and pxRatio', () => {
        element.style.border = 'none';
        element.style.width = '32px';
        element.style.height = '32px';
        element.onResized();
        expect(element.size[0]).to.equal(32);
        expect(element.size[1]).to.equal(32);
        expect(element.pxRatio).to.equal(window.devicePixelRatio);
      });
      it('has correct color', () => {
        let color = (element as IoGl).ctx.getImageData(0, 0, 1, 1).data;
        expect(color).to.eql(new Uint8ClampedArray([0, 0, 0, 0]));
        element.color = [1, 0.5, 0.25, 1];
        element._onRender();
        color = (element as IoGl).ctx.getImageData(0, 0, 1, 1).data;
        expect(color).to.eql(new Uint8ClampedArray([255, 128, 64, 255]));

        element.transparent = true;
        element.color = [1, 0.25, 0.5, 0.5];
        element._onRender();
        color = (element as IoGl).ctx.getImageData(0, 0, 1, 1).data;
        expect(color).to.eql(new Uint8ClampedArray([128, 32, 64, 64]));
      });
    });
  }
}
