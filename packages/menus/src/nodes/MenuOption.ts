import { ReactiveObject, Register, Property, WithBinding, NodeArray, Json } from '@io-gui/core'

export type MenuOptionMode = 'select' | 'toggle' | 'none'

export type MenuOptionProps = {
  id?: string
  value?: any
  label?: WithBinding<string>
  icon?: string
  hint?: WithBinding<string>
  action?: (value?: any) => void
  mode?: MenuOptionMode
  disabled?: boolean
  hidden?: boolean
  selected?: WithBinding<boolean>
  selectedID?: WithBinding<string>
  selectedIDImmediate?: WithBinding<string>
  path?: WithBinding<string>
  options?: Array<string | number | boolean | null | undefined | MenuOptionProps>
}

@Register
export class MenuOption extends ReactiveObject {

  @Property({value: '', type: String})
  declare id: string

  @Property({value: undefined})
  declare value: any

  @Property({value: '', type: String})
  declare label: string

  @Property({value: '', type: String})
  declare icon: string

  @Property({value: '', type: String})
  declare hint: string

  @Property({value: false, type: Boolean})
  declare disabled: boolean

  @Property({value: false, type: Boolean})
  declare hidden: boolean

  @Property()
  declare action?: (value?: any) => void

  @Property({value: 'select', type: String})
  declare mode: MenuOptionMode

  @Property({value: false, type: Boolean})
  declare selected: boolean

  @Property({value: '', type: String})
  declare selectedIDImmediate: string

  @Property({value: '', type: String})
  declare selectedID: string

  @Property({value: '', type: String})
  declare path: string

  @Property({type: NodeArray, init: 'this'})
  declare options: NodeArray<MenuOption>

  static override get Listeners() {
    return {
      'option-selected-changed': 'onOptionSelectedChanged',
    }
  }

