import {IoElement} from "../../../io/build/io.js";
import {TodoModel} from "./todo-model.js";

export class TodoFooter extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			display: block;
		}
		`;
	}
	static get Properties() {
		return {
			model: {
				type: TodoModel,
				observe: true,
			},
			route: 'all',
		};
	}
	_clear() {
		this.model.clearCompletedItems();
	}
	_setRoute(event) {
		this.route = event.target.innerText.toLowerCase();
	}
	changed() {
		const activeLeft = this.model.getActiveCount();
		const completedCount = this.model.getCompletedCount();
		this.template([
			['span', {class: 'todo-count'}, String(activeLeft) + (activeLeft === 1 ? ' item' : ' items') + ' left'],
			['ul', {class: 'filters'}, [
				['li', [
					['a', {'on-click': this._setRoute, class: this.route === 'all' ? 'selected' : ''}, 'All'],
				]],
				['li', [
					['a', {'on-click': this._setRoute, class: this.route === 'active' ? 'selected' : ''}, 'Active'],
				]],
				['li', [
					['a', {'on-click': this._setRoute, class: this.route === 'completed' ? 'selected' : ''}, 'Completed'],
				]],
			]],
			completedCount? ['button', {class: 'clear-completed', 'on-click': this._clear}, 'Clear completed'] : null
		]);
	}
}

TodoFooter.Register();
