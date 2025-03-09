import { IoThemeSingleton } from '../iogui.js';
import { expect } from 'chai';

const theme = IoThemeSingleton;
const binding = theme._properties.get('themeID')!.binding;

export default class {
  run() {
    describe('IoThemeSingleton', () => {
      describe('Initialization', () => {
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
    });
  }
}