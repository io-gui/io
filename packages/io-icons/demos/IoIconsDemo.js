import { Register, IoElement, h3 } from 'io-gui';
import { IconsetDB, ioIcon } from 'io-icons';

export class IoIconsDemo extends IoElement {
  init() {
    this.template(
      (()=>{
        const icons = [];
        for (const set of Object.keys(IconsetDB)) {
          icons.push(h3(set));
          for (const icon of Object.keys(IconsetDB[set])) {
            const id = `${set}:${icon}`;
            icons.push(ioIcon({value: id, title: id}));
          }
        }
        return icons;
      })(),
    )
  }
}
Register(IoIconsDemo);
export const ioIconsDemo = IoIconsDemo.vConstructor;
