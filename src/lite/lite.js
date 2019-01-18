export const IoLiteMixin = (superclass) => class extends superclass {
	addEventListener(type, listener) {
		this._listeners = this._listeners || {};
		this._listeners[type] = this._listeners[type] || [];
		if (this._listeners[type].indexOf(listener) === -1) {
			this._listeners[type].push(listener);
		}
	}
	hasEventListener(type, listener) {
		if (this._listeners === undefined) return false;
		return this._listeners[type] !== undefined && this._listeners[type].indexOf(listener) !== -1;
	}
	removeEventListener(type, listener) {
		if (this._listeners === undefined) return;
		if (this._listeners[type] !== undefined) {
			let index = this._listeners[type].indexOf(listener);
			if (index !== -1) this._listeners[type].splice(index, 1);
		}
	}
	dispatchEvent(type, detail = {}) {
		const event = {
			path: [this],
			target: this,
			detail: detail,
		};
		if (this._listeners && this._listeners[type] !== undefined) {
			const array = this._listeners[type].slice(0);
			for (let i = 0, l = array.length; i < l; i ++) {
				array[i].call(this, event);
			}
		}
		// TODO: bubbling
		// else if (this.parent && event.bubbles) {}
	}
	defineProperties(props) {
		if (!this.hasOwnProperty('_properties')) {
			Object.defineProperty(this, '_properties', {
				value: {},
				enumerable: false
			});
		}
		for (let prop in props) {
			let propDef = props[prop];
			if (propDef === null || propDef === undefined) {
				propDef = {value: propDef};
			} else if (typeof propDef !== 'object') {
				propDef = {value: propDef};
			} else if (typeof propDef === 'object' && propDef.constructor.name !== 'Object') {
				propDef = {value: propDef};
			}else if (typeof propDef === 'object' && propDef.value === undefined) {
				propDef = {value: propDef};
			}
			defineProperty(this, prop, propDef);
		}
	}
	// TODO: dispose
};

const defineProperty = function(scope, prop, def) {
	const observer = prop + 'Changed';
	const changeEvent = prop + '-changed';
	const isPublic = prop.charAt(0) !== '_';
	const isEnumerable = !(def.enumerable === false);
	scope._properties[prop] = def.value;
	if (!scope.hasOwnProperty(prop)) { // TODO: test
		Object.defineProperty(scope, prop, {
			get: function() {
				return scope._properties[prop];// !== undefined ? scope._properties[prop] : initValue;
			},
			set: function(value) {
				if (scope._properties[prop] === value) return;
				const oldValue = scope._properties[prop];
				scope._properties[prop] = value;
				if (isPublic) {
					if (def.observer) scope[def.observer](value, oldValue);
					if (typeof scope[observer] === 'function') scope[observer](value, oldValue);
					if (typeof scope.changed === 'function') scope.changed.call(scope);
					scope.dispatchEvent(changeEvent, {property: prop, value: value, oldValue: oldValue, bubbles: true});
				}
			},
			enumerable: isEnumerable && isPublic,
			configurable: true,
		});
	}
	scope[prop] = def.value;
};

export class IoLite extends IoLiteMixin(Object) {}