  constructor(args: string | number | boolean | null | undefined | MenuOptionProps) {

    if (typeof args === 'string' || typeof args === 'number' || typeof args === 'boolean' || args === null || args === undefined) {
      args = {
        id: String(args),
        value: args,
      }
    }

    args = { ...args }
    args.id = args.id ?? '' // TODO: Reconsider.
    args.label = args.label ?? args.id
    args.value = args.value ?? args.id
    args.options = args.options ?? []
    args.options = args.options.map(option => {
      return (option instanceof MenuOption) ? option : new MenuOption(option)
    })

    const selectedOptions = (args.options as MenuOption[]).filter(option => option.mode === 'select' && option.selected)
    for (let i = 1; i < selectedOptions.length; i++) {
      debug: console.warn('Duplicate selected options with mode "select" found!', selectedOptions)
      selectedOptions[i].selected = false
    }

    super(args as MenuOptionProps)
  }
  getAllOptions() {
    const options: MenuOption[] = [this]
    for (let i = 0; i < this.options.length; i++) {
      options.push(...this.options[i].getAllOptions())
    }
    debug: {
      const ids = new Set()
      for (let i = 0; i < options.length; i++) {
        if (ids.has(options[i].id)) console.warn(`Duplicate id "${options[i].id}"`, this)
        ids.add(options[i].id)
      }
    }
    return options
  }
  findItemByValue(value: any): MenuOption | undefined {
    for (let i = 0; i < this.options.length; i++) {
      const found = this.options[i].findItemByValue(value)
      if (found) return found
    }
    if (this.value === value) return this
  }
  findItemById(id: string): MenuOption | undefined {
    for (let i = 0; i < this.options.length; i++) {
      const found = this.options[i].findItemById(id)
      if (found) return found
    }
    if (this.id === id) return this
  }
  selectDefault() {
    let walker: MenuOption | undefined = this.mode === 'select' ? this : undefined
    while (walker) {
      const next = walker.options.find(option => option.mode === 'select')
      if (walker.mode === 'select' && next) {
        walker = next
      } else {
        break
      }
    }
    if (walker) walker.selected = true
  }
  selectedChanged() {
    if (this.selected === false) {
      this.unselectSuboptions()
    }
    this.dispatch('option-selected-changed', {option: this}, true)
  }
  selectedIDChanged() {
    const option = this.findItemById(this.selectedID)
    if (option) {
      option.selected = true
      this.dispatch('option-selected', {option: option}, false)
    } else {
      this.unselectSuboptions()
    }
  }
  selectedIDImmediateChanged() {
    if (this.selectedIDImmediate) {
      this.selected = true
      const option = this.options.find(option => option.id === this.selectedIDImmediate)
      if (option) {
        option.selected = true
      }
    }
    this.updatePaths()
  }
  getSelectedIDImmediate() {
    let selected = ''
    for (let i = 0; i < this.options.length; i++) {
      const item = this.options[i]
      if (item.selected && item.mode === 'select') {
        selected = item.id
        break
      }
    }
    return selected
  }
  findSelectedImmediateOption() {
    const selectedIDImmediate = this.getSelectedIDImmediate()
    return this.options.find(option => option.mode === 'select' && option.selected && option.id === selectedIDImmediate)
  }
  setSelectedIDImmediate(id: string) {
    // TODO Test and reconsider withInternalOperation
    this.options.withInternalOperation(() => {
      for (let i = 0; i < this.options.length; i++) {
        const item = this.options[i]
        if (item.id === id) {
          item.selected = true
        } else {
          item.selected = false
        }
      }
    })
    this.options.dispatchMutation()
  }
  onOptionSelectedChanged(event: CustomEvent) {
    // TODO: Instead of this check, use event.stopPropagation() once implemented in EventDispatcher.
    if (this.options.indexOf(event.detail.option) === -1) return
    if (event.detail.option === this) return
    const selectedOption = event.detail.option
    if (selectedOption.selected) {
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i] as MenuOption
        if (option !== selectedOption && option.mode === 'select' && selectedOption.mode === 'select') {
          option.selected = false
        }
      }
    }
    const hasSelected = this.options.some(option => option.selected && option.mode === 'select')
    if (hasSelected) {
      // this.updatePaths();
    } else {
      this.setProperties({
        selectedID: '',
        selectedIDImmediate: '',
        path: '',
      })
    }
  }
  unselectSuboptions() {
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i]
      if (option.mode === 'select') {
        option.selected = false
        option.unselectSuboptions()
      }
    }
  }
  updatePaths() {
    const path: string[] = []
    if (this.mode !== 'select' || !this.selected) {
      this.path = ''
      return
    }

    let walker = this.findSelectedImmediateOption()
    if (!walker) return

    while (walker) {
      path.push(walker.id)
      walker = walker.findSelectedImmediateOption()
    }
    const selectedID = path[path.length - 1]
    if (this.path !== path.join(',')) {
      this.path = path.join(',')
    }
    if (this.selectedID !== selectedID) {
      this.selectedID = selectedID
    }
  }
  pathChanged() {
    const path = this.path ? [...this.path.split(',')] : []
    for (let i = path.length - 1; i >= 0; i--) {
      if (this.findItemById(path[i])) {
        this.selectedID = path[i]
        return
      }
    }
  }
  optionsMutated(event: CustomEvent) {
    const hasSelected = this.options.some(option => option.selected && option.mode === 'select')
    if (this.mode === 'select' && hasSelected && this.options.length) {
      this.setProperties({
        selected: true,
        selectedIDImmediate: this.getSelectedIDImmediate(),
      })
    }
    this.updatePaths()
    this.dispatchMutation()
  }
  override toJSON(): Json {
    return {
      id: this.id,
      value: this.value,
      label: this.label,
      icon: this.icon,
      hint: this.hint,
      disabled: this.disabled,
      hidden: this.hidden,
      // action: N/A for serialization
      mode: this.mode,
      options: this.options.map(option => option.toJSON()),
    }
  }
  // TODO: use applyJSON recursively
  fromJSON(json: MenuOptionProps) {
    this.setProperties({
      id: json.id,
      value: json.value ?? undefined,
      label: json.label ?? json.id,
      icon: json.icon ?? '',
      hint: json.hint ?? '',
      disabled: json.disabled ?? false,
      hidden: json.hidden ?? false,
      // action: N/A for serialization
      mode: json.mode ?? 'select',
      selected: json.selected ?? false,
      options: json.options?.map(option => new MenuOption(option)) ?? [],
    })
    return this
  }
  override mutated() {
    debug: {
      if (['select', 'toggle', 'none'].indexOf(this.mode) === -1) {
        console.warn(`Unknown "mode" property "${this.mode}"!`, this)
      }
      if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
        console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this)
      }
      // if (!this.id) {
      //   console.warn('"id" property is required!', this)
      // }
      if (this.action && typeof this.action !== 'function') {
        console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this)
      }
    }
  }
}