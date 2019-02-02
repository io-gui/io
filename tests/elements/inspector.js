import {IoInspector} from "../../src/elements/inspector.js";

export default class {
  constructor() {
    this.element = new IoInspector();
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
