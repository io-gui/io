import {IoSliderRange} from "../../io-core.js";

export default class {
	constructor() {
		this.element = new IoSliderRange();
		this.element.style.display = 'none';
		document.body.appendChild(this.element);
	}
	run() {
		describe('IoSliderRange', () => {
			it('TODO', () => {
				chai.expect('TODO').to.not.equal('TODO');
			});
		});
	}
}
