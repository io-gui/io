const hardenListenerDefinition=e=>e instanceof Array?e:[e],assignListenerDefinition=(e,t)=>{const i=e.findIndex((e=>e[0]===t[0]));-1!==i?e[i][1]?e[i][1]=Object.assign(e[i][1],t[1]):t[1]&&(e[i][1]=t[1]):e.push(t)},listenerFromDefinition=(e,t)=>{const i=["string"==typeof t[0]?e[t[0]]:t[0]];return t[1]&&i.push(t[1]),i};class EventDispatcher{node;isEventTarget;protoListeners={};propListeners={};addedListeners={};constructor(e){this.node=e,this.isEventTarget=e instanceof EventTarget,this.setProtoListeners(e)}setProtoListeners(e){for(const t in e._protochain?.listeners){this.protoListeners[t]=[];for(let i=0;i<e._protochain.listeners[t].length;i++){const s=listenerFromDefinition(e,e._protochain.listeners[t][i]);this.protoListeners[t]=[s]}if(this.isEventTarget&&this.protoListeners[t].length){const e=this.protoListeners[t][0];EventTarget.prototype.addEventListener.call(this.node,t,e[0],e[1])}}}applyPropListeners(e){const t={};for(const i in e)if(i.startsWith("on-")){const s=i.slice(3,i.length),n=hardenListenerDefinition(e[i]),o=listenerFromDefinition(this.node,n);t[s]=[o]}const i=this.propListeners;for(const e in i)if(!t[e]){if(this.isEventTarget){const t=hardenListenerDefinition(i[e][0]),s=listenerFromDefinition(this.node,t);EventTarget.prototype.removeEventListener.call(this.node,e,s[0],s[1])}delete i[e]}for(const e in t){if(this.isEventTarget){const s=hardenListenerDefinition(t[e][0]),n=listenerFromDefinition(this.node,s);if(i[e]){const t=hardenListenerDefinition(i[e][0]),s=listenerFromDefinition(this.node,t);(s!==n||n[1]&&JSON.stringify(s[1])!==JSON.stringify(n[1]))&&(EventTarget.prototype.removeEventListener.call(this.node,e,s[0],s[1]),EventTarget.prototype.addEventListener.call(this.node,e,n[0],n[1]))}else EventTarget.prototype.addEventListener.call(this.node,e,n[0],n[1])}i[e]=t[e]}}addEventListener(e,t,i){this.addedListeners[e]=this.addedListeners[e]||[],this.addedListeners[e].push(i?[t,i]:[t]),this.isEventTarget&&EventTarget.prototype.addEventListener.call(this.node,e,t,i)}removeEventListener(e,t,i){if(t){const s=this.addedListeners[e].findIndex((e=>e[0]=t));this.addedListeners[e].splice(s,1),this.isEventTarget&&EventTarget.prototype.removeEventListener.call(this.node,e,t,i)}else{for(let t=0;t<this.addedListeners[e].length;t++)if(this.isEventTarget){const i=this.addedListeners[e][t];EventTarget.prototype.removeEventListener.call(this.node,e,i[0],i[1])}this.addedListeners[e].length=0}0===this.addedListeners[e].length&&delete this.addedListeners[e]}dispatchEvent(e,t,i=!0,s=this.node){const n={detail:t,target:s,path:[s]};if(s instanceof EventTarget)EventTarget.prototype.dispatchEvent.call(s,new CustomEvent(e,{detail:t,bubbles:i,composed:!0,cancelable:!0}));else{if(this.protoListeners[e])for(let t=0;t<this.protoListeners[e].length;t++)this.protoListeners[e][t][0].call(s,n);if(this.propListeners[e]&&this.propListeners[e][0][0].call(s,n),this.addedListeners[e])for(let t=0;t<this.addedListeners[e].length;t++)this.addedListeners[e][t][0].call(s,n)}}dispose(){for(const e in this.protoListeners){if(this.isEventTarget)for(let t=0;t<this.protoListeners[e].length;t++){const i=this.protoListeners[e][t];EventTarget.prototype.removeEventListener.call(this.node,e,i[0],i[1])}this.protoListeners[e].length=0,delete this.protoListeners[e]}for(const e in this.propListeners){if(this.isEventTarget){const t=this.propListeners[e][0];EventTarget.prototype.removeEventListener.call(this.node,e,t[0],t[1])}this.propListeners[e].length=0,delete this.propListeners[e]}for(const e in this.addedListeners){if(this.isEventTarget)for(let t=this.addedListeners[e].length;t--;){const i=this.addedListeners[e][t];EventTarget.prototype.removeEventListener.call(this.node,e,i[0],i[1])}this.addedListeners[e].length=0,delete this.addedListeners[e]}delete this.node,delete this.protoListeners,delete this.propListeners,delete this.addedListeners}}class Binding{node;property="";targets=[];targetProperties=new WeakMap;constructor(e,t){this.node=e,this.property=t,this.onTargetChanged=this.onTargetChanged.bind(this),this.onSourceChanged=this.onSourceChanged.bind(this),this.node.addEventListener(`${this.property}-changed`,this.onSourceChanged)}set value(e){this.node[this.property]=e}get value(){return this.node[this.property]}addTarget(e,t){e._properties[t].binding=this,e.setProperty(t,this.node[this.property]);const i=e;-1===this.targets.indexOf(i)&&this.targets.push(i);const s=this.getTargetProperties(i);-1===s.indexOf(t)&&(s.push(t),i.addEventListener(`${t}-changed`,this.onTargetChanged))}removeTarget(e,t){const i=e,s=this.getTargetProperties(i);if(t){const e=s.indexOf(t);-1!==e&&s.splice(e,1),i.removeEventListener(`${t}-changed`,this.onTargetChanged)}else{for(let e=s.length;e--;)i.removeEventListener(`${s[e]}-changed`,this.onTargetChanged);s.length=0}0===s.length&&this.targets.splice(this.targets.indexOf(i),1)}getTargetProperties(e){let t=this.targetProperties.get(e);return t||(t=[],this.targetProperties.set(e,t),t)}onTargetChanged(e){const t=this.node[this.property],i=e.detail.value;if(t!==i){if("number"==typeof i&&isNaN(i)&&"number"==typeof t&&isNaN(t))return;this.node[this.property]=i}}onSourceChanged(e){const t=e.detail.value;for(let e=this.targets.length;e--;){const i=this.targets[e],s=this.getTargetProperties(i);for(let e=s.length;e--;){const n=s[e],o=i[n];if(o!==t){if("number"==typeof t&&isNaN(t)&&"number"==typeof o&&isNaN(o))continue;i[n]=t}}}}dispose(){this.node.removeEventListener(`${this.property}-changed`,this.onSourceChanged);for(let e=this.targets.length;e--;)this.removeTarget(this.targets[e]);this.targets.length=0,delete this.node,delete this.property,delete this.targets,delete this.targetProperties,delete this.onTargetChanged,delete this.onSourceChanged}}class ProtoProperty{value;type;binding;reflect=0;notify=!0;observe=!1;constructor(e){if(null==e)this.value=e;else if("function"==typeof e)this.type=e;else if(e instanceof Binding)this.value=e.value,this.type=void 0!==e.value&&null!==e.value?e.value.constructor:void 0,this.binding=e;else if(e&&e.constructor===Object){const t=e;this.value=void 0!==t.value?t.value:void 0,this.type=void 0!==t.type?t.type:void 0!==t.value&&null!==t.value?t.value.constructor:void 0,this.binding=t.binding instanceof Binding?t.binding:void 0,this.reflect=void 0!==t.reflect?t.reflect:0,this.notify=void 0===t.notify||t.notify,this.observe=void 0!==t.observe&&t.observe,void 0!==this.binding&&(this.value=this.binding.value)}else e&&e.constructor===Object||(this.value=e,this.type=e.constructor);void 0===this.value&&"function"==typeof this.type&&(this.type===Boolean?this.value=!1:this.type===String?this.value="":this.type===Number?this.value=0:this.type===Array?this.value=[]:this.type===Object?this.value={}:this.value=new this.type)}}const assignProtoProperty=(e,t)=>{void 0!==t.value&&(e.value=t.value),void 0!==t.type&&(e.type=t.type),0!==t.reflect&&(e.reflect=t.reflect),!0!==t.notify&&(e.notify=t.notify),!1!==t.observe&&(e.observe=t.observe),void 0!==t.binding&&(e.binding=t.binding)};class Property{value=void 0;type=void 0;binding=void 0;reflect=0;notify=!0;observe=!1;constructor(e){if(this.value=e.value,this.type=e.type,this.binding=e.binding,this.reflect=e.reflect,this.notify=e.notify,this.observe=e.observe,this.binding instanceof Binding)this.value=this.binding.value;else if(this.type===Array&&this.value instanceof Array)this.value=[...this.value];else if("function"==typeof this.type){const e=this.value instanceof Object;if(void 0===this.value&&(this.value=new this.type),e)try{this.value=Object.assign(new this.type,this.value)}catch(e){console.log(e)}}}}class ProtoChain{constructors=[];functions=[];properties={};listeners={};style="";observedObjects=[];constructor(e){let t=e.prototype;for(;t&&"IoNodeMixinConstructor"!==e.name&&e!==HTMLElement&&e!==Object&&e!==Array;){this.constructors.push(e);const i=Object.getOwnPropertyNames(t);for(let e=0;e<i.length;e++){const s=i[e];if(s.startsWith("_")||s.startsWith("on")){const e=Object.getOwnPropertyDescriptor(t,s);if(void 0===e||e.get||e.set)continue;"function"==typeof t[s]&&-1===this.functions.indexOf(s)&&this.functions.push(s)}}e.Style&&-1===this.style.indexOf(e.Style)&&(this.style=e.Style+"\n"+this.style),t=t.__proto__,e=t.constructor}for(let e=this.constructors.length;e--;){const t=this.constructors[e].Properties;for(const e in t){const i=new ProtoProperty(t[e]);this.properties[e]?assignProtoProperty(this.properties[e],i):this.properties[e]=i}const i=this.constructors[e].Listeners;for(const e in i)i[e]&&(this.listeners[e]=this.listeners[e]||[],assignListenerDefinition(this.listeners[e],hardenListenerDefinition(i[e])))}for(const e in this.properties)this.properties[e].observe&&this.observedObjects.push(e)}bindFunctions(e){for(let t=this.functions.length;t--;)Object.defineProperty(e,this.functions[t],{value:e[this.functions[t]].bind(e)})}}class ChangeQueue{node;changes=[];dispatching=!1;constructor(e){this.node=e,Object.defineProperty(this,"node",{enumerable:!1,writable:!1}),Object.defineProperty(this,"changes",{enumerable:!1,writable:!1}),Object.defineProperty(this,"dispatching",{enumerable:!1})}queue(e,t,i){const s=this.changes.findIndex((t=>t.property===e));-1===s?this.changes.push({property:e,value:t,oldValue:i}):this.changes[s].value=t}dispatch(){if(!0===this.dispatching)return;this.dispatching=!0;let e=!1;for(;this.changes.length;){const t=this.changes[0];this.changes.splice(0,1);const i=t.property;t.value!==t.oldValue&&(e=!0,this.node[i+"Changed"]&&this.node[i+"Changed"](t),this.node.dispatchEvent(i+"-changed",t))}e&&(this.node.applyCompose(),this.node.changed()),this.dispatching=!1}dispose(){this.changes.length=0,delete this.node,delete this.changes}}function IoNodeMixin(o){const r=class extends o{static get Properties(){return{lazy:Boolean}}get compose(){return null}_properties={};_bindings={};_changeQueue;_eventDispatcher;constructor(e={},...t){super(...t),this._protochain.bindFunctions(this),this._changeQueue=new ChangeQueue(this),Object.defineProperty(this,"_changeQueue",{enumerable:!1}),this._eventDispatcher=new EventDispatcher(this),Object.defineProperty(this,"_eventDispatcher",{enumerable:!1});for(const e in this._protochain.properties){const t=new Property(this._protochain.properties[e]);this._properties[e]=t;const i=t.value;null!=i&&("object"==typeof i?this.queue(e,i,void 0):void 0!==t.reflect&&t.reflect>=1&&this._isIoElement&&this.setAttribute(e,i)),t.binding&&t.binding.addTarget(this,e)}Object.defineProperty(this,"_properties",{enumerable:!1}),Object.defineProperty(this,"_bindings",{enumerable:!1}),Object.defineProperty(this,"objectMutated",{enumerable:!1,value:this.objectMutated.bind(this)}),Object.defineProperty(this,"objectMutatedThrottled",{enumerable:!1,value:this.objectMutatedThrottled.bind(this)}),Object.defineProperty(this,"queueDispatch",{enumerable:!1,value:this.queueDispatch.bind(this)}),Object.defineProperty(this,"queueDispatchLazy",{enumerable:!1,value:this.queueDispatchLazy.bind(this)}),this._protochain.observedObjects.length&&window.addEventListener("object-mutated",this.objectMutated),this.applyProperties(e)}setProperty(e,t,i){const s=this._properties[e],n=s.value;if(t!==n){const o=t instanceof Binding?t:void 0;if(o){const i=s.binding;i&&o!==i&&i.removeTarget(this,e),o.addTarget(this,e),t=o.value}s.value=t,s.notify&&n!==t&&(this.queue(e,t,n),i||this.queueDispatch()),void 0!==s.reflect&&s.reflect>=1&&this._isIoElement&&this.setAttribute(e,t)}}applyProperties(e){for(const t in e)void 0!==this._properties[t]&&this.setProperty(t,e[t],!0);this._eventDispatcher.applyPropListeners(e),this.queueDispatch()}setProperties(e){for(const t in e)void 0!==this._properties[t]&&this.setProperty(t,e[t],!0);this.queueDispatch()}setValue(e){if(this.value!==e){const t=this.value;this.setProperty("value",e),this.dispatchEvent("value-set",{value:e,oldValue:t},!1)}}dispose(){this._changeQueue.dispose(),this._propertyBinder.dispose(),this._eventDispatcher.dispose();for(const e in this._properties)this._properties[e].binding&&this._properties[e].binding?.removeTarget(this._node,e);for(const e in this._bindings)this._bindings[e].dispose(),delete this._bindings[e];this._protochain.observedObjects.length&&window.removeEventListener("object-mutated",this.objectMutated)}changed(){}applyCompose(){const e=this.compose;if(this.compose)for(const t in e){const i=this._properties[t].value;if(i._isIoNode)i.applyProperties(e[t]);else for(const s in e[t])i[s]=e[t][s]}}queue(e,t,i){this._changeQueue.queue(e,t,i)}queueDispatch(){this.lazy?(t.push(this.queueDispatchLazy),this.throttle(this.queueDispatchLazy)):this._changeQueue.dispatch()}queueDispatchLazy(){this._changeQueue.dispatch()}objectMutated(e){for(let t=0;t<this._protochain.observedObjects.length;t++){const i=this._protochain.observedObjects[t];if(this._properties[i].value===e.detail.object)return void this.throttle(this.objectMutatedThrottled,i,!1)}}objectMutatedThrottled(e){this[e+"Mutated"]&&this[e+"Mutated"](),this.applyCompose(),this.changed()}bind(e){return this._bindings[e]=this._bindings[e]||new Binding(this,e),this._bindings[e]}unbind(e){this._bindings[e]&&this._bindings[e].dispose(),delete this._bindings[e],this._properties[e].binding&&this._properties[e].binding?.removeTarget(this,e)}addEventListener(e,t,i){this._eventDispatcher.addEventListener(e,t,i)}removeEventListener(e,t,i){this._eventDispatcher.removeEventListener(e,t,i)}dispatchEvent(e,t={},i=!1,s){this._eventDispatcher.dispatchEvent(e,t,i,s)}throttle(e,n,o){if(-1!==t.indexOf(e)||(t.push(e),o))if(-1===i.indexOf(e)&&i.push(e),s.has(e)&&"object"!=typeof n){const t=s.get(e);-1===t.indexOf(n)&&t.push(n)}else s.set(e,[n]);else e(n)}requestAnimationFrameOnce(e){!function requestAnimationFrameOnce(e){-1===n.indexOf(e)&&n.push(e)}(e)}filterObject(e,t,i=5,s=[],n=0){if(-1===s.indexOf(e)&&(s.push(e),!(n>i))){if(n++,t(e))return e;for(const o in e){const r=e[o]instanceof Binding?e[o].value:e[o];if(t(r))return r;if("object"==typeof r){const e=this.filterObject(r,t,i,s,n);if(e)return e}}}}filterObjects(e,t,i=5,s=[],n=0){const o=[];if(-1!==s.indexOf(e))return o;if(s.push(e),n>i)return o;n++,t(e)&&-1===o.indexOf(e)&&o.push(e);for(const r in e){const h=e[r]instanceof Binding?e[r].value:e[r];if(t(h)&&-1===o.indexOf(h)&&o.push(h),"object"==typeof h){const e=this.filterObjects(h,t,i,s,n);for(let t=0;t<e.length;t++)-1===o.indexOf(e[t])&&o.push(e[t])}}return o}import(t){const i=new URL(t,String(window.location)).href;return new Promise((s=>{!t||e[i]?s(i):import(i).then((()=>{e[i]=!0,s(i)}))}))}preventDefault(e){e.preventDefault()}stopPropagation(e){e.stopPropagation()}};return Object.defineProperty(r,"name",{value:"IoNodeMixinConstructor"}),r}const RegisterIoNode=function(e){const t=e.prototype;Object.defineProperty(t,"_isIoNode",{value:!0}),Object.defineProperty(e,"_registeredAs",{value:e.name}),Object.defineProperty(t,"_protochain",{value:new ProtoChain(e)});for(const e in t._protochain.properties)Object.defineProperty(t,e,{get:function(){return this._properties[e].value},set:function(t){this.setProperty(e,t)},configurable:!0})};class IoNode extends(IoNodeMixin(Object)){}RegisterIoNode(IoNode);const e={},t=[],i=[],s=new WeakMap,n=[],animate=function(){requestAnimationFrame(animate);for(let e=t.length;e--;)t.splice(t.indexOf(t[e]),1);for(let e=i.length;e--;){const t=s.get(i[e]);for(let s=t.length;s--;)i[e](t[s]),t.splice(t.indexOf(s),1);i.splice(i.indexOf(i[e]),1)}for(let e=n.length;e--;){const t=n[e];n.splice(n.indexOf(t),1),t()}};requestAnimationFrame(animate);class IoElement extends(IoNodeMixin(HTMLElement)){static get Style(){return":host[hidden] { display: none; } :host[disabled] { pointer-events: none; opacity: 0.5; }"}static get Properties(){return{$:{type:Object,notify:!1},tabindex:{type:String,reflect:1},contenteditable:{type:Boolean,reflect:1},class:{type:String,reflect:1},role:{type:String,reflect:1},label:{type:String,reflect:1},name:{type:String,reflect:1},title:{type:String,reflect:1},id:{type:String,reflect:-1},hidden:{type:Boolean,reflect:1},disabled:{type:Boolean,reflect:1}}}static get Listeners(){return{"focus-to":"_onFocusTo"}}static get observedAttributes(){const e=[];for(const t in this.prototype._protochain.properties){const i=this.prototype._protochain.properties[t].reflect;-1!==i&&2!==i||e.push(t)}return e}attributeChangedCallback(e,t,i){const s=this._properties[e].type;s===Boolean?null===i?this[e]=!1:""===i&&(this[e]=!0):this[e]=s===Number||s===String?new s(i):s===Object||s===Array?JSON.parse(i):"function"==typeof s?new s(JSON.parse(i)):isNaN(Number(i))?i:Number(i)}connectedCallback(){"function"==typeof this.onResized&&c.observe(this)}disconnectedCallback(){"function"==typeof this.onResized&&c.unobserve(this)}template(e,t){const i=buildTree()(["root",e]).children;(t=t||this)===this&&this.setProperty("$",{}),this.traverse(i,t)}traverse(e,t){const i=t.children;for(;i.length>e.length;){const e=i[i.length-1];t.removeChild(e)}if(i.length<e.length){const s=document.createDocumentFragment();for(let t=i.length;t<e.length;t++){const i=constructElement(e[t]);s.appendChild(i)}t.appendChild(s)}for(let s=0;s<i.length;s++){const n=i[s];if(n.localName!==e[s].name){const i=n,o=constructElement(e[s]);t.insertBefore(o,i),t.removeChild(i)}else n.removeAttribute("className"),n._isIoElement?n.applyProperties(e[s].props):applyNativeElementProps(n,e[s].props)}for(let t=0;t<e.length;t++){const s=i[t];e[t].props.id&&(this.$[e[t].props.id]=s),void 0!==e[t].children&&("string"==typeof e[t].children?(this.flattenTextNode(s),s._textNode.nodeValue=String(e[t].children)):"object"==typeof e[t].children&&this.traverse(e[t].children,s))}}flattenTextNode(e){if(0===e.childNodes.length&&e.appendChild(document.createTextNode("")),"#text"!==e.childNodes[0].nodeName&&(e.innerHTML="",e.appendChild(document.createTextNode(""))),e._textNode=e.childNodes[0],e.childNodes.length>1){const t=e.textContent;for(let t=e.childNodes.length;t--;)0!==t&&e.removeChild(e.childNodes[t]);e._textNode.nodeValue=t}}get textNode(){return this.flattenTextNode(this),this._textNode.nodeValue}set textNode(e){this.flattenTextNode(this),this._textNode.nodeValue=String(e)}applyProperties(e){if(super.applyProperties(e),e.style)for(const t in e.style)this.style[t]=e.style[t]}setAttribute(e,t){!0===t?HTMLElement.prototype.setAttribute.call(this,e,""):!1===t||""===t?this.removeAttribute(e):"string"!=typeof t&&"number"!=typeof t||this.getAttribute(e)!==String(t)&&HTMLElement.prototype.setAttribute.call(this,e,String(t))}applyCompose(){super.applyCompose(),this.applyAria()}applyAria(){this.label?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"),this.disabled?this.setAttribute("aria-disabled",!0):this.removeAttribute("aria-disabled")}_onFocusTo(e){const t=e.composedPath()[0],i=e.detail.dir,s=e.detail.rect;if(s.center={x:s.x+s.width/2,y:s.y+s.height/2},t!==this){let n=t,o=1/0,r=1/0;const h=this.querySelectorAll('[tabindex="0"]:not([disabled])');for(let e=h.length;e--;){if(!h[e].offsetParent)continue;if("visible"!==window.getComputedStyle(h[e]).visibility)continue;const t=h[e].getBoundingClientRect();switch(t.center={x:t.x+t.width/2,y:t.y+t.height/2},i){case"right":if(t.left>=s.right-1){const i=Math.abs(t.left-s.right),a=Math.abs(t.center.y-s.center.y);i<o||a<r/3?(n=h[e],o=i,r=a):i===o&&a<r&&(n=h[e],r=a)}break;case"left":if(t.right<=s.left+1){const i=Math.abs(t.right-s.left),a=Math.abs(t.center.y-s.center.y);i<o||a<r/3?(n=h[e],o=i,r=a):i===o&&a<r&&(n=h[e],r=a)}break;case"down":if(t.top>=s.bottom-1){const i=Math.abs(t.center.x-s.center.x),a=Math.abs(t.top-s.bottom);a<r||i<o/3?(n=h[e],o=i,r=a):a===r&&i<o&&(n=h[e],o=i)}break;case"up":if(t.bottom<=s.top+1){const i=Math.abs(t.center.x-s.center.x),a=Math.abs(t.bottom-s.top);a<r||i<o/3?(n=h[e],o=i,r=a):a===r&&i<o&&(n=h[e],o=i)}}}n!==t&&(n.focus(),e.stopPropagation())}}focusTo(e){const t=this.getBoundingClientRect();this.dispatchEvent("focus-to",{dir:e,rect:t},!0)}}const o=document.createElement("div");o.innerHTML="No support for custom elements detected! <br />Sorry, modern browser is required to view this page.<br />";const r={},h=new RegExp("((--[\\s\\S]*?): {([\\s\\S]*?)})","gi"),a=new RegExp("(@apply\\s.*?;)","gi"),RegisterIoElement=function(e){RegisterIoNode(e);const t=e.name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();if(Object.defineProperty(e,"localName",{value:t}),Object.defineProperty(e.prototype,"localName",{value:t}),Object.defineProperty(e,"_isIoElement",{enumerable:!1,value:!0}),Object.defineProperty(e.prototype,"_isIoElement",{enumerable:!1,value:!0}),Object.defineProperty(window,e.name,{value:e}),void 0===window.customElements)return void document.body.insertBefore(o,document.body.children[0]);window.customElements.define(t,e);let i="";const s=e.prototype._protochain.style.match(h);if(s)for(let e=0;e<s.length;e++){const t=s[e].split(": {"),n=t[0],o=t[1].replace(/}/g,"").trim().replace(/^ +/gm,"");r[n]=o,i+=s[e].replace("--",".").replace(": {"," {")}let n=e.prototype._protochain.style.replace(h,"");const c=n.match(a);if(c)for(let e=0;e<c.length;e++){const t=c[e].split("@apply ")[1].replace(";","");r[t]?n=n.replace(c[e],r[t]):console.warn("IoElement: cound not find mixin:",t)}n=i+n.replace(new RegExp(":host","g"),t);const l=document.createElement("style");l.innerHTML=n,l.setAttribute("id","io-style-"+t.replace("io-","")),document.head.appendChild(l)},c=new ResizeObserver((e=>{for(const t of e)t.target.onResized()})),constructElement=function(e){const t=window.customElements?window.customElements.get(e.name):null;if(t&&t._isIoElement)return new t(e.props);const i=document.createElement(e.name);return applyNativeElementProps(i,e.props),i},l=document.createElement;document.createElement=function(...e){const t=e[0];if(t.startsWith("io-")){const i=customElements.get(t);return i?new i:l.apply(this,e)}return l.apply(this,e)};const applyNativeElementProps=function(e,t){for(const i in t){const s=t[i];if(i.startsWith("@"))e.setAttribute(i.substr(1),s);else if("style"===i)for(const t in s)e.style.setProperty(t,s[t]);else"class"===i?e.className=s:"id"!==i&&(e[i]=s);"name"===i&&e.setAttribute("name",s)}e._eventDispatcher||Object.defineProperty(e,"_eventDispatcher",{value:new EventDispatcher(e)}),e._eventDispatcher.applyPropListeners(t,e)};RegisterIoElement(IoElement);
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
const d=Array.isArray,clense=(e,t)=>t?"string"==typeof t[0]?[...e,t]:[...e,...t]:e,buildTree=()=>e=>{return e&&("object"==typeof(t=e[1])&&!d(t))?{name:e[0],props:e[1],children:d(e[2])?e[2].reduce(clense,[]).map(buildTree()):e[2]}:buildTree()([e[0],{},e[1]]);
/** @License
 * Copyright ©2022 Aleksandar (Aki) Rodic
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var t},p="MIT";export{Binding,ChangeQueue,EventDispatcher,IoElement,IoNode,IoNodeMixin,p as LICENSE,Property,ProtoChain,ProtoProperty,RegisterIoElement,RegisterIoNode,assignListenerDefinition,assignProtoProperty,buildTree,hardenListenerDefinition,listenerFromDefinition};
