import { Property, Register, span } from '@io-gui/core'
import { IoButton, IoButtonProps } from '@io-gui/inputs'

interface NamedValue {
  name?: string
  title?: string
  id?: string
}

export type IoPropertyLinkProps = IoButtonProps & {
  value?: object
  showName?: boolean
}

@Register
export class IoPropertyLink extends IoButton {
  static override get Style() {
    return /* css */`
    :host {
      display: flex;
    }
    :host > span {
      color: var(--io_colorBlue);
      flex: 0 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host:hover > span {
      text-decoration: underline;
    }
    `
  }

  @Property()
  declare value: object

  @Property({value: false, type: Boolean})
  declare showName: boolean

  @Property({value: 'neutral', type: String, reflect: true})
  declare appearance: 'inset' | 'outset' | 'neutral'

  valueMutated() {
    this.mutated()
  }

  override mutated() {
    let label: string | undefined
    if (this.value instanceof Array) {
      label = `${this.value.constructor.name} (${this.value.length})`
    } else {
      label = `${this.value.constructor.name}`
    }
    if (this.showName) {
      const named = this.value as NamedValue
      const name = named.name || named.title || named.id
      if (name) {
        label += ` "${name}"`
      }
    }
    this.render([span(label)])
  }
}

export const ioPropertyLink = function(arg0?: IoPropertyLinkProps) {
  return IoPropertyLink.vConstructor(arg0)
}