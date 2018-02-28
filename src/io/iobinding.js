export class Binding extends Object {
  constructor(source, target, sourceProp, targetProp) {
    super();
    this.source = source;
    this.target = target;
    this.sourceProp = sourceProp;
    this.targetProp = targetProp;
    this.setTarget = this.setTarget.bind(this);
    this.setSource = this.setSource.bind(this);
    this.bind(); // TODO: check if anything broke
  }
  clone() {
    return new Binding(this.source, this.target, this.sourceProp, this.targetProp);
  }
  setTarget(event) {
    if (event.srcElement != this.source) return;
    if (this.target[this.targetProp] !== event.detail.value)
        this.target[this.targetProp] = event.detail.value;
  }
  setSource(event) {
    if (event.srcElement != this.target) return;
    if (this.source[this.sourceProp] !== event.detail.value)
        this.source[this.sourceProp] = event.detail.value;
  }
  bind() {
    if (this.source && this.target && this.targetProp) {
      this.source.__properties[this.sourceProp].notify = true;
      this.target.__properties[this.targetProp].notify = true;
      this.source.addEventListener(this.sourceProp + '-changed', this.setTarget);
      this.target.addEventListener(this.targetProp + '-changed', this.setSource);
      this.target[this.targetProp] = this.source[this.sourceProp];
    }
    return this;
  }
  unbind() {
    if (this.source) this.source.removeEventListener(this.sourceProp + '-changed', this.setTarget);
    if (this.target) this.target.removeEventListener(this.targetProp + '-changed', this.setSource);
  }
}

export const IoBindingMixin = (superclass) => class extends superclass {
  bind(sourceProp, target, targetProp) {
    sourceProp = arguments[0];
    target = arguments[1] ? arguments[1] : undefined;
    targetProp = arguments[2] ? arguments[2] : undefined;
    let binding = new Binding(this, target, sourceProp, targetProp);
    this.__bindings[sourceProp] = this.__bindings[sourceProp] || [];
    this.__bindings[sourceProp].push(binding);
    return binding;
  }
  unbind(sourceProp) {
    if (this.__bindings[sourceProp]) {
      for (var i = 0; i < this.__bindings[sourceProp].length; i++) {
        this.__bindings[sourceProp][i].unbind();
      }
    }
  }
  unbindAll() {
    for (var prop in this.__bindings) {
      for (var i = 0; i < this.__bindings[prop].length; i++) {
        this.__bindings[prop][i].unbind();
      }
      delete this.__bindings[prop]
    }
  }
}
