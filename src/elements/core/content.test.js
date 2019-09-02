import {IoContent} from "../../io-core.js";

export default class {
  constructor() {
    this.element = new IoContent();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoContent', () => {
      describe('TODO', () => {
      });
    });
  }
}
