import { ReactiveObject, Property, Register } from '@io-gui/core'

export type TabData = {
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

  constructor(data: TabData) {
    super()
    this.applyJSON(data)
  }

  override toJSON(): TabData {
    const json: TabData = { id: this.id }
    if (this.label !== this.id) json.label = this.label
    if (this.icon) json.icon = this.icon
    if (this.selected) json.selected = this.selected
    return json
  }

  override applyJSON(data: TabData) {
    this.setProperties({
      id: data.id,
      label: data.label ? data.label : data.id,
      icon: data.icon ? data.icon : '',
      selected: data.selected ? data.selected : false,
    })
    return this
  }

}
