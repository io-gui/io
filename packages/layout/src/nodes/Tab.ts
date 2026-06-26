import { ReactiveObject, Property, Register } from '@io-gui/core'

export type TabProps = {
  id: string
  label?: string
  icon?: string
  selected?: boolean
}

@Register
export class Tab extends ReactiveObject {

  @Property({type: String, value: ''})
  declare id: string

  @Property({type: String, value: ''})
  declare label: string

  @Property({type: String, value: ''})
  declare icon: string

  @Property({type: Boolean, value: false})
  declare selected: boolean

  constructor(args: TabProps) {
    debug: {
      if (!args.id) {
        console.error('Tab: construction error - empty id')
      }
    }
    super({
      ...args,
      label: args.label ? args.label : args.id,
    })
  }
  override toJSON(): TabProps {
    const json: TabProps = { id: this.id }
    if (this.label !== this.id) json.label = this.label
    if (this.icon) json.icon = this.icon
    if (this.selected) json.selected = this.selected
    return json
  }
  override applyJSON(json: TabProps) {
    this.setProperties({
      id: json.id,
      label: json.label ? json.label : json.id,
      icon: json.icon ? json.icon : '',
      selected: json.selected ? json.selected : false,
    })
    return this
  }
}