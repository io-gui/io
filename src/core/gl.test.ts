import { IoGl, IoNode, IoThemeSingleton } from '../iogui.js';

const element = new IoGl();
element.size = [0, 0];
element.color = [0, 0, 0, 0];
element.pxRatio = 1;
element.style.visibility = 'hidden';
element.style.position = 'fixed';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoGl', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(element.initShader).to.be.a('function');
          chai.expect(element.onResized).to.be.a('function');
          chai.expect(element.themeMutated).to.be.a('function');
          chai.expect(element.setShaderProgram).to.be.a('function');
          chai.expect(element.updatePropertyUniform).to.be.a('function');
          chai.expect(element.updateThemeUniforms).to.be.a('function');
          chai.expect(element.setUniform).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          element.onResized();
          chai.expect(element.size).to.be.eql([0, 0]);
          chai.expect(element.color).to.be.eql([0, 0, 0, 0]);
          chai.expect(element.pxRatio).to.be.equal(window.devicePixelRatio);
          chai.expect(element.theme).to.be.equal(IoThemeSingleton);

          chai.expect(element._properties.get('size')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: [0, 0],
            reflect: false,
            type: Array,
            value: [0, 0],
          });

          chai.expect(element._properties.get('color')).to.eql({
            binding: undefined,
            reactive: true,
            observe: true,
            init: [1, 1, 1, 1],
            reflect: false,
            type: Array,
            value: [0, 0, 0, 0],
          });

          chai.expect(element._properties.get('pxRatio')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            init: undefined,
            reflect: false,
            type: Number,
            value: window.devicePixelRatio,
          });

          chai.expect(element._properties.get('theme')).to.eql({
            binding: undefined,
            reactive: true,
            observe: true,
            init: undefined,
            reflect: false,
            type: IoNode,
            value: IoThemeSingleton,
          });
        });
        it('has <canvas> element', () => {
          chai.expect(element.children[0].localName).to.equal('canvas');
          chai.expect((element as any)._canvas.localName).to.equal('canvas');
        });
      });
      describe('Reactivity', () => {
        it('has correct size and pxRatio', () => {
          element.style.border = 'none';
          element.style.width = '32px';
          element.style.height = '32px';
          element.onResized();
          chai.expect(element.size[0]).to.equal(32);
          chai.expect(element.size[1]).to.equal(32);
          chai.expect(element.pxRatio).to.equal(window.devicePixelRatio);
        });
        it('has correct color', () => {
          let color = (element as any)._ctx.getImageData(0, 0, 1, 1).data;
          chai.expect(color).to.eql(new Uint8ClampedArray([0, 0, 0, 0]));
          element.color = [1, 0.5, 0.25, 1];
          element._onRender();
          color = (element as any)._ctx.getImageData(0, 0, 1, 1).data;
          chai.expect(color).to.eql(new Uint8ClampedArray([255, 128, 64, 255]));
        });
      });
    });
  }
}
