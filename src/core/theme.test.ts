import { IoTheme } from '../iogui.js';

const theme = new IoTheme();
const binding = theme._properties.get('theme')!.binding;

export default class {
  run() {
    describe('IoThemeSingleton', () => {
      describe('Initialization', () => {
        it('Should register property definitions correctly', () => {
          chai.expect(theme.lazy).to.be.equal(true);
          chai.expect(theme.persist).to.be.equal(true);

          chai.expect(theme._properties.get('persist')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: Boolean,
            value: true,
          });

          chai.expect(theme._properties.get('theme')).to.eql({
            binding: binding,
            notify: true,
            observe: false,
            reflect: 'none',
            type: String,
            value: theme.theme,
          });
        });
      });
    });
  }
}