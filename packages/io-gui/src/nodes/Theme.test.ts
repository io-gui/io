import { ThemeSingleton } from '../index';;

const theme = ThemeSingleton;
const binding = theme._properties.get('themeID')!.binding;

export default class {
  run() {
    describe('Theme', () => {
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