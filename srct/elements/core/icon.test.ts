import {IoIcon} from './icon.js';
import {IoIconsetSingleton} from './iconset.js';

export default class {
  element = new IoIcon();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  run() {
    describe('IoIcon', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(this.element.icon).to.equal('');
          chai.expect(this.element.label).to.equal('');
        });
      });
      describe('innerSvg', () => {
        it('matches icon', () => {
          this.element.icon = 'icon:check';
          chai.expect(this.element.innerHTML).to.equal(IoIconsetSingleton.getIcon('icon:check'));
          this.element.icon = '';
        });
      });
    });
  }
}
