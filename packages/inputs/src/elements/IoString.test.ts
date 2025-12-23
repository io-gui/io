import { IoString } from 'io-inputs'

export default class {
  element = new IoString()
  constructor() {
    this.element.style.display = 'none'
    document.body.appendChild(this.element as HTMLElement)
  }
  run() {
    describe('IoString.test', () => {
      it('has default values', () => {
        expect(this.element.value).to.equal('')
      })
      it('matches values', () => {
        this.element.value = 'hello'
        expect(this.element.textContent).to.equal('hello');
        (this.element as any).value = false
        expect(this.element.textContent).to.equal('');
        (this.element as any).value = null
        expect(this.element.textContent).to.equal('');
        (this.element as any).value = undefined
        expect(this.element.textContent).to.equal('');
        (this.element as any).value = NaN
        expect(this.element.textContent).to.equal('');
        (this.element as any).value = 123
        expect(this.element.textContent).to.equal('123')
        this.element.value = ''
      })
      it('has tabIndex attribute', () => {
        expect(this.element.getAttribute('tabIndex')).to.equal('0')
      })
      it('has contenteditable attribute', () => {
        expect(this.element.getAttribute('contenteditable')).to.equal('true')
      })
      it('has a11y attributes', () => {
        expect(this.element.getAttribute('role')).to.equal('textbox');
        (this.element as any).value = 0
        expect(this.element.getAttribute('aria-invalid')).to.equal('true')
        this.element.value = ''
        expect(this.element.getAttribute('aria-invalid')).to.equal(null)
      })
      it('has title attribute', () => {
        this.element.title = 'Enter text'
        expect(this.element.getAttribute('title')).to.equal('Enter text')
        this.element.title = ''
      })
    })
  }
}
