import {IoInspector} from './inspector.js';

export default class {
  element = new IoInspector();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  reset() {
    this.element.value = {};
    this.element.config = {};
  }
  run() {
    describe('IoInspector', () => {
      describe('default values', () => {
        it('has default values', () => {
          chai.expect(JSON.stringify(this.element.value)).to.equal(JSON.stringify({}));
          chai.expect(JSON.stringify(this.element.config)).to.equal(JSON.stringify({}));
        });
      });
    });
  }
}
