import { describe, it, expect } from 'vitest'
import { IoGl, Node, ThemeSingleton, ReactiveProperty, Register } from '@io-gui/core'

@Register
class IoGlTest extends IoGl {
  @ReactiveProperty({type: Array, init: [0, 0, 0, 0]})
  declare color: [number, number, number, number]
  static get Frag() {
    return /* glsl */`
      void main(void) {
        gl_FragColor = uColor;
      }\n\n`
  }
}

const element = new IoGlTest()
element.size = [0, 0]
element.pxRatio = 1
element.style.visibility = 'hidden'
element.style.position = 'fixed'
element.style.left = '0'
element.style.bottom = '0'
element.style.zIndex = '1000000'
document.body.appendChild(element as HTMLElement)

describe('IoGL', () => {
  it('Should have core API functions defined', () => {
    expect(typeof element.initShader).toBe('function')
    expect(typeof element.onResized).toBe('function')
    expect(typeof element.themeMutated).toBe('function')
    expect(typeof element.setShaderProgram).toBe('function')
    expect(typeof element.updatePropertyUniform).toBe('function')
    expect(typeof element.updateThemeUniforms).toBe('function')
    expect(typeof element.setUniform).toBe('function')
  })
  it('Should initialize properties correctly', () => {
    element.onResized()
    expect(element.size).toEqual([0, 0])
    expect(element.color).toEqual([0, 0, 0, 0])
    expect(element.pxRatio).toBe(window.devicePixelRatio)
    expect(element.theme).toBe(ThemeSingleton)

    expect(element._reactiveProperties.get('size')).toEqual({
      binding: undefined,
      init: [0, 0],
      reflect: false,
      type: Array,
      value: [0, 0],
    })

    expect(element._reactiveProperties.get('pxRatio')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: false,
      type: Number,
      value: window.devicePixelRatio,
    })

    expect(element._reactiveProperties.get('theme')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: false,
      type: Node,
      value: ThemeSingleton,
    })
  })
  it('has <canvas> element', () => {
    expect(element.children[0].localName).toBe('canvas')
  })
  it('has correct size and pxRatio', () => {
    element.style.border = 'none'
    element.style.width = '32px'
    element.style.height = '32px'
    element.onResized()
    expect(element.size[0]).toBe(32)
    expect(element.size[1]).toBe(32)
    expect(element.pxRatio).toBe(window.devicePixelRatio)
  })
  it('has correct color', () => {
    let color = element.ctx.getImageData(0, 0, 1, 1).data
    expect(color).toEqual(new Uint8ClampedArray([0, 0, 0, 0]))
    element.color = [1, 0.5, 0.25, 1]
    element.onRender()
    color = element.ctx.getImageData(0, 0, 1, 1).data
    expect(color).toEqual(new Uint8ClampedArray([255, 128, 64, 255]))

    element.color = [1, 0.25, 0.5, 0.5]
    element.onRender()
    color = (element as IoGl).ctx.getImageData(0, 0, 1, 1).data
    expect(color).toEqual(new Uint8ClampedArray([128, 32, 64, 64]))
  })
})
