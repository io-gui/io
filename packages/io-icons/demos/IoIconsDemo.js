import { Register, IoElement, h3, div } from 'io-gui';
import { IconsetDB, ioIcon } from 'io-icons';

export class IoIconsDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        margin: var(--io_spacing2);
      }
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: var(--io_spacing);
        margin: var(--io_spacing);
        margin-bottom: 0;
        background-color: var(--io_bgColorDimmed);
      }
      :host > h3 {
        margin: var(--io_spacing3);
      }
      :host .row > * {
        margin-right: var(--io_spacing3);
      }
    `;
  }
  init() {
    this.template(
      (()=>{
        const iconsets = [];
        for (const set of Object.keys(IconsetDB)) {
          iconsets.push(h3(set));
          const icons = [];
          for (const icon of Object.keys(IconsetDB[set])) {
            const id = `${set}:${icon}`;
            icons.push(ioIcon({value: id, title: id}));
          }
          iconsets.push(div({class: 'row'}, icons));
        }
        return iconsets;
      })(),
    )
  }
}
Register(IoIconsDemo);
export const ioIconsDemo = IoIconsDemo.vConstructor;
