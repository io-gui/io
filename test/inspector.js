import {IoInspector} from "../src/io.js";

import "../lib/chai.js";

export default class {
  constructor() {
    this.element = new IoInspector();
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoInspector: default values', () => {
    });
  }
}
