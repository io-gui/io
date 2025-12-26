import { IoInspector } from '@io-gui/editors'

export default class {
  element = new IoInspector()
  constructor() {
    this.element.style.display = 'none'
    document.body.appendChild(this.element as HTMLElement)
  }
  reset() {
    // this.element.value = {};
    // this.element.config = {};
  }
  run() {
    describe('IoInspector', () => {
      it('has default values', () => {
        expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}))
        expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}))
      })
    })
  }
}
