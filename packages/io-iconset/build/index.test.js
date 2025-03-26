import { IoIconsetSingleton } from 'io-gui';
import './index.js';
export default class {
    run() {
        describe('io-iconset.test', () => {
            it('registered icons', () => {
                expect(IoIconsetSingleton.getIcon('io:code')).to.equal(`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-code">
  <path d="M9.4,16.6L4.8,12l4.6-4.6L8,6.1l-6,6l6,6L9.4,16.6z M14.5,16.6l4.6-4.6l-4.6-4.6L15.9,6l6,6l-6,6L14.5,16.6z"></path>
</g></svg>`);
            });
        });
    }
}
//# sourceMappingURL=index.test.js.map