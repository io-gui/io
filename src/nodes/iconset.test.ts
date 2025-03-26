import { IoIconsetSingleton } from '../io-gui';
import { expect } from 'chai';

export default class {
  run() {
    describe('IoIconsetSingleton', () => {
      it('Should have core API functions defined', () => {
        expect(IoIconsetSingleton.registerIcons).to.be.a('function');
        expect(IoIconsetSingleton.getIcon).to.be.a('function');
      });
      it('registers icons', () => {
        const testicons = '<svg><g id="dummy"><path></path></g></svg>';
        IoIconsetSingleton.registerIcons('test-please-ignore', testicons);
        expect(IoIconsetSingleton.getIcon('test-please-ignore:dummy')).to.equal(
          '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-dummy"><path></path></g></svg>'
        );
      });
    });
  }
}
