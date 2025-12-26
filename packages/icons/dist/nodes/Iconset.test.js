import { IconsetSingleton } from '@io-gui/icons';
export default class {
    run() {
        describe('Iconset.test', () => {
            it('Should have core API functions defined', () => {
                expect(IconsetSingleton.registerIcons).to.be.a('function');
                expect(IconsetSingleton.getIcon).to.be.a('function');
            });
            it('Should register and retrieve icons', () => {
                const testicons = '<svg><g id="dummy"><path></path></g></svg>';
                IconsetSingleton.registerIcons('test', testicons);
                expect(IconsetSingleton.getIcon('test:dummy')).to.equal('<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-dummy"><path></path></g></svg>');
            });
        });
    }
}
//# sourceMappingURL=Iconset.test.js.map