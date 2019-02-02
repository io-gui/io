import {IoMenu} from "../../src/elements/menu.js";



export default class {
  constructor() {
    // this.element = new IoMenu();
    // document.body.appendChild(this.element);
  }
  run() {
    describe('IoMenu:', () => {
      it('menu layer', () => {
        // let layers = document.querySelectorAll('io-menu-layer');
        // chai.expect(layers.length).to.equal(1);
        // chai.expect([...layers[0].children].indexOf(this.element.$.group)).to.not.equal(-1);
      });
      it('menu options', () => {
        // this.element.options = [{label: 'a', value: 1}];
        // chai.expect(this.element.$.group.querySelector('span.menu-label').innerHTML).to.equal('a');
        // this.element.options = [{label: 'b', value: '2'}];
        // chai.expect(this.element.$.group.querySelector('span.menu-label').innerHTML).to.equal('b');
      });
      it('menu expanded', () => {
        // let layer = document.querySelector('io-menu-layer');
        // this.element.expanded = true;
        // chai.expect(layer.expanded).to.equal(true);
        // chai.expect(this.element.$.group.expanded).to.equal(true);
        // this.element.expanded = false;
        // chai.expect(this.element.$.group.expanded).to.equal(false);
        // chai.expect(layer.expanded).to.equal(false);
      });
    });
  }
}
