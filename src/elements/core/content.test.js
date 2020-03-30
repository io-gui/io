import {IoContent} from '../../io-elements.js';

export default class {
  constructor() {
    this.element = new IoContent();
    this.element.style.display = 'none';
    document.body.appendChild(this.element);
  }
  run() {
    describe('IoContent', () => {
      it('TODO', () => {
        chai.expect('TODO').to.not.equal('TODO');
      });
    });
  }
}
