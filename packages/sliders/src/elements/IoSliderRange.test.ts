import { nextQueue } from '@io-gui/core'
import { IoSliderRange } from '@io-gui/sliders'

export default class {
  element = new IoSliderRange()
  constructor() {
    this.element.style.display = 'none'
    document.body.appendChild(this.element as HTMLElement)
  }
  reset() {
    this.element.value = [0, 1]
    this.element.step = 0.01
    this.element.min = 0
    this.element.max = 1
  }
  run() {
    describe('IoSliderRange', () => {
      it('has default values', () => {
        this.reset()
        expect(this.element.value[0]).to.equal(0)
        expect(this.element.value[1]).to.equal(1)
        expect(this.element.step).to.equal(0.01)
        expect(this.element.min).to.equal(0)
        expect(this.element.max).to.equal(1)
      })
      it('has tabIndex attribute', () => {
        expect(this.element.getAttribute('tabIndex')).to.equal('0')
      })
      it('has contenteditable attribute on number field', () => {
        expect(this.element.getAttribute('contenteditable')).to.equal(null)
      })
      it('has a11y attributes', async () => {
        this.reset()
        expect(this.element.getAttribute('role')).to.equal('slider')
        await nextQueue()
        this.element.min = 0
        expect(this.element.getAttribute('aria-valuemin')).to.equal('0')
        await nextQueue()
        this.element.max = 1
        expect(this.element.getAttribute('aria-valuemax')).to.equal('1')
      })
    })
  }
}
