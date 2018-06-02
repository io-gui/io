import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties} from "./core/protoProperties.js";
import {ProtoFunctions} from "./core/protoFunctions.js";

export class IoNode {
  constructor() {
    this.__proto__.constructor.Register();
    Object.defineProperty(this, '__props', { value: this.__proto__._properties.clone() } );
    Object.defineProperty(this, '__listeners', { value: {} } );
    for (let prop in this.__props) {
      this.defineProperty(prop);
      this[prop] = this[prop];
    }
    this.__proto__._functions.bind(this);
  }
  defineProperty(prop) {
    if (this.__proto__.hasOwnProperty(prop)) return;
    Object.defineProperty(this.__proto__, prop, {
      get: function() {
        return this.__props[prop].value;
      },
      set: function(value) {
        if (this.__props[prop].value === value) return;
        let oldValue = this.__props[prop].value;
        this.__props[prop].value = value;
        if (this.__props[prop].observer) {
          this[this.__props[prop].observer](value, oldValue, prop);
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  dispose() {
    // TODO
  }
  update(dtime, time, progress) {}
  addEventListener( type, listener ) {
		this.__listeners[ type ] = this.__listeners[ type ] || [];
		if ( this.__listeners[ type ].indexOf( listener ) === - 1 ) {
			this.__listeners[ type ].push( listener );
		}
	}
	hasEventListener( type, listener ) {
		return this.__listeners[ type ] !== undefined && this.__listeners[ type ].indexOf( listener ) !== - 1;
	}
	removeEventListener( type, listener ) {
		if ( this.__listeners[ type ] !== undefined ) {
			var index = this.__listeners[ type ].indexOf( listener );
			if ( index !== - 1 ) {
				this.__listeners[ type ].splice( index, 1 );
			}
		}
	}
	dispatchEvent( type, detail ) {
    var event = { detail: detail };
		if ( this.__listeners[ type ] !== undefined ) {
			var array = this.__listeners[ type ].slice( 0 );
			for ( var i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, { detail: detail, target: this } );
			}
		}
	}
}

IoNode.Register = function() {
  if (!this.registered) {
    const prototypes = new Prototypes(this);
    Object.defineProperty(this.prototype, '_properties', {value: new ProtoProperties(prototypes)});
    Object.defineProperty(this.prototype, '_functions', {value: new ProtoFunctions(prototypes)});
  }
  this.registered = true;
}
