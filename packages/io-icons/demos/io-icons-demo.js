import { Register, IoElement, h3 } from 'io-gui';
import { IoIconsetDB, ioIcon } from 'io-icons';

export class IoIconsDemo extends IoElement {
  init() {
    this.template([
      (()=>{
        const icons = [];
        for (const set of Object.keys(IoIconsetDB)) {
          icons.push(h3(set));
          for (const icon of Object.keys(IoIconsetDB[set])) {
            const id = `${set}:${icon}`;
            icons.push(ioIcon({value: id, title: id, name: id, label: id}));
          }
        }
        return icons;
      })(),
    ])
  }
}
Register(IoIconsDemo);
export const ioIconsDemo = IoIconsDemo.vConstructor;
