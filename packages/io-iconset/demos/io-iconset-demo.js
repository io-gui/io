import { Register, IoElement, IoIconsetDB, ioIcon, h3 } from 'io-gui';
import 'io-iconset';

export class IoIconsetDemo extends IoElement {
  init() {
    this.template([
      (()=>{
        const icons = [];
        for (const set of Object.keys(IoIconsetDB)) {
          icons.push(h3(set));
          for (const icon of Object.keys(IoIconsetDB[set])) {
            const id = `${set}:${icon}`;
            icons.push(ioIcon({icon: id, title: id, name: id, label: id}));
          }
        }
        return icons;
      })(),
    ])
  }
}
Register(IoIconsetDemo);
export const ioIconsetDemo = IoIconsetDemo.vDOM;
