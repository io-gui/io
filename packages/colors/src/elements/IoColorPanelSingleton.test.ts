import { nextQueue } from 'io-core'
import { IoColorPanelSingleton } from 'io-colors'

const element = IoColorPanelSingleton

export default class {
  run() {
    describe('IoColorPanelSingleton.test', () => {
      it('Should initialize properties correctly', () => {
        expect(element.expanded).to.equal(false)
      })
      it('has correct sliders', async () => {
        expect(element.children.length).to.equal(3)
        expect(element.children[0].localName).to.equal('io-color-slider')
        expect((element.children[0] as any).channel).to.equal('sv')
        expect(element.children[1].localName).to.equal('io-color-slider')
        expect((element.children[1] as any).channel).to.equal('h')
        expect(element.children[2].localName).to.equal('io-color-slider')
        expect((element.children[2] as any).channel).to.equal('a')
        element.value = {r: 0.5, g: 0.5, b: 0.5}
        await nextQueue()
        expect(element.children[2]).to.equal(undefined)
      })
    })
  }
}
