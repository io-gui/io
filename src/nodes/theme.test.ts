import { IoThemeSingleton } from '../io-gui';

const theme = IoThemeSingleton;
const binding = theme._properties.get('themeID')!.binding;

export default class {
  run() {
    describe('theme.test.ts', () => {
      it('Should register property definitions correctly', () => {
        expect(theme._properties.get('themeID')).to.eql({
          binding: binding,
          init: undefined,
          reflect: false,
          type: String,
          value: theme.themeID,
        });
      });
    });
  }
}