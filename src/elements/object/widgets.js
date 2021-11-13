/*

 **/

export class Widgets {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.registerWidgets(prototypes[i].Widgets || {});
    }
  }
  registerWidgets(widgets) {
    for (let g in widgets) {
      this[g] = this[g] || [];
      this[g] = [...this[g], ...widgets[g]];
    }
  }
  getWidgets(object) {
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    let mainWidget = null;
    const groupWidgets = {};

    for (let i in this) {
      const id = i.split('|');
      const cstr = id[0];
      const grp = id[1];
      if (prototypes.indexOf(cstr) !== -1) {
        const widget = this[i];
        widget[1] = widget[1] || {};
        if (widget[1].$value) {
          widget[1].value = object[widget[1].$value];
        } else {
          widget[1].value = object;
        }
        if (grp) groupWidgets[grp] = widget;
        else mainWidget = widget;
      }
    }

    return {
      main: mainWidget,
      groups: groupWidgets,
    };

  }
}
