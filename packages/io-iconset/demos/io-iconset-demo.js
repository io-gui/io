import { Register, IoElement, IoIconsetDB } from 'io-gui';

export class IoIconsetDemo extends IoElement {
  init() {
    this.template([
      (()=>{
        const icons = [];
        for (const set of Object.keys(IoIconsetDB)) {
          icons.push(['h3', set]);
          for (const icon of Object.keys(IoIconsetDB[set])) {
            const id = `${set}:${icon}`;
            icons.push(['io-icon', {icon: id, title: id, name: id, label: id}]);
          }
        }
        return icons;
      })(),
    ])
  }
}
Register(IoIconsetDemo);