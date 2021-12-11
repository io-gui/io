import {IoContent} from './content.js';

export default class {
  element = new IoContent();
  constructor() {
    this.element.style.display = 'none';
    document.body.appendChild(this.element as unknown as HTMLElement);
  }
  run() {
    describe('IoContent', () => {
      it('TODO', () => {
        // chai.expect('TODO').to.not.equal('TODO');
      });
    });
  }
}
