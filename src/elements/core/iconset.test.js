import {IoIconsetSingleton} from "../../io-core.js";

export default class {
  constructor() {
    this.element = IoIconsetSingleton;
  }
  run() {
    describe('IoIconsetSingleton', () => {
      it('registers icons', () => {
        const testicons = `<svg><g id="test"><path></path></g></svg>`;
        IoIconsetSingleton.registerIcons('test', testicons);
        chai.expect(IoIconsetSingleton.getIcon('test:test')).to.equal('<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-test"><path></path></g></svg>');
      });
    });
  }
}
