import { describe, it, expect } from 'vitest'
import { IoGl, ReactiveObject, ThemeSingleton, Register, PropertyDefinitions } from '@io-gui/core'

@Register
class IoGlTest extends IoGl {
  static override get Properties(): PropertyDefinitions {
    return {
      color: { type: Array, init: [0, 0, 0, 0] },
    }
  }
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

    expect(element._properties.get('size')).toEqual({
      binding: undefined,
      init: [0, 0],
      reflect: false,
      type: Array,
      value: [0, 0],
      observer: {type: 'object', observing: true},
    })

    expect(element._properties.get('pxRatio')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: false,
      type: Number,
      value: window.devicePixelRatio,
      observer: {type: 'none', observing: false},
    })

    expect(element._properties.get('theme')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: false,
      type: ReactiveObject,
      value: ThemeSingleton,
      observer: {type: 'io', observing: true},
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
  it('should render when a second instance shares the cached shader program', () => {
    const second = new IoGlTest()
    second.size = [32, 32]
    second.pxRatio = 1
    second.style.visibility = 'hidden'
    second.style.position = 'fixed'
    second.style.width = '32px'
    second.style.height = '32px'
    document.body.appendChild(second as HTMLElement)

    second.color = [0, 1, 0, 1]
    second.onRender()

    const color = second.ctx.getImageData(0, 0, 1, 1).data
    expect(color).toEqual(new Uint8ClampedArray([0, 255, 0, 255]))
  })
  it('uniform cache smoke', () => {
    const colorProp = element._properties.get('color')!
    element.updatePropertyUniform('uColor', colorProp)
    element.updatePropertyUniform('uColor', colorProp)
    expect(() => element.setUniform('uColor', [0, 0, 1, 1])).not.toThrow()
    element.color = [0, 0, 1, 1]
    element.onRender()
    const color = element.ctx.getImageData(0, 0, 1, 1).data
    expect(color[2]).toBe(255)
  })
})
