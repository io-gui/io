import { Register, Property, ReactiveElement, ReactiveElementProps } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'
import { DrawerDirection, DrawerOrientation } from './IoDrawer.js'

export type IoDrawerHandleProps = ReactiveElementProps & {
  orientation: DrawerOrientation
  direction: DrawerDirection
  expanded: boolean
}

@Register
export class IoDrawerHandle extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        --io_drawerHandleSize: calc(var(--io_lineHeight) + var(--io_borderWidth) * 2);
        display: flex;
        overflow: hidden;
        flex: 0 0 var(--io_drawerHandleSize);
        align-items: center;
        background-color: var(--io_bgColorLight);
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        @apply --io-unselectable;
        z-index: 1;
      }
      :host[orientation="horizontal"] {
        border-top: 0;
        border-bottom: 0;
        flex-direction: row;
        width: var(--io_drawerHandleSize);
      }
      :host[orientation="vertical"] {
        border-left: 0;
        border-right: 0;
        flex-direction: column;
        height: var(--io_drawerHandleSize);
      }
    `
  }

  @Property({type: String, value: '', reflect: true})
  declare orientation: DrawerOrientation

  @Property({type: String, value: '', reflect: true})
  declare direction: DrawerDirection

  @Property({type: Boolean, value: false, reflect: true})
  declare expanded: boolean

  static override get Listeners() {
    return {
      'click': 'onClick',
      'contextmenu': 'onContextmenuDisable',
    }
  }

  constructor(args: IoDrawerHandleProps) {
    super(args)
  }

  onContextmenuDisable(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  onClick(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.dispatch('io-drawer-toggle', {}, true)
  }

  override mutated() {
    const icon = {
      horizontal: {
        leading: this.expanded ? 'io:triangle_left' : 'io:triangle_right',
        trailing: this.expanded ? 'io:triangle_right' : 'io:triangle_left',
      },
      vertical: {
        leading: this.expanded ? 'io:triangle_up' : 'io:triangle_down',
        trailing: this.expanded ? 'io:triangle_down' : 'io:triangle_up',
      }
    }[this.orientation][this.direction]

    this.render([
      ioIcon({value: icon, size: 'small'})
    ])
  }
}

export const ioDrawerHandle = function(args: IoDrawerHandleProps) {
  return IoDrawerHandle.vConstructor(args)
}
