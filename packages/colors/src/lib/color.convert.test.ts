import { hsl2rgb, rgb2hsl, rgb2hsv, hsv2rgb } from './color.convert'

export default class {
  run() {
    describe('color.convert.test', () => {
      it('should convert rgb to hsl', () => {
        const rgb = [255, 0, 0]
        const hsl = rgb2hsl(rgb)
        expect(hsl).to.eql([0, 100, 50])
      })
      it('should convert hsl to rgb', () => {
        const hsl = [0, 100, 50]
        const rgb = hsl2rgb(hsl)
        expect(rgb).to.eql([255, 0, 0])
      })
      it('should convert rgb to hsv', () => {
        const rgb = [255, 0, 0]
        const hsv = rgb2hsv(rgb)
        expect(hsv).to.eql([0, 100, 100])
      })
      it('should convert hsv to rgb', () => {
        const hsv = [0, 100, 100]
        const rgb = hsv2rgb(hsv)
        expect(rgb).to.eql([255, 0, 0])
      })
    })
  }
}
