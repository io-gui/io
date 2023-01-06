import { IoThemeSingleton } from '../iogui.js';

const theme = IoThemeSingleton;
const binding = theme._properties.get('themeID')!.binding;

export default class {
  run() {
    describe('IoThemeSingleton', () => {
      describe('Initialization', () => {
        it('Should register property definitions correctly', () => {
          chai.expect(theme._properties.get('themeID')).to.eql({
            binding: binding,
            reactive: true,
            observe: false,
            reflect: false,
            type: String,
            value: theme.themeID,
          });
        });
      });
    });
  }
}