import {IoNumberSliderRange} from "../../io-core.js";

export default class {
	constructor() {
		this.element = new IoNumberSliderRange();
		this.element.style.display = 'none';
		document.body.appendChild(this.element);
	}
	run() {
		describe('IoNumberSliderRange', () => {
			it('TODO', () => {
				chai.expect('TODO').to.not.equal('TODO');
			});
		});
	}
}
