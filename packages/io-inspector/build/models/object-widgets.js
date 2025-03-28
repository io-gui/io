export class ObjectWidgets {
    constructor(prototypes) {
        for (let i = 0; i < prototypes.length; i++) {
            this.registerObjectWidgets(prototypes[i].ObjectWidgets || {});
        }
    }
    registerObjectWidgets(widgets) {
        for (const g in widgets) {
            const self = this;
            self[g] = self[g] || [];
            self[g] = [...self[g], ...widgets[g]];
        }
    }
    getObjectWidgets(object) {
        const prototypes = [];
        let proto = object.__proto__;
        while (proto) {
            prototypes.push(proto.constructor.name);
            proto = proto.__proto__;
        }
        let mainWidget = null;
        const groupWidgets = {};
        for (const i in this) {
            const id = i.split('|');
            const cstr = id[0];
            const grp = id[1];
            if (prototypes.indexOf(cstr) !== -1) {
                const widget = this[i];
                widget[1] = widget[1] || {};
                if (widget[1].$value) {
                    widget[1].value = object[widget[1].$value];
                }
                else {
                    widget[1].value = object;
                }
                if (grp)
                    groupWidgets[grp] = widget;
                else
                    mainWidget = widget;
            }
        }
        return {
            main: mainWidget,
            groups: groupWidgets,
        };
    }
}
//# sourceMappingURL=object-widgets.js.map