export class Binding extends Object {
  constructor(source, sourceProp) {
    super();
    this.source = source;
    this.sourceProp = sourceProp;
    this.targets = [];
    this.targetsMap = new WeakMap();
    this.updateSource = this.updateSource.bind(this);
    this.updateTarget = this.updateTarget.bind(this);
  }
  clone() {
    return new Binding(this.source, this.sourceProp);
  }
  setTarget(target, targetProp) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    if (this.targetsMap.has(target)) {
      let targetProps = this.targetsMap.get(target);
      if (targetProps.indexOf(targetProp) === -1) targetProps.push(targetProp);
    } else {
      this.targetsMap.set(target, [targetProp]);
    }
  }
  // TODO: implement selective purging in io traverse for garbage collection.
  purgeTargets() {
    for (let i = this.targets.length; i--;) this.targetsMap.delete(this.targets[i]);
    this.targets.length = 0;
  }
  updateSource(event) {
    if (this.targets.indexOf(event.srcElement) === -1) return;
    if (this.source[this.sourceProp] !== event.detail.value)
    this.source[this.sourceProp] = event.detail.value;
  }
  updateTarget(event) {
    if (event.srcElement != this.source) return;
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        if (this.targets[i][targetProps[j]] !== event.detail.value)
            this.targets[i][targetProps[j]] = event.detail.value;
      }
    }
  }
  bind() {
    this.source.__properties[this.sourceProp].notify = true;
    this.source.addEventListener(this.sourceProp + '-changed', this.updateTarget);
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        this.targets[i].__properties[targetProps[j]].notify = true;
        this.targets[i].addEventListener(targetProps[j] + '-changed', this.updateSource);
        this.targets[i][targetProps[j]] = this.source[this.sourceProp];
      }
    }
    return this;
  }
  unbind() {
    if (this.source) this.source.removeEventListener(this.sourceProp + '-changed', this.updateTarget);
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        if (this.targets[i]) this.targets[i].removeEventListener(targetProps[j] + '-changed', this.updateSource);
      }
    }
    return this;
  }
}

export const IoBindingMixin = (superclass) => class extends superclass {
  bind(sourceProp) {
    this.__bindings[sourceProp] = this.__bindings[sourceProp] || new Binding(this, sourceProp);
    return this.__bindings[sourceProp];
  }
  unbind(sourceProp) {
    if (this.__bindings[sourceProp]) this.__bindings[sourceProp][i].unbind();
    delete this.__bindings[sourceProp];
  }
  unbindAll() {
    for (let sourceProp in this.__bindings) this.unbind(sourceProp);
  }
};
