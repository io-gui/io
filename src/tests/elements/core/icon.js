import {IoIcon, IoIconsetSingleton} from "../../../io-core.js";

export default class {
  constructor() {
    this.element = new IoIcon();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
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
