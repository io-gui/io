class ProtoListeners{constructor(t){for(let e=t.length;e--;){var i=t[e].Listeners;for(const s in i){var o=i[s]instanceof Array?i[s]:[i[s]];this[s]=o}}}}class EventDispatcher{__node;__nodeIsEventTarget;__protoListeners={};__propListeners={};__addedListeners={};__connected=!1;constructor(e,t={}){this.__node=e,this.__nodeIsEventTarget=e instanceof EventTarget,Object.defineProperty(this,"__node",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__nodeIsEventTarget",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__protoListeners",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__propListeners",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__connected",{enumerable:!1});for(const s in t){var i=t[s],o="function"==typeof i[0]?i[0]:this.__node[i[0]],i=i[1];this.__protoListeners[s]=[o],i&&this.__protoListeners[s].push(i)}}setPropListeners(e){const t={};for(const s in e)if(s.startsWith("on-")){var i=s.slice(3,s.length);const r=e[s]instanceof Array?[...e[s]]:[e[s]];"function"!=typeof r[0]&&(r[0]=this.__node[r[0]]),t[i]=r}const o=this.__propListeners;for(const n in o)t[n]||(this.__connected&&this.__nodeIsEventTarget&&EventTarget.prototype.removeEventListener.call(this.__node,n,o[n][0],o[n][1]),delete o[n]);for(const a in t)this.__connected&&this.__nodeIsEventTarget&&(o[a]?o[a][0]===t[a][0]&&o[a][1]===t[a][1]||(EventTarget.prototype.removeEventListener.call(this.__node,a,o[a][0],o[a][1]),EventTarget.prototype.addEventListener.call(this.__node,a,t[a][0],t[a][1])):EventTarget.prototype.addEventListener.call(this.__node,a,t[a][0],t[a][1])),o[a]=t[a]}connect(){if(this.__nodeIsEventTarget){for(const e in this.__protoListeners)EventTarget.prototype.addEventListener.call(this.__node,e,this.__protoListeners[e][0],this.__protoListeners[e][1]);for(const t in this.__propListeners)EventTarget.prototype.addEventListener.call(this.__node,t,this.__propListeners[t][0],this.__propListeners[t][1]);for(const i in this.__addedListeners)for(let e=this.__addedListeners[i].length;e--;)EventTarget.prototype.addEventListener.call(this.__node,i,this.__addedListeners[i][e][0],this.__addedListeners[i][e][1])}return this.__connected=!0,this}disconnect(){if(this.__nodeIsEventTarget){for(const e in this.__protoListeners)EventTarget.prototype.removeEventListener.call(this.__node,e,this.__protoListeners[e][0],this.__protoListeners[e][1]);for(const t in this.__propListeners)EventTarget.prototype.removeEventListener.call(this.__node,t,this.__propListeners[t][0],this.__propListeners[t][1]);for(const i in this.__addedListeners)for(let e=this.__addedListeners[i].length;e--;)EventTarget.prototype.removeEventListener.call(this.__node,i,this.__addedListeners[i][e][0],this.__addedListeners[i][e][1])}return this.__connected=!1,this}addEventListener(e,t,i){this.__addedListeners[e]=this.__addedListeners[e]||[],this.__addedListeners[e].push(i?[t,i]:[t]),this.__connected&&this.__nodeIsEventTarget&&EventTarget.prototype.addEventListener.call(this.__node,e,t,i)}removeEventListener(t,i,e){if(i){var o=this.__addedListeners[t].findIndex(e=>e[0]=i);this.__addedListeners[t].splice(o,1),this.__connected&&this.__nodeIsEventTarget&&EventTarget.prototype.removeEventListener.call(this.__node,t,i,e)}else{for(let e=0;e<this.__addedListeners[t].length;e++)this.__connected&&this.__nodeIsEventTarget&&EventTarget.prototype.removeEventListener.call(this.__node,t,this.__addedListeners[t][e][0],this.__addedListeners[t][e][1]);this.__addedListeners[t].length=0,delete this.__addedListeners[t]}}dispatchEvent(t,i={},e=!0,o=this.__node){if(this.__connected)if(o instanceof EventTarget)EventTarget.prototype.dispatchEvent.call(o,new CustomEvent(t,{detail:i,bubbles:e,composed:!0,cancelable:!0}));else if(void 0!==this.__protoListeners[t]&&this.__protoListeners[t][0].call(o,{detail:i,target:o,path:[o]}),void 0!==this.__propListeners[t]&&this.__propListeners[t][0].call(o,{detail:i,target:o,path:[o]}),void 0!==this.__addedListeners[t])for(let e=0;e<this.__addedListeners[t].length;e++)this.__addedListeners[t][e][0].call(o,{detail:i,target:o,path:[o]})}dispose(){this.__connected&&this.disconnect(),delete this.__node,delete this.__protoListeners,delete this.__propListeners,delete this.__addedListeners}}class ProtoChain extends Array{constructor(e){super();let t=e.prototype;for(;t&&"classConstructor"!==t.constructor.name&&t.constructor!==HTMLElement&&t.constructor!==Object&&t.constructor!==Array;)this.push(t.constructor),t=t.__proto__}}class FunctionBinder extends Array{constructor(t){super();for(let e=t.length;e--;){var i,o=t[e].prototype,s=Object.getOwnPropertyNames(o);for(let e=0;e<s.length;e++){const r=s[e];"constructor"!==r&&(void 0===(i=Object.getOwnPropertyDescriptor(o,r))||i.get||i.set||"function"==typeof o[r]&&-1===this.indexOf(r)&&(r.startsWith("_")||r.startsWith("on"))&&this.push(r))}}}bind(t){for(let e=this.length;e--;)Object.defineProperty(t,this[e],{value:t[this[e]].bind(t)})}}class Binding{__node;__property="";__targets=[];__targetProperties=new WeakMap;constructor(e,t){this.__node=e,this.__property=t,this._onTargetChanged=this._onTargetChanged.bind(this),this._onSourceChanged=this._onSourceChanged.bind(this),Object.defineProperty(this,"__node",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__property",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__targets",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__targetProperties",{enumerable:!1,writable:!1}),Object.defineProperty(this,"_onTargetChanged",{enumerable:!1,writable:!1}),Object.defineProperty(this,"_onSourceChanged",{enumerable:!1,writable:!1}),this.__node.addEventListener(this.__property+"-changed",this._onSourceChanged)}set value(e){this.__node[this.__property]=e}get value(){return this.__node[this.__property]}addTarget(e,t,i){const o=e.__properties||i;o[t].binding=this,o.set(t,this.__node[this.__property]);const s=e;-1===this.__targets.indexOf(s)&&this.__targets.push(s);const r=this._getTargetProperties(s);-1===r.indexOf(t)&&(r.push(t),s.addEventListener(t+"-changed",this._onTargetChanged))}removeTarget(e,t){const i=e,o=this._getTargetProperties(i);if(t){e=o.indexOf(t);-1!==e&&o.splice(e,1),i.removeEventListener(t+"-changed",this._onTargetChanged)}else{for(let e=o.length;e--;)i.removeEventListener(o[e]+"-changed",this._onTargetChanged);o.length=0}0===o.length&&this.__targets.splice(this.__targets.indexOf(i),1)}_getTargetProperties(e){let t=this.__targetProperties.get(e);return t||(t=[],this.__targetProperties.set(e,t),t)}_onTargetChanged(e){var t=this.__node[this.__property],e=e.detail.value;t!==e&&("number"==typeof e&&isNaN(e)&&"number"==typeof t&&isNaN(t)||(this.__node[this.__property]=e))}_onSourceChanged(e){var t=e.detail.value;for(let e=this.__targets.length;e--;){const r=this.__targets[e];var i=this._getTargetProperties(r);for(let e=i.length;e--;){var o=i[e],s=r[o];s!==t&&("number"==typeof t&&isNaN(t)&&"number"==typeof s&&isNaN(s)||(r[o]=t))}}}dispose(){this.__node.removeEventListener(this.__property+"-changed",this._onSourceChanged);for(let e=this.__targets.length;e--;)this.removeTarget(this.__targets[e]);this.__targets.length=0,delete this.__node,delete this.__property,delete this.__targets,delete this.__targetProperties,delete this._onTargetChanged,delete this._onSourceChanged}}class PropertyBinder{__node;__bindings={};constructor(e){this.__node=e,Object.defineProperty(this,"__node",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__bindings",{enumerable:!1,writable:!1})}bind(e){return this.__bindings[e]=this.__bindings[e]||new Binding(this.__node,e),this.__bindings[e]}unbind(e){this.__bindings[e]&&this.__bindings[e].dispose(),delete this.__bindings[e]}dispose(){for(const e in this.__bindings)this.__bindings[e].dispose(),delete this.__bindings[e];delete this.__node,delete this.__bindings}}class ChangeQueue{__node;__changes=[];__dispatching=!1;constructor(e){this.__node=e,Object.defineProperty(this,"__node",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__changes",{enumerable:!1,writable:!1}),Object.defineProperty(this,"__dispatching",{enumerable:!1})}queue(t,e,i){var o=this.__changes.findIndex(e=>e.property===t);-1===o?this.__changes.push(new Change(t,e,i)):this.__changes[o].value=e}dispatch(){if(!0!==this.__dispatching&&this.__node.__connected){let e=!(this.__dispatching=!0);for(;this.__changes.length;){var t=this.__changes.length-1,i=this.__changes[t];this.__changes.splice(t,1);t=i.property;i.value!==i.oldValue&&(e=!0,this.__node[t+"Changed"]&&this.__node[t+"Changed"](i),this.__node.dispatchEvent(t+"-changed",i))}e&&(this.__node.applyCompose(),this.__node.changed()),this.__dispatching=!1}}dispose(){this.__changes.length=0,delete this.__node,delete this.__changes}}class Change{property;value;oldValue;constructor(e,t,i){this.property=e,this.value=t,this.oldValue=i}}class ProtoProperty{value=void 0;type=void 0;reflect=0;notify=!0;observe=!1;readonly=!1;strict=!1;enumerable=!0;binding=void 0;constructor(e){return this.assign(e)}assign(e){return null==e?this.value=e:"function"==typeof e?this.type=e:e instanceof Binding?this.binding=e:e&&e.constructor===Object?(void 0!==e.value&&(this.value=e.value),void 0!==e.type&&(this.type=e.type),void 0===this.type&&void 0!==this.value&&null!==this.value&&(this.type=this.value.constructor),void 0!==e.reflect&&(this.reflect=e.reflect),void 0!==e.notify&&(this.notify=e.notify),void 0!==e.observe&&(this.observe=e.observe),void 0!==e.readonly&&(this.readonly=e.readonly),void 0!==e.strict&&(this.strict=e.strict),void 0!==e.enumerable&&(this.enumerable=e.enumerable),e.binding instanceof Binding&&(this.binding=e.binding)):e&&e.constructor===Object||(this.value=e,this.type=e.constructor),this}}class ProtoProperties{constructor(t){for(let e=t.length;e--;){var i=t[e].Properties;for(const o in i)this[o]?this[o].assign(i[o]):this[o]=new ProtoProperty(i[o]),"_"===o.charAt(0)&&(this[o].notify=!1,this[o].enumerable=!1)}}}class Property{value;type;reflect;notify;observe;readonly;strict;enumerable;binding;constructor(e){this.value=e.value,this.type=e.type,this.reflect=e.reflect,this.notify=e.notify,this.observe=e.observe,this.readonly=e.readonly,this.strict=e.strict,this.enumerable=e.enumerable,this.binding=e.binding,this.binding instanceof Binding?this.value=this.binding.value:void 0===this.value?"function"==typeof this.type&&(this.type===Boolean?this.value=!1:this.type===String?this.value="":this.type===Number?this.value=0:this.type===Array?this.value=[]:this.type===Object?this.value={}:this.value=new this.type):this.type===Array&&this.value instanceof Array?this.value=[...this.value]:this.type===Object&&this.value instanceof Object&&(this.value=Object.assign({},this.value))}}class Properties{__node;__keys=[];__connected=!1;constructor(e,t){Object.defineProperty(this,"__node",{enumerable:!1,configurable:!0,value:e}),Object.defineProperty(this,"__connected",{enumerable:!1});for(const o in t){var i=t;Object.defineProperty(this,o,{value:new Property(i[o]),enumerable:i[o].enumerable,configurable:!0});i=this[o];const s=i.value;void 0!==s&&null!==s&&("object"==typeof s?(e.queue(o,s,void 0),s.__isIoNode&&e.__connected&&s.connect(e)):void 0!==i.reflect&&1<=i.reflect&&e.__isIoElement&&e.setAttribute(o,s));const r=i.binding;r&&r.addTarget(e,o,this)}Object.defineProperty(this,"__keys",{enumerable:!1,configurable:!0,value:Object.keys(this)})}get(e){return this[e].value}set(e,t,i){const o=this[e],s=o.value;if(t!==s){const r=this.__node,n=t instanceof Binding?t:void 0;if(n){const a=o.binding;a&&n!==a&&a.removeTarget(r,e),n.addTarget(r,e),t=n.value}else!o.strict||!o.type||t instanceof o.type||(t=new o.type(t));(o.value=t)&&t.__isIoNode&&!t.__isIoElement&&t.connect(r),s&&s.__isIoNode&&s.__connected&&!s.__isIoElement&&s.disconnect(r),o.notify&&s!==t&&(r.queue(e,t,s),r.__connected&&!i&&r.queueDispatch()),void 0!==o.reflect&&1<=o.reflect&&r.__isIoElement&&r.setAttribute(e,t)}}connect(){for(let e=this.__keys.length;e--;){var t=this.__keys[e];const i=this[t];i.binding&&i.binding.addTarget(this.__node,t),i.value&&i.value.__isIoNode&&!i.value.__connected&&!i.value.__isIoElement&&i.value.connect(this.__node)}this.__connected=!0}disconnect(){for(let e=this.__keys.length;e--;){var t=this.__keys[e];const i=this[t];i.binding&&i.binding.removeTarget(this.__node,t),i.value&&i.value.__isIoNode&&!i.value.__isIoElement&&-1!==i.value.__connections.indexOf(this.__node)&&i.value.disconnect(this.__node)}this.__connected=!1}dispose(){this.disconnect(),delete this.__node,delete this.__keys}}function IoNodeMixin(e){return class extends e{static get Properties(){return{lazy:Boolean}}get compose(){return null}constructor(e={},...t){super(...t),this.__functionBinder.bind(this),Object.defineProperty(this,"__propertyBinder",{enumerable:!1,value:new PropertyBinder(this)}),Object.defineProperty(this,"__changeQueue",{enumerable:!1,value:new ChangeQueue(this)}),Object.defineProperty(this,"__eventDispatcher",{enumerable:!1,value:new EventDispatcher(this,this.__protoListeners)}),Object.defineProperty(this,"__properties",{enumerable:!1,value:new Properties(this,this.__protoProperties)}),Object.defineProperty(this,"objectMutated",{enumerable:!1,value:this.objectMutated.bind(this)}),Object.defineProperty(this,"objectMutatedThrottled",{enumerable:!1,value:this.objectMutatedThrottled.bind(this)}),Object.defineProperty(this,"queueDispatch",{enumerable:!1,value:this.queueDispatch.bind(this)}),Object.defineProperty(this,"queueDispatchLazy",{enumerable:!1,value:this.queueDispatchLazy.bind(this)}),Object.defineProperty(this,"__connected",{enumerable:!1,writable:!0,value:!1}),this.__proto__.__isIoElement||Object.defineProperty(this,"__connections",{enumerable:!1,value:[]}),this.setProperties(e)}connect(e=window){return this.__connections.push(e),this.__connected||this.connectedCallback(),this}disconnect(e=window){return this.__connections.splice(this.__connections.indexOf(e),1),0===this.__connections.length&&this.__connected&&this.disconnectedCallback(),this}connectedCallback(){this.__connected=!0,this.__eventDispatcher.connect(),this.__properties.connect(),this.__observedObjects.length&&window.addEventListener("object-mutated",this.objectMutated),this.queueDispatch()}disconnectedCallback(){this.__connected=!1,this.__eventDispatcher.disconnect(),this.__properties.disconnect(),this.__observedObjects.length&&window.removeEventListener("object-mutated",this.objectMutated)}dispose(){this.__connected=!1,this.__connections.length=0,this.__changeQueue.dispose(),this.__propertyBinder.dispose(),this.__properties.dispose(),this.__eventDispatcher.dispose(),this.__observedObjects.length&&window.removeEventListener("object-mutated",this.objectMutated)}changed(){}applyCompose(){var e=this.compose;if(this.compose)for(const t in e){const i=this.__properties[t].value;if(i.__isIoNode)i.setProperties(e[t]);else for(const o in e[t])i[o]=e[t][o]}}queue(e,t,i){this.__changeQueue.queue(e,t,i)}queueDispatch(){this.lazy?(preThrottleQueue.push(this.queueDispatchLazy),this.throttle(this.queueDispatchLazy)):this.__changeQueue.dispatch()}queueDispatchLazy(){this.__changeQueue.dispatch()}objectMutated(t){for(let e=0;e<this.__observedObjects.length;e++){var i=this.__observedObjects[e];if(this.__properties[i].value===t.detail.object)return void this.throttle(this.objectMutatedThrottled,i,!1)}}objectMutatedThrottled(e){this[e+"Mutated"]&&this[e+"Mutated"](),this.applyCompose(),this.changed()}bind(e){return this.__propertyBinder.bind(e)}unbind(e){this.__propertyBinder.unbind(e);const t=this.__properties[e].binding;t&&t.removeTarget(this,e)}set(e,t,i){this[e]===t&&!i||(i=this[e],this[e]=t,this.dispatchEvent("value-set",{property:e,value:t,oldValue:i},!1))}setProperties(e){for(const t in e)void 0!==this.__properties[t]&&this.__properties.set(t,e[t],!0);this.__eventDispatcher.setPropListeners(e,this),this.__connected&&this.queueDispatch()}addEventListener(e,t,i){this.__eventDispatcher.addEventListener(e,t,i)}removeEventListener(e,t,i){this.__eventDispatcher.removeEventListener(e,t,i)}dispatchEvent(e,t={},i=!1,o){this.__eventDispatcher.dispatchEvent(e,t,i,o)}throttle(e,t,i){if(-1!==preThrottleQueue.indexOf(e)||(preThrottleQueue.push(e),i))if(-1===throttleQueue.indexOf(e)&&throttleQueue.push(e),argQueue.has(e)&&"object"!=typeof t){const o=argQueue.get(e);-1===o.indexOf(t)&&o.push(t)}else argQueue.set(e,[t]);else e(t)}requestAnimationFrameOnce(e){requestAnimationFrameOnce(e)}filterObject(e,t,i=5,o=[],s=0){if(-1===o.indexOf(e)&&(o.push(e),!(i<s))){if(s++,t(e))return e;for(const n in e){var r=e[n]instanceof Binding?e[n].value:e[n];if(t(r))return r;if("object"==typeof r){r=this.filterObject(r,t,i,o,s);if(r)return r}}}}filterObjects(e,t,i=5,o=[],s=0){const r=[];if(-1!==o.indexOf(e))return r;if(o.push(e),i<s)return r;s++,t(e)&&-1===r.indexOf(e)&&r.push(e);for(const l in e){var n=e[l]instanceof Binding?e[l].value:e[l];if(t(n)&&-1===r.indexOf(n)&&r.push(n),"object"==typeof n){var a=this.filterObjects(n,t,i,o,s);for(let e=0;e<a.length;e++)-1===r.indexOf(a[e])&&r.push(a[e])}}return r}import(t){const i=new URL(t,String(window.location)).href;return new Promise(e=>{!t||IMPORTED_PATHS[i]?e(i):import(i).then(()=>{IMPORTED_PATHS[i]=!0,e(i)})})}preventDefault(e){e.preventDefault()}stopPropagation(e){e.stopPropagation()}}}const RegisterIoNode=function(e){var t=new ProtoChain(e);const i=e.prototype;Object.defineProperty(i,"__isIoNode",{value:!0}),Object.defineProperty(i.constructor,"__registeredAs",{value:i.constructor.name}),Object.defineProperty(i,"__protochain",{value:t}),Object.defineProperty(i,"__functionBinder",{value:new FunctionBinder(t)}),Object.defineProperty(i,"__protoProperties",{value:new ProtoProperties(t)}),Object.defineProperty(i,"__protoListeners",{value:new ProtoListeners(t)}),Object.defineProperty(i,"__observedObjects",{value:[]});for(const o in i.__protoProperties)i.__protoProperties[o].observe&&i.__observedObjects.push(o);for(const s in i.__protoProperties)Object.defineProperty(i,s,{get:function(){return this.__properties.get(s)},set:function(e){this.__properties.set(s,e)},enumerable:!!i.__protoProperties[s].enumerable,configurable:!0})};class IoNode extends IoNodeMixin(Object){}RegisterIoNode(IoNode);const IMPORTED_PATHS={},preThrottleQueue=[],throttleQueue=[],argQueue=new WeakMap,funcQueue=[],animate=function(){requestAnimationFrame(animate);for(let e=preThrottleQueue.length;e--;)preThrottleQueue.splice(preThrottleQueue.indexOf(preThrottleQueue[e]),1);for(let t=throttleQueue.length;t--;){const i=argQueue.get(throttleQueue[t]);for(let e=i.length;e--;)throttleQueue[t](i[e]),i.splice(i.indexOf(e),1);throttleQueue.splice(throttleQueue.indexOf(throttleQueue[t]),1)}for(let e=funcQueue.length;e--;){const t=funcQueue[e];funcQueue.splice(funcQueue.indexOf(t),1),t()}};function requestAnimationFrameOnce(e){-1===funcQueue.indexOf(e)&&funcQueue.push(e)}requestAnimationFrame(animate);class IoElement extends IoNodeMixin(HTMLElement){static get Style(){return`
    :host[hidden] {
      display: none;
    }
    :host[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
    `}static get Properties(){return{$:{type:Object,notify:!1},tabindex:{type:String,reflect:1},contenteditable:{type:Boolean,reflect:1},class:{type:String,reflect:1},role:{type:String,reflect:1},label:{type:String,reflect:1},name:{type:String,reflect:1},title:{type:String,reflect:1},id:{type:String,reflect:-1},hidden:{type:Boolean,reflect:1},disabled:{type:Boolean,reflect:1}}}static get Listeners(){return{"focus-to":"_onFocusTo"}}static get observedAttributes(){const e=[];for(const i in this.prototype.__protoProperties){var t=this.prototype.__protoProperties[i].reflect;-1!==t&&2!==t||e.push(i)}return e}attributeChangedCallback(e,t,i){const o=this.__properties[e].type;o===Boolean?null===i?this[e]=!1:""===i&&(this[e]=!0):o===Number||o===String?this[e]=o(i):o===Object||o===Array?this[e]=JSON.parse(i):"function"==typeof o?this[e]=new o(JSON.parse(i)):this[e]=isNaN(Number(i))?i:Number(i)}connectedCallback(){super.connectedCallback(),"function"==typeof this.onResized&&ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),"function"==typeof this.onResized&&ro.unobserve(this)}template(e,t){e=buildTree()(["root",e]).children;(t=t||this)===this&&(this.__properties.$.value={}),this.traverse(e,t)}traverse(t,i){for(var o,s,r=i.children;r.length>t.length;){var e=r[r.length-1];i.removeChild(e)}if(r.length<t.length){const a=document.createDocumentFragment();for(let e=r.length;e<t.length;e++){var n=constructElement(t[e]);a.appendChild(n)}i.appendChild(a)}for(let e=0;e<r.length;e++){const l=r[e];l.localName!==t[e].name?(o=l,s=constructElement(t[e]),i.insertBefore(s,o),i.removeChild(o)):(l.removeAttribute("className"),l.__isIoElement?l.setProperties(t[e].props):setNativeElementProps(l,t[e].props))}for(let e=0;e<t.length;e++){const h=r[e];t[e].props.id&&(this.$[t[e].props.id]=h),void 0!==t[e].children&&("string"==typeof t[e].children?(this.flattenTextNode(h),h.__textNode.nodeValue=String(t[e].children)):"object"==typeof t[e].children&&this.traverse(t[e].children,h))}}flattenTextNode(t){if(0===t.childNodes.length&&t.appendChild(document.createTextNode("")),"#text"!==t.childNodes[0].nodeName&&(t.innerHTML="",t.appendChild(document.createTextNode(""))),t.__textNode=t.childNodes[0],1<t.childNodes.length){var e=t.textContent;for(let e=t.childNodes.length;e--;)0!==e&&t.removeChild(t.childNodes[e]);t.__textNode.nodeValue=e}}get textNode(){return this.flattenTextNode(this),this.__textNode.nodeValue}set textNode(e){this.flattenTextNode(this),this.__textNode.nodeValue=String(e)}setProperties(e){if(super.setProperties(e),e.style)for(const t in e.style)this.style[t]=e.style[t]}setAttribute(e,t){!0===t?HTMLElement.prototype.setAttribute.call(this,e,""):!1===t||""===t?this.removeAttribute(e):"string"!=typeof t&&"number"!=typeof t||this.getAttribute(e)!==String(t)&&HTMLElement.prototype.setAttribute.call(this,e,String(t))}applyCompose(){super.applyCompose(),this.applyAria()}applyAria(){this.label?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"),this.disabled?this.setAttribute("aria-disabled",!0):this.removeAttribute("aria-disabled")}_onFocusTo(e){var s,r,n,a,l=e.composedPath()[0],h=e.detail.dir;const c=e.detail.rect;if(c.center={x:c.x+c.width/2,y:c.y+c.height/2},l!==this){let t=l,i=1/0,o=1/0;const d=this.querySelectorAll('[tabindex="0"]:not([disabled])');for(let e=d.length;e--;)if(d[e].offsetParent)if("visible"===window.getComputedStyle(d[e]).visibility){const u=d[e].getBoundingClientRect();switch(u.center={x:u.x+u.width/2,y:u.y+u.height/2},h){case"right":u.left>=c.right-1&&(s=Math.abs(u.left-c.right),r=Math.abs(u.center.y-c.center.y),s<i||r<o/3?(t=d[e],i=s,o=r):s===i&&r<o&&(t=d[e],o=r));break;case"left":u.right<=c.left+1&&(s=Math.abs(u.right-c.left),r=Math.abs(u.center.y-c.center.y),s<i||r<o/3?(t=d[e],i=s,o=r):s===i&&r<o&&(t=d[e],o=r));break;case"down":u.top>=c.bottom-1&&(a=Math.abs(u.center.x-c.center.x),(n=Math.abs(u.top-c.bottom))<o||a<i/3?(t=d[e],i=a,o=n):n===o&&a<i&&(t=d[e],i=a));break;case"up":u.bottom<=c.top+1&&(n=Math.abs(u.center.x-c.center.x),(a=Math.abs(u.bottom-c.top))<o||n<i/3?(t=d[e],i=n,o=a):a===o&&n<i&&(t=d[e],i=n))}}t!==l&&(t.focus(),e.stopPropagation())}}focusTo(e){var t=this.getBoundingClientRect();this.dispatchEvent("focus-to",{dir:e,rect:t},!0)}}const warning=document.createElement("div");warning.innerHTML=`
No support for custom elements detected! <br />
Sorry, modern browser is required to view this page.<br />
Please try <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,
<a href="https://www.google.com/chrome/">Chrome</a> or
<a href="https://www.apple.com/lae/safari/">Safari</a>`;const RegisterIoElement=function(e){RegisterIoNode(e);var t=e.name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();Object.defineProperty(e,"localName",{value:t}),Object.defineProperty(e.prototype,"localName",{value:t}),Object.defineProperty(e,"__isIoElement",{enumerable:!1,value:!0}),Object.defineProperty(e.prototype,"__isIoElement",{enumerable:!1,value:!0}),void 0!==window.customElements?(window.customElements.define(t,e),_initProtoStyle(e.prototype.__protochain)):document.body.insertBefore(warning,document.body.children[0])},ro=new ResizeObserver(e=>{for(const t of e)t.target.onResized()}),constructElement=function(e){const t=window.customElements?window.customElements.get(e.name):null;if(t&&t.__isIoElement)return new t(e.props);var i=document.createElement(e.name);return setNativeElementProps(i,e.props),i},superCreateElement=document.createElement;document.createElement=function(...e){const t=e[0];if(t.startsWith("io-")){const i=customElements.get(t);return i?new i:superCreateElement.apply(this,e)}return superCreateElement.apply(this,e)};const setNativeElementProps=function(e,t){for(const o in t){var i=t[o];if(o.startsWith("@"))e.setAttribute(o.substr(1),i);else if("style"===o)for(const s in i)e.style.setProperty(s,i[s]);else"class"===o?e.className=i:"id"!==o&&(e[o]=i);"name"===o&&e.setAttribute("name",i)}e.__eventDispatcher||(Object.defineProperty(e,"__eventDispatcher",{value:new EventDispatcher(e,{})}),e.__eventDispatcher.connect()),e.__eventDispatcher.setPropListeners(t,e)},mixinDB={},commentsRegex=new RegExp("(\\/\\*[\\s\\S]*?\\*\\/)","gi"),keyframeRegex=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi"),mediaQueryRegex=new RegExp("((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi"),mixinRegex=new RegExp("((--[\\s\\S]*?): {([\\s\\S]*?)})","gi"),applyRegex=new RegExp("(@apply\\s.*?;)","gi"),cssRegex=new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})","gi");function _initProtoStyle(i){const o=i[0].name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();var e="io-style-"+o.replace("io-","");let s="";const t=i[0].Style;if(t){const l=t.match(mixinRegex);if(l)for(let e=0;e<l.length;e++){const h=l[e].split(": {");var r=h[0],n=h[1].replace(/}/g,"").trim().replace(/^ +/gm,"");mixinDB[r]=n,s+=l[e].replace("--",".").replace(": {"," {")}for(let e=i.length;e--;){let t=i[e].Style;if(t){t=t.replace(mixinRegex,"");const c=t.match(applyRegex);if(c)for(let e=0;e<c.length;e++){var a=c[e].split("@apply ")[1].replace(";","");mixinDB[a]&&(t=t.replace(c[e],mixinDB[a]))}{let e=t;e=e.replace(commentsRegex,""),e=e.replace(keyframeRegex,""),e=e.replace(mediaQueryRegex,"");const d=e.match(cssRegex);d&&d.map(e=>{(e=e.trim()).startsWith(":host")})}s+=t.replace(new RegExp(":host","g"),o)}}}if(s){const u=document.createElement("style");u.innerHTML=s,u.setAttribute("id",e),document.head.appendChild(u)}}RegisterIoElement(IoElement);
/** @license
 * MIT License
 *
 * Copyright (c) 2019 Luke Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const isString=e=>"string"==typeof e,isArray=Array.isArray,isObject=e=>"object"==typeof e&&!isArray(e),clense=(e,t)=>t?isString(t[0])?[...e,t]:[...e,...t]:e,buildTree=()=>e=>e&&isObject(e[1])?{name:e[0],props:e[1],children:isArray(e[2])?e[2].reduce(clense,[]).map(buildTree()):e[2]}:buildTree()([e[0],{},e[1]]);class Path extends IoNode{static get Properties(){return{value:Array,string:String,root:null,leaf:null,delimiter:":"}}valueChanged(){this.__properties.value.value=new Proxy(this.__properties.value.value,{get:(e,t)=>e[t],set:(e,t,i)=>(e[t]===i||(e[t]=i,this.update(),this.throttle(this.onMutation,null,!0)),!0)}),this.update(),this.throttle(this.onMutation,null,!1)}onMutation(){this.__connected&&this.queueDispatch()}update(){let t="";for(let e=0;e<this.value.length;e++)t+=this.value[e],e!==this.value.length-1&&(t+=this.delimiter);this.__properties.set("string",t,!0),this.__properties.set("root",this.value[0],!0),this.__properties.set("leaf",this.value[this.value.length-1],!0)}stringChanged(){var t=this.string?[...this.string.split(this.delimiter)]:[];for(let e=0;e<t.length;e++)this.value[e]!==t[e]&&(this.value[e]=t[e]);this.value.length=t.length}rootChanged(){this.value[0]!==this.root&&(this.value=[this.root])}leafChanged(){var e=Math.max(0,this.value.length-1);this.value[e]!==this.leaf&&(this.value[e]=this.leaf)}}RegisterIoNode(Path);class Options extends IoNodeMixin(Array){static get Properties(){return{items:{type:Array,readonly:!0,strict:!0},path:{type:Path,readonly:!0,strict:!0}}}constructor(i=[],e={}){super(e);for(let t=0;t<i.length;t++){let e;e=i[t]instanceof Item?i[t]:"object"==typeof i[t]?new Item(i[t]):new Item({value:i[t]}),this.push(e),e.addEventListener("selected-changed",this.onItemSelectedChanged),e.addEventListener("path-changed",this.onItemSelectedPathChanged),e.connect(this)}}option(t){for(let e=0;e<this.length;e++)if(this[e].value===t)return this[e];return null}pathChanged(){var t=this.path.value;if(t.length){this.setSelectedPath(t);var i=t[0];for(let e=0;e<this.length;e++)if("pick"===this[e].select&&this[e].value===i){const o=[...t];return o.shift(),void this[e].setSelectedPath(!0,o)}}else for(let e=0;e<this.length;e++)"pick"===this[e].select&&this[e].setSelectedPath(!1,[])}onItemSelectedPathChanged(e){var t=e.target,e=t.path.value;"pick"===t.select&&e.length&&this.setSelectedPath([t.value,...e])}onItemSelectedChanged(e){var t=e.target,e=t.path.value;if("pick"===t.select)if(t.selected){for(let e=0;e<this.length;e++)"pick"===this[e].select&&this[e]!==t&&this[e].setSelectedPath(!1,[]);this.setSelectedPath([t.value,...e])}else{let t=!1;for(let e=0;e<this.length;e++)this[e].selected&&(t=!0);t||this.setSelectedPath([])}}setSelectedPath(e=[]){if(!(this.path.value=e).length)for(let e=0;e<this.length;e++)"pick"===this[e].select&&this[e].setSelectedPath(!1,[]);this.dispatchEvent("path-changed")}selectDefault(){for(let e=0;e<this.length;e++)if("pick"===this[e].select){if(!this[e].hasmore)return this[e].setSelectedPath(!0,[]),!0;if(this[e].options.selectDefault())return!0}return!1}changed(){this.dispatchEvent("changed")}}RegisterIoNode(Options);class Item extends IoNode{static get Properties(){return{value:void 0,label:"",icon:"",hint:"",action:void 0,select:"pick",selected:Boolean,path:{type:Path,readonly:!0,strict:!0},options:{type:Options,strict:!0}}}get compose(){return{options:{"on-path-changed":this.onOptionsSelectedPathChanged}}}constructor(e){(e="object"!=typeof e||null===e?{value:e,label:e}:e).options&&(e.options instanceof Options||(e.options=new Options(e.options))),e.label||("object"==typeof e.value?e.label=e.value.constructor.name:e.label=String(e.value)),"toggle"===e.select&&e.options&&e.options.length&&(e.options=new Options),"pick"===e.select&&e.options.length&&(e.selected=!!e.options.path.value.length,e.path.value=[...e.options.path.value]),super(e),"pick"===this.select&&this.options.length&&this.setSelectedPath(!!this.options.path.value.length,[...this.options.path.value])}get hasmore(){return!!this.options.length}option(e){return this.options.option(e)}onOptionsSelectedPathChanged(){"pick"===this.select&&this.setSelectedPath(!!this.options.path.value.length,[...this.options.path.value])}selectedChanged(){"pick"===this.select&&(this.selected||(this.options.setSelectedPath([]),this.setSelectedPath(!1,[])))}setSelectedPath(e,t=[]){this.path.value=t,this.selected=e,this.dispatchEvent("path-changed",this.path)}changed(){this.dispatchEvent("changed")}}RegisterIoNode(Item);class EmulatedLocalStorage{store={};warned=!1;get permited(){try{return!!self.localStorage.getItem("io-storage-user-permitted")}catch(e){}return!1}set permited(e){try{if(self.localStorage.setItem("io-storage-user-permitted",String(e)),"true"===self.localStorage.getItem("io-storage-user-permitted"))for(const t in this.store)self.localStorage.setItem(t,String(this.store[t])),delete this.store[t]}catch(e){}}constructor(){Object.defineProperty(this,"store",{value:{},writable:!0}),Object.defineProperty(this,"warned",{value:!1,writable:!0})}setItem(e,t){t="object"==typeof t?JSON.stringify(t):String(t);this.permited?self.localStorage.setItem(e,t):(this.store[e]=t,this.warned||(this.permited,this.warned=!0),"io-storage-user-permitted"===e&&(this.permited=!!this.store[e]))}getItem(e){return this.permited?self.localStorage.getItem(e):this.store[e]}removeItem(e){if(this.permited)return self.localStorage.removeItem(e);delete this.store[e]}clear(){if(this.permited)return self.localStorage.clear();this.store={}}}const localStorage=new EmulatedLocalStorage,nodes={};let hashes={};const parseHashes=function(){return self.location.hash.substr(1).split("&").reduce(function(e,t){t=t.split("=");return e[t[0]]=t[1],e},{})},getHashes=function(){hashes=parseHashes();for(const i in hashes){var e=i,t=i;nodes[e]&&""!==hashes[t]&&(t=hashes[t].replace(/%20/g," "),isNaN(t)?nodes[e].value="true"===t||"false"===t?JSON.parse(t):t:nodes[e].value=JSON.parse(t))}for(const o in nodes)"hash"!==nodes[o].storage||hashes[o]||(nodes[o].value=nodes[o].default)},setHashes=function(e){let t="";for(const i in nodes)"hash"!==nodes[i].storage&&!e||void 0===nodes[i].value||""===nodes[i].value||nodes[i].value===nodes[i].default||("string"==typeof nodes[i].value?t+=i+"="+nodes[i].value+"&":t+=i+"="+JSON.stringify(nodes[i].value)+"&");for(const o in hashes)o&&!nodes[o]&&(t+=o+"="+hashes[o]+"&");t=t.slice(0,-1),self.location.hash=t,self.location.hash||history.replaceState({},document.title,self.location.pathname+self.location.search)};self.addEventListener("hashchange",getHashes,!1),getHashes();class IoStorage extends IoNode{static get Properties(){return{key:String,value:void 0,default:void 0,storage:void 0}}constructor(e){super(Object.assign({default:e.value},e)),e.key&&(nodes[e.key]=nodes[e.key]||this),this.binding=this.bind("value"),this.getStorageValue(),this.connect(window)}getStorageValue(){const e=this.key;switch(this.storage){case"hash":if(void 0!==hashes[e]){var t=hashes[e].replace(/%20/g," ");try{this.value=JSON.parse(t)}catch(e){this.value=t}}else this.value=this.default;break;case"local":{const e="/"!==self.location.pathname?self.location.pathname+this.key:this.key;t=localStorage.getItem(e);this.value=null!=t?JSON.parse(t):this.default;break}default:this.value=this.default}}valueChanged(){switch(this.storage){case"hash":setHashes();break;case"local":var e="/"!==self.location.pathname?self.location.pathname+this.key:this.key;null===this.value||void 0===this.value?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(this.value))}}}RegisterIoNode(IoStorage);const IoStorageFactory=function(e){return(e=e&&"string"==typeof e?{key:e}:e)&&e.key&&nodes[e.key]?(e.storage&&(nodes[e.key].storage=e.storage),void 0!==e.value&&(nodes[e.key].default=e.value),nodes[e.key].binding):new IoStorage(e).binding};Object.defineProperty(IoStorageFactory,"permitted",{get:()=>localStorage.permited,set:e=>{localStorage.permited=e}});const themePropDefaults={cssSpacing:2,cssBorderRadius:3,cssBorderWidth:1,cssStrokeWidth:1,cssLineHeight:22,cssItemHeight:0,cssFontSize:14},themeDBDefaults={light:Object.assign({cssBackgroundColor:[.95,.95,.95,1],cssBackgroundColorLight:[1,1,1,1],cssBackgroundColorDark:[.84,.84,.84,1],cssBackgroundColorField:[.92,.92,.92,1],cssColor:[.16,.16,.16,1],cssColorError:[.91,.5,.5,1],cssColorLink:[.2,.75,.2,1],cssColorFocus:[.3,.6,1,1],cssColorField:[0,0,0,1],cssColorNumber:[.12,.64,1,1],cssColorString:[.95,.25,.1,1],cssColorBoolean:[.82,.35,.75,1],cssColorBorder:[.7,.7,.7,1],cssColorBorderLight:[1,1,1,1],cssColorBorderDark:[.6,.6,.6,1],cssColorGradientStart:[.9,.9,.9,1],cssColorGradientEnd:[.75,.75,.75,1],cssColorShadow:[0,0,0,.2]},themePropDefaults),dark:Object.assign({cssBackgroundColor:[.164,.164,.164,1],cssBackgroundColorLight:[.22,.22,.22,1],cssBackgroundColorDark:[.25,.25,.25,1],cssBackgroundColorField:[.137,.137,.137,1],cssColor:[.823,.823,.823,1],cssColorError:[1,.376,.062,1],cssColorLink:[.75,.9,.59,1],cssColorFocus:[.3,.82,1.4,1],cssColorField:[.75,.75,.75,1],cssColorNumber:[.125,.64,1,1],cssColorString:[.94,.25,.086,1],cssColorBoolean:[.82,.35,.75,1],cssColorBorder:[.3,.3,.3,1],cssColorBorderLight:[.4,.4,.4,1],cssColorBorderDark:[0,0,0,1],cssColorGradientStart:[1,1,1,.1],cssColorGradientEnd:[0,0,0,.2],cssColorShadow:[0,0,0,.2]},themePropDefaults)},themeDB=IoStorageFactory({value:JSON.parse(JSON.stringify(themeDBDefaults)),storage:"local",key:"themeDB"});class IoTheme extends IoElement{static get Style(){return`
    --io-item: {
      align-self: flex-start;
      display: inline-block;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      white-space: nowrap;
      box-sizing: border-box;
      line-height: var(--io-line-height);
      height: var(--io-item-height);
      font-size: var(--io-font-size);
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: transparent;
      color: var(--io-color);
      background-color: transparent;
      background-image: none;
      padding: var(--io-spacing);
      transition: background-color 0.25s;
    }
    --io-panel: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      border-radius: calc(var(--io-border-radius) + var(--io-spacing));
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-dark);
      padding: var(--io-spacing);
    }
    --io-content: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
    }
    --io-row: {
      display: flex;
      flex: 1 1;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    --io-column: {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    --io-table2: {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table3: {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table4: {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table5: {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: var(--io-spacing);
    }
    `}static get Properties(){var e=!!window.matchMedia("(prefers-color-scheme: dark)").matches,t=IoStorageFactory({value:e?"dark":"light",storage:"local",key:"theme"}),e=themeDB.value[t.value];return{theme:t,cssSpacing:e.cssSpacing,cssBorderRadius:e.cssBorderRadius,cssBorderWidth:e.cssBorderWidth,cssStrokeWidth:e.cssStrokeWidth,cssLineHeight:e.cssLineHeight,cssItemHeight:e.cssItemHeight,cssFontSize:e.cssFontSize,cssBackgroundColor:{value:e.cssBackgroundColor,observe:!0},cssBackgroundColorLight:{value:e.cssBackgroundColorLight,observe:!0},cssBackgroundColorDark:{value:e.cssBackgroundColorDark,observe:!0},cssBackgroundColorField:{value:e.cssBackgroundColorField,observe:!0},cssColor:{value:e.cssColor,observe:!0},cssColorError:{value:e.cssColorError,observe:!0},cssColorLink:{value:e.cssColorLink,observe:!0},cssColorFocus:{value:e.cssColorFocus,observe:!0},cssColorField:{value:e.cssColorField,observe:!0},cssColorNumber:{value:e.cssColorNumber,observe:!0},cssColorString:{value:e.cssColorString,observe:!0},cssColorBoolean:{value:e.cssColorBoolean,observe:!0},cssColorBorder:{value:e.cssColorBorder,observe:!0},cssColorBorderLight:{value:e.cssColorBorderLight,observe:!0},cssColorBorderDark:{value:e.cssColorBorderDark,observe:!0},cssColorGradientStart:{value:e.cssColorGradientStart,observe:!0},cssColorGradientEnd:{value:e.cssColorGradientEnd,observe:!0},cssColorShadow:{value:e.cssColorShadow,observe:!0},lazy:!0}}constructor(e){super(e),this.variablesElement=document.createElement("style"),this.variablesElement.setAttribute("id","io-theme-variables"),document.head.appendChild(this.variablesElement)}_toCss(e){var t=Math.floor(255*e[0]),i=Math.floor(255*e[1]),o=Math.floor(255*e[2]);return void 0!==e[3]?`rgba(${t}, ${i}, ${o}, ${e[3]})`:`rgb(${t}, ${i}, ${o})`}reset(){themeDB.value=Object.assign({},JSON.parse(JSON.stringify(themeDBDefaults))),this.themeChanged()}themeChanged(){var e=themeDB.value[this.theme];this.setProperties({cssSpacing:e.cssSpacing,cssBorderRadius:e.cssBorderRadius,cssBorderWidth:e.cssBorderWidth,cssStrokeWidth:e.cssStrokeWidth,cssLineHeight:e.cssLineHeight,cssItemHeight:e.cssItemHeight,cssFontSize:e.cssFontSize,cssBackgroundColor:e.cssBackgroundColor,cssBackgroundColorLight:e.cssBackgroundColorLight,cssBackgroundColorDark:e.cssBackgroundColorDark,cssBackgroundColorField:e.cssBackgroundColorField,cssColor:e.cssColor,cssColorError:e.cssColorError,cssColorLink:e.cssColorLink,cssColorFocus:e.cssColorFocus,cssColorField:e.cssColorField,cssColorNumber:e.cssColorNumber,cssColorString:e.cssColorString,cssColorBoolean:e.cssColorBoolean,cssColorBorder:e.cssColorBorder,cssColorBorderLight:e.cssColorBorderLight,cssColorBorderDark:e.cssColorBorderDark,cssColorGradientStart:e.cssColorGradientStart,cssColorGradientEnd:e.cssColorGradientEnd,cssColorShadow:e.cssColorShadow})}changed(){this.__properties.cssItemHeight.value=this.cssLineHeight+2*(this.cssSpacing+this.cssBorderWidth),this.variablesElement.innerHTML=`
      body {
        --io-spacing: ${this.cssSpacing}px;
        --io-border-radius: ${this.cssBorderRadius}px;
        --io-border-width: ${this.cssBorderWidth}px;
        --io-stroke-width: ${this.cssStrokeWidth}px;
        --io-line-height: ${this.cssLineHeight}px;
        --io-item-height: ${this.cssItemHeight}px;
        --io-font-size: ${this.cssFontSize}px;

        --io-background-color: ${this._toCss(this.cssBackgroundColor)};
        --io-background-color-highlight: ${this._toCss(this.cssBackgroundColorLight)};
        --io-background-color-dark: ${this._toCss(this.cssBackgroundColorDark)};
        --io-background-color-field: ${this._toCss(this.cssBackgroundColorField)};

        --io-color: ${this._toCss(this.cssColor)};
        --io-color-error: ${this._toCss(this.cssColorError)};
        --io-color-link: ${this._toCss(this.cssColorLink)};
        --io-color-focus: ${this._toCss(this.cssColorFocus)};
        --io-color-field: ${this._toCss(this.cssColorField)};
        --io-color-number: ${this._toCss(this.cssColorNumber)};
        --io-color-string: ${this._toCss(this.cssColorString)};
        --io-color-boolean: ${this._toCss(this.cssColorBoolean)};
        --io-color-border: ${this._toCss(this.cssColorBorder)};
        --io-color-border-light: ${this._toCss(this.cssColorBorderLight)};
        --io-color-border-dark: ${this._toCss(this.cssColorBorderDark)};
        --io-color-gradient-start: ${this._toCss(this.cssColorGradientStart)};
        --io-color-gradient-end: ${this._toCss(this.cssColorGradientEnd)};
        --io-color-shadow: ${this._toCss(this.cssColorShadow)};


        --io-border: var(--io-border-width) solid var(--io-color-border);
        --io-border-error: var(--io-border-width) solid var(--io-color-error);
        --io-color-border-inset: var(--io-color-border-dark) var(--io-color-border-light) var(--io-color-border-light) var(--io-color-border-dark);
        --io-color-border-outset: var(--io-color-border-light) var(--io-color-border-dark) var(--io-color-border-dark) var(--io-color-border-light);

        --io-gradient-button: linear-gradient(180deg, var(--io-color-gradient-start), var(--io-color-gradient-end) 100%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, var(--io-color-error) 1px, var(--io-color-error) 4px, transparent 6px);

        --io-shadow: 2px 2px 6px var(--io-color-shadow),
                     1px 1px 1px var(--io-color-shadow);
        --io-shadow-inset: 1px 1px 2px inset var(--io-color-shadow);
        --io-shadow-outset: -1px -1px 2px inset var(--io-color-shadow);
      }
    `;const e=themeDB.value[this.theme];for(const t in this.__properties)t.startsWith("css")&&(e[t]=this.__properties[t].value);themeDB.value=Object.assign({},themeDB.value),this.dispatchEvent("object-mutated",{object:this},!1,window)}}RegisterIoElement(IoTheme);const IoThemeSingleton=new IoTheme;document.head.appendChild(IoThemeSingleton);const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl",{antialias:!1,premultipliedAlpha:!0});gl.getExtension("OES_standard_derivatives"),gl.enable(gl.BLEND),gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA),gl.disable(gl.DEPTH_TEST);const positionBuff=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,positionBuff),gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,1,0,-1,-1,0,1,-1,0,1,1,0]),gl.STATIC_DRAW),gl.bindBuffer(gl.ARRAY_BUFFER,null);const uvBuff=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,uvBuff),gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,1,0,0,1,0,1,1]),gl.STATIC_DRAW),gl.bindBuffer(gl.ARRAY_BUFFER,null);const indexBuff=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuff),gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([3,2,1,3,1,0]),gl.STATIC_DRAW),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuff);const shadersCache=new WeakMap;let currentProgram;class IoGl extends IoElement{static get Style(){return`
    :host {
      position: relative;
      overflow: hidden !important;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      box-sizing: border-box;
    }
    :host > .io-gl-canvas {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: calc(var(--io-border-radius) - var(--io-border-width));
      pointer-events: none;
      /* image-rendering: pixelated; */
    }
    `}static get Properties(){return{size:[0,0],color:{value:[1,1,1,1],observe:!0},pxRatio:1,css:{type:Object,observe:!0}}}static get Vert(){return`
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }

`}static get GlUtils(){return`
    #ifndef saturate
      #define saturate(v) clamp(v, 0., 1.)
    #endif

    vec2 translate(vec2 samplePosition, vec2 xy){
      return samplePosition - vec2(xy.x, xy.y);
    }
    vec2 translate(vec2 samplePosition, float x, float y){
      return samplePosition - vec2(x, y);
    }
    float circle(vec2 samplePosition, float radius){
      return saturate((length(samplePosition) - radius) * uPxRatio);
    }
    float rectangle(vec2 samplePosition, vec2 halfSize){
      vec2 edgeDistance = abs(samplePosition) - halfSize;
      float outside = length(max(edgeDistance, 0.));
      float inside = min(max(edgeDistance.x, edgeDistance.y), 0.);
      return saturate((outside + inside) * uPxRatio); // TODO: check
    }
    float grid(vec2 samplePosition, float gridWidth, float gridHeight, float lineWidth) {
      vec2 sp = samplePosition / vec2(gridWidth, gridHeight);
      float linex = abs(fract(sp.x - 0.5) - 0.5) * 2.0 / abs(max(dFdx(sp.x), dFdy(sp.x))) - lineWidth;
      float liney = abs(fract(sp.y - 0.5) - 0.5) * 2.0 / abs(max(dFdy(sp.y), dFdx(sp.y))) - lineWidth;
      return saturate(min(linex, liney));
    }
    float checker(vec2 samplePosition, float size) {
      vec2 checkerPos = floor(samplePosition / size);
      float checkerMask = mod(checkerPos.x + mod(checkerPos.y, 2.0), 2.0);
      return checkerMask;
    }

`}static get Frag(){return`
      varying vec2 vUv;
      void main(void) {
        vec2 position = uSize * vUv;
        float gridWidth = 8. * uPxRatio;
        float lineWidth = 1. * uPxRatio;
        float gridShape = grid(position, gridWidth, gridWidth, lineWidth);
        gl_FragColor = mix(vec4(vUv, 0.0, 1.0), uColor, gridShape);
      }

`}initPropertyUniform(e,t){if(t.notify)switch(t.type){case Boolean:return"uniform int "+e+";\n";case Number:return"uniform float "+e+";\n";case Array:return this._vecLengths[e]=t.value.length,"uniform vec"+t.value.length+" "+e+";\n"}return""}initShader(){let t=`
    #extension GL_OES_standard_derivatives : enable
    precision highp float;
`;for(const h in this.css.__properties){var e=this.css.__protoProperties[h];t+=this.initPropertyUniform(h,e)}t+="\n";for(const c in this.__properties){var i="u"+c.charAt(0).toUpperCase()+c.slice(1),o=this.__protoProperties[c];t+=this.initPropertyUniform(i,o)}for(let e=this.__protochain.length;e--;){var s=this.__protochain[e],r=Object.getOwnPropertyDescriptor(s,"GlUtils");r&&r.get&&(t+=s.GlUtils)}var n=gl.createShader(gl.VERTEX_SHADER);gl.shaderSource(n,this.constructor.Vert),gl.compileShader(n),gl.getShaderParameter(n,gl.COMPILE_STATUS)||gl.getShaderInfoLog(n);var a=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(a,t+this.constructor.Frag),gl.compileShader(a),gl.getShaderParameter(a,gl.COMPILE_STATUS)||gl.getShaderInfoLog(a);var l=gl.createProgram();return gl.attachShader(l,n),gl.attachShader(l,a),l}constructor(e={}){super(e),this.css=IoThemeSingleton,this._vecLengths={};for(const s in this.css.__properties){var t=this.css.__protoProperties[s];t.notify&&t.type===Array&&(this._vecLengths[s]=t.value.length)}for(const r in this.__properties){var i="u"+r.charAt(0).toUpperCase()+r.slice(1),o=this.__protoProperties[r];o.notify&&o.type===Array&&(this._vecLengths[i]=o.value.length)}shadersCache.has(this.constructor)?this._shader=shadersCache.get(this.constructor):(this._shader=this.initShader(),shadersCache.set(this.constructor,this._shader)),gl.linkProgram(this._shader);e=gl.getAttribLocation(this._shader,"position");gl.bindBuffer(gl.ARRAY_BUFFER,positionBuff),gl.vertexAttribPointer(e,3,gl.FLOAT,!1,0,0),gl.enableVertexAttribArray(e);e=gl.getAttribLocation(this._shader,"uv");gl.bindBuffer(gl.ARRAY_BUFFER,uvBuff),gl.vertexAttribPointer(e,2,gl.FLOAT,!1,0,0),gl.enableVertexAttribArray(e),this.render=this.render.bind(this),this.template([["canvas",{id:"canvas",class:"io-gl-canvas"}]]),this.$.canvas.ctx=this.$.canvas.getContext("2d"),this.updateCssUniforms()}onResized(){var e=window.devicePixelRatio,t=this.getBoundingClientRect(),i=window.getComputedStyle(this),o=parseInt(i.borderRightWidth)+parseInt(i.borderLeftWidth),i=parseInt(i.borderTopWidth)+parseInt(i.borderBottomWidth),o=Math.max(0,Math.floor(t.width-o)),i=Math.max(0,Math.floor(t.height-i));o===this.size[0]&&i===this.size[1]&&e===this.pxRatio||(this.$.canvas.style.width=Math.floor(o)+"px",this.$.canvas.style.height=Math.floor(i)+"px",this.$.canvas.width=Math.floor(o*e),this.$.canvas.height=Math.floor(i*e),this.setProperties({size:[o,i],pxRatio:e}))}cssMutated(){this.updateCssUniforms(),this.requestAnimationFrameOnce(this.render)}changed(){window.ResizeObserver?this.requestAnimationFrameOnce(this.render):setTimeout(()=>{this.onResized(),this.requestAnimationFrameOnce(this.render)})}render(){var e=this.size[0]*this.pxRatio,t=this.size[1]*this.pxRatio;if(e&&t){this.setShaderProgram();for(const o in this.__properties){var i="u"+o.charAt(0).toUpperCase()+o.slice(1);this.updatePropertyUniform(i,this.__properties[o])}canvas.width=e,canvas.height=t,gl.viewport(0,0,e,t),gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0),this.$.canvas.ctx.drawImage(canvas,0,0)}}setShaderProgram(){currentProgram!==this._shader&&(currentProgram=this._shader,gl.useProgram(this._shader))}updatePropertyUniform(e,t){this.setShaderProgram(),t.notify&&this.setUniform(e,t.type,t.value)}updateCssUniforms(){for(const e in this.css.__properties)this.updatePropertyUniform(e,this.css.__properties[e])}setUniform(e,t,i){var o=gl.getUniformLocation(this._shader,e);let s;switch(t){case Boolean:gl.uniform1i(o,i?1:0);break;case Number:gl.uniform1f(o,void 0!==i?i:1);break;case Array:switch(s=[0,1,2,3],i instanceof Array||"object"!=typeof i||(void 0!==i.x?s=["x","y","z","w"]:void 0!==i.r?s=["r","g","b","a"]:void 0!==i.h?s=["h","s","v","a"]:void 0!==i.c&&(s=["c","m","y","k"])),this._vecLengths[e]){case 2:if(void 0===i){gl.uniform2f(o,0,0);break}gl.uniform2f(o,void 0!==i[s[0]]?i[s[0]]:1,void 0!==i[s[1]]?i[s[1]]:1);break;case 3:if(void 0===i){gl.uniform3f(o,0,0,0);break}gl.uniform3f(o,void 0!==i[s[0]]?i[s[0]]:1,void 0!==i[s[1]]?i[s[1]]:1,void 0!==i[s[2]]?i[s[2]]:1);break;case 4:if(void 0===i){gl.uniform4f(o,0,0,0,0);break}gl.uniform4f(o,void 0!==i[s[0]]?i[s[0]]:1,void 0!==i[s[1]]?i[s[1]]:1,void 0!==i[s[2]]?i[s[2]]:1,void 0!==i[s[3]]?i[s[3]]:1)}}}}RegisterIoElement(IoGl);class IoSlider extends IoGl{static get Style(){return`
    :host {
      cursor: ns-resize;
      box-sizing: border-box;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-item-height);
      min-height: var(--io-item-height);
      align-self: stretch;
      justify-self: stretch;
    }
    :host[horizontal] {
      cursor: ew-resize;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    :host[aria-invalid] > .io-gl-canvas {
      opacity: 0.5;
    }
    :host:focus {
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `}static get Properties(){return{value:0,step:.01,min:0,max:1,exponent:1,horizontal:{value:!0,reflect:1},noscroll:!1,role:"slider",tabindex:0,lazy:!0}}static get Listeners(){return{focus:"_onFocus",contextmenu:"_onContextmenu",pointerdown:"_onPointerdown",touchstart:"_onTouchstart"}}_onFocus(){this.addEventListener("blur",this._onBlur),this.addEventListener("keydown",this._onKeydown)}_onBlur(){this.removeEventListener("blur",this._onBlur),this.removeEventListener("keydown",this._onKeydown)}_onContextmenu(e){e.preventDefault()}_onTouchstart(e){this.addEventListener("touchmove",this._onTouchmove),this.addEventListener("touchend",this._onTouchend),this._x=e.changedTouches[0].clientX,this._y=e.changedTouches[0].clientY,this._active=this.noscroll?1:-1}_onTouchmove(e){var t=Math.abs(this._x-e.changedTouches[0].clientX),i=Math.abs(this._y-e.changedTouches[0].clientY);-1===this._active&&(this.horizontal?3<t&&i<t&&(this._active=i<t&&i<10?1:0):3<i&&t<i&&(this._active=t<i&&t<10?1:0)),1===this._active&&e.preventDefault()}_onTouchend(){this.removeEventListener("touchmove",this._onTouchmove),this.removeEventListener("touchend",this._onTouchend)}_onPointerdown(e){this.setPointerCapture(e.pointerId),this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerup",this._onPointerup)}_onPointermove(e){"touch"!==e.pointerType&&(this._active=1),this.throttle(this._onPointermoveThrottled,e,!0)}_onPointerup(e){this.releasePointerCapture(e.pointerId),this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerup",this._onPointerup)}_getPointerCoord(e){var t=this.getBoundingClientRect();return[Math.pow(Math.max(0,Math.min(1,(e.clientX-t.x)/t.width)),this.exponent),Math.pow(Math.max(0,Math.min(1,1-(e.clientY-t.y)/t.height)),this.exponent)]}_getValueFromCoord(e){e=this.min*(1-e)+this.max*e,e=Math.min(this.max,Math.max(this.min,e));return Math.round(e/this.step)*this.step}_getCoordFromValue(e){return(e-this.min)/(this.max-this.min)}_onPointermoveThrottled(e){var t;1===this._active&&(document.activeElement!==this&&this.focus(),t=this._getPointerCoord(e),e=this._getValueFromCoord(t[0]),t=this._getValueFromCoord(t[1]),this._setValue(this.horizontal?e:t))}_setValue(e,t){this.set("value",Number(e.toFixed(5)))}_onKeydown(e){switch(e.key){case"ArrowLeft":e.preventDefault(),e.shiftKey?this._setDecrease():this.focusTo("left");break;case"ArrowUp":e.preventDefault(),e.shiftKey?this._setIncrease():this.focusTo("up");break;case"ArrowRight":e.preventDefault(),e.shiftKey?this._setIncrease():this.focusTo("right");break;case"ArrowDown":e.preventDefault(),e.shiftKey?this._setDecrease():this.focusTo("down");break;case"PageUp":case"+":e.preventDefault(),this._setIncrease();break;case"PageDown":case"-":e.preventDefault(),this._setDecrease();break;case"Home":e.preventDefault(),this._setMin()}}_setIncrease(){var e=this.value+this.step,e=Math.min(this.max,Math.max(this.min,e));this._setValue(e)}_setDecrease(){var e=this.value-this.step,e=Math.min(this.max,Math.max(this.min,e));this._setValue(e)}_setMin(){var e=this.min,e=Math.min(this.max,Math.max(this.min,e));this._setValue(e)}_setMax(){var e=this.max,e=Math.min(this.max,Math.max(this.min,e));this._setValue(e)}changed(){super.changed()}applyAria(){super.applyAria(),this.setAttribute("aria-invalid",!!isNaN(this.value)&&"true"),this.setAttribute("aria-valuenow",isNaN(this.value)?0:this.value),this.setAttribute("aria-valuemin",this.min),this.setAttribute("aria-valuemax",this.max)}static get GlUtils(){return`
    vec4 paintSlider(vec2 position, vec2 sliderStart, vec2 sliderEnd, float knobRadius, float slotWidth, vec3 color) {
      vec4 slotColor = mix(cssColor, cssBackgroundColorField, 0.125);
      vec4 sliderColor = vec4(0.0);
      float stroke = cssStrokeWidth;

      vec2 startPos = translate(position, sliderStart);
      vec2 endPos = translate(position, sliderEnd);
      vec2 slotCenter = (startPos + endPos) / 2.;
      float slotSpan = abs(startPos.x - endPos.x) / 2.0;

      float strokeShape = min(min(
        circle(startPos, knobRadius + stroke + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke + stroke))),
        circle(endPos, knobRadius + stroke + stroke)
      );
      sliderColor = mix(vec4(slotColor.rgb, 1.0), sliderColor, strokeShape);

      float fillShape = min(min(
        circle(startPos, knobRadius + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke))),
        circle(endPos, knobRadius + stroke)
      );
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);

      float colorShape = min(min(
        circle(startPos, knobRadius),
        rectangle(slotCenter, vec2(slotSpan, slotWidth))),
        circle(endPos, knobRadius)
      );
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);

      return sliderColor;
    }
    

`}static get Frag(){return`
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = cssBackgroundColorField.rgb;

      vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
      vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
      vec2 position = size * uv;


      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

      float lineWidth = cssStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        // TODO: grid with exponent
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      vec4 slotGradient = mix(cssColorFocus, cssColorLink, uv.x);
      float knobRadius = cssItemHeight * 0.125;
      float slotWidth = cssItemHeight * 0.125;

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      float sign = valueInRange < 0.0 ? -1.0 : 1.0;
      valueInRange = abs(pow(valueInRange, 1./uExponent)) * sign;

      vec2 sliderStart = vec2(0.0, size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`}}RegisterIoElement(IoSlider);
/**@License
 * Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const convert={rgb:{channels:3,labels:"rgb"},hsl:{channels:3,labels:"hsl"},hsv:{channels:3,labels:"hsv"},hwb:{channels:3,labels:"hwb"},cmyk:{channels:4,labels:"cmyk"},xyz:{channels:3,labels:"xyz"},lab:{channels:3,labels:"lab"},lch:{channels:3,labels:"lch"},hex:{channels:1,labels:["hex"]},ansi16:{channels:1,labels:["ansi16"]},ansi256:{channels:1,labels:["ansi256"]},hcg:{channels:3,labels:["h","c","g"]},apple:{channels:3,labels:["r16","g16","b16"]},gray:{channels:1,labels:["gray"]}};for(const l3 of Object.keys(convert)){if(!("channels"in convert[l3]))throw new Error("missing channels property: "+l3);if(!("labels"in convert[l3]))throw new Error("missing channel labels property: "+l3);if(convert[l3].labels.length!==convert[l3].channels)throw new Error("channel and label counts mismatch: "+l3);const{channels:m3,labels:n3}=convert[l3];delete convert[l3].channels,delete convert[l3].labels,Object.defineProperty(convert[l3],"channels",{value:m3}),Object.defineProperty(convert[l3],"labels",{value:n3})}function IoColorMixin(e){return class extends e{static get Properties(){return{value:{value:[1,1,1,1],observe:!0},rgb:[1,1,1],hsv:[1,1,1],hsl:[1,1,1],cmyk:[1,1,1,1],alpha:1,mode:0}}static get GlUtils(){return`
      vec3 hue2rgb(float hue) {
        hue=fract(hue);
        float R = abs(hue * 6. - 3.) - 1.;
        float G = 2. - abs(hue * 6. - 2.);
        float B = 2. - abs(hue * 6. - 4.);
        return saturate(vec3(R,G,B));
      }
      vec3 hsv2rgb(vec3 hsv) {
        vec3 rgb = hue2rgb(hsv.r);
        return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
      }
      vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb = hue2rgb(hsl.x);
        float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
        return (rgb - 0.5) * C + hsl.z;
      }
      vec3 cmyk2rgb(vec4 cmyk) {
        float r = 1. - min(1., cmyk.x * (1. - cmyk.w) + cmyk.w);
        float g = 1. - min(1., cmyk.y * (1. - cmyk.w) + cmyk.w);
        float b = 1. - min(1., cmyk.z * (1. - cmyk.w) + cmyk.w);
        return vec3(r, g, b);
      }
      

`}valueMutated(){this.valueChanged()}modeChanged(){this.valueChanged()}setValueFromRgb(){var e=Object.keys(this.value);switch(this.mode){case 0:this.value[e[0]]=this.rgb[0],this.value[e[1]]=this.rgb[1],this.value[e[2]]=this.rgb[2];break;case 1:var t=convert.rgb.hsv([255*this.rgb[0],255*this.rgb[1],255*this.rgb[2]]);this.value[e[0]]=t[0]/360,this.value[e[1]]=t[1]/100,this.value[e[2]]=t[2]/100;break;case 2:var i=convert.rgb.hsl([255*this.rgb[0],255*this.rgb[1],255*this.rgb[2]]);this.value[e[0]]=i[0]/360,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100;break;case 3:i=convert.rgb.cmyk([255*this.rgb[0],255*this.rgb[1],255*this.rgb[2]]);this.value[e[0]]=i[0]/100,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100,this.value[e[3]]=i[3]/100}this._notifyValueChange()}setValueFromHsv(){var e=Object.keys(this.value);switch(this.mode){case 0:var t=convert.hsv.rgb([360*this.hsv[0],100*this.hsv[1],100*this.hsv[2]]);this.value[e[0]]=t[0]/255,this.value[e[1]]=t[1]/255,this.value[e[2]]=t[2]/255;break;case 1:this.value[e[0]]=this.hsv[0],this.value[e[1]]=this.hsv[1],this.value[e[2]]=this.hsv[2];break;case 2:var i=convert.rgb.hsl(convert.hsv.rgb([360*this.hsv[0],100*this.hsv[1],100*this.hsv[2]]));this.value[e[0]]=i[0]/360,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100;break;case 3:i=convert.rgb.cmyk(convert.hsv.rgb([360*this.hsv[0],100*this.hsv[1],100*this.hsv[2]]));this.value[e[0]]=i[0]/100,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100,this.value[e[3]]=i[3]/100}this._notifyValueChange()}setValueFromHsl(){var e=Object.keys(this.value);switch(this.mode){case 0:var t=convert.hsl.rgb([360*this.hsl[0],100*this.hsl[1],100*this.hsl[2]]);this.value[e[0]]=t[0]/255,this.value[e[1]]=t[1]/255,this.value[e[2]]=t[2]/255;break;case 1:var i=convert.rgb.hsv(convert.hsl.rgb([360*this.hsl[0],100*this.hsl[1],100*this.hsl[2]]));this.value[e[0]]=i[0]/360,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100;break;case 2:this.value[e[0]]=this.hsl[0],this.value[e[1]]=this.hsl[1],this.value[e[2]]=this.hsl[2];break;case 3:i=convert.rgb.cmyk(convert.hsl.rgb([360*this.hsl[0],100*this.hsl[1],100*this.hsl[2]]));this.value[e[0]]=i[0]/100,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100,this.value[e[3]]=i[3]/100}this._notifyValueChange()}setValueFromCmyk(){var e=Object.keys(this.value);switch(this.mode){case 0:var t=convert.cmyk.rgb([100*this.cmyk[0],100*this.cmyk[1],100*this.cmyk[2],100*this.cmyk[3]]);this.value[e[0]]=t[0]/255,this.value[e[1]]=t[1]/255,this.value[e[2]]=t[2]/255;break;case 1:var i=convert.rgb.hsv(convert.cmyk.rgb([100*this.cmyk[0],100*this.cmyk[1],100*this.cmyk[2],100*this.cmyk[3]]));this.value[e[0]]=i[0]/360,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100;break;case 2:i=convert.rgb.hsl(convert.cmyk.rgb([100*this.cmyk[0],100*this.cmyk[1],100*this.cmyk[2],100*this.cmyk[3]]));this.value[e[0]]=i[0]/360,this.value[e[1]]=i[1]/100,this.value[e[2]]=i[2]/100;break;case 3:this.value[e[0]]=this.cmyk[0],this.value[e[1]]=this.cmyk[1],this.value[e[2]]=this.cmyk[2],this.value[e[3]]=this.cmyk[3]}this._notifyValueChange()}valueChanged(){const n=Object.keys(this.value);if(!(n.length<3||4<n.length)){let e=this.mode;-1!==n.indexOf("r")?e=0:-1!==n.indexOf("h")&&-1!==n.indexOf("v")?e=1:-1!==n.indexOf("h")&&-1!==n.indexOf("l")?e=2:-1!==n.indexOf("c")&&(e=3);const a=[];for(let e=0;e<n.length;e++)a.push(this.value[n[e]]);let t,i,o,s,r=void 0;switch(e){case 3:s=[100*a[0],100*a[1],100*a[2],100*a[3]],t=convert.cmyk.rgb(s),i=convert.rgb.hsv(convert.cmyk.rgb(s)),o=convert.rgb.hsl(convert.cmyk.rgb(s)),void 0!==a[4]&&(r=100*a[4]);break;case 2:o=[360*a[0],100*a[1],100*a[2]],t=convert.hsl.rgb(o),i=convert.hsl.hsv(o),s=convert.rgb.cmyk(convert.hsl.rgb(o)),void 0!==a[3]&&(r=100*a[3]);break;case 1:i=[360*a[0],100*a[1],100*a[2]],t=convert.hsv.rgb(i),o=convert.hsv.hsl(i),s=convert.rgb.cmyk(convert.hsv.rgb(i)),void 0!==a[3]&&(r=100*a[3]);break;default:t=[255*a[0],255*a[1],255*a[2]],i=convert.rgb.hsv(t),o=convert.rgb.hsl(t),s=convert.rgb.cmyk(t),void 0!==a[3]&&(r=100*a[3])}0===i[1]&&(i[0]=360*this.hsv[0]),0===i[2]&&(i[1]=100*this.hsv[1]),0===o[1]&&(o[0]=360*this.hsl[0]),0!==o[2]&&100!==o[2]||(o[0]=360*this.hsl[0],o[1]=100*this.hsl[1]),100===s[3]&&(s[0]=100*this.cmyk[0],s[1]=100*this.cmyk[1],s[2]=100*this.cmyk[2]),this.setProperties({rgb:[t[0]/255,t[1]/255,t[2]/255],hsv:[i[0]/360,i[1]/100,i[2]/100],hsl:[o[0]/360,o[1]/100,o[2]/100],cmyk:[s[0]/100,s[1]/100,s[2]/100,s[3]/100],alpha:void 0!==r?r/100:1,mode:e})}}}}convert.rgb.hsl=function(e){var t=e[0]/255,i=e[1]/255,o=e[2]/255,s=Math.min(t,i,o),r=Math.max(t,i,o),e=r-s;let n=0,a;r===s?n=0:t===r?n=(i-o)/e:i===r?n=2+(o-t)/e:o===r&&(n=4+(t-i)/e),n=Math.min(60*n,360),n<0&&(n+=360);i=(s+r)/2;return a=r===s?0:i<=.5?e/(r+s):e/(2-r-s),[n,100*a,100*i]},convert.rgb.hsv=function(e){var t,i;let o=0,s;var r=e[0]/255,n=e[1]/255,a=e[2]/255;const l=Math.max(r,n,a),h=l-Math.min(r,n,a);function c(e){return(l-e)/6/h+.5}return 0==h?(o=0,s=0):(s=h/l,t=c(r),i=c(n),e=c(a),r===l?o=e-i:n===l?o=1/3+t-e:a===l&&(o=2/3+i-t),o<0?o+=1:1<o&&--o),[360*o,100*s,100*l]},convert.rgb.hwb=function(e){var t=e[0],i=e[1],o=e[2];return[convert.rgb.hsl(e)[0],100*(1/255*Math.min(t,Math.min(i,o))),100*(o=1-1/255*Math.max(t,Math.max(i,o)))]},convert.rgb.cmyk=function(e){var t=e[0]/255,i=e[1]/255,o=e[2]/255,e=Math.min(1-t,1-i,1-o);return[100*((1-t-e)/(1-e)||0),100*((1-i-e)/(1-e)||0),100*((1-o-e)/(1-e)||0),100*e]},convert.rgb.xyz=function(e){let t=e[0]/255,i=e[1]/255,o=e[2]/255;return t=.04045<t?((t+.055)/1.055)**2.4:t/12.92,i=.04045<i?((i+.055)/1.055)**2.4:i/12.92,o=.04045<o?((o+.055)/1.055)**2.4:o/12.92,[100*(.4124*t+.3576*i+.1805*o),100*(.2126*t+.7152*i+.0722*o),100*(.0193*t+.1192*i+.9505*o)]},convert.rgb.lab=function(e){e=convert.rgb.xyz(e);let t=e[0],i=e[1],o=e[2];return t/=95.047,i/=100,o/=108.883,t=.008856<t?t**(1/3):7.787*t+16/116,i=.008856<i?i**(1/3):7.787*i+16/116,o=.008856<o?o**(1/3):7.787*o+16/116,[116*i-16,500*(t-i),200*(i-o)]},convert.hsl.rgb=function(e){var t=e[0]/360,i=e[1]/100,e=e[2]/100;let o,s,r;if(0==i)return r=255*e,[r,r,r];o=e<.5?e*(1+i):e+i-e*i;var n=2*e-o;const a=[0,0,0];for(let e=0;e<3;e++)s=t+1/3*-(e-1),s<0&&s++,1<s&&s--,r=6*s<1?n+6*(o-n)*s:2*s<1?o:3*s<2?n+(o-n)*(2/3-s)*6:n,a[e]=255*r;return a},convert.hsl.hsv=function(e){var t=e[0],i=e[1]/100,o=e[2]/100,s=i,e=Math.max(o,.01);return i*=(o*=2)<=1?o:2-o,s*=e<=1?e:2-e,[t,100*(0==o?2*s/(e+s):2*i/(o+i)),100*((o+i)/2)]},convert.hsv.rgb=function(e){var t=e[0]/60,i=e[1]/100,o=e[2]/100,e=Math.floor(t)%6,t=t-Math.floor(t),s=255*o*(1-i),r=255*o*(1-i*t),n=255*o*(1-i*(1-t));switch(o*=255,e){case 0:return[o,n,s];case 1:return[r,o,s];case 2:return[s,o,n];case 3:return[s,r,o];case 4:return[n,s,o];default:return[o,s,r]}},convert.hsv.hsl=function(e){var t=e[0],i=e[1]/100,o=e[2]/100,s=Math.max(o,.01),e=(2-i)*o,o=(2-i)*s,s=i*s;return[t,100*((s/=o<=1?o:2-o)||0),100*(e/=2)]},convert.hwb.rgb=function(e){var t=e[0]/360;let i=e[1]/100,o=e[2]/100;e=i+o;let s;1<e&&(i/=e,o/=e);var e=Math.floor(6*t),r=1-o;s=6*t-e,0!=(1&e)&&(s=1-s);var n=i+s*(r-i);let a,l,h;switch(e){default:case 6:case 0:a=r,l=n,h=i;break;case 1:a=n,l=r,h=i;break;case 2:a=i,l=r,h=n;break;case 3:a=i,l=n,h=r;break;case 4:a=n,l=i,h=r;break;case 5:a=r,l=i,h=n}return[255*a,255*l,255*h]},convert.cmyk.rgb=function(e){var t=e[0]/100,i=e[1]/100,o=e[2]/100,e=e[3]/100;return[255*(1-Math.min(1,t*(1-e)+e)),255*(1-Math.min(1,i*(1-e)+e)),255*(1-Math.min(1,o*(1-e)+e))]},convert.xyz.rgb=function(e){var t=e[0]/100,i=e[1]/100,e=e[2]/100;let o,s,r;return o=3.2406*t+-1.5372*i+-.4986*e,s=-.9689*t+1.8758*i+.0415*e,r=.0557*t+-.204*i+1.057*e,o=.0031308<o?1.055*o**(1/2.4)-.055:12.92*o,s=.0031308<s?1.055*s**(1/2.4)-.055:12.92*s,r=.0031308<r?1.055*r**(1/2.4)-.055:12.92*r,o=Math.min(Math.max(0,o),1),s=Math.min(Math.max(0,s),1),r=Math.min(Math.max(0,r),1),[255*o,255*s,255*r]},convert.xyz.lab=function(e){let t=e[0],i=e[1],o=e[2];return t/=95.047,i/=100,o/=108.883,t=.008856<t?t**(1/3):7.787*t+16/116,i=.008856<i?i**(1/3):7.787*i+16/116,o=.008856<o?o**(1/3):7.787*o+16/116,[116*i-16,500*(t-i),200*(i-o)]},convert.lab.xyz=function(e){var t=e[0],i=e[1],e=e[2];let o,s,r;s=(t+16)/116,o=i/500+s,r=s-e/200;t=s**3,i=o**3,e=r**3;return s=.008856<t?t:(s-16/116)/7.787,o=.008856<i?i:(o-16/116)/7.787,r=.008856<e?e:(r-16/116)/7.787,o*=95.047,s*=100,r*=108.883,[o,s,r]},convert.lab.lch=function(e){var t=e[0],i=e[1],o=e[2];let s;e=Math.atan2(o,i);return s=360*e/2/Math.PI,s<0&&(s+=360),[t,Math.sqrt(i*i+o*o),s]},convert.lch.lab=function(e){var t=e[0],i=e[1],e=e[2]/360*2*Math.PI;return[t,i*Math.cos(e),i*Math.sin(e)]},convert.rgb.ansi16=function(e,t=null){var[i,o,s]=e,t=null===t?convert.rgb.hsv(e)[2]:t;if(0===(t=Math.round(t/50)))return 30;let r=30+(Math.round(s/255)<<2|Math.round(o/255)<<1|Math.round(i/255));return 2===t&&(r+=60),r},convert.hsv.ansi16=function(e){return convert.rgb.ansi16(convert.hsv.rgb(e),e[2])},convert.rgb.ansi256=function(e){var t=e[0],i=e[1],e=e[2];return t===i&&i===e?t<8?16:248<t?231:Math.round((t-8)/247*24)+232:16+36*Math.round(t/255*5)+6*Math.round(i/255*5)+Math.round(e/255*5)},convert.ansi16.rgb=function(e){let t=e%10;if(0===t||7===t)return 50<e&&(t+=3.5),t=t/10.5*255,[t,t,t];e=.5*(1+~~(50<e));return[(1&t)*e*255,(t>>1&1)*e*255,(t>>2&1)*e*255]},convert.ansi256.rgb=function(e){if(232<=e){var t=10*(e-232)+8;return[t,t,t]}return e-=16,[Math.floor(e/36)/5*255,Math.floor((e=e%36)/6)/5*255,e%6/5*255]},convert.rgb.hex=function(e){const t=((255&Math.round(e[0]))<<16)+((255&Math.round(e[1]))<<8)+(255&Math.round(e[2]));e=t.toString(16).toUpperCase();return"000000".substring(e.length)+e},convert.hex.rgb=function(e){e=e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);if(!e)return[0,0,0];let t=e[0];3===e[0].length&&(t=t.split("").map(e=>e+e).join(""));e=parseInt(t,16);return[e>>16&255,e>>8&255,255&e]},convert.rgb.hcg=function(e){var t=e[0]/255,i=e[1]/255,o=e[2]/255,s=Math.max(Math.max(t,i),o),r=Math.min(Math.min(t,i),o),e=s-r;let n,a;return n=e<1?r/(1-e):0,a=e<=0?0:s===t?(i-o)/e%6:s===i?2+(o-t)/e:4+(t-i)/e+4,a/=6,a%=1,[360*a,100*e,100*n]},convert.hsl.hcg=function(e){var t=e[1]/100,i=e[2]/100,t=i<.5?2*t*i:2*t*(1-i);let o=t<1?(i-.5*t)/(1-t):0;return[e[0],100*t,100*o]},convert.hsv.hcg=function(e){var t=e[1]/100,i=e[2]/100,t=t*i;let o=t<1?(i-t)/(1-t):0;return[e[0],100*t,100*o]},convert.hcg.rgb=function(e){var t=e[0]/360,i=e[1]/100,e=e[2]/100;if(0==i)return[255*e,255*e,255*e];const o=[0,0,0];var t=t%1*6,s=t%1,r=1-s;switch(Math.floor(t)){case 0:o[0]=1,o[1]=s,o[2]=0;break;case 1:o[0]=r,o[1]=1,o[2]=0;break;case 2:o[0]=0,o[1]=1,o[2]=s;break;case 3:o[0]=0,o[1]=r,o[2]=1;break;case 4:o[0]=s,o[1]=0,o[2]=1;break;default:o[0]=1,o[1]=0,o[2]=r}return e=(1-i)*e,[255*(i*o[0]+e),255*(i*o[1]+e),255*(i*o[2]+e)]},convert.hcg.hsv=function(e){var t=e[1]/100,i=t+e[2]/100*(1-t);let o=0<i?t/i:0;return[e[0],100*o,100*i]},convert.hcg.hsl=function(e){var t=e[1]/100,i=e[2]/100*(1-t)+.5*t;let o=0;return 0<i&&i<.5?o=t/(2*i):.5<=i&&i<1&&(o=t/(2*(1-i))),[e[0],100*o,100*i]},convert.hcg.hwb=function(e){var t=e[1]/100,i=t+e[2]/100*(1-t);return[e[0],100*(i-t),100*(1-i)]},convert.hwb.hcg=function(e){var t=e[1]/100,i=1-e[2]/100,t=i-t;let o=t<1?(i-t)/(1-t):0;return[e[0],100*t,100*o]},convert.apple.rgb=function(e){return[e[0]/65535*255,e[1]/65535*255,e[2]/65535*255]},convert.rgb.apple=function(e){return[e[0]/255*65535,e[1]/255*65535,e[2]/255*65535]},convert.gray.rgb=function(e){return[e[0]/100*255,e[0]/100*255,e[0]/100*255]},convert.gray.hsl=function(e){return[0,0,e[0]]},convert.gray.hsv=convert.gray.hsl,convert.gray.hwb=function(e){return[0,100,e[0]]},convert.gray.cmyk=function(e){return[0,0,0,e[0]]},convert.gray.lab=function(e){return[e[0],0,0]},convert.gray.hex=function(e){e=255&Math.round(e[0]/100*255);const t=(e<<16)+(e<<8)+e;e=t.toString(16).toUpperCase();return"000000".substring(e.length)+e},convert.rgb.gray=function(e){return[(e[0]+e[1]+e[2])/3/255*100]};class IoColorSlider extends IoColorMixin(IoSlider){static get Properties(){return{value:[1,1,1,1],step:.001,min:0,max:1}}static get GlUtils(){return`
    vec4 paintColorSlider(vec2 position, vec3 color) {
      // return paintSlider(position, color);
      vec4 slotColor = vec4(.2, .2, .2, 1.);
      vec4 fillColor = vec4(.8, .8, .8, 1.);
      vec4 sliderColor = vec4(0.);
      float slotWidth = cssStrokeWidth * 1.5;
      float radius = cssItemHeight / 4.;
      float stroke = cssStrokeWidth;
      float strokeShape = min(circle(position, radius + stroke), rectangle(position - vec2(0., 2500.), vec2(slotWidth + stroke, 5000.)));
      sliderColor = mix(vec4(slotColor.rgb, 1.), sliderColor, strokeShape);
      float fillShape = min(circle(position, radius), rectangle(position - vec2(0., 2500.), vec2(slotWidth, 5000.)));
      sliderColor = mix(fillColor, sliderColor, fillShape);
      float colorShape = min(circle(position, radius - stroke), rectangle(position - vec2(0., 2500.), vec2(slotWidth - stroke, 5000.)));
      sliderColor = mix(vec4(color, 1.), sliderColor, colorShape);
      return sliderColor;
    }
    vec4 paintColorSlider2D(vec2 position, vec3 color) {
      vec4 sliderColor = vec4(0.);
      float radius = cssItemHeight / 4.;
      float stroke = cssStrokeWidth;
      vec4 slotColor = vec4(.2, .2, .2, 1.);
      vec4 fillColor = vec4(.8, .8, .8, 1.);
      vec2 width = (uHorizontal == 1) ? vec2(stroke * 2., uSize.y) : vec2(uSize.x, stroke * 2.);
      float strokeShape = circle(position, radius + stroke);
      sliderColor = mix(slotColor, sliderColor, strokeShape);
      float fillShape = circle(position, radius);
      sliderColor = mix(fillColor, sliderColor, fillShape);
      float colorShape = circle(position, radius - stroke);
      sliderColor = mix(vec4(color, 1.), sliderColor, colorShape);
      return sliderColor;
    }
    

`}valueMutated(){this.valueChanged()}applyAria(){}_onKeydown(e){super._onKeydown(e),this._notifyValueChange()}_setIncrease(){}_setDecrease(){}_setMin(){this._setValue(0,0)}_setMax(){this._setValue(1,1)}_onPointermoveThrottled(e){super._onPointermoveThrottled(e),this._notifyValueChange()}_notifyValueChange(){this.dispatchEvent("object-mutated",{object:this.value},!1,window),this.dispatchEvent("value-set",{property:"value",value:this.value},!1)}_setValue(e,t){}}RegisterIoElement(IoColorSlider);class IoColorSliderRed extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = vec3(uv.x, uRgb[1], uRgb[2]);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uRgb[0], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.rgb[0]=Math.min(1,this.rgb[0]+.01),this.setValueFromRgb()}_setDecrease(){this.rgb[0]=Math.max(0,this.rgb[0]-.01),this.setValueFromRgb()}_setValue(e){this.rgb[0]=e,this.setValueFromRgb()}}RegisterIoElement(IoColorSliderRed);class IoColorSliderGreen extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = vec3(uRgb[0], uv.x, uRgb[2]);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uRgb[1], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.rgb[1]=Math.min(1,this.rgb[1]+.01),this.setValueFromRgb()}_setDecrease(){this.rgb[1]=Math.max(0,this.rgb[1]-.01),this.setValueFromRgb()}_setValue(e){this.rgb[1]=e,this.setValueFromRgb()}}RegisterIoElement(IoColorSliderGreen);class IoColorSliderBlue extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = vec3(uRgb[0], uRgb[1], uv.x);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uRgb[2], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.rgb[2]=Math.min(1,this.rgb[2]+.01),this.setValueFromRgb()}_setDecrease(){this.rgb[2]=Math.max(0,this.rgb[2]-.01),this.setValueFromRgb()}_setValue(e){this.rgb[2]=e,this.setValueFromRgb()}}RegisterIoElement(IoColorSliderBlue);class IoColorSliderHue extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Hue spectrum
        vec3 finalColor = hsv2rgb(vec3(uv.x, uHsv[1], uHsv[2]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsv[0], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.hsv[0]=Math.min(1,this.hsv[0]+.01),this.setValueFromHsv()}_setDecrease(){this.hsv[0]=Math.max(0,this.hsv[0]-.01),this.setValueFromHsv()}_setValue(e){this.hsv[0]=e,this.setValueFromHsv()}}RegisterIoElement(IoColorSliderHue);class IoColorSliderSaturation extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Saturation gradient
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], uv.x, uHsv[2]));
        float saturation = uHsv[1];
        if (uMode == 2.0) {
          saturation = uHsl[1];
          finalColor = hsl2rgb(vec3(uHsl[0], uv.x, uHsl[2]));
        }

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * saturation, size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.hsv[1]=Math.min(1,this.hsv[1]+.01),this.setValueFromHsv()}_setDecrease(){this.hsv[1]=Math.max(0,this.hsv[1]-.01),this.setValueFromHsv()}_setValue(e){this.hsv[1]=e,this.setValueFromHsv()}}RegisterIoElement(IoColorSliderSaturation);class IoColorSliderValue extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], uHsv[1], uv.x));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsv[2], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.hsv[2]=Math.min(1,this.hsv[2]+.01),this.setValueFromHsv()}_setDecrease(){this.hsv[2]=Math.max(0,this.hsv[2]-.01),this.setValueFromHsv()}_setValue(e){this.hsv[2]=e,this.setValueFromHsv()}}RegisterIoElement(IoColorSliderValue);class IoColorSliderLevel extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = hsl2rgb(vec3(uHsl[0], uHsl[1], uv.x));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsl[2], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.hsv[2]=Math.min(1,this.hsv[2]+.01),this.setValueFromHsl()}_setDecrease(){this.hsv[2]=Math.max(0,this.hsv[2]-.01),this.setValueFromHsl()}_setValue(e){this.hsl[2]=e,this.setValueFromHsl()}}RegisterIoElement(IoColorSliderLevel);class IoColorSliderHs extends IoColorSlider{static get Style(){return`
    :host {
      cursor: move !important;
    }
    `}static get Properties(){return{noscroll:!0}}static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // HS gradient
        vec3 finalColor = hsv2rgb(vec3(uv, uHsv[2]));
        if (uMode == 2.0) {
          finalColor = hsl2rgb(vec3(uv, uHsl[2]));
        }

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsv[0], size.y * uHsv[1]));
        vec4 slider = paintColorSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_onKeydown(e){e.shiftKey&&"ArrowLeft"===e.key?(e.preventDefault(),this.horizontal?this.hsv[0]=Math.max(0,this.hsv[0]-.01):this.hsv[1]=Math.max(0,this.hsv[1]-.01),this.setValueFromHsv()):e.shiftKey&&"ArrowUp"===e.key?(e.preventDefault(),this.horizontal?this.hsv[1]=Math.min(1,this.hsv[1]+.01):this.hsv[0]=Math.min(1,this.hsv[0]+.01),this.setValueFromHsv()):e.shiftKey&&"ArrowRight"===e.key?(e.preventDefault(),this.horizontal?this.hsv[0]=Math.min(1,this.hsv[0]+.01):this.hsv[1]=Math.min(1,this.hsv[1]+.01),this.setValueFromHsv()):e.shiftKey&&"ArrowDown"===e.key?(e.preventDefault(),this.horizontal?this.hsv[1]=Math.max(0,this.hsv[1]-.01):this.hsv[0]=Math.max(0,this.hsv[0]-.01),this.setValueFromHsv()):super._onKeydown(e)}_setValue(e,t){this.hsv[0]=e,this.hsv[1]=t,this.setValueFromHsv()}}RegisterIoElement(IoColorSliderHs);class IoColorSliderSv extends IoColorSlider{static get Style(){return`
    :host {
      cursor: move !important;
    }
    `}static get Properties(){return{noscroll:!0}}static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // SV gradient
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], uv));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsv[1], size.y * uHsv[2]));
        vec4 slider = paintColorSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_onKeydown(e){e.shiftKey&&"ArrowLeft"===e.key?(e.preventDefault(),this.horizontal?this.hsv[1]=Math.max(0,this.hsv[1]-.01):this.hsv[2]=Math.max(0,this.hsv[2]-.01),this.setValueFromHsv()):e.shiftKey&&"ArrowUp"===e.key?(e.preventDefault(),this.horizontal?this.hsv[2]=Math.min(1,this.hsv[2]+.01):this.hsv[1]=Math.min(1,this.hsv[1]+.01),this.setValueFromHsv()):e.shiftKey&&"ArrowRight"===e.key?(e.preventDefault(),this.horizontal?this.hsv[1]=Math.min(1,this.hsv[1]+.01):this.hsv[2]=Math.min(1,this.hsv[2]+.01),this.setValueFromHsv()):e.shiftKey&&"ArrowDown"===e.key?(e.preventDefault(),this.horizontal?this.hsv[2]=Math.max(0,this.hsv[2]-.01):this.hsv[1]=Math.max(0,this.hsv[1]-.01),this.setValueFromHsv()):super._onKeydown(e)}_setValue(e,t){this.hsv[1]=e,this.hsv[2]=t,this.setValueFromHsv()}}RegisterIoElement(IoColorSliderSv);class IoColorSliderSl extends IoColorSlider{static get Style(){return`
    :host {
      cursor: move !important;
    }
    `}static get Properties(){return{noscroll:!0}}static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // SV gradient
        vec3 finalColor = hsl2rgb(vec3(uHsl[0], uv));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsl[1], size.y * uHsl[2]));
        vec4 slider = paintColorSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_onKeydown(e){e.shiftKey&&"ArrowLeft"===e.key?(e.preventDefault(),this.horizontal?this.hsl[1]=Math.max(0,this.hsl[1]-.01):this.hsl[2]=Math.max(0,this.hsl[2]-.01),this.setValueFromHsl()):e.shiftKey&&"ArrowUp"===e.key?(e.preventDefault(),this.horizontal?this.hsl[2]=Math.min(1,this.hsl[2]+.01):this.hsl[1]=Math.min(1,this.hsl[1]+.01),this.setValueFromHsl()):e.shiftKey&&"ArrowRight"===e.key?(e.preventDefault(),this.horizontal?this.hsl[1]=Math.min(1,this.hsl[1]+.01):this.hsl[2]=Math.min(1,this.hsl[2]+.01),this.setValueFromHsl()):e.shiftKey&&"ArrowDown"===e.key?(e.preventDefault(),this.horizontal?this.hsl[2]=Math.max(0,this.hsl[2]-.01):this.hsl[1]=Math.max(0,this.hsl[1]-.01),this.setValueFromHsl()):super._onKeydown(e)}_setValue(e,t){this.hsl[1]=e,this.hsl[2]=t,this.setValueFromHsl()}}RegisterIoElement(IoColorSliderSl);class IoColorSliderCyan extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uv.x, uCmyk[1], uCmyk[2], uCmyk[3]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[0], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.cmyk[0]=Math.min(1,this.cmyk[0]+.01),this.setValueFromCmyk()}_setDecrease(){this.cmyk[0]=Math.max(0,this.cmyk[0]-.01),this.setValueFromCmyk()}_setValue(e){this.cmyk[0]=e,this.setValueFromCmyk()}}RegisterIoElement(IoColorSliderCyan);class IoColorSliderMagenta extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uCmyk[0], uv.x, uCmyk[2], uCmyk[3]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[1], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.cmyk[1]=Math.min(1,this.cmyk[1]+.01),this.setValueFromCmyk()}_setDecrease(){this.cmyk[1]=Math.max(0,this.cmyk[1]-.01),this.setValueFromCmyk()}_setValue(e){this.cmyk[1]=e,this.setValueFromCmyk()}}RegisterIoElement(IoColorSliderMagenta);class IoColorSliderYellow extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uCmyk[0], uCmyk[1], uv.x, uCmyk[3]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[2], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.cmyk[2]=Math.min(1,this.cmyk[2]+.01),this.setValueFromCmyk()}_setDecrease(){this.cmyk[2]=Math.max(0,this.cmyk[2]-.01),this.setValueFromCmyk()}_setValue(e){this.cmyk[2]=e,this.setValueFromCmyk()}}RegisterIoElement(IoColorSliderYellow);class IoColorSliderKey extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uCmyk[0], uCmyk[1], uCmyk[2], uv.x));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[3], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}_setIncrease(){this.cmyk[3]=Math.min(1,this.cmyk[3]+.01),this.setValueFromCmyk()}_setDecrease(){this.cmyk[3]=Math.max(0,this.cmyk[3]-.01),this.setValueFromCmyk()}_setValue(e){this.cmyk[3]=e,this.setValueFromCmyk()}}RegisterIoElement(IoColorSliderKey);class IoColorSliderAlpha extends IoColorSlider{static get Frag(){return`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 6.));
        vec3 finalColor = alphaPattern;

        // Apha gradient
        finalColor = mix(finalColor, vec3(1.0), uv.x);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uAlpha, size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, vec3(1.0));
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `}applyAria(){super.applyAria();var e=3===this.mode?4:3,t=Object.keys(this.value),e=void 0!==this.value[t[e]];this.setAttribute("aria-invalid",!e&&"true")}_setIncrease(){var e=3===this.mode?4:3,t=Object.keys(this.value);this.value[t[e]]=Math.min(1,this.value[t[e]]+.01)}_setDecrease(){var e=3===this.mode?4:3,t=Object.keys(this.value);this.value[t[e]]=Math.max(0,this.value[t[e]]-.01)}_setMin(){var e=3===this.mode?4:3,t=Object.keys(this.value);this.value[t[e]]=0}_setMax(){var e=3===this.mode?4:3,t=Object.keys(this.value);this.value[t[e]]=1}_setValue(e){var t=3===this.mode?4:3,i=Object.keys(this.value);void 0!==this.value[i[t]]&&(this.value[i[t]]=e)}}RegisterIoElement(IoColorSliderAlpha);let lastFocus$1=null;window.addEventListener("focusin",()=>{lastFocus$1=document.activeElement},{capture:!1}),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement===document.body&&(lastFocus$1=null)})},{capture:!0});class IoLayer extends IoElement{static get Style(){return`
    :host {
      display: block;
      visibility: hidden;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100000;
      user-select: none;
      overflow: hidden;
      pointer-events: none;
      touch-action: none;
      opacity: 0;
      transition: opacity 0.25s;
      background: transparent;
    }
    :host[expanded] {
      pointer-events: all;
      visibility: visible;
      opacity: 1;
      /* background: rgba(0,0,0,0.2); */
    }
    :host > * {
      position: absolute;
      touch-action: none;
    }
    `}static get Properties(){return{expanded:{value:!1,reflect:1},skipCollapse:Boolean}}static get Listeners(){return{pointerup:"_onPointerup",contextmenu:"_onContextmenu",focusin:"_onFocusIn",scroll:"_onScroll",wheel:"_onScroll",mousedown:"stopPropagation",mouseup:"stopPropagation",mousemove:"stopPropagation",touchstart:"stopPropagation",touchmove:"stopPropagation",touchend:"stopPropagation",keydown:"stopPropagation",keyup:"stopPropagation"}}constructor(e={}){super(e),Object.defineProperty(this,"x",{value:0,writable:!0}),Object.defineProperty(this,"y",{value:0,writable:!0})}stopPropagation(e){e.stopPropagation()}_onPointerup(e){e.composedPath()[0]===this&&(this.skipCollapse||this.requestAnimationFrameOnce(this._collapse),this.skipCollapse=!1)}_collapse(){this.expanded=!1}_onContextmenu(e){e.preventDefault()}_onFocusIn(e){e.stopPropagation()}_onScroll(e){e.composedPath()[0]===this&&this.requestAnimationFrameOnce(this._collapse)}nudgeDown(e,t,i,o,s){return t=Math.max(0,Math.min(t,window.innerWidth-o.width)),!!(i+o.height<window.innerHeight||s)&&(e.style.left=t+"px",e.style.top=i+"px",!0)}nudgeUp(e,t,i,o,s){return t=Math.max(0,Math.min(t,window.innerWidth-o.width)),!!(0<i-o.height||s)&&(e.style.left=t+"px",e.style.top=i-o.height+"px",!0)}nudgeRight(e,t,i,o,s){return!!(t+o.width<window.innerWidth||s)&&(e.style.left=t+"px",e.style.top=Math.min(i,window.innerHeight-o.height)+"px",!0)}nudgeLeft(e,t,i,o,s){return!!(0<t-o.width||s)&&(e.style.left=t-o.width+"px",e.style.top=Math.min(i,window.innerHeight-o.height)+"px",!0)}nudgePointer(e,t,i,o){return e.style.left=Math.max(0,Math.min(t,window.innerWidth-o.width))+"px",e.style.top=Math.max(0,Math.min(i,window.innerHeight-o.height))+"px",!0}setElementPosition(e,t,i){var o=e.getBoundingClientRect(),s=i.left,r=i.top,n=i.right,a=i.bottom,l=window.innerHeight-a,h=window.innerWidth-n;switch(t){case"pointer":this.nudgePointer(e,this.x+5,this.y+5,o);break;case"top":this.nudgeUp(e,s,r,o)||this.nudgeDown(e,s,a,o)||this.nudgeUp(e,s,r,o,l<r)||this.nudgeDown(e,s,a,o,r<=l);break;case"left":this.nudgeLeft(e,s,r,o)||this.nudgeRight(e,n,r,o)||this.nudgeLeft(e,s,r,o,h<s)||this.nudgeRight(e,n,r,o,s<=h);break;case"bottom":this.nudgeDown(e,s,a,o)||this.nudgeUp(e,s,r,o)||this.nudgeDown(e,s,a,o,r<l)||this.nudgeUp(e,s,r,o,l<=r);break;default:this.nudgeRight(e,n,r,o)||this.nudgeLeft(e,s,r,o)||this.nudgeRight(e,n,r,o,s<h)||this.nudgeLeft(e,s,r,o,h<=s)}}appendChild(e){super.appendChild(e),e.addEventListener("expanded-changed",this.onChildExpanded),this.onChildExpanded()}removeChild(e){super.removeChild(e),e.removeEventListener("expanded-changed",this.onChildExpanded),this.onChildExpanded()}onChildExpanded(){this.requestAnimationFrameOnce(this.onChildExpandedDelayed)}onChildExpandedDelayed(){for(let e=this.children.length;e--;)if(this.children[e].expanded)return void(this.expanded=!0);this.requestAnimationFrameOnce(this._collapse)}expandedChanged(){if(!this.expanded){for(let e=this.children.length;e--;)this.children[e].expanded=!1;lastFocus$1&&lastFocus$1.focus()}}}RegisterIoElement(IoLayer);const IoLayerSingleton=new IoLayer;document.body.appendChild(IoLayerSingleton);class IoColorPanel extends IoColorMixin(IoElement){static get Style(){return`
    :host {
      @apply --io-panel;
      display: flex;
      cursor: move;
      align-items: stretch;
      min-width: var(--io-line-height);
      min-height: var(--io-line-height);
      flex-direction: column;
    }
    :host:not([expanded]) {
      display: none;
    }
    :host[horizontal] {
      flex-direction: row;
    }
    :host > * {
      border-radius: calc(var(--io-border-radius) - var(--io-border-width));
    }
    :host > io-color-slider-sl,
    :host > io-color-slider-sv {
      flex: 1 1;
    }
    :host > *:not(:last-child) {
      margin: 0 0 var(--io-spacing) 0;
    }
    :host[horizontal] > *:not(:last-child) {
      margin: 0 var(--io-spacing) 0 0;
    }
    `}static get Properties(){return{expanded:{type:Boolean,reflect:1},horizontal:{value:!0,reflect:1}}}static get Listeners(){return{keydown:"_onKeydown"}}_onKeydown(e){"Escape"!==e.key&&"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.expanded=!1)}changed(){this.template([2===this.mode?["io-color-slider-sl",{value:this.value,mode:this.mode}]:["io-color-slider-sv",{value:this.value,mode:this.mode}],["io-color-slider-hue",{value:this.value,mode:this.mode,horizontal:!this.horizontal}],void 0!==this.alpha?["io-color-slider-alpha",{value:this.value,horizontal:!this.horizontal}]:null])}}RegisterIoElement(IoColorPanel);const IoColorPanelSingleton=new IoColorPanel;IoLayerSingleton.appendChild(IoColorPanelSingleton);class IoItem extends IoElement{static get Style(){return`
    :host {
      @apply --io-item;
    }
    :host[selected] {
      color: var(--io-color-link);
      background-color: var(--io-background-color-highlight);
    }
    :host:focus {
      z-index: 200;
      position: relative;
      text-overflow: inherit;
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `}static get Properties(){return{value:void 0,selected:{type:Boolean,reflect:1},tabindex:0}}static get Listeners(){return{focus:"_onFocus",pointerdown:"_onPointerdown",click:"_onClick"}}constructor(e={}){super(e),Object.defineProperty(this,"__textNode",{enumerable:!1,writable:!0,value:document.createTextNode("")}),this.appendChild(this.__textNode)}_onFocus(e){this.addEventListener("blur",this._onBlur),this.addEventListener("keydown",this._onKeydown),this.addEventListener("keyup",this._onKeyup)}_onBlur(e){this.removeEventListener("blur",this._onBlur),this.removeEventListener("keydown",this._onKeydown),this.removeEventListener("keyup",this._onKeyup)}_onPointerdown(e){e.preventDefault(),this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerleave",this._onPointerleave),this.addEventListener("pointerup",this._onPointerup)}_onPointermove(e){}_onPointerleave(e){this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerleave",this._onPointerleave),this.removeEventListener("pointerup",this._onPointerup)}_onPointerup(e){this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerleave",this._onPointerleave),this.removeEventListener("pointerup",this._onPointerup),this.focus()}_onClick(){this.dispatchEvent("item-clicked",{value:this.value,label:this.label},!0)}_onKeydown(e){"Enter"===e.key||" "===e.key?(e.preventDefault(),this._onClick()):"ArrowLeft"===e.key?(e.preventDefault(),this.focusTo("left")):"ArrowUp"===e.key?(e.preventDefault(),this.focusTo("up")):"ArrowRight"===e.key?(e.preventDefault(),this.focusTo("right")):"ArrowDown"===e.key&&(e.preventDefault(),this.focusTo("down"))}_onKeyup(e){}getCaretPosition(){let e=0;const t=window.getSelection();if(t&&t.rangeCount){const o=t.getRangeAt(0);var i=o.toString().length;const s=o.cloneRange();s.selectNodeContents(this),s.setEnd(o.endContainer,o.endOffset),e=s.toString().length-i}return e}setCaretPosition(e){if(e){const t=window.getSelection();if(t){const i=document.createRange();i.setStart(this.firstChild,e),i.collapse(!0),t.removeAllRanges(),t.addRange(i)}}}changed(){let t;if(this.label)t=this.label,this.title=this.label;else{let e;e=this.value&&"object"==typeof this.value?""+this.value.constructor.name+(this.value instanceof Array?`(${this.value.length})`:""):String(this.value),this.title=e,t=e}this.textNode=t}}RegisterIoElement(IoItem);class IoColorSwatch extends IoColorMixin(IoGl){static get Style(){return`
    :host {
      box-sizing: border-box;
      align-self: flex-start;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-item-height);
      min-height: var(--io-item-height);
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
    }
    :host:focus {
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `}static get Frag(){return`
      varying vec2 vUv;
      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 6.));

        float alpha = uAlpha;
        float lineWidth = cssStrokeWidth * 2.0;
        vec2 pxUv = vUv * uSize;
        if (pxUv.x < lineWidth) alpha = 1.0;
        if (pxUv.y < lineWidth) alpha = 1.0;
        if (pxUv.x > uSize.x - lineWidth) alpha = 1.0;
        if (pxUv.y > uSize.y - lineWidth) alpha = 1.0;

        gl_FragColor = saturate(vec4(mix(alphaPattern, uRgb.rgb, alpha), 1.0));
      }
    `}}RegisterIoElement(IoColorSwatch);class IoColorPicker extends IoColorMixin(IoItem){static get Style(){return`
    :host {
      display: flex;
      box-sizing: border-box;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-item-height);
      min-height: var(--io-item-height);
      padding: 0;
    }
    :host > io-color-swatch {
      border: 0;
      flex: 1 1 auto;
      align-self: stretch;
      min-width: 0;
      min-height: 0;
      border-radius: 0;
    }
    `}static get Properties(){return{value:[.5,.5,.5,.5],horizontal:!1,role:"slider",tabindex:0}}static get Listeners(){return{click:"_onClick",keydown:"_onKeydown"}}_onClick(){this.focus(),this.toggle()}get expanded(){return IoColorPanelSingleton.expanded&&IoColorPanelSingleton.value===this.value}_onKeydown(e){var t=this.getBoundingClientRect(),i=IoColorPanelSingleton.getBoundingClientRect();"Enter"===e.key||" "===e.key?(e.preventDefault(),this.toggle(),this.expanded&&IoColorPanelSingleton.firstChild.focus()):this.expanded&&i.top>=t.bottom&&"ArrowDown"===e.key||this.expanded&&i.bottom<=t.top&&"ArrowUp"===e.key?(e.preventDefault(),IoColorPanelSingleton.firstChild.focus()):(this.collapse(),super._onKeydown(e))}_onValueSet(){this.dispatchEvent("value-set",{property:"value",value:this.value},!0)}toggle(){this.expanded?this.collapse():this.expand()}expand(){var e=void 0!==this.alpha;IoColorPanelSingleton.value=this.value,IoColorPanelSingleton.mode=this.mode,IoColorPanelSingleton.style.width=e?"192px":"160px",IoColorPanelSingleton.style.height="128px",IoColorPanelSingleton.expanded=!0,IoLayerSingleton.setElementPosition(IoColorPanelSingleton,"bottom",this.getBoundingClientRect()),IoColorPanelSingleton.removeEventListener("value-set",IoColorPanelSingleton._targetValueSetHandler),IoColorPanelSingleton.addEventListener("value-set",this._onValueSet),IoColorPanelSingleton._targetValueSetHandler=this._onValueSet}collapse(){IoColorPanelSingleton.expanded=!1}changed(){this.template([["io-color-swatch",{value:this.value,mode:this.mode}]])}}RegisterIoElement(IoColorPicker);class IoColorVector extends IoColorMixin(IoElement){static get Style(){return`
    :host {
      display: flex;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      width: inherit;
      flex: 1 1;
    }
    :host > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host > io-color-picker {
      width: calc(var(--io-line-height) + calc(2 * var(--io-spacing)));
    }
    `}static get Properties(){return{value:[0,0,0,0],conversion:1,step:.01,min:0,max:1}}_onValueSet(e){var t=e.composedPath()[0].id,i=e.detail.value,e=e.detail.oldValue;this.value[t]=i;e={object:this.value,property:this.linked?null:t,value:i,oldValue:e};this.dispatchEvent("object-mutated",e,!1,window)}changed(){const e=[];var t=Object.keys(this.value);for(const o in t){var i=t[o];void 0!==this.value[i]&&e.push(["io-number",{id:i,value:this.value[i],conversion:this.conversion,step:this.step,min:this.min,max:this.max,ladder:!0,"on-value-set":this._onValueSet}])}e.push(this.getSlotted()),this.template(e)}getSlotted(){return["io-color-picker",{id:"swatch",mode:this.mode,value:this.value}]}}RegisterIoElement(IoColorVector);class IoContent extends IoElement{static get Style(){return`
    :host {
      @apply --io-content;
    }
    :host:not([expanded]) {
      display: none;
    }
    `}static get Properties(){return{elements:{type:Array,observe:!0},expanded:{type:Boolean,reflect:1},cache:Boolean}}changed(){this.expanded?this.template([this.elements]):this.cache||this.template([null])}}RegisterIoElement(IoContent);class IoButton extends IoItem{static get Style(){return`
    :host {
      text-align: center;
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
    }
    :host[pressed] {
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
    }
    `}static get Properties(){return{action:null,value:void 0,pressed:{type:Boolean,reflect:1},label:"Button",icon:"",role:"button"}}_onPointerdown(e){super._onPointerdown(e),this.pressed=!0}_onPointerleave(e){super._onPointerleave(e),this.pressed=!1}_onPointerup(e){super._onPointerup(e),this.pressed=!1}_onKeydown(e){super._onKeydown(e),"Enter"!==e.key&&" "!==e.key||(this.pressed=!0)}_onKeyup(e){super._onKeyup(e),this.pressed=!1}_onClick(){super._onClick(),"function"==typeof this.action&&this.action(this.value)}}RegisterIoElement(IoButton);class IoBoolean extends IoItem{static get Style(){return`
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `}static get Properties(){return{label:"Boolean",value:{type:Boolean,reflect:1},true:"true",false:"false",role:"switch"}}_onClick(){this.toggle()}toggle(){this.set("value",!this.value)}valueChanged(){this.setAttribute("value",Boolean(this.value))}changed(){this.title=this.label,this.textNode=this.value?this.true:this.false}applyAria(){super.applyAria(),this.setAttribute("aria-checked",String(!!this.value)),this.setAttribute("aria-invalid","boolean"!=typeof this.value&&"true")}}RegisterIoElement(IoBoolean);const IoIconsetDB={};class IoIconset extends IoNode{registerIcons(t,e){const i=document.createElement("div");i.innerHTML=e,i.querySelectorAll("[id]").forEach(e=>{IoIconsetDB[t]=IoIconsetDB[t]||{},IoIconsetDB[t][e.id]=e.outerHTML})}getIcon(e){const t=IoIconsetDB[e.split(":")[0]];if(t){e=e.split(":")[1];if(t[e])return`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">${t[e].replace(' id="',' class="icon-id-')}</svg>`}return'<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></svg>'}}RegisterIoNode(IoIconset);const IoIconsetSingleton=new IoIconset,icons=`
<svg><g id="io"><ellipse fill="#83A61E" cx="5.4" cy="12.1" rx="3.4" ry="3.4"/><path fill="#646464" d="M16.3,17.7c-3.1,0-5.6-2.6-5.6-5.6s2.6-5.6,5.6-5.6s5.6,2.6,5.6,5.6S19.3,17.7,16.3,17.7z M16.3,8.8c-1.8,0-3.3,1.5-3.3,3.2s1.5,3.2,3.3,3.2s3.3-1.5,3.3-3.2S18.1,8.8,16.3,8.8z"/></g><g id="io_logo"><path fill="#646464" d="M19.5,12.7c0.3-0.3,0.3-0.9,0-1.2l-0.7-0.7l-2.6-2.6c-0.3-0.3-0.3-0.9,0-1.2c0.3-0.3,0.9-0.3,1.2,0l3.8,3.8c0.7,0.7,0.7,1.8,0,2.6l-3.8,3.8c-0.3,0.3-0.9,0.3-1.2,0c-0.3-0.3-0.3-0.9,0-1.2"/><path fill="#646464" d="M4.3,12.7c-0.3-0.3-0.3-0.9,0-1.2L5,10.8l2.6-2.6c0.3-0.3,0.3-0.9,0-1.2C7.3,6.7,6.7,6.7,6.4,7l-3.8,3.8c-0.7,0.7-0.7,1.8,0,2.6l3.8,3.8c0.3,0.3,0.9,0.3,1.2,0s0.3-0.9,0-1.2"/><ellipse fill="#83A61E" cx="8.4" cy="12.1" rx="1.7" ry="1.7"/><path fill="#646464" d="M13.9,14.9c-1.6,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S15.4,14.9,13.9,14.9z M13.9,10.4c-0.9,0-1.7,0.7-1.7,1.7c0,0.9,0.7,1.7,1.7,1.7c0.9,0,1.7-0.7,1.7-1.7C15.5,11.2,14.8,10.4,13.9,10.4z"/></g><g <g id="unlink"><path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M17,7h-4.1v1.9H17c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/></g><g id="link"><path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M8,13h8.1v-2H8V13z M17,7h-4.1v1.9H17c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/></g><g id="gear"><path d="M21.3,14.6L19.2,13c0-0.3,0.1-0.6,0.1-1c0-0.3,0-0.6-0.1-1l2.1-1.7c0.2-0.2,0.2-0.4,0.1-0.6l-1.9-3.4c-0.1-0.2-0.3-0.2-0.6-0.2l-2.4,1c-0.5-0.3-1.1-0.7-1.7-1l-0.3-2.7c0-0.2-0.2-0.4-0.4-0.4h-4C9.8,2.3,9.5,2.4,9.5,2.7L9.1,5.3C8.5,5.5,8,5.8,7.5,6.3l-2.4-1c-0.2-0.1-0.5,0-0.7,0.2L2.5,8.8C2.4,9.1,2.4,9.3,2.6,9.5l2.1,1.7c0,0.3-0.1,0.6-0.1,1s0,0.6,0.1,1l-2.1,1.7c-0.2,0.2-0.2,0.4-0.1,0.6l1.9,3.4C4.5,19,4.7,19,5,19l2.4-1c0.5,0.4,1.1,0.7,1.7,1l0.4,2.7c0,0.2,0.3,0.4,0.6,0.4H14c0.2,0,0.4-0.2,0.5-0.4l0.3-2.7c0.6-0.2,1.2-0.5,1.7-1l2.4,1c0.2,0.1,0.4,0,0.6-0.2l1.9-3.4C21.6,15.1,21.5,14.8,21.3,14.6z M11.9,15.6c-2,0-3.7-1.7-3.7-3.7s1.7-3.6,3.7-3.6s3.7,1.7,3.7,3.7S13.9,15.6,11.9,15.6z"/></g><g id="less"><path d="M6.6,20.3L8.3,22l3.7-4l3.7,4l1.7-1.7l-5.3-5.7L6.6,20.3z M17.3,3.8l-1.7-1.7l-3.7,4l-3.7-4L6.6,3.8l5.3,5.7L17.3,3.8z"/></g><g id="more"><path d="M11.9,5.3l3.7,3.5l1.7-1.6L12,2.1L6.6,7.2l1.7,1.6L11.9,5.3z M11.9,18.9l-3.7-3.5L6.6,17l5.3,5.1l5.3-5.1l-1.7-1.6L11.9,18.9z"/></g><g id="code"><path d="M9.4,16.6L4.8,12l4.6-4.6L8,6.1l-6,6l6,6L9.4,16.6z M14.5,16.6l4.6-4.6l-4.6-4.6L15.9,6l6,6l-6,6L14.5,16.6z"/></g><g id="tune"><path d="M2,17.6v2.2h6.6v-2.2H2z M2,4.3v2.2h11V4.3H2z M13,22v-2.2h8.9v-2.2H13v-2.2h-2.2V22H13z M6.4,8.7V11H2v2.2h4.4v2.2h2.2V8.7H6.4z M21.9,13.1v-2.2h-11v2.2H21.9z M15.3,8.7h2.2V6.5h4.4V4.3h-4.4V2.1h-2.2V8.7z"/></g><g id="unlock"><path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8H9c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M17.6,20.1H6.4v-9.5h11.2V20.1z"/></g><g id="lock"><path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M9,6.8c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H9V6.8z M17.6,20.1H6.4v-9.5h11.2V20.1z"/></g><g id="more_horizontal"><path d="M4.5,9.6C3.1,9.6,2,10.7,2,12.1s1.1,2.5,2.5,2.5S7,13.5,7,12.1S5.9,9.6,4.5,9.6z M19.4,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S20.8,9.6,19.4,9.6z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.6,11.9,9.6z"/></g><g id="more_vertical"><path d="M11.9,7.1c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5S9.5,3.2,9.5,4.6S10.5,7.1,11.9,7.1z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.6,11.9,9.6z M11.9,17.1c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,17.1,11.9,17.1z"/></g><g id="chevron_left"><path d="M18.1,4.4l-2.3-2.3l-10,10l10,10l2.3-2.3l-7.6-7.6L18.1,4.4z"/></g><g id="chevron_up"><path d="M11.9,5.9l-10,10l2.3,2.3l7.6-7.6l7.6,7.6l2.3-2.3L11.9,5.9z"/></g><g id="chevron_down"><path d="M4.3,5.9l7.6,7.6l7.6-7.6l2.3,2.3l-10,10L2,8.2L4.3,5.9z"/></g><g id="chevron_right"><path d="M5.8,19.7l7.6-7.6L5.8,4.4l2.3-2.3l10,10l-10,10L5.8,19.7z"/></g><g id="arrow_left"><path d="M21.9,10.8H6.7l7-7L12,2.1l-10,10l10,10l1.7-1.7l-7-7h15.2V10.8z"/></g><g id="arrow_down"><path d="M21.9,12.1l-1.7-1.7l-7,7V2.1h-2.5v15.2l-7-7L2,12.1l10,10L21.9,12.1z"/></g><g id="arrow_up"><path d="M2,12.1l1.7,1.7l7-7V22h2.5V6.8l7,7l1.7-1.7l-10-10L2,12.1z"/></g><g id="arrow_right"><path d="M2,13.3h15.2l-7,7l1.7,1.7l10-10l-10-10l-1.7,1.7l7,7H2V13.3z"/></g><g id="arrow_end"><polygon points="7.6,3.8 14.6,10.8 2,10.8 2,13.3 14.6,13.3 7.6,20.3 9.4,22 19.3,12.1 9.4,2.1 "/><rect x="19.4" y="2.1" width="2.5" height="19.9"/></g><g id="arrow_home"><polygon points="16.3,20.3 9.3,13.3 21.9,13.3 21.9,10.8 9.3,10.8 16.3,3.8 14.5,2.1 4.6,12.1 14.5,22 "/><rect x="2" y="2.1" width="2.5" height="19.9"/></g><g id="chevron_end"><path d="M2,4.4L9.6,12L2,19.7L4.3,22l10-10L4.3,2L2,4.4z M18.6,2.1h3.3V22h-3.3V2.1z"/></g><g id="chevron_home"><path d="M21.9,19.7l-7.6-7.6l7.6-7.6l-2.3-2.3l-10,10l10,10L21.9,19.7z M5.3,22H2V2.1h3.3V22z"/></g><g id="check"><path d="M8.3,16.5l-4.7-4.7L2,13.3l6.3,6.3L21.9,6.1l-1.6-1.6L8.3,16.5z"/></g><g id="close"><path d="M21.9,4.1l-2-2l-8,8l-8-8l-2,2l8,8l-8,8l2,2l8-8l8,8l2-2l-8-8L21.9,4.1z"/></g><g id="circle"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_minus"><path d="M7,11.1v2h10v-2C16.9,11.1,7,11.1,7,11.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_plus"><path d="M12.9,7.1h-2v4H7v2h4v4h2v-4h4v-2h-4v-4H12.9z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_close"><path d="M14.5,8.1l-2.6,2.6L9.4,8.1L8,9.5l2.6,2.6L8,14.6L9.4,16l2.6-2.6l2.6,2.6l1.4-1.4L13.4,12L16,9.4L14.5,8.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_triangle_right"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/><polygon points="10,16.6 15.9,12.1 10,7.6 "/></g><g id="circle_triangle_down"><path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M4,12.1c0-4.4,3.6-8,8-8s8,3.6,8,8s-3.6,8-8,8S4,16.5,4,12.1z"/><polygon points="7.5,10.1 11.9,16.1 16.4,10.1 "/></g><g id="circle_triangle_left"><path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M11.9,4.1c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S7.5,4.1,11.9,4.1z"/><polygon points="13.9,7.6 8,12.1 13.9,16.6 "/></g><g id="circle_triangle_up"><path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M19.9,12.1c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8S19.9,7.7,19.9,12.1z"/><polygon points="16.4,14.1 11.9,8.1 7.5,14.1 "/></g><g id="triangle_right"><polygon points="9.1,16.5 14.9,12 9.1,7.5 "/></g><g id="triangle_down"><polygon points="7.6,9 11.9,15 16.5,9 "/></g><g id="triangle_left"><polygon points="14.9,7.5 9.1,12 14.9,16.5 "/></g><g id="triangle_up"><polygon points="16.5,15 11.9,9 7.6,15 "/></g><g id="circle_pause"><path d="M9,16.1h2v-8H9V16.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M12.9,16.1h2v-8h-2V16.1z"/></g><g id="circle_info"><path d="M11,17.1h2v-6h-2V17.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11,9.1h2v-2h-2C11,7.1,11,9.1,11,9.1z"/></g><g id="circle_warning"><path d="M11,15.1h2v2h-2V15.1z M11,7.1h2v6h-2V7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_help"><path d="M11,18h2v-2h-2C11,16.1,11,18,11,18z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11.9,6.1c-2.2,0-4,1.8-4,4h2c0-1.1,0.9-2,2-2s2,0.9,2,2c0,2-3,1.8-3,5h2c0-2.3,3-2.5,3-5C15.9,7.9,14.1,6.1,11.9,6.1z"/></g><g id="circle_checked"><path d="M11.9,7.1c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S14.8,7.1,11.9,7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_location"><path d="M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3S15.5,18.4,11.9,18.4z"/></g><g id="circle_location_checked"><path d="M11.9,8.4c-2,0-3.7,1.7-3.7,3.7s1.7,3.7,3.7,3.7s3.7-1.7,3.7-3.7S13.9,8.4,11.9,8.4z M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3S15.5,18.4,11.9,18.4z"/></g><g id="circle_fill"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z"/></g><g id="circle_fill_checked"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,17.1l-5-5l1.4-1.4l3.6,3.6l7.6-7.6L19,8.1L10,17.1z"/></g><g id="circle_fill_minus"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1H7v-2h10v2H16.9z"/></g><g id="circle_fill_plus"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1h-4v4h-2v-4H7v-2h4v-4h2v4h4v2H16.9z"/></g><g id="circle_fill_arrow_down"><path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M7.5,10.1h9l-4.5,6L7.5,10.1z"/></g><g id="circle_fill_arrow_left"><path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M13.9,7.6v9l-6-4.5L13.9,7.6z"/></g><g id="circle_fill_arrow_up"><path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M16.4,14.1h-9l4.5-6L16.4,14.1z"/></g><g id="circle_fill_arrow_right"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,16.6v-9l6,4.5L10,16.6z"/></g><g id="circle_fill_pause"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11,16.1H9v-8h2V16.1z M14.9,16.1h-2v-8h2V16.1z"/></g><g id="circle_fill_info"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-6h2V17.1z M12.9,9.1h-2v-2h2C12.9,7.1,12.9,9.1,12.9,9.1z"/></g><g id="circle_fill_warning"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-2h2V17.1z M12.9,13.1h-2v-6h2C12.9,7.1,12.9,13.1,12.9,13.1z"/></g><g id="circle_fill_help"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,19h-2v-2h2C12.9,17.1,12.9,19,12.9,19z M15,11.4l-0.9,0.9c-0.8,0.7-1.2,1.3-1.2,2.8h-2v-0.6c0-1.1,0.4-2.1,1.2-2.8l1.2-1.3c0.4-0.3,0.6-0.8,0.6-1.4C14,8,13.1,7.1,12,7.1s-2,0.9-2,2H8c0-2.2,1.8-4,4-4s4,1.8,4,4C15.9,10,15.5,10.7,15,11.4z"/></g><g id="circle_fill_group"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M8,17.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S9.4,17.5,8,17.5z M9.5,8.1c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5S9.5,9.5,9.5,8.1z M15.9,17.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S17.3,17.5,15.9,17.5z"/></g><g id="box"><path d="M19.7,4.3v15.5H4.2V4.3H19.7 M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z"/></g><g id="box_fill"><path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z"/></g><g id="box_fill_checked"><path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M9.8,17.6l-5.5-5.5l1.6-1.6l4,4l8.3-8.4l1.6,1.5L9.8,17.6z"/></g><g id="box_fill_minus"><path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.5,13.1H6.4v-2.2h11L17.5,13.1L17.5,13.1z"/></g><path id="box_fill_plus" d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.5,13.1h-4.4v4.4h-2.2v-4.4H6.4v-2.2h4.4V6.5H13v4.4h4.4L17.5,13.1L17.5,13.1z"/><g id="box_fill_gear"><path d="M11.9,9.8c-1.2,0-2.2,1-2.2,2.2s1,2.2,2.2,2.2s2.2-1,2.2-2.2S13.2,9.8,11.9,9.8z M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.8,12.1c0,0.2,0,0.5-0.1,0.7l1.7,1.2c0.2,0.1,0.2,0.3,0.1,0.5l-1.6,2.7c-0.1,0.2-0.3,0.2-0.5,0.2l-1.9-0.7c-0.4,0.3-0.8,0.6-1.3,0.7L14,19.5c0,0.2-0.2,0.3-0.4,0.3h-3.1c-0.2,0-0.3-0.2-0.4-0.3l-0.2-2.1C9.4,17.2,9,17,8.6,16.7l-1.9,0.7c-0.2,0.1-0.4,0-0.5-0.2l-1.5-2.7c-0.1-0.2-0.1-0.4,0.1-0.5l1.7-1.2c-0.1-0.2-0.1-0.5-0.1-0.7s0-0.5,0.1-0.7l-1.7-1.2C4.4,9.9,4.4,9.7,4.5,9.6l1.6-2.7c0.1-0.2,0.2-0.3,0.4-0.2l1.9,0.7c0.4-0.3,0.8-0.6,1.3-0.7L10,4.6c0-0.2,0.2-0.3,0.4-0.3h3.1c0.2,0,0.3,0.2,0.4,0.3l0.2,2.1c0.5,0.2,0.9,0.4,1.3,0.7l1.9-0.7c0.2-0.1,0.4,0,0.5,0.2l1.6,2.7c0.1,0.2,0.1,0.4-0.1,0.5l-1.7,1.2C17.8,11.6,17.8,11.8,17.8,12.1z"/></g><g id="box_focus"><path d="M4.2,15.4H2v4.4C2,21,3,22,4.2,22h4.4v-2.2H4.2V15.4z M4.2,4.3h4.4V2.1H4.2C3,2.1,2,3.1,2,4.3v4.4h2.2V4.3z M19.7,2.1h-4.4v2.2h4.4v4.4h2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M19.7,19.8h-4.4V22h4.4c1.2,0,2.2-1,2.2-2.2v-4.4h-2.2V19.8z M11.9,7.7c-2.4,0-4.4,2-4.4,4.4s2,4.4,4.4,4.4s4.4-2,4.4-4.4S14.4,7.7,11.9,7.7z M11.9,14.3c-1.2,0-2.2-1-2.2-2.2s1-2.2,2.2-2.2s2.2,1,2.2,2.2S13.2,14.3,11.9,14.3z"/></g><g id="rows"><path d="M20.8,13.1H3.1c-0.6,0-1.1,0.5-1.1,1.1v6.6C2,21.5,2.5,22,3.1,22H21c0.6,0,1.1-0.5,1.1-1.1v-6.6C21.9,13.6,21.4,13.1,20.8,13.1z M20.8,2.1H3.1C2.5,2.1,2,2.6,2,3.2v6.6c0,0.6,0.5,1.1,1.1,1.1H21c0.6,0,1.1-0.5,1.1-1.1V3.2C21.9,2.6,21.4,2.1,20.8,2.1z"/></g><g id="columns"><path d="M6.2,2.1H3.1C2.5,2.1,2,2.8,2,3.5v17.1C2,21.4,2.5,22,3.1,22h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C7.2,2.8,6.7,2.1,6.2,2.1z M20.8,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C21.9,2.8,21.4,2.1,20.8,2.1z M13.5,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C14.6,2.8,14.1,2.1,13.5,2.1z"/></g><g id="dashboard"><path d="M2,13.1h8.9v-11H2V13.1z M2,22h8.9v-6.6H2V22z M13,22h8.9V11H13V22z M13,2.1v6.6h8.9V2.1H13z"/></g><g id="layer_add"><path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12C21.9,3,21,2.1,19.9,2.1z M18.9,11.1h-4v4h-2v-4H9v-2h4v-4h2v4h4C18.9,9.1,18.9,11.1,18.9,11.1z"/></g><g id="layer_remove"><path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z"/><path d="M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12C21.9,3,21,2.1,19.9,2.1z M18.9,11.1H9v-2h10v2H18.9z"/></g><g id="layer_to_back"><path d="M8.6,6.5H6.4v2.2h2.2V6.5L8.6,6.5z M8.6,11H6.4v2.2h2.2V11C8.5,11,8.6,11,8.6,11z M8.6,2.1c-1.2,0-2.2,1-2.2,2.2h2.2V2.1L8.6,2.1z M13,15.4h-2.2v2.2H13C13,17.5,13,15.4,13,15.4z M19.8,2.1v2.2H22C21.9,3.1,20.9,2.1,19.8,2.1z M13,2.1h-2.2v2.2H13V2.1z M8.6,17.6v-2.2H6.4C6.4,16.6,7.4,17.6,8.6,17.6z M19.8,13.1H22V11h-2.2V13.1z M19.8,8.7H22V6.5h-2.2V8.7z M19.8,17.6c1.2,0,2.2-1,2.2-2.2h-2.2V17.6z M4.1,6.5H2v13.3C2,21,3,22,4.1,22h13.3v-2.2H4.1C4.1,19.9,4.1,6.5,4.1,6.5z M15.3,4.3h2.2V2.1h-2.2V4.3z M15.3,17.6h2.2v-2.2h-2.2V17.6z"/></g><g id="layer_to_front"><path d="M2,13.1h2.2V11H2V13.1z M2,17.6h2.2v-2.2H2V17.6z M4.1,22v-2.2H2C2,21,3,22,4.1,22z M2,8.7h2.2V6.5H2V8.7z M15.3,22h2.2v-2.2h-2.2V22z M19.8,2.1H8.6c-1.2,0-2.2,1-2.2,2.2v11.1c0,1.2,1,2.2,2.2,2.2h11c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.8,2.1z M19.8,15.4H8.6V4.3h11L19.8,15.4L19.8,15.4z M10.9,22H13v-2.2h-2.2C10.9,19.9,10.9,22,10.9,22z M6.4,22h2.2v-2.2H6.4V22z"/></g><g id="layer_image"><path d="M21.9,16.1v-12c0-1.1-0.9-2-2-2H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12C21,18,21.9,17.1,21.9,16.1z M11,12.1l2,2.7l3-3.7l4,5H8L11,12.1z M2,6.1v14c0,1.1,0.9,2,2,2h14v-2H4v-14C4,6.1,2,6.1,2,6.1z"/></g><g id="image"><path d="M21.9,19.8V4.3c0-1.2-1-2.2-2.2-2.2H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5C20.9,22,21.9,21,21.9,19.8z M8,13.7l2.7,3.3l3.9-5l5,6.6H4.2L8,13.7z"/></g><g id="label_fill"><path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.8,2,5.7,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.4L17.3,5.6z"/></g><g id="label"><path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.7,2,5.6,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.3L17.3,5.6z M15.6,17.3H4.1V6.8h11.5l3.7,5.2L15.6,17.3z"/></g><g id="backspace"><path d="M20.3,4.8H7.8c-0.6,0-1,0.2-1.3,0.7L2,12.1l4.5,6.6c0.3,0.4,0.7,0.7,1.3,0.7h12.5c0.9,0,1.7-0.7,1.7-1.7V6.3C21.9,5.4,21.2,4.8,20.3,4.8z M17.8,15l-1.2,1.2l-3-2.9l-3,2.9L9.5,15l3-2.9l-3-2.9L10.6,8l3,2.9l3-2.9l1.2,1.2l-3,2.9L17.8,15z"/></g><g id="redo"><path d="M18.3,11.2c-1.8-1.6-4.2-2.6-6.7-2.6c-4.6,0-8.3,3-9.7,7.1l2.2,0.7c1-3.1,4-5.3,7.4-5.3c1.9,0,3.7,0.7,5,1.8l-3.6,3.6h9V7.7L18.3,11.2z"/></g><g id="undo"><path d="M12.2,8.6c-2.6,0-4.9,1-6.7,2.6L2,7.7v8.8h8.8L7.2,13c1.3-1.2,3.1-1.8,5-1.8c3.4,0,6.3,2.2,7.4,5.3l2.2-0.8C20.6,11.6,16.8,8.6,12.2,8.6z"/></g><g id="reload"><path d="M19,5c-1.8-1.7-4.3-2.9-7.1-2.9c-5.5,0-10,4.5-10,10s4.5,10,10,10c4.7,0,8.6-3.2,9.6-7.5H19c-1,2.9-3.8,5-7.1,5c-4.2,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c2.1,0,3.9,0.8,5.2,2.2l-4,4h8.7V2.1L19,5z"/></g><g id="grid_fill"><path d="M4,8.1h4v-4H4V8.1z M10,20h4v-4h-4V20z M4,20h4v-4H4V20z M4,14.1h4v-4H4V14.1z M10,14.1h4v-4h-4V14.1z M15.9,4.1v4h4v-4C19.9,4.1,15.9,4.1,15.9,4.1z M10,8.1h4v-4h-4V8.1z M15.9,14.1h4v-4h-4V14.1z M15.9,20h4v-4h-4V20z"/></g><g id="grid"><path d="M19.9,2.1H4c-1.1,0-2,0.9-2,2V20c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2V4.1C21.9,3,21,2.1,19.9,2.1z M8,20H4v-4h4C8,16.1,8,20,8,20z M8,14.1H4v-4h4V14.1z M8,8.1H4v-4h4C8,4.1,8,8.1,8,8.1z M13.9,20h-4v-4h4C13.9,16.1,13.9,20,13.9,20z M13.9,14.1h-4v-4h4V14.1z M13.9,8.1h-4v-4h4C13.9,4.1,13.9,8.1,13.9,8.1z M19.9,20h-4v-4h4C19.9,16.1,19.9,20,19.9,20z M19.9,14.1h-4v-4h4V14.1z M19.9,8.1h-4v-4h4C19.9,4.1,19.9,8.1,19.9,8.1z"/></g><g id="search"><path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-2.9,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1S12.2,14.6,9.5,14.6z"/></g><g id="zoom_in"><path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1S12.2,14.6,9.5,14.6z M12.2,10.1H10v2.2H8.9v-2.2H6.6V9h2.2V6.8H10V9h2.2V10.1L12.2,10.1z"/></g><g id="zoom_out"><path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1S12.2,14.6,9.5,14.6z M6.6,9h5.6v1.2H6.6V9z"/></g><g id="fullscreen"><path d="M4.8,14.9H2V22h7.1v-2.8H4.8V14.9z M2,9.2h2.8V4.9H9V2.1H2V9.2z M19.1,19.2h-4.2V22H22v-7.1h-2.8v4.3H19.1z M14.8,2.1v2.8H19v4.2h2.9v-7H14.8z"/></g><g id="fullscreen_off"><path d="M2,17.8h4.2V22H9v-7.1H2V17.8z M6.2,6.3H2v2.8h7.1v-7H6.2V6.3z M14.8,22h2.8v-4.2h4.3V15h-7.1C14.8,15,14.8,22,14.8,22z M17.7,6.3V2.1h-2.8v7.1H22V6.3H17.7z"/></g><g id="color_palette"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10c0.9,0,1.7-0.7,1.7-1.7c0-0.4-0.2-0.8-0.4-1.1c-0.2-0.3-0.4-0.7-0.4-1.1c0-0.9,0.7-1.7,1.7-1.7h2c3.1,0,5.6-2.5,5.6-5.6C21.9,6.1,17.4,2.1,11.9,2.1z M5.9,12.1c-0.9,0-1.7-0.7-1.7-1.7S5,8.7,5.9,8.7s1.7,0.7,1.7,1.7S6.8,12.1,5.9,12.1z M9.2,7.7C8.3,7.7,7.5,6.9,7.5,6s0.7-1.7,1.7-1.7S10.9,5,10.9,6S10.1,7.7,9.2,7.7z M14.7,7.7C13.8,7.7,13,6.9,13,6s0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7S15.6,7.7,14.7,7.7z M18,12.1c-0.9,0-1.7-0.7-1.7-1.7S17,8.7,18,8.7s1.7,0.7,1.7,1.7S18.9,12.1,18,12.1z"/></g><g id="color_picker"><path d="M21.6,5L19,2.4c-0.4-0.4-1.2-0.4-1.6,0l-3.5,3.5l-2.1-2.2l-1.6,1.6l1.6,1.6L2,16.8V22h5.2l9.9-9.9l1.6,1.6l1.6-1.6L18.1,10l3.5-3.5C22,6.2,22,5.4,21.6,5z M6.3,19.8l-2.2-2.2l9-8.9l2.2,2.2L6.3,19.8z"/></g><g id="trash"><path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M19.7,3.2h-3.9l-1.1-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2L19.7,3.2z"/></g><g id="trash_empty"><path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M8,11.9l1.6-1.5l2.3,2.3l2.3-2.3l1.6,1.6l-2.3,2.3l2.3,2.3l-1.6,1.6l-2.3-2.4l-2.3,2.3L8,16.6l2.3-2.3L8,11.9z M15.9,3.2l-1.2-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2H15.9z"/></g><g id="developer"><path d="M21.9,9V6.9h-2v-2c0-1.2-0.9-2.1-2-2.1H4c-1.1,0-2,0.9-2,2.1v14.4c0,1.2,0.9,2.1,2,2.1h13.9c1.1,0,2-0.9,2-2.1v-2.1H22v-2.1h-2V13h2v-2h-2V9H21.9z M17.9,19.2H4V4.9h13.9V19.2L17.9,19.2z M6,13.1h5v4.1H6V13.1z M11.9,6.9h4V10h-4V6.9z M6,6.9h5V12H6V6.9z M11.9,11.1h4v6.1h-4V11.1z"/></g><g id="hub"><path d="M17.5,16.5L13,12.1V8.6c1.3-0.5,2.2-1.7,2.2-3.2c0-1.8-1.5-3.3-3.3-3.3S8.6,3.6,8.6,5.4c0,1.4,0.9,2.7,2.2,3.2v3.5l-4.4,4.4H2V22h5.6v-3.4l4.4-4.7l4.4,4.7V22H22v-5.6h-4.5V16.5z"/></g><g id="camera"><path d="M9.4,10.6l4.7-8.2c-0.7-0.2-1.4-0.2-2.2-0.2C9.5,2.2,7.3,3,5.6,4.4L9.4,10.6L9.4,10.6z M21.4,9.1c-0.9-2.9-3.2-5.2-6-6.3l-3.7,6.3H21.4z M21.8,10.1h-7.5l0.2,0.5l4.7,8.2c1.7-1.7,2.7-4.2,2.7-6.7C21.9,11.4,21.8,10.7,21.8,10.1z M8.5,12.1L4.6,5.3C3,7.1,2,9.5,2,12.1c0,0.7,0.1,1.3,0.2,2h7.5L8.5,12.1z M2.5,15.1c0.9,2.9,3.2,5.2,6,6.3l3.7-6.3C12.2,15.1,2.5,15.1,2.5,15.1z M13.7,15.1l-3.9,6.7C10.5,22,11.2,22,12,22c2.4,0,4.6-0.8,6.3-2.2l-3.7-6.3C14.6,13.5,13.7,15.1,13.7,15.1z"/></g><g id="camera_alt"><circle cx="11.9" cy="13.1" r="3.2"/><path d="M9,3.1l-1.8,2H4c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2v-12c0-1.1-0.9-2-2-2h-3.2l-1.8-2C14.9,3.1,9,3.1,9,3.1z M11.9,18c-2.7,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.7,18,11.9,18z"/></g><g id="film"><path d="M13.9,5.9c0-1.1-0.9-1.9-2-1.9H11V3c0-0.5-0.4-0.9-0.9-0.9H6.2C5.7,2.1,5.3,2.5,5.3,3v0.9H4.4c-1.1,0-1.9,0.8-1.9,1.9V20c0,1.1,0.8,1.9,1.9,1.9H12c1.1,0,1.9-0.8,1.9-1.9h7.6V5.9H13.9z M11.9,18.2H10v-1.9h1.9V18.2z M11.9,9.7H10V7.8h1.9V9.7z M15.8,18.2h-1.9v-1.9h1.9V18.2z M15.8,9.7h-1.9V7.8h1.9V9.7z M19.5,18.2h-1.9v-1.9h1.9V18.2z M19.5,9.7h-1.9V7.8h1.9V9.7z"/></g><g id="visibility"><path d="M12,5.3c-4.5,0-8.3,2.8-9.9,6.7c1.5,3.9,5.4,6.7,9.9,6.7s8.3-2.8,9.9-6.7C20.3,8,16.5,5.3,12,5.3z M12,16.5c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S14.5,16.5,12,16.5z M12,9.2c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S13.5,9.2,12,9.2z"/></g><g id="visibility_off"><path d="M12,7.4c2.5,0,4.5,2,4.5,4.5c0,0.6-0.1,1.2-0.3,1.7l2.7,2.7c1.3-1.2,2.4-2.6,3.1-4.2c-1.6-4.1-5.4-6.8-9.9-6.8c-1.2,0-2.5,0.2-3.6,0.7l1.9,1.9C10.9,7.5,11.5,7.4,12,7.4z M3.1,4.9l2,2.1l0.4,0.4C4,8.6,2.8,10.2,2.1,11.9c1.6,4,5.4,6.7,9.9,6.7c1.4,0,2.7-0.2,3.9-0.7l0.4,0.4L19,21l1.2-1.2L4.1,3.8L3.1,4.9z M8,9.9l1.4,1.4c-0.1,0.2-0.1,0.4-0.1,0.6c0,1.5,1.2,2.7,2.7,2.7c0.2,0,0.4,0,0.6-0.1L14,16c-0.6,0.3-1.2,0.5-2,0.5c-2.5,0-4.5-2-4.5-4.5C7.5,11.2,7.7,10.5,8,9.9z M11.9,9.2l2.8,2.8v-0.2C14.7,10.4,13.4,9.2,11.9,9.2L11.9,9.2z"/></g><g id="layers"><path d="M11.9,19.5l-7.3-5.7L3,15l8.9,7l9-7l-1.6-1.2L11.9,19.5z M11.9,17l7.3-5.7l1.7-1.2l-9-6.9l-9,7l1.6,1.2L11.9,17z"/></g><g id="layers_off"><path d="M19.7,16l1.2-0.9l-1.4-1.4l-1.2,0.9L19.7,16z M19.3,11.3l1.7-1.2l-9-7L9,5.3l7.8,7.8C16.9,13.1,19.3,11.3,19.3,11.3z M3.3,2.1L2,3.3l4.2,4.2L2.9,10l1.6,1.2l7.3,5.7l2.1-1.6l1.4,1.4L12,19.4l-7.3-5.7l-1.6,1.2l8.9,7l4.9-3.8l3.7,3.7l1.2-1.2L3.3,2.1z"/></g><g id="hamburger"><path d="M20.9,9.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V14c0,0.4,0.5,0.8,1.1,0.8h17.9c0.6,0,1.1-0.3,1.1-0.7V9.9C22,9.4,21.5,9.1,20.9,9.1z M20.9,2.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V7c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7V2.8C22,2.4,21.5,2.1,20.9,2.1z M20.9,16.5H3.2c-0.6,0-1.1,0.3-1.1,0.7v4.2c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7v-4.2C22,16.8,21.5,16.5,20.9,16.5z"/></g></svg>`;IoIconsetSingleton.registerIcons("icons",icons);class IoBoolicon extends IoBoolean{static get Style(){return`
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      fill: var(--io-color, currentcolor);
      padding: 0;
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      pointer-events: none;
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      transform-origin: 0px 0px;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `}static get Properties(){return{true:"icons:box_fill_checked",false:"icons:box",stroke:{value:!1,reflect:1}}}changed(){this.title=this.label,this.innerHTML=IoIconsetSingleton.getIcon(this.value?this.true:this.false)}applyAria(){super.applyAria(),this.setAttribute("aria-checked",String(!!this.value)),this.setAttribute("aria-invalid","boolean"!=typeof this.value&&"true")}}RegisterIoElement(IoBoolicon);class IoSwitch extends IoBoolean{static get Style(){return`
    :host {
      position: relative;
      width: calc(1.5 * var(--io-item-height));
    }
    :host:before {
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      content: '';
      top: var(--io-spacing);
      left: 0;
      width: calc(100% - calc(2 * var(--io-border-width)));
      height: var(--io-line-height);
      border-radius: var(--io-line-height);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      background-color: var(--io-background-color-dark);
      box-shadow: var(--io-shadow-inset);
      transition: background-color 0.4s;
    }
    :host:after {
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      content: '';
      top: calc(var(--io-border-width) + var(--io-spacing));
      left: var(--io-border-width);
      height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
      width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      border-radius: var(--io-line-height);
      transition-timing-function: ease-in-out;
      transition: left 0.25s;
    }
    :host[value]:after {
      background-color: rgba(80, 210, 355, 0.75);
      left: calc(calc(100% - var(--io-line-height)) - var(--io-border-width));
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    :host:hover:before,
    :host[display="switch"][value]:not([aria-invalid]):before {
      background-color: var(--io-background-color);
    }
    :host:focus:before,
    :host:focus:after {
      border-color: var(--io-color-focus);
    }
    :host:focus {
      outline-color: var(--io-color-focus);
    }
    `}changed(){this.title=this.label}applyAria(){super.applyAria(),this.setAttribute("aria-checked",String(!!this.value)),this.setAttribute("aria-invalid","boolean"!=typeof this.value&&"true"),this.setAttribute("aria-label",this.label)}}RegisterIoElement(IoSwitch);class IoString extends IoItem{static get Style(){return`
    :host {
      cursor: text;
      user-select: text;
      -webkit-user-select: text;
      -webkit-touch-callout: default;
      min-width: var(--io-item-height);
      border-color: var(--io-color-border-inset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      box-shadow: var(--io-shadow-inset);
    }
    :host:before,
    :host:after {
      content: ' ';
      white-space: pre;
      visibility: hidden;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `}static get Properties(){return{live:Boolean,value:String,contenteditable:!0,role:"textbox"}}_setFromTextNode(){var e=this.textNode;"string"==typeof this.value&&e!==String(this.value)&&this.set("value",e)}_tryParseFromTextNode(){const e=this.textNode;try{var t=JSON.parse(e.replace(/[\t\n\r ]+/g," "));this.set("value",t)}catch(e){this._setFromTextNode()}}_onBlur(e){super._onBlur(e),this._setFromTextNode(),this.scrollTop=0,this.scrollLeft=0}_onPointerdown(){this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerup",this._onPointerup)}_onPointermove(){}_onPointerup(){this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerup",this._onPointerup),document.activeElement!==this&&(this.focus(),this.setCaretPosition(this.textNode.length))}_onKeyup(e){super._onKeyup(e),this.live&&(e=this.getCaretPosition(),this._setFromTextNode(),this.setCaretPosition(e))}_onKeydown(e){var t=window.getSelection().getRangeAt(0),i=t.startOffset,o=t.endOffset,s=this.childNodes[0]?this.childNodes[0].length:0,t=t.startContainer===t.endContainer&&(t.startContainer===this.childNodes[0]||t.startContainer===this);"Enter"===e.key?(e.preventDefault(),e.shiftKey?this._tryParseFromTextNode():this._setFromTextNode()):"ArrowLeft"===e.key?(e.ctrlKey||t&&i===o&&0===i)&&(e.preventDefault(),this.focusTo("left")):"ArrowUp"===e.key?(e.ctrlKey||t&&i===o&&0===i)&&(e.preventDefault(),this.focusTo("up")):"ArrowRight"===e.key?(e.ctrlKey||t&&i===o&&i===s)&&(e.preventDefault(),this.focusTo("right")):"ArrowDown"===e.key&&(e.ctrlKey||t&&i===o&&i===s)&&(e.preventDefault(),this.focusTo("down"))}changed(){this.title=this.label,this.textNode=String(this.value).replace(new RegExp(" ","g")," ")}applyAria(){super.applyAria(),this.setAttribute("aria-invalid","string"!=typeof this.value&&"true")}}RegisterIoElement(IoString);let lastFocus=null;window.addEventListener("focusin",()=>{lastFocus=document.activeElement},{capture:!1}),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement===document.body&&(lastFocus=null)})},{capture:!0});class IoLadderStep extends IoItem{static get Style(){return`
    :host {
      pointer-events: all;
      display: inline-block;
      cursor: ew-resize;
      text-align: center;
      background-color: var(--io-background-color-highlight);
      color: var(--io-color);
      align-self: stretch;
      touch-action: none;
      width: 6em;
    }
    :host:before {
      float: left;
      content: '<';
      opacity: 0.25;
    }
    :host:after {
      float: right;
      content: '>';
      opacity: 0.25;
    }
    `}static get Properties(){return{role:"spinbutton",type:{value:"number",reflect:1}}}_onKeydown(e){let t=0;"Escape"===e.key||" "===e.key?this.dispatchEvent("ladder-step-collapse",{},!0):"ArrowLeft"===e.key||"Backspace"===e.key?(e.preventDefault(),t=-1*this.value):"ArrowUp"===e.key?(e.preventDefault(),this.focusTo("up")):"ArrowRight"===e.key||"Enter"===e.key?(e.preventDefault(),t=+this.value):"ArrowDown"===e.key&&(e.preventDefault(),this.focusTo("down")),0!==t&&(this.dispatchEvent("ladder-step-change",{step:Number(t.toFixed(5)),round:e.shiftKey},!0),this.setAttribute("aria-valuenow",this.parentElement.value))}_onPointerdown(e){this.setPointerCapture(e.pointerId),this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerup",this._onPointerup),this._startX=e.clientX}_onPointermove(e){var t=e.clientX-this._startX;if(5<Math.abs(t)){var i=Math.pow(t/5,2)*t<0?-1:1,i=0<t?Math.floor(i):Math.ceil(i);const o=this.value*i;this._startX=e.clientX,this.dispatchEvent("ladder-step-change",{step:Number(o.toFixed(5)),round:e.shiftKey},!0)}}_onPointerup(e){this.releasePointerCapture(e.pointerId),this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerup",this._onPointerup),this.dispatchEvent("ladder-step-collapse",{},!0)}applyAria(){super.applyAria(),this.setAttribute("aria-valuemax",this.parentElement.max),this.setAttribute("aria-valuemin",this.parentElement.min),this.setAttribute("aria-valuenow",this.parentElement.value)}}RegisterIoElement(IoLadderStep);class IoLadder extends IoElement{static get Style(){return`
    :host {
      position: relative;
      pointer-events: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      display: flex;
      flex-direction: column;
    }
    :host:not([expanded]) {
      visibility: hidden;
    }
    :host:not([expanded]) > io-ladder-step {
      opacity: 0.5;
    }
    :host > io-ladder-step:nth-child(-n+5) {
      box-shadow: 0 -1px 4px rgba(0,0,0,0.2);
    }
    :host > io-ladder-step:nth-child(n+6) {
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    :host > .io-up1,
    :host > .io-down1{
      z-index: 4;
      transition: opacity 0.1s, transform 0.1s;
    }
    :host > .io-up2,
    :host > .io-down2 {
      z-index: 3;
      opacity: 0.8;
      transition: opacity 0.2s, transform 0.2s;
    }
    :host:not([expanded]) > .io-up4 {
      transform: translateY(calc(3 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-up3 {
      transform: translateY(calc(2 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-up2 {
      transform: translateY(calc(1 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down2 {
      transform: translateY(calc(-1 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down3 {
      transform: translateY(calc(-2 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down4 {
      transform: translateY(calc(-3 * var(--io-item-height)));
    }
    :host > .io-up3,
    :host > .io-down3 {
      z-index: 2;
      opacity: 0.6;
      transition: opacity 0.4s, transform 0.4s;
    }
    :host > .io-up4,
    :host > .io-down4 {
      z-index: 1;
      opacity: 0.4;
      transition: opacity 0.8s, transform 0.8s;
    }
    :host > io-ladder-step:hover,
    :host > io-ladder-step:focus {
      background-color: var(--io-background-color-highlight);
      border-color: var(--io-color-focus);
      transition: opacity 0.2s;
      opacity: 1;
    }
    :host > .io-ladder-empty {
      height: var(--io-item-height);
    }
    :host > .io-ladder-center {
      height: calc(1.5 * var(--io-item-height));
    }
    `}static get Properties(){return{src:null,conversion:1,expanded:{type:Boolean,reflect:1},min:-1/0,max:1/0,step:1e-4,role:"list"}}static get Listeners(){return{"ladder-step-change":"_onLadderStepChange","ladder-step-collapse":"_onLadderStepCollapse",focusin:"_onFocusIn"}}get value(){return this.src?this.src.value:0}_onFocusIn(e){e.stopPropagation()}_onFocusTo(e){e.stopPropagation();var t=e.composedPath()[0];const i=this.src;var o=e.detail.dir;if(i&&(t===this.querySelector(".io-up1")&&"down"===o||t===this.querySelector(".io-down1")&&"up"===o))return i.focus(),void(i.selectionStart=i.selectionEnd=i.textNode.length);super._onFocusTo(e)}_onLadderStepChange(t){const i=this.src;if(this.src){var o=t.detail.step,t=t.detail.round?Math.round(this.value/o)*o:this.value;let e=Math.min(this.max,Math.max(this.min,t+o));e=Number(e.toFixed(5)),i.set("value",e)}}_onLadderStepCollapse(){this.set("expanded",!1)}srcChanged(){var e=this.src;e&&this.setProperties({min:e.min,max:e.max,step:e.step,conversion:e.conversion})}expandedChanged(){const e=this.src;var t,i;this.expanded?e?(t=e.getBoundingClientRect(),i=IoLayerSingleton.getBoundingClientRect(),this.style.top=t.bottom-i.top+"px",this.style.left=t.left-i.left+"px",this.style.position="absolute",this.style.marginTop="calc(-5.25 * var(--io-item-height))"):this.removeAttribute("style"):e&&"touch"!==e._pointerType?e.focus():lastFocus&&lastFocus.focus(),this.dispatchEvent("expanded",{value:this.expanded},!0)}changed(){var e=this.max-this.min,t=["span",{class:"io-ladder-empty"}];let i=this.step/1e4;for(;i<.1;)i*=10;var o=1e4*i,s=1e3*i,r=100*i,n=10*i,a=+i,l=.1*i,h=.01*i,c=.001*i,d=Number((o*this.conversion).toFixed(6)),u=Number((s*this.conversion).toFixed(6)),p=Number((r*this.conversion).toFixed(6)),g=Number((n*this.conversion).toFixed(6)),v=Number((a*this.conversion).toFixed(6)),m=Number((l*this.conversion).toFixed(6)),f=Number((h*this.conversion).toFixed(6)),b=Number((c*this.conversion).toFixed(6));this.template([o<=e?["io-ladder-step",{class:"io-up4",value:o,label:String(d)}]:t,s<=e?["io-ladder-step",{class:"io-up3",value:s,label:String(u)}]:t,r<=e?["io-ladder-step",{class:"io-up2",value:r,label:String(p)}]:t,n<=e?["io-ladder-step",{class:"io-up1",value:n,label:String(g)}]:t,["span",{class:"io-ladder-center"}],this.step<=a?["io-ladder-step",{class:"io-down1",value:a,label:String(v)}]:t,this.step<=l?["io-ladder-step",{class:"io-down2",value:l,label:String(m)}]:t,this.step<=h?["io-ladder-step",{class:"io-down3",value:h,label:String(f)}]:t,this.step<=c?["io-ladder-step",{class:"io-down4",value:c,label:String(b)}]:t]);const _=this.querySelectorAll("io-ladder-step");for(let e=_.length;e--;)_[e].applyAria()}}RegisterIoElement(IoLadder);const IoLadderSingleton=new IoLadder;IoLayerSingleton.appendChild(IoLadderSingleton);class IoNumber extends IoItem{static get Style(){return`
    :host {
      cursor: text;
      user-select: text;
      -webkit-user-select: text;
      -webkit-touch-callout: default;
      min-width: var(--io-item-height);
      border-color: var(--io-color-border-inset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      box-shadow: var(--io-shadow-inset);
    }
    :host:before,
    :host:after {
      content: ' ';
      white-space: pre;
      visibility: hidden;
    }
    :host:before {
      content: '-';
    }
    :host:not([positive]):before {
      content: ' ';
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `}static get Properties(){return{value:Number,conversion:1,step:.001,min:-1/0,max:1/0,ladder:!1,contenteditable:!0,role:"textbox",type:{value:"number",reflect:1},pattern:{value:'pattern="[0-9]*"',reflect:1},inputmode:{value:"numeric",reflect:1},spellcheck:{value:"false",reflect:1}}}constructor(e={}){super(e),Object.defineProperty(this,"_pointer",{enumerable:!1,writable:!0,value:"touch"})}_onPointerdown(e){"touch"===this._pointer&&e.preventDefault(),this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerup",this._onPointerup),document.activeElement===this&&0===e.button||(this._pointer=e.pointerType)}_onPointerup(e){this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerup",this._onPointerup),this.ladder||1===e.button?("touch"===this._pointer?(e.preventDefault(),document.activeElement.blur()):document.activeElement!==this&&(this.focus(),this.setCaretPosition(this.textNode.length)),this._expandLadder()):document.activeElement!==this&&(this.focus(),this.setCaretPosition(this.textNode.length))}_onFocus(e){super._onFocus(e),"touch"===this._pointer&&(IoLadderSingleton.expanded=!1)}_onBlur(e){super._onBlur(e),this._setFromTextNode(),this.scrollTop=0,this.scrollLeft=0,setTimeout(()=>{document.activeElement.parentElement!==IoLadderSingleton&&(IoLadderSingleton.expanded=!1)})}_expandLadder(){IoLadderSingleton.src=this,IoLadderSingleton.expanded=!0}_onKeydown(e){var t=window.getSelection().getRangeAt(0),i=t.startOffset,o=t.endOffset,s=this.childNodes[0]?this.childNodes[0].length:0,t=t.startContainer===t.endContainer&&(t.startContainer===this.childNodes[0]||t.startContainer===this);if(27===e.which||13===e.which||32===e.which)e.preventDefault(),this._setFromTextNode();else if(36===e.which)this.textNode=this.min,this._setFromTextNode();else if(35===e.which)this.textNode=this.max,this._setFromTextNode();else if(33===e.which){var r=Number(this.textNode);"number"==typeof r&&!isNaN(r)&&Math.abs(r)<1/0?this.textNode=Number(this.textNode)+this.step:this.textNode=this.step,this._setFromTextNode()}else if(34===e.which){r=Number(this.textNode);"number"==typeof r&&!isNaN(r)&&Math.abs(r)<1/0?this.textNode=Number(this.textNode)-this.step:this.textNode=-this.step,this._setFromTextNode()}else if(37===e.which)(e.ctrlKey||t&&i===o&&0===i)&&(e.preventDefault(),this.focusTo("left"));else if(38===e.which)if(IoLadderSingleton.expanded){const n=IoLadderSingleton.querySelector(".io-up1");n&&n.focus()}else(e.ctrlKey||t&&i===o&&0===i)&&(e.preventDefault(),this.focusTo("up"));else if(39===e.which)(e.ctrlKey||t&&i===o&&i===s)&&(e.preventDefault(),this.focusTo("right"));else if(40===e.which)if(IoLadderSingleton.expanded){const a=IoLadderSingleton.querySelector(".io-down1");a&&a.focus()}else(e.ctrlKey||t&&i===o&&i===s)&&(e.preventDefault(),this.focusTo("down"))}_onKeyup(e){17===e.which?this._expandLadder():27!==e.which&&13!==e.which&&32!==e.which||(IoLayerSingleton.expanded=!1)}_setFromTextNode(){var e=this.textNode;let t=Number(e)/this.conversion;t=Math.min(this.max,Math.max(this.min,t)),t=Math.round(t/this.step)*this.step;e=Math.max(0,Math.min(100,-Math.floor(Math.log(this.step)/Math.LN10)));t=Number(t.toFixed(e)),isNaN(t)?this.textNode="NaN":this.set("value",t)}changed(){this.title=this.label;let e=this.value,t;var i;t="number"!=typeof e||isNaN(e)?"NaN":(e*=this.conversion,i=-Math.floor(Math.log(this.step*this.conversion)/Math.LN10),i=Math.max(0,Math.min(100,i)),e=e.toFixed(i),Number(String(e))),this.textNode=t,this.setAttribute("positive",0<=this.value)}applyAria(){super.applyAria(),this.setAttribute("aria-invalid",!("number"==typeof this.value&&!isNaN(this.value))&&"true")}}RegisterIoElement(IoNumber);class IoSliderRange extends IoSlider{static get Properties(){return{value:{type:Array,value:[0,0],observe:!0}}}_onPointerdown(e){super._onPointerdown(e);var t=this._getPointerCoord(e),i=this._getCoordFromValue(Math.min(this.max,Math.max(this.min,this.value[0]))),e=this._getCoordFromValue(Math.min(this.max,Math.max(this.min,this.value[1])));this.horizontal?this._index=Math.abs(i-t[0])<Math.abs(e-t[0])?0:1:this._index=Math.abs(i-t[1])<Math.abs(e-t[1])?0:1}_onPointermoveThrottled(e){var t;1===this._active&&(document.activeElement!==this&&this.focus(),t=this._getPointerCoord(e),e=this._getValueFromCoord(t[0]),t=this._getValueFromCoord(t[1]),0===this._index?this._setValue(this.horizontal?e:t,this.value[1]):1===this._index&&this._setValue(this.value[0],this.horizontal?e:t))}_setValue(e,t){this.set("value",[Number(e.toFixed(5)),Number(t.toFixed(5))])}_onKeydown(e){switch(e.key){case"ArrowLeft":e.preventDefault(),e.shiftKey?this._setDecrease():this.focusTo("left");break;case"ArrowUp":e.preventDefault(),e.shiftKey?this._setIncrease():this.focusTo("up");break;case"ArrowRight":e.preventDefault(),e.shiftKey?this._setIncrease():this.focusTo("right");break;case"ArrowDown":e.preventDefault(),e.shiftKey?this._setDecrease():this.focusTo("down");break;case"PageUp":case"+":e.preventDefault(),this._setIncrease();break;case"PageDown":case"-":e.preventDefault(),this._setDecrease();break;case"Home":e.preventDefault(),this._setMin()}}_setIncrease(){var e=this.value[0]+this.step,t=this.value[1]+this.step,e=Math.min(this.max,Math.max(this.min,e)),t=Math.min(this.max,Math.max(this.min,t));this._setValue(e,t)}_setDecrease(){var e=this.value[0]-this.step,t=this.value[1]-this.step,e=Math.min(this.max,Math.max(this.min,e)),t=Math.min(this.max,Math.max(this.min,t));this._setValue(e,t)}_setMin(){var e=this.min,t=this.min,e=Math.min(this.max,Math.max(this.min,e)),t=Math.min(this.max,Math.max(this.min,t));this._setValue(e,t)}_setMax(){var e=this.max,t=this.max,e=Math.min(this.max,Math.max(this.min,e)),t=Math.min(this.max,Math.max(this.min,t));this._setValue(e,t)}applyAria(){super.applyAria(),this.setAttribute("aria-invalid",!(this.value instanceof Array&&2===this.value.length)&&"true"),this.setAttribute("aria-valuemin",this.min),this.setAttribute("aria-valuemax",this.max),this.setAttribute("aria-valuestep",this.step)}static get Frag(){return`
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = cssBackgroundColorField.rgb;

      vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
      vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
      vec2 position = size * uv;


      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

      float lineWidth = cssStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        // TODO: grid with exponent
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      float knobRadius = cssItemHeight * 0.25;
      float slotWidth = cssItemHeight * 0.125;

      float valueInRangeStart = (uValue[0] - uMin) / (uMax - uMin);
      float signStart = valueInRangeStart < 0.0 ? -1.0 : 1.0;
      valueInRangeStart = abs(pow(valueInRangeStart, 1./uExponent)) * signStart;

      float valueInRangeEnd = (uValue[1] - uMin) / (uMax - uMin);
      float signEnd = valueInRangeEnd < 0.0 ? -1.0 : 1.0;
      valueInRangeEnd = abs(pow(valueInRangeEnd, 1./uExponent)) * signEnd;

      float grad = 0.5;
      if (valueInRangeEnd > valueInRangeStart) {
        grad = (uv.x - valueInRangeStart) / max(valueInRangeEnd - valueInRangeStart, 0.01);
      } else if (valueInRangeEnd < valueInRangeStart) {
        grad = 1.0 - (uv.x - valueInRangeEnd) / max(valueInRangeStart - valueInRangeEnd, 0.01);
      }
      vec4 slotGradient = mix(cssColorFocus, cssColorLink, saturate(grad));

      vec2 sliderStart = vec2(size.x * min(2.0, max(-1.0, (valueInRangeStart))), size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRangeEnd))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`}}RegisterIoElement(IoSliderRange);class IoNumberSlider extends IoElement{static get Style(){return`
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      flex: 0 0 calc(2 * var(--io-item-height));
      margin-right: var(--io-spacing);
    }
    :host > io-slider {
      flex: 1 1 calc(2 * var(--io-item-height));
      min-width: calc(2 * var(--io-item-height));
    }
    `}static get Properties(){return{value:0,step:.01,conversion:1,min:0,max:1,exponent:1}}_onNumberSet(e){this.value=e.detail.value,this.dispatchEvent("value-set",e.detail,!1)}_onSliderSet(e){e.detail.value=e.detail.value/this.conversion,this.value=e.detail.value,this.dispatchEvent("value-set",e.detail,!1)}changed(){this.template([["io-number",{id:"number",value:this.value,step:this.step,conversion:this.conversion,label:this.label,"on-value-set":this._onNumberSet}],["io-slider",{id:"slider",value:this.value*this.conversion,step:this.step*this.conversion,min:this.min*this.conversion,max:this.max*this.conversion,exponent:this.exponent,label:this.label,"on-value-set":this._onSliderSet}]])}}RegisterIoElement(IoNumberSlider);class IoNumberSliderRange extends IoElement{static get Style(){return`
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      flex: 0 0 calc(2 * var(--io-item-height));
    }
    :host > io-slider-range {
      margin-left: var(--io-spacing);
      margin-right: var(--io-spacing);
      flex: 1 1 calc(2 * var(--io-item-height));
      min-width: calc(2 * var(--io-item-height));
    }
    `}static get Properties(){return{value:{type:Array,value:[0,0],observe:!0},step:.01,conversion:1,min:0,max:1,exponent:1}}_onNumberSet(e){var t=e.composedPath()[0];t===this.$.number0&&(this.value[0]=e.detail.value),t===this.$.number1&&(this.value[1]=e.detail.value),e.detail.value=this.value,this.dispatchEvent("value-set",e.detail,!1)}_onSliderSet(e){this.value=e.detail.value,this.dispatchEvent("value-set",e.detail,!1)}changed(){this.template([["io-number",{id:"number0",value:this.value[0],step:this.step,conversion:this.conversion,label:this.label,"on-value-set":this._onNumberSet}],["io-slider-range",{id:"slider",value:this.value,step:this.step,min:this.min,max:this.max,exponent:this.exponent,label:this.label,"on-value-set":this._onSliderSet}],["io-number",{id:"number1",value:this.value[1],step:this.step,conversion:this.conversion,label:this.label,"on-value-set":this._onNumberSet}]])}}RegisterIoElement(IoNumberSliderRange);class IoIcon extends IoElement{static get Style(){return`
    :host {
      @apply --io-item;
    }
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      border: 0;
      padding: 0;
      fill: var(--io-color, currentcolor);
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      pointer-events: none;
      transform-origin: 0px 0px;
    }
    `}static get Properties(){return{icon:{value:"",reflect:-1},label:{value:"",reflect:1},stroke:{value:!1,reflect:1}}}iconChanged(){this.innerHTML=IoIconsetSingleton.getIcon(this.icon)}}function createCommonjsModule(e,t){return e(t={exports:{}},t.exports),t.exports}RegisterIoElement(IoIcon);let defaults=createCommonjsModule(function(t){function e(){return{baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,xhtml:!1}}t.exports={defaults:e(),getDefaults:e,changeDefaults:function(e){t.exports.defaults=e}}});defaults.defaults,defaults.getDefaults,defaults.changeDefaults;const escapeTest=/[&<>"']/,escapeReplace=/[&<>"']/g,escapeTestNoEncode=/[<>"']|&(?!#?\w+;)/,escapeReplaceNoEncode=/[<>"']|&(?!#?\w+;)/g,escapeReplacements={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},getEscapeReplacement=e=>escapeReplacements[e];function escape(e,t){if(t){if(escapeTest.test(e))return e.replace(escapeReplace,getEscapeReplacement)}else if(escapeTestNoEncode.test(e))return e.replace(escapeReplaceNoEncode,getEscapeReplacement);return e}const unescapeTest=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function unescape(e){return e.replace(unescapeTest,(e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):"")}const caret=/(^|[^\[])\^/g;function edit(i,e){i=i.source||i,e=e||"";const o={replace:(e,t)=>(t=(t=t.source||t).replace(caret,"$1"),i=i.replace(e,t),o),getRegex:()=>new RegExp(i,e)};return o}const nonWordAndColonTest=/[^\w:]/g,originIndependentUrl=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function cleanUrl(e,t,i){if(e){let e;try{e=decodeURIComponent(unescape(i)).replace(nonWordAndColonTest,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!originIndependentUrl.test(i)&&(i=resolveUrl(t,i));try{i=encodeURI(i).replace(/%25/g,"%")}catch(e){return null}return i}const baseUrls={},justDomain=/^[^:]+:\/*[^/]*$/,protocol=/^([^:]+:)[\s\S]*$/,domain=/^([^:]+:\/*[^/]*)[\s\S]*$/;function resolveUrl(e,t){baseUrls[" "+e]||(justDomain.test(e)?baseUrls[" "+e]=e+"/":baseUrls[" "+e]=rtrim(e,"/",!0));var i=-1===(e=baseUrls[" "+e]).indexOf(":");return"//"===t.substring(0,2)?i?t:e.replace(protocol,"$1")+t:"/"===t.charAt(0)?i?t:e.replace(domain,"$1")+t:e+t}const noopTest={exec:function(){}};function merge(e){let t=1,i,o;for(;t<arguments.length;t++)for(o in i=arguments[t])Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o]);return e}function splitCells(e,t){const i=e.replace(/\|/g,(e,t,i)=>{let o=!1,s=t;for(;0<=--s&&"\\"===i[s];)o=!o;return o?"|":" |"}),o=i.split(/ \|/);let s=0;if(o.length>t)o.splice(t);else for(;o.length<t;)o.push("");for(;s<o.length;s++)o[s]=o[s].trim().replace(/\\\|/g,"|");return o}function rtrim(e,t,i){var o=e.length;if(0===o)return"";let s=0;for(;s<o;){var r=e.charAt(o-s-1);if(r!==t||i){if(r===t||!i)break;s++}else s++}return e.substr(0,o-s)}function findClosingBracket(e,t){if(-1===e.indexOf(t[1]))return-1;var i=e.length;let o=0,s=0;for(;s<i;s++)if("\\"===e[s])s++;else if(e[s]===t[0])o++;else if(e[s]===t[1]&&(o--,o<0))return s;return-1}function checkSanitizeDeprecation(e){e&&e.sanitize&&e.silent}let helpers={escape:escape,unescape:unescape,edit:edit,cleanUrl:cleanUrl,resolveUrl:resolveUrl,noopTest:noopTest,merge:merge,splitCells:splitCells,rtrim:rtrim,findClosingBracket:findClosingBracket,checkSanitizeDeprecation:checkSanitizeDeprecation};const{noopTest:noopTest$1,edit:edit$1,merge:merge$1}=helpers,block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,hr:/^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:"^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",def:/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,nptable:noopTest$1,table:noopTest$1,lheading:/^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};block.def=edit$1(block.def).replace("label",block._label).replace("title",block._title).getRegex(),block.bullet=/(?:[*+-]|\d{1,9}\.)/,block.item=/^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/,block.item=edit$1(block.item,"gm").replace(/bull/g,block.bullet).getRegex(),block.list=edit$1(block.list).replace(/bull/g,block.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+block.def.source+")").getRegex(),block._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",block._comment=/<!--(?!-?>)[\s\S]*?-->/,block.html=edit$1(block.html,"i").replace("comment",block._comment).replace("tag",block._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),block.paragraph=edit$1(block._paragraph).replace("hr",block.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",block._tag).getRegex(),block.blockquote=edit$1(block.blockquote).replace("paragraph",block.paragraph).getRegex(),block.normal=merge$1({},block),block.gfm=merge$1({},block.normal,{nptable:"^ *([^|\\n ].*\\|.*)\\n *([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",table:"^ *\\|(.+)\\n *\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),block.gfm.nptable=edit$1(block.gfm.nptable).replace("hr",block.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",block._tag).getRegex(),block.gfm.table=edit$1(block.gfm.table).replace("hr",block.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag",block._tag).getRegex(),block.pedantic=merge$1({},block.normal,{html:edit$1("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",block._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,fences:noopTest$1,paragraph:edit$1(block.normal._paragraph).replace("hr",block.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",block.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});const inline={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:noopTest$1,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,nolink:/^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,strong:/^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,em:/^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:noopTest$1,text:/^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/,_punctuation:"!\"#$%&'()*+,\\-./:;<=>?@\\[^_{|}~"};inline.em=edit$1(inline.em).replace(/punctuation/g,inline._punctuation).getRegex(),inline._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,inline._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,inline._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,inline.autolink=edit$1(inline.autolink).replace("scheme",inline._scheme).replace("email",inline._email).getRegex(),inline._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,inline.tag=edit$1(inline.tag).replace("comment",block._comment).replace("attribute",inline._attribute).getRegex(),inline._label=/(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,inline._href=/<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/,inline._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,inline.link=edit$1(inline.link).replace("label",inline._label).replace("href",inline._href).replace("title",inline._title).getRegex(),inline.reflink=edit$1(inline.reflink).replace("label",inline._label).getRegex(),inline.normal=merge$1({},inline),inline.pedantic=merge$1({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,link:edit$1(/^!?\[(label)\]\((.*?)\)/).replace("label",inline._label).getRegex(),reflink:edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",inline._label).getRegex()}),inline.gfm=merge$1({},inline.normal,{escape:edit$1(inline.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^~+(?=\S)([\s\S]*?\S)~+/,text:/^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/}),inline.gfm.url=edit$1(inline.gfm.url,"i").replace("email",inline.gfm._extended_email).getRegex(),inline.breaks=merge$1({},inline.gfm,{br:edit$1(inline.br).replace("{2,}","*").getRegex(),text:edit$1(inline.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});let rules={block:block,inline:inline};const defaults$1=defaults["defaults"],block$1=rules["block"],{rtrim:rtrim$1,splitCells:splitCells$1,escape:escape$1}=helpers;let Lexer_1=class E8{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||defaults$1,this.rules=block$1.normal,this.options.pedantic?this.rules=block$1.pedantic:this.options.gfm&&(this.rules=block$1.gfm)}static get rules(){return block$1}static lex(e,t){const i=new E8(t);return i.lex(e)}lex(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    "),this.token(e,!0)}token(e,t){e=e.replace(/^ +$/gm,"");let i,o,s,r,n,a,l,h,c,d,u,p,g,v,m,f;for(;e;)if((s=this.rules.newline.exec(e))&&(e=e.substring(s[0].length),1<s[0].length&&this.tokens.push({type:"space"})),s=this.rules.code.exec(e)){const b=this.tokens[this.tokens.length-1];e=e.substring(s[0].length),b&&"paragraph"===b.type?b.text+="\n"+s[0].trimRight():(s=s[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",codeBlockStyle:"indented",text:this.options.pedantic?s:rtrim$1(s,"\n")}))}else if(s=this.rules.fences.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"code",lang:s[2]&&s[2].trim(),text:s[3]||""});else if(s=this.rules.heading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:s[1].length,text:s[2]});else if((s=this.rules.nptable.exec(e))&&(a={type:"table",header:splitCells$1(s[1].replace(/^ *| *\| *$/g,"")),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3]?s[3].replace(/\n$/,"").split("\n"):[]},a.header.length===a.align.length)){for(e=e.substring(s[0].length),u=0;u<a.align.length;u++)/^ *-+: *$/.test(a.align[u])?a.align[u]="right":/^ *:-+: *$/.test(a.align[u])?a.align[u]="center":/^ *:-+ *$/.test(a.align[u])?a.align[u]="left":a.align[u]=null;for(u=0;u<a.cells.length;u++)a.cells[u]=splitCells$1(a.cells[u],a.header.length);this.tokens.push(a)}else if(s=this.rules.hr.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"hr"});else if(s=this.rules.blockquote.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"blockquote_start"}),s=s[0].replace(/^ *> ?/gm,""),this.token(s,t),this.tokens.push({type:"blockquote_end"});else if(s=this.rules.list.exec(e)){for(e=e.substring(s[0].length),v=1<(r=s[2]).length,l={type:"list_start",ordered:v,start:v?+r:"",loose:!1},this.tokens.push(l),s=s[0].match(this.rules.item),h=[],i=!1,g=s.length,u=0;u<g;u++)a=s[u],d=a.length,a=a.replace(/^ *([*+-]|\d+\.) */,""),~a.indexOf("\n ")&&(d-=a.length,a=this.options.pedantic?a.replace(/^ {1,4}/gm,""):a.replace(new RegExp("^ {1,"+d+"}","gm"),"")),u!==g-1&&(n=block$1.bullet.exec(s[u+1])[0],(1<r.length?1===n.length:1<n.length||this.options.smartLists&&n!==r)&&(e=s.slice(u+1).join("\n")+e,u=g-1)),o=i||/\n\n(?!\s*$)/.test(a),u!==g-1&&(i="\n"===a.charAt(a.length-1),o=o||i),o&&(l.loose=!0),m=/^\[[ xX]\] /.test(a),f=void 0,m&&(f=" "!==a[1],a=a.replace(/^\[[ xX]\] +/,"")),c={type:"list_item_start",task:m,checked:f,loose:o},h.push(c),this.tokens.push(c),this.token(a,!1),this.tokens.push({type:"list_item_end"});if(l.loose)for(g=h.length,u=0;u<g;u++)h[u].loose=!0;this.tokens.push({type:"list_end"})}else if(s=this.rules.html.exec(e))e=e.substring(s[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===s[1]||"script"===s[1]||"style"===s[1]),text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(s[0]):escape$1(s[0]):s[0]});else if(t&&(s=this.rules.def.exec(e)))e=e.substring(s[0].length),s[3]&&(s[3]=s[3].substring(1,s[3].length-1)),p=s[1].toLowerCase().replace(/\s+/g," "),this.tokens.links[p]||(this.tokens.links[p]={href:s[2],title:s[3]});else if((s=this.rules.table.exec(e))&&(a={type:"table",header:splitCells$1(s[1].replace(/^ *| *\| *$/g,"")),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3]?s[3].replace(/\n$/,"").split("\n"):[]},a.header.length===a.align.length)){for(e=e.substring(s[0].length),u=0;u<a.align.length;u++)/^ *-+: *$/.test(a.align[u])?a.align[u]="right":/^ *:-+: *$/.test(a.align[u])?a.align[u]="center":/^ *:-+ *$/.test(a.align[u])?a.align[u]="left":a.align[u]=null;for(u=0;u<a.cells.length;u++)a.cells[u]=splitCells$1(a.cells[u].replace(/^ *\| *| *\| *$/g,""),a.header.length);this.tokens.push(a)}else if(s=this.rules.lheading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:"="===s[2].charAt(0)?1:2,text:s[1]});else if(t&&(s=this.rules.paragraph.exec(e)))e=e.substring(s[0].length),this.tokens.push({type:"paragraph",text:"\n"===s[1].charAt(s[1].length-1)?s[1].slice(0,-1):s[1]});else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"text",text:s[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens}};const defaults$2=defaults["defaults"],{cleanUrl:cleanUrl$1,escape:escape$2}=helpers;let Renderer_1=class{constructor(e){this.options=e||defaults$2}code(e,t,i){var o=(t||"").match(/\S*/)[0];return!this.options.highlight||null!=(t=this.options.highlight(e,o))&&t!==e&&(i=!0,e=t),o?'<pre><code class="'+this.options.langPrefix+escape$2(o,!0)+'">'+(i?e:escape$2(e,!0))+"</code></pre>\n":"<pre><code>"+(i?e:escape$2(e,!0))+"</code></pre>"}blockquote(e){return"<blockquote>\n"+e+"</blockquote>\n"}html(e){return e}heading(e,t,i,o){return this.options.headerIds?"<h"+t+' id="'+this.options.headerPrefix+o.slug(i)+'">'+e+"</h"+t+">\n":"<h"+t+">"+e+"</h"+t+">\n"}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,i){var o=t?"ol":"ul";return"<"+o+(t&&1!==i?' start="'+i+'"':"")+">\n"+e+"</"+o+">\n"}listitem(e){return"<li>"+e+"</li>\n"}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return"<p>"+e+"</p>\n"}table(e,t){return"<table>\n<thead>\n"+e+"</thead>\n"+(t=t&&"<tbody>"+t+"</tbody>")+"</table>\n"}tablerow(e){return"<tr>\n"+e+"</tr>\n"}tablecell(e,t){var i=t.header?"th":"td";return(t.align?"<"+i+' align="'+t.align+'">':"<"+i+">")+e+"</"+i+">\n"}strong(e){return"<strong>"+e+"</strong>"}em(e){return"<em>"+e+"</em>"}codespan(e){return"<code>"+e+"</code>"}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return"<del>"+e+"</del>"}link(e,t,i){if(null===(e=cleanUrl$1(this.options.sanitize,this.options.baseUrl,e)))return i;let o='<a href="'+escape$2(e)+'"';return t&&(o+=' title="'+t+'"'),o+=">"+i+"</a>",o}image(e,t,i){if(null===(e=cleanUrl$1(this.options.sanitize,this.options.baseUrl,e)))return i;let o='<img src="'+e+'" alt="'+i+'"';return t&&(o+=' title="'+t+'"'),o+=this.options.xhtml?"/>":">",o}text(e){return e}},Slugger_1=class{constructor(){this.seen={}}slug(e){let t=e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-");if(this.seen.hasOwnProperty(t))for(var i=t;this.seen[i]++,t=i+"-"+this.seen[i],this.seen.hasOwnProperty(t););return this.seen[t]=0,t}};const defaults$3=defaults["defaults"],inline$1=rules["inline"],{findClosingBracket:findClosingBracket$1,escape:escape$3}=helpers;let InlineLexer_1=class Uj{constructor(e,t){if(this.options=t||defaults$3,this.links=e,this.rules=inline$1.normal,this.options.renderer=this.options.renderer||new Renderer_1,this.renderer=this.options.renderer,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.pedantic?this.rules=inline$1.pedantic:this.options.gfm&&(this.options.breaks?this.rules=inline$1.breaks:this.rules=inline$1.gfm)}static get rules(){return inline$1}static output(e,t,i){const o=new Uj(t,i);return o.output(e)}output(e){let t="",i,o,s,r,n,a;for(;e;)if(n=this.rules.escape.exec(e))e=e.substring(n[0].length),t+=escape$3(n[1]);else if(n=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(n[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(n[0])&&(this.inLink=!1),!this.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(n[0])?this.inRawBlock=!0:this.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(n[0])&&(this.inRawBlock=!1),e=e.substring(n[0].length),t+=this.renderer.html(this.options.sanitize?this.options.sanitizer?this.options.sanitizer(n[0]):escape$3(n[0]):n[0]);else if(n=this.rules.link.exec(e)){var l,h=findClosingBracket$1(n[2],"()");-1<h&&(l=(0===n[0].indexOf("!")?5:4)+n[1].length+h,n[2]=n[2].substring(0,h),n[0]=n[0].substring(0,l).trim(),n[3]=""),e=e.substring(n[0].length),this.inLink=!0,s=n[2],r=this.options.pedantic?(i=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s),i?(s=i[1],i[3]):""):n[3]?n[3].slice(1,-1):"",s=s.trim().replace(/^<([\s\S]*)>$/,"$1"),t+=this.outputLink(n,{href:Uj.escapes(s),title:Uj.escapes(r)}),this.inLink=!1}else if((n=this.rules.reflink.exec(e))||(n=this.rules.nolink.exec(e)))e=e.substring(n[0].length),i=(n[2]||n[1]).replace(/\s+/g," "),i=this.links[i.toLowerCase()],i&&i.href?(this.inLink=!0,t+=this.outputLink(n,i),this.inLink=!1):(t+=n[0].charAt(0),e=n[0].substring(1)+e);else if(n=this.rules.strong.exec(e))e=e.substring(n[0].length),t+=this.renderer.strong(this.output(n[4]||n[3]||n[2]||n[1]));else if(n=this.rules.em.exec(e))e=e.substring(n[0].length),t+=this.renderer.em(this.output(n[6]||n[5]||n[4]||n[3]||n[2]||n[1]));else if(n=this.rules.code.exec(e))e=e.substring(n[0].length),t+=this.renderer.codespan(escape$3(n[2].trim(),!0));else if(n=this.rules.br.exec(e))e=e.substring(n[0].length),t+=this.renderer.br();else if(n=this.rules.del.exec(e))e=e.substring(n[0].length),t+=this.renderer.del(this.output(n[1]));else if(n=this.rules.autolink.exec(e))e=e.substring(n[0].length),s="@"===n[2]?(o=escape$3(this.mangle(n[1])),"mailto:"+o):(o=escape$3(n[1]),o),t+=this.renderer.link(s,null,o);else if(this.inLink||!(n=this.rules.url.exec(e))){if(n=this.rules.text.exec(e))e=e.substring(n[0].length),this.inRawBlock?t+=this.renderer.text(this.options.sanitize?this.options.sanitizer?this.options.sanitizer(n[0]):escape$3(n[0]):n[0]):t+=this.renderer.text(escape$3(this.smartypants(n[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else{if("@"===n[2])o=escape$3(n[0]),s="mailto:"+o;else{for(;a=n[0],n[0]=this.rules._backpedal.exec(n[0])[0],a!==n[0];);o=escape$3(n[0]),s="www."===n[1]?"http://"+o:o}e=e.substring(n[0].length),t+=this.renderer.link(s,null,o)}return t}static escapes(e){return e&&e.replace(Uj.rules._escapes,"$1")}outputLink(e,t){var i=t.href,t=t.title?escape$3(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(i,t,this.output(e[1])):this.renderer.image(i,t,escape$3(e[1]))}smartypants(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e}mangle(e){if(!this.options.mangle)return e;var t=e.length;let i="",o=0,s;for(;o<t;o++)s=e.charCodeAt(o),.5<Math.random()&&(s="x"+s.toString(16)),i+="&#"+s+";";return i}},TextRenderer_1=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,i){return""+i}image(e,t,i){return""+i}br(){return""}};const defaults$4=defaults["defaults"],{merge:merge$2,unescape:unescape$1}=helpers;let Parser_1=class I9{constructor(e){this.tokens=[],this.token=null,this.options=e||defaults$4,this.options.renderer=this.options.renderer||new Renderer_1,this.renderer=this.options.renderer,this.renderer.options=this.options,this.slugger=new Slugger_1}static parse(e,t){const i=new I9(t);return i.parse(e)}parse(e){this.inline=new InlineLexer_1(e.links,this.options),this.inlineText=new InlineLexer_1(e.links,merge$2({},this.options,{renderer:new TextRenderer_1})),this.tokens=e.reverse();let t="";for(;this.next();)t+=this.tok();return t}next(){return this.token=this.tokens.pop(),this.token}peek(){return this.tokens[this.tokens.length-1]||0}parseText(){let e=this.token.text;for(;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)}tok(){let r="";switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,unescape$1(this.inlineText.output(this.token.text)),this.slugger);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":{let e="",t,i,o,s;for(o="",t=0;t<this.token.header.length;t++)o+=this.renderer.tablecell(this.inline.output(this.token.header[t]),{header:!0,align:this.token.align[t]});for(e+=this.renderer.tablerow(o),t=0;t<this.token.cells.length;t++){for(i=this.token.cells[t],o="",s=0;s<i.length;s++)o+=this.renderer.tablecell(this.inline.output(i[s]),{header:!1,align:this.token.align[s]});r+=this.renderer.tablerow(o)}return this.renderer.table(e,r)}case"blockquote_start":for(r="";"blockquote_end"!==this.next().type;)r+=this.tok();return this.renderer.blockquote(r);case"list_start":r="";for(var e=this.token.ordered,t=this.token.start;"list_end"!==this.next().type;)r+=this.tok();return this.renderer.list(r,e,t);case"list_item_start":r="";var i=this.token.loose,o=this.token.checked,t=this.token.task;if(this.token.task)if(i)if("text"===this.peek().type){const s=this.peek();s.text=this.renderer.checkbox(o)+" "+s.text}else this.tokens.push({type:"text",text:this.renderer.checkbox(o)});else r+=this.renderer.checkbox(o);for(;"list_item_end"!==this.next().type;)r+=i||"text"!==this.token.type?this.tok():this.parseText();return this.renderer.listitem(r,t,o);case"html":return this.renderer.html(this.token.text);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText());default:o='Token with "'+this.token.type+'" type was not found.';if(!this.options.silent)throw new Error(o)}}};const{merge:merge$3,checkSanitizeDeprecation:checkSanitizeDeprecation$1,escape:escape$4}=helpers,{getDefaults,changeDefaults,defaults:defaults$5}=defaults;function marked(t,s,r){if(null==t)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof t)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected");if(r||"function"==typeof s){r||(r=s,s=null),s=merge$3({},marked.defaults,s||{}),checkSanitizeDeprecation$1(s);const n=s.highlight;let i,o,e=0;try{i=Lexer_1.lex(t,s)}catch(e){return r(e)}o=i.length;const a=function(t){if(t)return s.highlight=n,r(t);let e;try{e=Parser_1.parse(i,s)}catch(e){t=e}return s.highlight=n,t?r(t):r(null,e)};if(!n||n.length<3)return a();if(delete s.highlight,!o)return a();for(;e<i.length;e++)!function(i){"code"!==i.type?--o||a():n(i.text,i.lang,function(e,t){return e?a(e):null==t||t===i.text?--o||a():(i.text=t,i.escaped=!0,void(--o||a()))})}(i[e])}else try{return s=merge$3({},marked.defaults,s||{}),checkSanitizeDeprecation$1(s),Parser_1.parse(Lexer_1.lex(t,s),s)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",(s||marked.defaults).silent)return"<p>An error occurred:</p><pre>"+escape$4(e.message+"",!0)+"</pre>";throw e}}marked.options=marked.setOptions=function(e){return merge$3(marked.defaults,e),changeDefaults(marked.defaults),marked},marked.getDefaults=getDefaults,marked.defaults=defaults$5,marked.Parser=Parser_1,marked.parser=Parser_1.parse,marked.Renderer=Renderer_1,marked.TextRenderer=TextRenderer_1,marked.Lexer=Lexer_1,marked.lexer=Lexer_1.lex,marked.InlineLexer=InlineLexer_1,marked.inlineLexer=InlineLexer_1.output,marked.Slugger=Slugger_1;let marked_1=marked.parse=marked;class IoMdView extends IoElement{static get Style(){return`
    :host {
      display: block;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      --io-code-size: 15px;
      padding: 0 1em;
    }
    :host > :first-child {
      margin-top: 0;
    }
    :host > :last-child {
      margin-top: 0;
    }
    :host p {
      line-height: 1.4em;
      padding: 0 0.5em;
    }
    :host a {
      text-decoration: underline;
      color: var(--io-color-link);
    }
    :host h1, :host h2, :host h3, :host h4 {
      margin: 0;
      border: var(--io-border);
      border-width: 0 0 var(--io-border-width) 0;
    }
    :host h1 {
      padding: 0.5em 0;
    }
    :host h2 {
      padding: 0.4em 0;
    }
    :host h3 {
      padding: 0.3em 0;
      border: 0;
    }
    :host h4 {
      padding: 0.2em 0;
      border: 0;
    }
    :host code {
      font-family: monospace, monospace;
      -webkit-font-smoothing: auto;
      overflow: auto;
      color: var(--io-color-link);
    }
    :host strong code {
      background: var(--io-background-color-highlight);
    }
    :host pre > code {
      background: var(--io-background-color-highlight);
      color: inherit;
      line-height: 1.6em;
    }

    :host code.language-html,
    :host code.language-javascript {
      padding: 1em;
      display: block;
      font-size: var(--io-code-size);
    }
    :host blockquote {
      font-size: 0.85em;
      opacity: 0.5;
      margin: 0;
      padding: var(--io-spacing) 0;
    }
    :host table  {
      width: 100% !important;
      border: 1px solid black;
      border-collapse: collapse;
      table-layout: fixed;
    }
    :host table td,
    :host table tr,
    :host table th {
      border: 1px solid gray;
      padding: 0.25em;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    :host .videocontainer {
        width: 100%;
        height: 0;
        position: relative;
        padding-bottom: 56.25%;
    }
    :host .videocontainer > iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    @keyframes spinner {
      to {transform: rotate(360deg);}
    }
    :host .io-loading {
      background-image: repeating-linear-gradient(135deg, var(--io-background-color-highlight), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-highlight) 10px) !important;
      background-repeat: repeat;
      position: relative;
    }
    :host .io-loading:after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      margin-top: -20px;
      margin-left: -20px;
      border-radius: 50%;
      border: var(--io-border);
      border-top-color: #000;
      animation: spinner .6s linear infinite;
    }
    `}static get Properties(){return{path:{type:String,reflect:1},role:"document"}}onResized(){var e=this.getBoundingClientRect().width,e=Math.min((e-30)/35,15);this.style.setProperty("--io-code-size",e+"px")}parseMarkdown(e){marked_1&&(marked_1.setOptions({sanitize:!1,highlight:function(e){return window.hljs?window.hljs.highlightAuto(e).value:null}}),this.innerHTML=marked_1(e,void 0,void 0),this.classList.toggle("io-loading",!1),this.dispatchEvent("content-ready",{},!0))}pathChanged(){this.classList.toggle("io-loading",!0),fetch(this.path).then(e=>e.text()).then(e=>{this.parseMarkdown(e)})}}RegisterIoElement(IoMdView);class IoSelector extends IoElement{static get Style(){return`
    :host {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      overflow-x: hidden;
      overflow-y: auto;
      color: var(--io-color);
      background-color: var(--io-background-color);
    }
    @keyframes io-selector-spinner {
      to {
        transform: rotate(360deg);
      }
    }
    :host .io-loading {
      background-image: repeating-linear-gradient(135deg, var(--io-background-color-highlight), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-highlight) 10px) !important;
      background-repeat: repeat;
      position: relative;
    }
    :host .io-loading:after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      margin-top: -20px;
      margin-left: -20px;
      border-radius: 50%;
      border: var(--io-border);
      border-top-color: #000;
      animation: io-selector-spinner .6s linear infinite;
    }
    `}static get Properties(){return{options:{type:Options,observe:!0,strict:!0},elements:{type:Array,observe:!0},selected:{reflect:1},cache:Boolean,_caches:Object,_selectedID:String,_scrollID:{type:String,notify:!0}}}static get Listeners(){return{scroll:["_onScroll",{capture:!0,passive:!0}],"content-ready":"_onIoContentReady"}}constructor(e){super(e),this._selectDefault()}_selectDefault(){!this.selected&&this.options[0]&&(this.selected=this.options[0].value)}_onIoContentReady(e){e.stopImmediatePropagation(),this.scrollTo(this._scrollID,!1)}connectedCallback(){super.connectedCallback(),this.scrollTo(this._scrollID,!1)}scrollTo(t,i){t&&setTimeout(()=>{const e=this.$.content.querySelector("#"+t.toLowerCase());e&&e.scrollIntoView({behavior:i?"smooth":"auto"})},250)}_onScroll(){void 0!==this._scrollID&&(clearTimeout(this.__scrollThrottle),this.__scrollThrottle=setTimeout(()=>{delete this.__scrollThrottle;var e,t=[...this.$.content.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")],i=this.$.content.scrollTop||this.$.content.children[0].scrollTop,o=i+this.$.content.getBoundingClientRect().height/2,s=this._scrollID;let r;for(let e=t.length;e--;){var n=t[e],a=t[e+1],l=n.offsetTop,a=a?a.offsetTop:l;if(l<i-5&&a<o&&e!==t.length-1)break;r=n.id}void 0!==r&&r!==s&&(this._scrollID=r||"",e=this.selected,s=this._selectedID+"#"+this._scrollID,this.__properties.selected.value=s,this.dispatchEvent("selected-changed",{value:s,oldValue:e}))},100))}selectedChanged(){this._selectDefault(),this.updateScroll()}optionsChanged(){this._selectDefault(),this.updateScroll()}elementsChanged(){this.updateScroll()}updateScroll(){var e,t;this.selected&&(e=this._scrollID,t=this._selectedID,this._selectedID=this.selected.split("#")[0]||"",this._scrollID=this.selected.split("#")[1]||"",this._selectedID!==t?(this.update(),this.scrollTo(this._scrollID)):this._scrollID!==e&&this.scrollTo(this._scrollID,!0))}getSlotted(){return null}update(){const t=this._selectedID;let e=this.elements.find(e=>e[1].name===t);e=e||["span",`Could not find element with name:${t}!`],"object"!=typeof e[1]&&e.splice(1,0,{});var i=!0===e[1].cache,o=!1===e[1].cache;this.template([this.getSlotted(),["div",{id:"content",class:"io-content"}]]),this.$.content&&(this.$.content.textContent=""),this.$.content.classList.toggle("io-loading",!0),!o&&(this.cache||i)&&this._caches[t]?(this.$.content.appendChild(this._caches[t]),this.$.content.classList.toggle("io-loading",!1)):this.import(e[1].import).then(()=>{e[1].name===this.selected.split("#")[0]&&(this.$.content.classList.toggle("io-loading",!1),this.template([e],this.$.content),this._caches[t]=this.$.content.childNodes[0])})}}RegisterIoElement(IoSelector);class IoSidebar extends IoElement{static get Style(){return`
    :host {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: hidden;
      overflow-y: auto;
      padding: var(--io-spacing);
      flex-direction: column;
      -webkit-overflow-scrolling: touch;
    }
    :host > * {
      align-self: stretch !important;
      flex: 0 0 auto;
    }
    :host * {
      overflow: visible !important;
    }
    :host io-collapsable {
      padding: 0;
    }
    :host io-collapsable > io-content {
      padding: 0 0 0 0.75em;
    }
    :host io-button {
      text-align: left;
      align-self: stretch;
    }
    :host io-button,
    :host io-collapsable,
    :host io-content {
      background: none;
      box-shadow: none;
      border-color: transparent;
    }
    :host io-boolean:not(:focus) {
      border-bottom-color: transparent  !important;
    }
    `}static get Properties(){return{selected:null,options:{type:Options,observe:!0,strict:!0},collapsed:{type:Boolean,reflect:1},role:"navigation"}}_onSelect(e){this.set("selected",e)}_addOptions(t){const i=[];for(let e=0;e<t.length;e++){var o,s,r=t[e];r.options.length?(o=!!this.filterObject(r.options,e=>matches(this.selected,e)),s=IoStorageFactory({value:!1,storage:"local",key:genUUID$1(t,e)}),i.push(["io-collapsable",{label:r.label,expanded:o||s,elements:[...this._addOptions(r.options)]}])):(s=matches(this.selected,r),i.push(["io-button",{value:r.value||r,label:r.label||r.value||r,action:this._onSelect,selected:s}]))}return i}changed(){var e;this.collapsed?(e=this.filterObject(this.options,e=>matches(this.selected,e)),this.template([["io-option-menu",{options:this.options,value:this.bind("selected"),label:e?e.label:"",icon:"☰",selectable:!0,title:"select tab",class:"io-item"}]])):this.template([...this._addOptions(this.options)])}}function genUUID$1(e,t){var i=e[t];let o="io-sidebar-collapse-state-"+t+"-"+e.length;return i.label&&(o+="-"+i.label),i.options.length&&(o+="("+i.options.length+")"),o}function matches(e,t){return void 0!==e&&("object"==typeof t&&(t=t.value),String(e).toLowerCase()===String(t).toLowerCase())}RegisterIoElement(IoSidebar);class IoSelectorSidebar extends IoSelector{static get Style(){return`
    :host {
      flex-direction: row;
    }
    :host[right] {
      flex-direction: row-reverse;
    }
    :host[collapsed] {
      flex-direction: column;
    }
    :host > io-sidebar {
      flex: 0 0 auto;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 var(--io-border-width) 0 0;
    }
    :host[right] > io-sidebar {
      border-width: 0 0 0 var(--io-border-width);
    }
    :host[collapsed] > io-sidebar {
      flex: 0 0 auto;
      border-width: 0 0 var(--io-border-width) 0;
    }
    `}static get Properties(){return{collapseWidth:410,collapsed:{type:Boolean,reflect:1},right:{type:Boolean,reflect:1}}}onResized(){this.collapsed=this.getBoundingClientRect().width<this.collapseWidth}collapsedChanged(){this.update()}getSlotted(){return["io-sidebar",{selected:this.bind("selected"),options:this.options,collapsed:this.collapsed}]}}RegisterIoElement(IoSelectorSidebar);class IoMdViewSelector extends IoSelectorSidebar{update(){this.template([this.getSlotted(),["io-md-view",{id:"content",class:"io-content",path:this._selectedID}]])}}RegisterIoElement(IoMdViewSelector);class IoServiceLoader extends IoNode{static get Properties(){return{path:"service.js",serviceWorker:void 0,permission:window.Notification?window.Notification.permission:"default",subscription:""}}constructor(e){super(e),this.requestNotification=this.requestNotification.bind(this),"serviceWorker"in navigator&&this.init()}async init(){const e=await navigator.serviceWorker.register(this.path);e.update(),navigator.serviceWorker.addEventListener("message",this.onServiceWorkerMessage),e.active?this.serviceWorker=e:e.addEventListener("activate",()=>{this.serviceWorker=e})}serviceWorkerChanged(){"granted"===this.permission&&this.subscribe()}subscribe(){navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({command:"subscribe"})}async requestNotification(){this.permission=await window.Notification.requestPermission(),"granted"===this.permission&&this.subscribe()}onServiceWorkerMessage(e){e=JSON.parse(e.data);e.subscription&&(this.subscription=JSON.stringify(e.subscription))}}RegisterIoNode(IoServiceLoader);class IoElementDemo extends IoElement{static get Style(){return`
    :host {
      @apply --io-panel;
      position: relative;
    }
    :host > io-boolicon {
      z-index: 2;
      position: absolute !important;
      top: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
      right: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
    }
    :host > io-boolicon:not([value]):not(:hover) {
      opacity: 0.5;
    }
    :host > io-properties {
      align-self: stretch;
      padding: var(--io-spacing) 0;
      margin: var(--io-border-width);
      margin-right: var(--io-spacing);
      margin-bottom: calc(2 * var(--io-spacing));
    }
    :host > io-properties > :nth-child(3) {
      margin-right: calc(var(--io-item-height) + var(--io-spacing));
    }
    :host > .io-content {
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      padding: var(--io-spacing);
      box-shadow: var(--io-shadow-inset);
      color: var(--io-color);
      background-color: var(--io-background-color);
      background-image: none;
    }
    :host:not([expanded]) > .io-content {
      margin-right: calc(var(--io-item-height) + calc(3 * var(--io-spacing)));
    }
    `}static get Properties(){return{element:{type:String,reflect:-1},properties:{type:Object,reflect:-1,observe:!0},width:{type:String,reflect:-1},height:{type:String,reflect:-1},config:{type:Object,reflect:-1},expanded:{type:Boolean,reflect:2}}}objectMutated(t){super.objectMutated(t);for(let e=this.__observedObjects.length;e--;){var i=this.__observedObjects[e],i=this.__properties[i].value;if(!!this.filterObject(i,e=>e===t.detail.object)){const o=this.querySelectorAll("*");for(let e=0;e<o.length;e++)o[e].changed&&o[e].changed()}}}changed(){var e=this.properties;const t=[["io-boolicon",{value:this.bind("expanded"),true:"icons:tune",false:"icons:tune"}]];this.expanded&&t.push(["io-properties",{value:e,config:Object.assign({"type:number":["io-number",{step:1e-5}],"type:boolean":["io-switch"]},this.config)}]),t.push(["div",{class:"io-content"},[[this.element,Object.assign({id:"demo-element"},e)]]]),this.template(t),this.width&&(this.$["demo-element"].style.width=this.width),this.height&&(this.$["demo-element"].style.height=this.height),this.$["demo-element"].onResized&&this.$["demo-element"].onResized()}}RegisterIoElement(IoElementDemo);class IoLayout extends IoElement{static get Style(){return`
    :host {
      flex: 1;
      display: flex;
      overflow: hidden;
      touch-action: none;
    }
    :host[orientation=horizontal] {
      flex-direction: row;
    }
    :host[orientation=vertical] {
      flex-direction: column;
    }
    `}static get Properties(){return{elements:Array,splits:{type:Array,observe:!0},editable:!0,orientation:{value:"horizontal",reflect:1}}}static get Listeners(){return{"io-layout-divider-move":"_onDividerMove","io-layout-tab-insert":"_onLayoutTabInsert"}}_onSelectedChanged(){var t=[].slice.call(this.children).filter(e=>"io-layout-divider"!==e.localName);for(let e=0;e<t.length;e++)t[e].selected&&(this.splits[e].selected=t[e].selected)}changed(){const t=[];for(let e=0;e<this.splits.length;e++){var i=this.splits[e],o=void 0!==i.size?i.size+"px":null,o={"flex-basis":o||"auto","flex-grow":o?0:1,"flex-shrink":o?0:1};i.tabs?t.push(["io-selector-tabs",{elements:this.elements,filter:i.tabs,selected:i.selected,editable:this.editable,style:o,"on-selected-changed":this._onSelectedChanged}]):i.splits?t.push(["io-layout",{elements:this.elements,splits:i.splits,orientation:i.orientation,editable:this.editable,style:o}]):t.push(["p","Malformed layout data."]),e<this.splits.length-1&&t.push(["io-layout-divider",{orientation:this.orientation||"horizontal",index:e}])}this.template([t])}_onLayoutTabInsert(e){e.stopImmediatePropagation();const t=[].slice.call(this.children).filter(e=>"io-layout-divider"!==e.localName),i=e.detail.source;var o=e.detail.destination,s=t.indexOf(o),r=e.detail.tab,o="vertical"===this.orientation,e=e.detail.direction;for(let e=i.filter.length;e--;)i.filter[e]===r&&(i.filter.splice(e,1),i.selected=i.filter[i.filter.length-1],i.changed());o&&"down"===e||!o&&"right"===e?this.splits.splice(s+1,0,{tabs:[r],selected:r}):o&&"up"===e||!o&&"left"===e?this.splits.splice(s,0,{tabs:[r],selected:r}):o&&"left"===e||!o&&"up"===e?this.splits[s]={splits:[{tabs:[r],selected:r},this.splits[s]],orientation:o?"horizontal":"vertical"}:(o&&"right"===e||!o&&"down"===e)&&(this.splits[s]={splits:[this.splits[s],{tabs:[r],selected:r}],orientation:o?"horizontal":"vertical"}),this.changed()}_onDividerMove(e){e.stopImmediatePropagation();var t=e.detail.index,i=e.detail.index+1,o=this.splits[t],s=this.splits[i],r=void 0===o.size?void 0:o.size+e.detail.movement,e=void 0===s.size?void 0:s.size-e.detail.movement;if(void 0!==r&&0<=r&&(void 0===e||0<=e)&&(this.splits[t].size=Math.max(0,r)),void 0!==e&&0<=e&&(void 0===r||0<=r)&&(this.splits[i].size=Math.max(0,e)),void 0===o.size&&void 0===s.size){const a=[].slice.call(this.children).filter(e=>"io-layout-divider"!==e.localName);var n="horizontal"===this.orientation?"width":"height",s=Math.floor(this.splits.length/2);if(Math.abs(s-t)<=Math.abs(s-i))for(let e=i;e<this.splits.length;e++)this.splits[e].size=parseInt(a[e].getBoundingClientRect()[n]);else for(let e=t;0<=e;e--)this.splits[e].size=parseInt(a[e].getBoundingClientRect()[n])}this.queue("splits",this.splits,this.splits),this.queueDispatch()}}RegisterIoElement(IoLayout);class IoLayoutDivider extends IoElement{static get Style(){return`
    :host {
      background: var(--io-background-color);
      color: var(--io-color);
      z-index: 1;
      display: flex;
      flex: none;
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      user-select: none;
      transition: background-color 0.4s;
    }
    :host:hover {
      background-color: var(--io-color-focus);
    }
    :host[orientation=horizontal] {
      cursor: col-resize;
      width: var(--io-spacing);
      border-top: 0;
      border-bottom: 0;
    }
    :host[orientation=vertical] {
      cursor: row-resize;
      height: var(--io-spacing);
      border-left: 0;
      border-right: 0;
    }
    :host > .app-divider {
      flex: 1;
      display: flex;
      margin-left: -0.03em;
      margin-top: -0.06em;
      align-items: center;
      justify-content: center;
    }
    `}static get Properties(){return{orientation:{value:"horizontal",reflect:1},index:Number,pointermode:"relative"}}static get Listeners(){return{pointermove:"_onPointermove"}}_onPointermove(e){e.buttons&&(e.preventDefault(),this.setPointerCapture(e.pointerId),this.dispatchEvent("io-layout-divider-move",{movement:"horizontal"===this.orientation?e.movementX:e.movementY,index:this.index},!0))}changed(){this.template([["div",{class:"app-divider"},"horizontal"===this.orientation?"⋮":"⋯"]])}}RegisterIoElement(IoLayoutDivider);class IoCollapsable extends IoElement{static get Style(){return`
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
      width: auto;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 1.125em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > :nth-child(n+2) {
      margin-top: var(--io-spacing);
    }
    `}static get Properties(){return{elements:Array,label:{reflect:1},expanded:{type:Boolean,reflect:1},role:"region"}}changed(){this.template([["io-boolean",{true:this.label,false:this.label,value:this.bind("expanded")}],["io-content",{elements:this.elements,expanded:this.expanded}]])}}RegisterIoElement(IoCollapsable);class IoSelectorTabs extends IoSelector{static get Style(){return`
    :host > io-menu-options {
      flex: 0 0 auto;
      border: none;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 0 var(--io-border-width) 0;
    }
    `}static get Properties(){return{slotted:{type:Array,observe:!0},depth:1/0}}getSlotted(){return["io-menu-options",{role:"navigation",horizontal:!0,options:this.options,depth:this.depth,slotted:this.slotted}]}}RegisterIoElement(IoSelectorTabs);class IoVector extends IoElement{static get Style(){return`
    :host {
      display: flex;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      width: inherit;
      flex: 1 1;
    }
    :host > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host > io-boolean {
      width: var(--io-line-height) !important;
    }
    `}static get Properties(){return{value:{value:[0,0,0,0],observe:!0},conversion:1,step:.001,min:-1/0,max:1/0,linkable:!1,linked:!1,components:{type:Array,notify:!1}}}_onValueSet(e){var t=e.composedPath()[0].id,i=e.detail.value,o=e.detail.oldValue;if(this.value[t]=i,this.linked){var s=i/o;for(const n in this.components){var r=this.components[n];0===o?this.value[r]=i:r!==t&&(this.value[r]*=s)}}e={object:this.value,property:this.linked?null:t,value:i,oldValue:o};this.dispatchEvent("object-mutated",e,!1,window)}valueChanged(){this.components=Object.keys(this.value).filter(e=>"number"==typeof this.value[e])}changed(){const e=[];for(const i in this.components){var t=this.components[i];void 0!==this.value[t]&&e.push(["io-number",{id:t,value:this.value[t],conversion:this.conversion,step:this.step,min:this.min,max:this.max,ladder:!0,"on-value-set":this._onValueSet}])}e.push(this.getSlotted()),this.template(e)}getSlotted(){return this.linkable?["io-boolicon",{value:this.bind("linked"),true:"icons:link",false:"icons:unlink"}]:null}}RegisterIoElement(IoVector);class IoMatrix extends IoElement{static get Style(){return`
    :host {
      display: grid;
      align-self: stretch;
      justify-self: stretch;
      grid-gap: var(--io-spacing);
    }
    :host[columns="4"] {
      grid-template-columns: repeat(4, 1fr);
    }
    :host[columns="3"] {
      grid-template-columns: repeat(3, 1fr);
    }
    :host[columns="2"] {
      grid-template-columns: repeat(2, 1fr);
    }
    :host > io-number {
      width: inherit;
    }
    `}static get Properties(){return{value:{value:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],observe:!0},step:.001,components:{type:Array,notify:!1},columns:{value:4,reflect:1}}}_onValueSet(e){var t,i;e.detail.object||(t=e.composedPath()[0].id,i=e.detail.value,e=e.detail.oldValue,this.value[t]=i,e={object:this.value,property:t,value:i,oldValue:e},this.dispatchEvent("object-mutated",e,!1,window))}valueChanged(){let e;4===this.value.length&&(e=[0,1,2,3],this.columns=2),9===this.value.length&&(e=[0,1,2,3,4,5,6,7,8],this.columns=3),16===this.value.length&&(e=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],this.columns=4),this.components=e}changed(){const e=[];for(const i in this.components){var t=this.components[i];void 0!==this.value[t]&&e.push(["io-number",{id:String(t),value:this.value[t],step:this.step,"on-value-set":this._onValueSet}])}this.template(e)}}RegisterIoElement(IoMatrix);const rects=new WeakMap;class IoMenuOptions extends IoElement{static get Style(){return`
    :host {
      @apply --io-panel;
      box-sizing: border-box;
      align-self: flex-start;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      white-space: nowrap;
      user-select: none;
      background-image: none;
      opacity: 1;
      transition: opacity 0.25s;
      overflow-y: auto !important;
      padding: 0;
    }
    :host > io-menu-item {
      align-self: stretch;
      flex: 0 0 auto;
    }
    :host[inlayer] {
      box-shadow: var(--io-shadow);
    }
    :host[inlayer]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }
    :host[horizontal] {
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      flex-wrap: nowrap;
      padding: 0 var(--io-spacing);
    }
    :host[horizontal] > io-menu-item {
      padding: var(--io-spacing) calc(0.5 * var(--io-line-height));
    }
    :host[horizontal] > io-menu-item {
      border-right:1px solid var(--io-color-border);
    }
    :host:not([horizontal]) > io-menu-item > * {
      min-width: 0.5em;
      padding: 0 var(--io-spacing);
    }
    :host[horizontal] > io-menu-item > .io-menu-hint,
    :host[horizontal] > io-menu-item > .io-menu-more {
      display: none;
    }
    :host[horizontal] > io-menu-item.io-hamburger {
      margin-left: auto;
    }
    :host[horizontal] > io-menu-item.io-hamburger:after {
      content: '';
      display: none;
    }
    :host[horizontal] > io-menu-item.io-hamburger[hidden] {
      display: inline-block;
      width: 0;
      padding: 0;
      border: 0;
      overflow: hidden;
      visibility: hidden;
    }
    :host > io-string {
      align-self: stretch;
      flex: 0 0 auto;
      min-width: 8em;
    }
    :host > io-string:empty:before {
      content: '\\1F50D';
      white-space: pre;
      padding: 0 0.25em;
      visibility: visible;
      opacity: 0.33;
    }
    `}static get Properties(){return{options:{type:Options,observe:!0,strict:!0},expanded:{value:!1,reflect:1},horizontal:{type:Boolean,reflect:1},position:"right",depth:1/0,searchable:Boolean,search:String,overflow:{type:Boolean,reflect:1},inlayer:{type:Boolean,reflect:1},slotted:Array,$parent:null,_rects:Array,role:"listbox"}}static get Listeners(){return{"item-clicked":"_onItemClicked",touchstart:"_stopPropagation"}}connectedCallback(){super.connectedCallback(),this.inlayer=this.parentElement===IoLayerSingleton}_onItemClicked(e){var t=e.composedPath()[0],i=e.detail;"io-string"!==t.localName?t!==this&&(e.stopImmediatePropagation(),void 0!==i.value&&!1!==i.selectable&&this.set("value",i.value),this.dispatchEvent("item-clicked",i,!0),this.requestAnimationFrameOnce(this._collapse)):e.stopImmediatePropagation()}_stopPropagation(e){e.stopPropagation()}onResized(){this.requestAnimationFrameOnce(this._setOverflow)}_setOverflow(){const s=this.querySelectorAll("io-menu-item:not(.io-hamburger)");if(this.horizontal){const n=this.querySelector(".io-hamburger");if(s.length){let t=this.getBoundingClientRect().right,i=!1,o=1/0;n.hidden=!0;const a=[];for(let e=s.length;e--;){var r=s[e].getBoundingClientRect();const l=rects.get(s[e])||{right:0,width:0};0!==r.right&&0!==r.width&&(l.right=r.right,l.width=r.width,rects.set(s[e],l)),n.hidden&&i&&(n.hidden=!1,t-=n.getBoundingClientRect().width),s[e].selected?(t-=l.width,s[e].hidden=!1):(o=Math.min(o,l.right),o<t?s[e].hidden=!1:(s[e].hidden=!0,a.push(s[e].option),i=!0))}this.overflow=i}}else for(let e=s.length;e--;)s[e].hidden=!1}_collapse(){var e=this.selectable&&!!this.search&&!this.inlayer;this.setProperties({search:"",expanded:!1}),e&&this.$.search.focus()}expandedChanged(){this.expanded?(this.inlayer=this.parentElement===IoLayerSingleton,this.inlayer&&this.$parent&&(this._expandedChangedLazy(),this.throttle(this._expandedChangedLazy,null,!0))):(this.style.top=null,this.style.height=null,this.style.touchAction=null,this.scrollTop=0,this.search="")}searchChanged(){this.inlayer&&this.$parent&&this.requestAnimationFrameOnce(this._clipHeight)}_expandedChangedLazy(){var e=this.$parent.getBoundingClientRect();IoLayerSingleton.setElementPosition(this,this.position,e),this._clipHeight(),this.searchable=!!this.style.height}_clipHeight(){var e,t,i;this.scrollTop=0,this.firstChild&&(e=this.firstChild.getBoundingClientRect().top,i=(t=this.lastChild.getBoundingClientRect().bottom)-e,e<0?(this.style.top="0px",this.style.height=i+e+"px",this.style.touchAction="pan-y"):t>window.innerHeight?(this.style.height=window.innerHeight-e+"px",this.style.touchAction="pan-y"):(this.style.height=null,this.style.touchAction=null))}get _options(){if(this.search){const t=this.search.toLowerCase();var e=this.filterObjects(this.options,e=>{if(e.value||e.action){if(-1!==String(e.value).toLowerCase().search(t))return!0;if(e.label&&-1!==e.label.toLowerCase().search(t))return!0;if(e.hint&&-1!==e.hint.toLowerCase().search(t))return!0}return!1});return e.length?e:new Options([new Item({label:"No matches"})])}return this.options}changed(){const t=this.horizontal?"bottom":"right",e=[];this.searchable&&e.push(["io-string",{id:"search",value:this.bind("search"),live:!0}]),this._options&&e.push(this._options.map(e=>["io-menu-item",{$parent:this,option:e,direction:t,depth:this.depth,lazy:!1}])),this.horizontal&&(e.splice(0,0,...this.slotted),e.push(["io-menu-item",{label:"☰",icon:"☰",title:"select tab",depth:this.depth+1,class:"io-hamburger",option:new Item({options:this._options}),lazy:!1}])),this.template(e),this.requestAnimationFrameOnce(this._setOverflow)}}RegisterIoElement(IoMenuOptions);class IoMenuItem extends IoItem{static get Style(){return`
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      border-radius: 0;
    }
    :host > * {
      pointer-events: none;
    }
    :host > :empty {
      display: none;
    }
    :host > :not(:empty) {
      padding: 0 var(--io-spacing);
    }
    :host > io-icon {
      width: var(--io-line-height);
      height: var(--io-line-height);
      margin-right: var(--io-spacing);
    }
    :host > .io-menu-label {
      flex: 1 1 auto;
      text-overflow: ellipsis;
    }
    :host > .io-menu-hint {
      opacity: 0.25;
    }
    :host[hasmore][direction="up"]:after {
      content: '\\25B4';
      margin-left: 0.5em;
    }
    :host[hasmore][direction="right"]:after {
      content: '\\25B8';
      margin-left: 0.5em;
    }
    :host[hasmore][direction="bottom"]:after {
      content: '\\25BE';
      margin-left: 0.5em;
    }
    :host[hasmore][direction="left"]:before {
      content: '\\25C2';
      margin-right: 0.5em;
    }
    :host[selected][direction="top"],
    :host[selected][direction="bottom"] {
      border-bottom-color: var(--io-color-link);
    }
    :host[selected][direction="right"],
    :host[selected][direction="left"] {
      border-left-color: var(--io-color-link);
    }
    `}static get Properties(){return{option:{type:Item,strict:!0},expanded:{value:!1,reflect:1},direction:{value:"bottom",reflect:1},icon:String,$parent:null,$options:null,depth:1/0,lazy:!0}}static get Listeners(){return{click:"preventDefault"}}preventDefault(e){e.stopPropagation(),e.preventDefault()}get hasmore(){return this.option.hasmore&&0<this.depth}get inlayer(){return this.$parent&&this.$parent.inlayer}connectedCallback(){super.connectedCallback(),this.$options&&IoLayerSingleton.appendChild(this.$options),this.inlayer||IoLayerSingleton.addEventListener("pointermove",this._onLayerPointermove),this.inlayer||IoLayerSingleton.addEventListener("pointerup",this._onLayerPointerup)}disconnectedCallback(){super.disconnectedCallback(),this.$options&&this.$options.inlayer&&IoLayerSingleton.removeChild(this.$options),IoLayerSingleton.removeEventListener("pointermove",this._onLayerPointermove),IoLayerSingleton.removeEventListener("pointerup",this._onLayerPointerup)}_onClick(){const e=this.option;this.hasmore?this.expanded||(this.expanded=!0):"toggle"===e.select?e.selected=!e.selected:(e.action&&e.action.apply(null,[e.value]),"pick"===e.select&&(e.hasmore&&this.depth<=0?e.options.selectDefault():e.selected=!0),this.dispatchEvent("item-clicked",e,!0),this.requestAnimationFrameOnce(this._collapse))}_onItemClicked(e){e.composedPath()[0]!==this&&(e.stopImmediatePropagation(),this.dispatchEvent("item-clicked",e.detail,!0)),this.expanded&&this.requestAnimationFrameOnce(this._collapse)}_onPointerdown(e){e.stopPropagation(),e.preventDefault(),this.setPointerCapture(e.pointerId),this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerup",this._onPointerup),(this.expanded||"mouse"===e.pointerType||this.inlayer)&&(this.focus(),this.option.options&&(this.expanded=!0)),hovered=this,hoveredParent=this.parentElement,this._x=e.clientX,this._y=e.clientY}_onPointermove(e){var t,i;e.stopPropagation(),(this.expanded||"touch"!==e.pointerType||this.inlayer)&&(t=!!this.$parent&&!!this.$parent.style.height,"touch"===e.pointerType&&t||(i=e.clientX-this._x,t=e.clientY-this._y,this._x=e.clientX,this._y=e.clientY,IoLayerSingleton.x=e.clientX,IoLayerSingleton.y=e.clientY,clearTimeout(this.__timeoutOpen),hovered=this._gethovered(e),hovered&&(t=Math.abs(t)-Math.abs(i),i=hovered.parentElement.horizontal,hoveredParent!==hovered.parentElement?(hoveredParent=hovered.parentElement,this._expandHovered()):(i?t<-.5:.5<t)?this._expandHovered():this.__timeoutOpen=setTimeout(()=>{this._expandHovered()},100))))}_gethovered(t){var i=getElementDescendants(getRootElement(this));for(let e=i.length;e--;)if(isPointerAboveItem(t,i[e]))return i[e]}_expandHovered(){if(hovered&&(hovered.focus(),hovered.hasmore)){if(hovered.$options){const t=getElementDescendants(hovered.$options);for(let e=t.length;e--;)t[e].expanded=!1}hovered.expanded=!0}}_onLayerPointermove(e){this.expanded&&this._onPointermove(e)}_onLayerPointerup(e){this.expanded&&this._onPointerup(e)}_onPointerup(e){e.stopPropagation(),this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerup",this._onPointerup);const t=this._gethovered(e);t?(t.focus(),t._onClick(e)):this.requestAnimationFrameOnce(this._collapseRoot)}_onKeydown(e){if("Enter"===e.key||" "===e.key)return e.preventDefault(),void this._onClick();if("Escape"===e.key)return e.preventDefault(),void this.requestAnimationFrameOnce(this._collapseRoot);let t="";"left"===this.direction||"right"===this.direction?("ArrowUp"===e.key&&(t="prev"),"ArrowRight"===e.key&&(t="in"),"ArrowDown"===e.key&&(t="next"),"ArrowLeft"===e.key&&(t="out")):("ArrowUp"===e.key&&(t="out"),"ArrowRight"===e.key&&(t="next"),"ArrowDown"===e.key&&(t="in"),"ArrowLeft"===e.key&&(t="prev")),this.inlayer&&"Tab"===e.key&&(t="next");const i=this.$parent?[...this.$parent.children]:[];var o=i.indexOf(this);if(t&&(this.inlayer||this.expanded))switch(e.preventDefault(),t){case"prev":{const s=i[(o+i.length-1)%i.length];this.expanded=!1,s&&(s.hasmore&&(s.expanded=!0),s.focus());break}case"next":{const r=i[(o+1)%i.length];this.expanded=!1,r&&(r.hasmore&&(r.expanded=!0),r.focus());break}case"in":this.$options&&this.$options.children.length&&this.$options.children[0].focus();break;case"out":this.expanded=!1,this.$parent&&this.$parent.$parent&&this.$parent.$parent.focus()}else super._onKeydown(e)}_collapse(){this.expanded=!1}_collapseRoot(){getRootElement(this).expanded=!1}expandedChanged(){if(this.$options||(this.$options=new IoMenuOptions),this.expanded&&0<this.depth){this.$options.parentElement!==IoLayerSingleton&&IoLayerSingleton.appendChild(this.$options);const t=getElementDescendants(getRootElement(this)),i=getElementAncestors(this);for(let e=t.length;e--;)-1===i.indexOf(t[e])&&(t[e].expanded=!1);const o=getElementDescendants(this.$options);for(let e=o.length;e--;)o[e].expanded=!1;this.$options.addEventListener("item-clicked",this._onItemClicked)}else{const s=getElementDescendants(this);for(let e=s.length;e--;)s[e].expanded=!1;this.$options.removeEventListener("item-clicked",this._onItemClicked)}}optionChanged(e){e.oldValue&&e.oldValue.removeEventListener("changed",this.onOptionChanged),e.value&&e.value.addEventListener("changed",this.onOptionChanged)}onOptionChanged(){this.changed()}changed(){var e=this.option,t=this.icon||e.icon;this.setAttribute("selected",e.selected),this.setAttribute("hasmore",this.hasmore),this.template([t?["io-icon",{icon:t}]:null,["span",{class:"io-menu-label"},e.label],["span",{class:"io-menu-hint"},e.hint]]),this.$options&&this.$options.setProperties({$parent:this,depth:this.depth-1,expanded:this.bind("expanded"),options:e.options,position:this.direction})}}function getElementDescendants(e){const t=[];let i=[];-1!=="io-menu-item, io-option-menu".search(e.localName)?(t.push(e),e.$options&&(i=e.$options.querySelectorAll("io-menu-item, io-option-menu"))):"io-context-menu"===e.localName?e.$options&&(i=e.$options.querySelectorAll("io-menu-item, io-option-menu")):i=e.querySelectorAll("io-menu-item, io-option-menu");for(let e=i.length;e--;)t.push(i[e]),i[e].expanded&&t.push(...getElementDescendants(i[e]));return t}function getElementAncestors(e){let t=e;const i=[e];for(;t&&t.$parent;)t=t.$parent,t&&i.push(t);return i}function getRootElement(e){let t=e;for(;t&&t.$parent;)t=t.$parent;return t}function isPointerAboveItem(e,t){var i=t.getBoundingClientRect(),o=e.clientX,e=e.clientY;if(-1!==["io-menu-item","io-option-menu"].indexOf(t.localName)&&(!t.inlayer||t.parentElement.expanded))return i.top<=e&&i.bottom>=e&&i.left<=o&&i.right>=o;return null}RegisterIoElement(IoMenuItem);let hovered,hoveredParent;class IoOptionMenu extends IoElement{static get Style(){return`
    :host {
      display: inline-block;
      text-align: center;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--io-border-width));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    :host > io-menu-item[selected] {
      color: var(--io-color);
    }
    `}static get Properties(){return{value:{reflect:-1},options:{type:Options,reflect:-1,strict:!0},role:"button"}}get _label(){var e=void 0!==this.value?String(this.value):"";return this.label||e||""}_setValue(e){if(void 0!==e.detail.leaf)try{this.set("value",JSON.parse(e.detail.leaf))}catch{this.set("value",e.detail.leaf)}}changed(){let e="";if(this.options.length){const t=this.options.find(e=>e.value===this.value);t&&(e=t.label||("object"==typeof t.value?""+t.value.constructor.name+(t.value instanceof Array?`(${t.value.length})`:""):String(t.value)))}e=e||this._label,this.icon&&(e=this.icon+"  "+e),this.options.setSelectedPath([this.value]);for(let e=0;e<this.options.length;e++){const t=this.options[e];t.value===this.value&&(t.selected=!0)}const t=new Item({label:e,options:this.options,"on-path-changed":this._setValue});this.template([["io-menu-item",{option:t,direction:"bottom"}]])}}RegisterIoElement(IoOptionMenu);class IoContextMenu extends IoElement{static get Properties(){return{value:null,options:{type:Array,observe:!0},expanded:Boolean,position:"pointer",button:0,selectable:!1,$options:null}}connectedCallback(){super.connectedCallback(),IoLayerSingleton.addEventListener("pointermove",this._onLayerPointermove),this._parent=this.parentElement,this._parent.style.userSelect="none",this._parent.style.webkitUserSelect="none",this._parent.style.webkitTouchCallout="default",this._parent.addEventListener("pointerdown",this._onPointerdown),this._parent.addEventListener("click",this._onClick),this._parent.addEventListener("contextmenu",this._onContextmenu)}disconnectedCallback(){super.disconnectedCallback(),this.$options&&this.$options.parentElement&&IoLayerSingleton.removeChild(this.$options),IoLayerSingleton.removeEventListener("pointermove",this._onLayerPointermove),this._parent.style.userSelect=null,this._parent.style.webkitUserSelect=null,this._parent.style.webkitTouchCallout=null,this._parent.removeEventListener("pointerdown",this._onPointerdown),this._parent.removeEventListener("contextmenu",this._onContextmenu),this._parent.removeEventListener("pointermove",this._onPointermove),this._parent.removeEventListener("pointerup",this._onPointerup),this._parent.removeEventListener("click",this._onClick),delete this._parent}getBoundingClientRect(){return this._parent.getBoundingClientRect()}_onItemClicked(e){var t=e.composedPath()[0],i=e.detail;t!==this&&(e.stopImmediatePropagation(),void 0!==i.value&&!1!==i.selectable&&this.set("value",i.value),this.dispatchEvent("item-clicked",i,!0),this.requestAnimationFrameOnce(this._collapse))}_onContextmenu(e){2===this.button&&e.preventDefault()}_onPointerdown(e){IoLayerSingleton.x=e.clientX,IoLayerSingleton.y=e.clientY,this._parent.addEventListener("pointermove",this._onPointermove),this._parent.addEventListener("pointerup",this._onPointerup),clearTimeout(this._contextTimeout),"touch"!==e.pointerType?e.button===this.button&&(this.expanded=!0,IoLayerSingleton.skipCollapse=!0):(e.preventDefault(),this._contextTimeout=setTimeout(()=>{this.expanded=!0,IoLayerSingleton.skipCollapse=!0},150))}_onPointermove(e){if(clearTimeout(this._contextTimeout),this.expanded&&this.$options){const t=this.$options.querySelector("io-menu-item");t&&t._onPointermove(e)}}_onPointerup(e){if(clearTimeout(this._contextTimeout),this.expanded&&this.$options){const t=this.$options.querySelector("io-menu-item");t&&t._onPointerup(e,{nocollapse:!0})}this._parent.removeEventListener("pointermove",this._onPointermove),this._parent.removeEventListener("pointerup",this._onPointerup)}_onLayerPointermove(e){this.expanded&&this._onPointermove(e)}_onClick(e){e.button===this.button&&2!==e.button&&(this.expanded=!0)}_collapse(){this.expanded=!1}expandedChanged(){if(this.expanded)this.$options||(this.$options=new IoMenuOptions({$parent:this,"on-item-clicked":this._onItemClicked})),this.$options.parentElement!==IoLayerSingleton&&IoLayerSingleton.appendChild(this.$options),this.$options.setProperties({value:this.bind("value"),expanded:this.bind("expanded"),options:this.options,selectable:this.selectable,position:this.position});else{const t=getElementDescendants(this);for(let e=t.length;e--;)t[e].expanded=!1}}}RegisterIoElement(IoContextMenu);class IoNotify extends IoElement{static get Style(){return`
    :host {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-color: var(--io-color-error);
      width: 100%;
      opacity: 1;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      padding: 0 var(--io-spacing);
    }
    :host > span {
      cursor: default;
      box-sizing: border-box;
      line-height: var(--io-item-height);
      font-size: var(--io-font-size);
      color: var(--io-color);
      padding: 0 var(--io-spacing);
    }
    :host > :nth-child(n+2) {
      flex-shrink: 0;
      align-self: center;
      white-space: nowrap;
    }
    @keyframes io-notification-fade {
      to {
        opacity: 0;
      }
    }
    :host:not([expanded]) {
      animation: io-notification-fade .6s linear forwards;
      pointer-events: none;
    }
    `}static get Properties(){return{expanded:{value:!0,reflect:1}}}static get Listeners(){return{}}constructor(e){super(e),this.template([["span","This app uses cookies for user interface customization."],["span","Agree"],["io-boolicon",{"on-value-set":this._onAgree}],["span","Disagree"],["io-boolicon",{"on-value-set":this._onDisgree}]])}_onAgree(e){e.detail.value?IoStorageFactory.permitted=!0:IoStorageFactory.permitted=!1,this.expanded=!1}_onDisgree(){IoStorageFactory.permitted=!1,this.expanded=!1}}RegisterIoElement(IoNotify),null===IoStorageFactory.permitted&&document.body.appendChild(new IoNotify);class Config{constructor(t){for(let e=0;e<t.length;e++)this.registerConfig(t[e].Config||{})}registerConfig(e){for(const i in e){var t=this;t[i]=t[i]||[],t[i]=[e[i][0]||t[i][0],Object.assign(t[i][1]||{},e[i][1]||{})]}}getConfig(t,e){const i=Object.getOwnPropertyNames(t),o=[];let s=t.__proto__;for(;s;)o.push(s.constructor.name),i.push(...Object.keys(s)),s=s.__proto__;const r={};for(const c in this){const d=c.split("|");1===d.length&&d.splice(0,0,"Object"),-1!==o.indexOf(d[0])&&(r[d[1]]=this[c])}for(const u in e){const p=u.split("|");1===p.length&&p.splice(0,0,"Object"),-1!==o.indexOf(p[0])&&(r[p[1]]=e[u])}const n={};for(let e=0;e<i.length;e++){const g=i[e];var a=t[g]instanceof Binding?t[g].value:t[g],l=null===a?"null":typeof a,h=void 0!==a&&a.constructor?a.constructor.name:"null";"function"!=l&&(a="type:"+l,l="constructor:"+h,h=g.replace("type:","").replace("constructor:",""),n[g]=null,r[a]&&(n[g]=r[a]),r[l]&&(n[g]=r[l]),r[h]&&(n[g]=r[h]))}return n}}class Groups{constructor(t){for(let e=0;e<t.length;e++)this.registerGroups(t[e].Groups||{})}registerGroups(e){for(const t in e)this[t]=this[t]||[],this[t]=[...this[t],...e[t]]}getGroups(t,e,i,o=!1){const s=[];let r=t.__proto__;for(;r;)s.push(r.constructor.name),r=r.__proto__;const n={};for(const p in this){const g=p.split("|");if(1===g.length&&g.splice(0,0,"Object"),g[1]=g[1].split(":"),-1!==s.indexOf(g[0]))if(!("advanced"===g[1][1])||o){n[g[1][0]]=n[g[1][0]]||[];for(let e=0;e<this[p].length;e++){const v=this[p][e];if("string"==typeof v&&v.startsWith("constructor:")){var a=v.replace("constructor:","");for(let e=0;e<i.length;e++)t[i[e]]&&t[i[e]].name===a&&n[g[1][0]].push(i[e])}else if("string"==typeof v&&v.startsWith("type:")){var l=v.replace("type:","");for(let e=0;e<i.length;e++)t[i[e]]&&typeof t[i[e]]===l&&n[g[1][0]].push(i[e])}else n[g[1][0]].push(v)}}}for(const m in e){const f=m.split("|");1===f.length&&f.splice(0,0,"Object"),f[1]=f[1].split(":"),-1!==s.indexOf(f[0])&&("advanced"===f[1][1]&&!o||(n[f[1][0]]=n[f[1][0]]||[],n[f[1][0]].push(...e[m])))}const h={},c=[];for(const b in n){h[b]=h[b]||[];for(const _ in n[b]){var d=n[b][_];const y=new RegExp(d);for(let e=0;e<i.length;e++){var u=i[e];"string"==typeof d?u===d&&-1===c.indexOf(u)&&(h[b].push(u),c.push(u)):"object"==typeof d&&y.exec(u)&&-1===c.indexOf(u)&&(h[b].push(u),c.push(u))}}}if(0===c.length)h.properties=i;else if(o){h.advanced=h.advanced||[];for(let e=0;e<i.length;e++)-1===c.indexOf(i[e])&&h.advanced.push(i[e])}for(const x in h)0===h[x].length&&delete h[x];return delete h.hidden,h}}class Widgets{constructor(t){for(let e=0;e<t.length;e++)this.registerWidgets(t[e].Widgets||{})}registerWidgets(e){for(const t in e)this[t]=this[t]||[],this[t]=[...this[t],...e[t]]}getWidgets(e){const t=[];let i=e.__proto__;for(;i;)t.push(i.constructor.name),i=i.__proto__;let o=null;const s={};for(const a in this){var r=a.split("|"),n=r[0],r=r[1];if(-1!==t.indexOf(n)){const l=this[a];l[1]=l[1]||{},l[1].$value?l[1].value=e[l[1].$value]:l[1].value=e,r?s[r]=l:o=l}}return{main:o,groups:s}}}class IoBreadcrumbs extends IoElement{static get Style(){return`
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      padding: var(--io-spacing);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      overflow-x: hidden;
    }
    :host > io-item:hover {
      text-decoration: underline;
    }
    :host > io-item:first-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-left: var(--io-spacing);
    }
    :host > io-item:last-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-right: var(--io-spacing);
    }
    :host > io-item:not(:first-of-type):before {
      content: '>';
      margin: 0 var(--io-spacing);
      padding: 0 var(--io-spacing) 0 0;
      opacity: 0.25;
    }
    `}static get Properties(){return{value:Object,selected:null,options:{type:Array,observe:!0}}}_onClick(e){this.set("selected",this.options[e.detail.value])}valueChanged(){this.options.length=0,this.options.push(this.value)}selectedChanged(){var e=this.options.indexOf(this.selected);-1!==e?this.options.length=e+1:this.options.push(this.selected)}changed(){const t=[];for(let e=0;e<this.options.length;e++)t.push(["io-item",{value:e,label:getLabel(this.options[e]),"on-item-clicked":this._onClick}]);this.template(t)}}function getLabel(e){return e instanceof Array?String(`${e.constructor.name} (${e.length})`):"object"==typeof e?String(""+e.constructor.name):String(e)}RegisterIoElement(IoBreadcrumbs);class IoInspector extends IoElement{static get Style(){return`
    :host {
      @apply --io-column;
    }
    :host > * {
      flex-shrink: 0;
    }
    :host > .inspector-header {
      margin-bottom: var(--io-spacing);
      flex-grow: 0;
    }
    :host > .inspector-header > io-breadcrumbs {
      flex: 1 1;
    }
    :host > .inspector-header > io-boolicon {
      width: calc(var(--io-spacing) + var(--io-item-height));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-boolicon:not([value]) {
      opacity: 0.25;
    }
    :host > .inspector-header > io-string {
      margin: 0 var(--io-spacing);
      padding: calc(2 * var(--io-spacing));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-string:focus {
      width: 6em;
    }
    :host > .inspector-header > io-string:empty:before {
      content: ' 🔍';
      white-space: pre;
      visibility: visible;
      opacity: 0.33;
    }
    :host > io-collapsable > io-boolean,
    :host > io-object > io-boolean {
      text-transform: capitalize;
    }
    :host > io-object > io-properties {
      border-radius: var(--io-border-radius);
      background-color: var(--io-background-color) !important;
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      box-shadow: var(--io-shadow-inset);
      padding: var(--io-spacing);
      overflow: hidden;
    }
    :host > io-object > io-properties:not([horizontal])[labeled] {
      grid-template-columns: minmax(6em, min-content) minmax(12em, 1fr);
    }
    :host > io-object > io-properties:not([horizontal])[labeled] > span.io-item {
      text-align: right;
    }
    :host io-properties > io-item.select {
      color: var(--io-color-link);
    }
    :host io-properties > io-item.select:hover {
      text-decoration: underline;
    }
    `}static get Properties(){return{value:{type:Object,observe:!0},selected:{type:Object,observe:!0},search:String,advanced:!1,groups:Object,config:Object,widgets:Object,autoExpand:["main","properties"]}}static get Listeners(){return{"item-clicked":"_onItemClicked"}}constructor(e){super(e),Object.defineProperty(this,"uuid",{value:null,writable:!0})}_onItemClicked(e){e.stopPropagation();var t=e.detail.value;const i=e.composedPath()[0];t&&"object"==typeof t&&i.classList.contains("select")&&this.set("selected",t)}valueChanged(){this.selected=this.value}advancedChanged(){delete this._currentCfgLen}selectedMutated(){clearTimeout(this._cfgTimeout),this._cfgTimeout=setTimeout(()=>{this._changed()},100)}_getConfig(){this._config=this.__proto__.__config.getConfig(this.selected,this.config)}_getGroups(){this._groups=this.__proto__.__groups.getGroups(this.selected,this.groups,Object.getOwnPropertyNames(this._config),this.advanced)}_getWidgets(){this._widgets=this.__proto__.__widgets.getWidgets(this.selected,this.widgets)}_getAll(){var e=Object.getOwnPropertyNames(this.selected).length;this._config&&this.selected===this._currentCfgObj&&e===this._currentCfgLen||(this._currentCfgObj=this.selected,this._currentCfgLen=e,this._getConfig(),this._getGroups(),this._getWidgets())}changed(){this.advanced=IoStorageFactory({value:!1,storage:"local",key:"inspector-show-advanced"}),this._changedThrottled()}_changedThrottled(){this.throttle(this._changed,null,!0)}_changed(){this._getAll(),this.uuid=genUUID(this.selected);const e=[["div",{class:"inspector-header io-row io-panel"},[["io-breadcrumbs",{value:this.value,selected:this.bind("selected")}],["io-string",{id:"search",value:this.bind("search"),live:!0}],["io-boolicon",{value:this.bind("advanced"),true:"icons:less",false:"icons:more"}]]],this._widgets.main||null];for(const o in this._widgets.groups){var t;this._groups[o]||(t=-1!==this.autoExpand.indexOf(o),e.push(["io-collapsable",{label:o,expanded:IoStorageFactory({value:t,storage:"local",key:this.uuid+"-"+o}),elements:[this._widgets.groups[o]],class:"io-panel"}]))}for(const s in this._groups){var i=-1!==this.autoExpand.indexOf(s);e.push(["io-object",{label:s,expanded:IoStorageFactory({value:i,storage:"local",key:this.uuid+"-"+s}),value:this.selected,properties:this._groups[s],config:this._config,slotted:this._widgets.groups[s]||[]}])}this.template(e)}static get Config(){return{"type:object":["io-item",{class:"select"}],"type:null":["io-item",{class:"select"}]}}static get Groups(){return{"Object|hidden":[/^_/],"HTMLElement|main":["localName","tagName","nodeName",/class/i,/attribute/i],"HTMLElement|hidden":[/^on/,/^[A-Z0-9_]*$/,"childElementCount"],"HTMLElement|content":[/content/i,/inner/i,/outer/i],"HTMLElement|display":[/width/i,/height/i,/top/i,/left/i,/scroll/i,/style/i],"HTMLElement|hierarchy":[/parent/i,/child/i,/element/i,/root/i,/slot/i,/sibling/i,/document/i]}}static get Widgets(){return{}}static RegisterConfig;static RegisterGroups;static RegisterWidgets;static Register(){throw new Error("Method not implemented.")}}function genUUID(e){var t="io-object-collapse-state-"+e.constructor.name;t+="-"+e.guid||e.uuid||e.id||"";const i=JSON.stringify(Object.keys(e));let o=0;for(let e=0;e<i.length;e++)o=(o<<5)-o+i.charCodeAt(e),o|=0;return o=(-o).toString(16),t+="-"+o}IoInspector.Register=function(){Object.defineProperty(this.prototype,"__config",{value:new Config(this.prototype.__protochain)}),Object.defineProperty(this.prototype,"__groups",{value:new Groups(this.prototype.__protochain)}),Object.defineProperty(this.prototype,"__widgets",{value:new Widgets(this.prototype.__protochain)})},IoInspector.RegisterConfig=function(e){this.prototype.__config.registerConfig(e)},IoInspector.RegisterGroups=function(e){this.prototype.__groups.registerGroups(e)},IoInspector.RegisterWidgets=function(e){this.prototype.__widgets.registerWidgets(e)},RegisterIoElement(IoInspector),IoInspector.Register(),IoInspector.RegisterGroups({"Array|main":[/^[0-9]+$/]});class IoProperties extends IoElement{static get Style(){return`
    :host {
      display: grid;
      grid-gap: var(--io-spacing);
      justify-self: stretch;
      justify-items: start;
      white-space: nowrap;
    }
    :host[horizontal] {
      grid-auto-flow: column;
    }
    :host[horizontal][labeled] {
      grid-template-rows: auto auto;
    }
    :host:not([horizontal]) {
      grid-template-columns: auto;
    }
    :host:not([horizontal])[labeled] {
      grid-template-columns: min-content minmax(4em, 1fr);
    }
    :host > span.io-item {
      max-width: 8em !important;
      width: 100%;
    }
    :host:not([horizontal]) > * {
      max-width: 100%;
    }
    :host[labeled] > :first-child {
      grid-column: span 2;
      width: 100%;
    }
    :host > io-object {}
    :host > io-object {
      padding: 0;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      border-color: transparent;
      background-color: transparent;
      background-image: none;
    }
    :host > io-object,
    :host > io-properties,
    :host > io-number,
    :host > io-string {
      width: auto;
      justify-self: stretch;
    }
    :host io-properties {
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    `}static get Properties(){return{labeled:{value:!0,reflect:1},horizontal:{value:!1,reflect:1},value:{type:Object,observe:!0},properties:Array,slotted:Array,config:Object}}static get Config(){return{"type:string":["io-string",{}],"type:number":["io-number",{step:1e-7}],"type:boolean":["io-boolean",{}],"type:object":["io-object",{}],"type:null":["io-string",{}],"type:undefined":["io-string",{}]}}_onValueSet(e){var t,i;e.detail.object||(i=e.composedPath()[0])!==this&&(e.stopImmediatePropagation(),null!==(t=i.id)&&"value"===e.detail.property&&(i=e.detail.value,e=e.detail.oldValue,this.value[t]=i,e={object:this.value,property:t,value:i,oldValue:e},this.dispatchEvent("object-mutated",e,!1,window)))}_getConfig(){var e=Object.getOwnPropertyNames(this.value).length;return this._config&&this.config===this._currentConfig&&this.value===this._currentValue&&e===this._currentLength||(this._currentConfig=this.config,this._currentValue=this.value,this._currentLength=e,this._config=this.__proto__.__config.getConfig(this.value,this.config)),this._config}valueMutated(){this._changedThrottled(),clearTimeout(this._cfgTimeout),this._cfgTimeout=setTimeout(()=>{this._updateChildren()},100)}_updateChildren(){var t=this.querySelectorAll(":scope > *, io-properties > *");const i=this.filterObjects(this.value,e=>"object"==typeof e,1);for(let e=0;e<t.length;e++){const o=t[e];"object"==typeof o.value&&-1!==i.indexOf(o.value)&&o.changed&&o.changed()}}changed(){this._changedThrottled()}_changedThrottled(){this.throttle(this._changed,null)}_changed(){this._config=this._getConfig();var t=this._config;const i=[];var o=this.properties.length?this.properties:Object.keys(t);this.slotted.length?i.push(this.slotted):i.push(["slotted-dummy"]);for(let e=0;e<o.length;e++){var s=o[e];if(!this.properties.length||-1!==this.properties.indexOf(s)){var r=t[s][0],n=t[s][1],a=t[s].label||s;const l={title:a,id:s,value:this.value[s],"on-value-set":this._onValueSet};l.config=this.config,i.push(this.labeled?["span",{class:"io-item"},a+":"]:null,[r,Object.assign(l,n)])}}this.template(i)}static RegisterConfig}const RegisterIoProperties=function(e){RegisterIoElement(e),Object.defineProperty(e.prototype,"__config",{value:new Config(e.prototype.__protochain)})};IoProperties.RegisterConfig=function(e){this.prototype.__config.registerConfig(e)},RegisterIoProperties(IoProperties);class IoObject extends IoElement{static get Style(){return`
    :host {
      @apply --io-panel;
    }
    :host > io-boolean {
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 1.125em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > :nth-child(n+2) {
      margin-top: var(--io-spacing);
    }
    `}static get Properties(){return{value:Object,properties:Array,config:Object,labeled:!0,label:{reflect:1},expanded:{type:Boolean,reflect:1},slotted:Array,role:"region"}}changed(){var e=this.label||this.value.constructor.name;const t=[["io-boolean",{true:e,false:e,value:this.bind("expanded")}]];this.expanded&&t.push(["io-properties",{value:this.value,properties:this.properties,config:this.config,labeled:this.labeled,slotted:this.slotted}]),this.template(t),this.setAttribute("aria-expanded",String(this.expanded))}}RegisterIoElement(IoObject);export{Binding,Change,ChangeQueue,EventDispatcher,FunctionBinder,IoBoolean,IoBoolicon,IoButton,IoCollapsable,IoColorPanel,IoColorPicker,IoColorSlider,IoColorSliderAlpha,IoColorSliderBlue,IoColorSliderCyan,IoColorSliderGreen,IoColorSliderHs,IoColorSliderHue,IoColorSliderKey,IoColorSliderLevel,IoColorSliderMagenta,IoColorSliderRed,IoColorSliderSaturation,IoColorSliderSl,IoColorSliderSv,IoColorSliderValue,IoColorSliderYellow,IoColorVector,IoContent,IoContextMenu,IoElement,IoElementDemo,IoGl,IoIcon,IoIconsetSingleton,IoInspector,IoItem,IoLadderSingleton,IoLayerSingleton,IoLayout,IoMatrix,IoMdView,IoMdViewSelector,IoMenuItem,IoMenuOptions,IoNode,IoNodeMixin,IoNotify,IoNumber,IoNumberSlider,IoNumberSliderRange,IoObject,IoOptionMenu,IoProperties,IoSelector,IoSelectorSidebar,IoSelectorTabs,IoServiceLoader,IoSidebar,IoSlider,IoSliderRange,IoStorageFactory,IoString,IoSwitch,IoThemeSingleton,IoVector,Item,Options,Path,Properties,Property,PropertyBinder,ProtoChain,ProtoListeners,ProtoProperties,ProtoProperty,RegisterIoElement,RegisterIoNode,buildTree};