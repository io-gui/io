import { IoGl, IoThemeSingleton } from '../iogui.js';

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
          chai.expect(element.size).to.be.eql([0, 0]);
          chai.expect(element.color).to.be.eql([0, 0, 0, 0]);
          chai.expect(element.pxRatio).to.be.equal(1);
          chai.expect(element.theme).to.be.equal(IoThemeSingleton);

          chai.expect(element._properties.size).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Array,
            value: [0, 0],
          });

          chai.expect(element._properties.color).to.eql({
            binding: undefined,
            notify: true,
            observe: true,
            reflect: 'none',
            type: Array,
            value: [0, 0, 0, 0],
          });

          chai.expect(element._properties.pxRatio).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Number,
            value: 1,
          });

          chai.expect(element._properties.theme).to.eql({
            binding: undefined,
            notify: true,
            observe: true,
            reflect: 'none',
            type: Object,
            value: IoThemeSingleton,
          });
        });
        it('has <canvas> element', () => {
          chai.expect(element.children[0].localName).to.equal('canvas');
          chai.expect(element.$.canvas.localName).to.equal('canvas');
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
          let color = element.$.canvas.ctx.getImageData(8, 8, 1, 1).data;
          chai.expect(color).to.eql(new Uint8ClampedArray([0, 0, 0, 0]));
          element.color = [1, 0.5, 0.25, 1];
          element._onRender();
          color = element.$.canvas.ctx.getImageData(8, 8, 1, 1).data;
          chai.expect(color).to.eql(new Uint8ClampedArray([255, 128, 64, 255]));
        });
      });
    });
  }
}
