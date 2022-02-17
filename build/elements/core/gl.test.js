import { IoGl, IoThemeSingleton } from '../../iogui.elements.js';
export default class {
    element;
    constructor() {
        this.element = new IoGl();
        this.element.style.visibility = 'hidden';
        this.element.style.position = 'fixed';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.size = [0, 0];
        this.element.color = [0, 0, 0, 0];
        this.element.pxRatio = 1;
    }
    run() {
        describe('IoGl', () => {
            describe('canvas', () => {
                it('has canvas', () => {
                    chai.expect(this.element.children[0].localName).to.equal('canvas');
                    chai.expect(this.element.$.canvas.localName).to.equal('canvas');
                });
            });
            describe('theme', () => {
                it('has theme singleton variables', () => {
                    chai.expect(this.element.css).to.equal(IoThemeSingleton);
                });
            });
            describe('size', () => {
                it('has correct size and pxRatio', () => {
                    this.element.style.border = 'none';
                    this.element.style.width = '32px';
                    this.element.style.height = '32px';
                    this.element.onResized();
                    chai.expect(this.element.size[0]).to.equal(32);
                    chai.expect(this.element.size[1]).to.equal(32);
                    chai.expect(this.element.pxRatio).to.equal(window.devicePixelRatio);
                });
            });
            // TODO: test color values, uniforms, rAF throttling.
        });
    }
}
//# sourceMappingURL=gl.test.js.map