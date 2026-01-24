var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { describe, it, expect } from 'vitest';
import { IoGl, Node, ThemeSingleton, ReactiveProperty, Register } from '@io-gui/core';
let IoGlTest = class IoGlTest extends IoGl {
    static get Frag() {
        return /* glsl */ `
      void main(void) {
        gl_FragColor = uColor;
      }\n\n`;
    }
};
__decorate([
    ReactiveProperty({ type: Array, init: [0, 0, 0, 0] })
], IoGlTest.prototype, "color", void 0);
IoGlTest = __decorate([
    Register
], IoGlTest);
const element = new IoGlTest();
element.size = [0, 0];
element.pxRatio = 1;
element.style.visibility = 'hidden';
element.style.position = 'fixed';
element.style.left = '0';
element.style.bottom = '0';
element.style.zIndex = '1000000';
document.body.appendChild(element);
describe('IoGL', () => {
    it('Should have core API functions defined', () => {
        expect(typeof element.initShader).toBe('function');
        expect(typeof element.onResized).toBe('function');
        expect(typeof element.themeMutated).toBe('function');
        expect(typeof element.setShaderProgram).toBe('function');
        expect(typeof element.updatePropertyUniform).toBe('function');
        expect(typeof element.updateThemeUniforms).toBe('function');
        expect(typeof element.setUniform).toBe('function');
    });
    it('Should initialize properties correctly', () => {
        element.onResized();
        expect(element.size).toEqual([0, 0]);
        expect(element.color).toEqual([0, 0, 0, 0]);
        expect(element.pxRatio).toBe(window.devicePixelRatio);
        expect(element.theme).toBe(ThemeSingleton);
        expect(element._reactiveProperties.get('size')).toEqual({
            binding: undefined,
            init: [0, 0],
            reflect: false,
            type: Array,
            value: [0, 0],
            observer: { type: 'object', observing: true },
        });
        expect(element._reactiveProperties.get('pxRatio')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: Number,
            value: window.devicePixelRatio,
            observer: { type: 'none', observing: false },
        });
        expect(element._reactiveProperties.get('theme')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: Node,
            value: ThemeSingleton,
            observer: { type: 'io', observing: true },
        });
    });
    it('has <canvas> element', () => {
        expect(element.children[0].localName).toBe('canvas');
    });
    it('has correct size and pxRatio', () => {
        element.style.border = 'none';
        element.style.width = '32px';
        element.style.height = '32px';
        element.onResized();
        expect(element.size[0]).toBe(32);
        expect(element.size[1]).toBe(32);
        expect(element.pxRatio).toBe(window.devicePixelRatio);
    });
    it('has correct color', () => {
        let color = element.ctx.getImageData(0, 0, 1, 1).data;
        expect(color).toEqual(new Uint8ClampedArray([0, 0, 0, 0]));
        element.color = [1, 0.5, 0.25, 1];
        element.onRender();
        color = element.ctx.getImageData(0, 0, 1, 1).data;
        expect(color).toEqual(new Uint8ClampedArray([255, 128, 64, 255]));
        element.color = [1, 0.25, 0.5, 0.5];
        element.onRender();
        color = element.ctx.getImageData(0, 0, 1, 1).data;
        expect(color).toEqual(new Uint8ClampedArray([128, 32, 64, 64]));
    });
});
//# sourceMappingURL=IoGL.test.js.map