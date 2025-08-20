import { ThemeSingleton } from 'io-gui';

const theme = ThemeSingleton;
const binding = theme._reactiveProperties.get('themeID')!.binding;

export default class {
  run() {
    describe('Theme', () => {
      it('Should register property definitions correctly', () => {
        expect(theme._reactiveProperties.get('themeID')).to.eql({
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