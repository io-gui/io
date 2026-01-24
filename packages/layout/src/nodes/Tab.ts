import { Node, ReactiveProperty, Register } from '@io-gui/core'

export type TabProps = {
  id: string
  label?: string
  icon?: string
  selected?: boolean
}

@Register
export class Tab extends Node {

  @ReactiveProperty({type: String, value: ''})
  declare id: string

  @ReactiveProperty({type: String, value: ''})
  declare label: string

  @ReactiveProperty({type: String, value: ''})
  declare icon: string

  @ReactiveProperty({type: Boolean, value: false})
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
  toJSON(): TabProps {
    const json: TabProps = { id: this.id }
    if (this.label !== this.id) json.label = this.label
    if (this.icon) json.icon = this.icon
    if (this.selected) json.selected = this.selected
    return json
  }
  fromJSON(json: TabProps) {
    this.setProperties({
      id: json.id,
      label: json.label ? json.label : json.id,
      icon: json.icon ? json.icon : '',
      selected: json.selected ? json.selected : false,
    })
    return this
  }
}