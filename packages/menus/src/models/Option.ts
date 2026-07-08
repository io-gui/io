import { ReactiveObject, Register, Property, NodeArray, Json, WithBinding } from '@io-gui/core'

export type OptionMode = 'select' | 'toggle' | 'none'

export type OptionPrimitiveData = string | number | boolean | null

// Wire format — structure only; `action` and selection state are not serialized.
export type OptionData = {
  id?: string
  value?: Json
  label?: string
  icon?: string
  hint?: string
  disabled?: boolean
  hidden?: boolean
  mode?: OptionMode
  options?: Array<OptionPrimitiveData | OptionData>
}

export type OptionProps = OptionData & {
  options?: Array<OptionPrimitiveData | OptionData | OptionProps | Option>
  selected?: WithBinding<boolean>
  action?: (value?: any) => void
}

/**
 * One node of a Menu's tree. Carries local state only (id, value, label, icon,
 * hint, mode, action, selected, child options) — tree-scoped state (selection
 * tracking, disclosure, serialization entry point) belongs on `Menu`.
 *
 * The `select`-mode children of any one Option form a selection scope: at most
 * one of them is selected, enforced here by the parent.
 */
@Register
export class Option extends ReactiveObject {

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

  @Property({value: 'select', type: String})
  declare mode: OptionMode

  @Property({type: NodeArray, init: 'this'})
  declare options: NodeArray<Option>

  @Property()
  declare action?: (value?: any) => void

  @Property({value: false, type: Boolean})
  declare selected: boolean

  static override get Listeners() {
    return {
      // Internal scope-enforcement traffic — not public API.
      'option-selected-changed': 'onOptionSelectedChanged',
    }
  }

  constructor(args: OptionPrimitiveData | OptionProps) {
    super()
    this.applyJSON(args as OptionPrimitiveData | OptionData)

    // `action` and `selected` are props-only — never part of the wire format.
    if (!!args && typeof args === 'object') {
      if (typeof args.action === 'function') {
        // An Option with an action is a transient command unless told otherwise.
        if (args.mode === undefined) {
          this.setProperty('mode', 'none', true)
        }
        this.setProperty('action', args.action, true)
      }
      if (args.selected !== undefined) {
        this.setProperty('selected', args.selected, true)
      }
      this.dispatchQueue()
    }
  }
  getAllOptions() {
    const options: Option[] = [this]
    for (let i = 0; i < this.options.length; i++) {
      options.push(...this.options[i].getAllOptions())
    }
    return options
  }
  findOptionByValue(value: any): Option | undefined {
    for (let i = 0; i < this.options.length; i++) {
      const found = this.options[i].findOptionByValue(value)
      if (found) return found
    }
    if (this.value === value) return this
  }
  findOptionById(id: string): Option | undefined {
    for (let i = 0; i < this.options.length; i++) {
      const found = this.options[i].findOptionById(id)
      if (found) return found
    }
    if (this.id === id) return this
  }
  selectDefault() {
    let walker: Option | undefined = this.mode === 'select' ? this : undefined
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
  // Derived: the id of this scope's selected child ('' when none).
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
  // Derived: the chain of selected options from this scope downwards.
  getSelectedChain(): Option[] {
    const chain: Option[] = []
    let walker = this.findSelectedImmediateOption()
    while (walker) {
      chain.push(walker)
      walker = walker.findSelectedImmediateOption()
    }
    return chain
  }
  onOptionSelectedChanged(event: CustomEvent) {
    // TODO: Instead of this check, use event.stopPropagation() once implemented in EventDispatcher.
    if (this.options.indexOf(event.detail.option) === -1) return
    if (event.detail.option === this) return
    const selectedOption = event.detail.option
    if (selectedOption.selected) {
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i] as Option
        if (option !== selectedOption && option.mode === 'select' && selectedOption.mode === 'select') {
          option.selected = false
        }
      }
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
  optionsMutated() {
    const selectedOptions = this.options.filter(option => option.mode === 'select' && option.selected)
    for (let i = 1; i < selectedOptions.length; i++) {
      debug: console.warn('Duplicate selected options with mode "select" found!', selectedOptions)
      selectedOptions[i].selected = false
    }
    const hasSelected = this.options.some(option => option.selected && option.mode === 'select')
    if (this.mode === 'select' && hasSelected && this.options.length) {
      this.setProperty('selected', true)
    }
    this.dispatchMutation()
  }

  override mutated() {
    debug: {
      if (this.icon !== '' && this.icon.indexOf(':') === -1) {
        console.warn(`Option icon "${this.icon}" must contain a colon — it is the Iconset selector!`, this)
      }
      if (['select', 'toggle', 'none'].indexOf(this.mode) === -1) {
        console.warn(`Unknown "mode" property "${this.mode}"!`, this)
      }
      if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
        console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this)
      }
      if (this.action && typeof this.action !== 'function') {
        console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this)
      }
      if (this.id.indexOf(',') !== -1) {
        console.warn(`Option id "${this.id}" may not contain a comma — it is the Path separator!`)
      }
    }
  }

  // Structure only — selection is not part of an Option's serialized form.
  override toJSON(): OptionData {
    const json: OptionData = {
      id: this.id,
      value: this.value,
      label: this.label,
      icon: this.icon,
      hint: this.hint,
      disabled: this.disabled,
      hidden: this.hidden,
      mode: this.mode,
      options: this.options.map(option => option.toJSON()),
    }
    if (json.value === json.id) delete json.value
    if (json.label === json.id) delete json.label
    if (json.id === '') delete json.id
    if (json.icon === '') delete json.icon
    if (json.hint === '') delete json.hint
    if (json.disabled === false) delete json.disabled
    if (json.hidden === false) delete json.hidden
    if (json.mode === 'select') delete json.mode
    return json
  }
  override applyJSON(json: OptionPrimitiveData | OptionData) {
    if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) {
      json = { id: String(json), value: json } as OptionData
    }
    if (json.id === undefined) json.id = ''

    this.setProperties({
      id: json.id,
      // Default value to id only when absent — null/false are valid payloads.
      value: json.value !== undefined ? json.value : json.id,
      label: json.label ?? json.id,
      icon: json.icon ?? '',
      hint: json.hint ?? '',
      disabled: json.disabled ?? false,
      hidden: json.hidden ?? false,
      mode: json.mode ?? 'select',
      options: json.options?.map(option => (option instanceof Option) ? option : new Option(option)) ?? [],
      // action: N/A for serialization
      // selected: N/A for serialization
    })
    return this
  }
}
