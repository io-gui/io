import { IoIconsetSingleton } from '../index';;

export default class {
  run() {
    describe('iconset.test', () => {
      it('Should have core API functions defined', () => {
        expect(IoIconsetSingleton.registerIcons).to.be.a('function');
        expect(IoIconsetSingleton.getIcon).to.be.a('function');
      });
      it('Should register and retrieve icons', () => {
        const testicons = '<svg><g id="dummy"><path></path></g></svg>';
        IoIconsetSingleton.registerIcons('test', testicons);
        expect(IoIconsetSingleton.getIcon('test:dummy')).to.equal(
          '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-dummy"><path></path></g></svg>'
        );
      });
    });
  }
}
