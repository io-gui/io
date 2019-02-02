import {IoInspector} from "../../src/elements/inspector.js";

export default class {
  constructor() {
    this.element = new IoInspector();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoInspector: ', () => {
      it('IoInspector', () => {
        // chai.expect('TODO').to.not.exist;
      });
    });
  }
}
