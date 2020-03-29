import {IoInspector} from '../../io-elements.js';

export default class {
	constructor() {
		this.element = new IoInspector();
		this.element.style.display = 'none';
		document.body.appendChild(this.element);
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
