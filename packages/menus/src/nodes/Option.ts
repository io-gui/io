import { ReactiveObject, Register, Property, WithBinding, NodeArray, Json } from '@io-gui/core'

export type OptionMode = 'select' | 'toggle' | 'none'

export type OptionProps = {
  id?: string
  value?: any
  label?: WithBinding<string>
  icon?: string
  hint?: WithBinding<string>
  action?: (value?: any) => void
  mode?: OptionMode
  disabled?: boolean
  hidden?: boolean
  selected?: WithBinding<boolean>
  options?: Array<string | number | boolean | null | undefined | OptionProps | Option>
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

  @Property()
  declare action?: (value?: any) => void

  @Property({value: 'select', type: String})
  declare mode: OptionMode

  @Property({value: false, type: Boolean})
  declare selected: boolean

  // TODO: Consider implementing readonly in core
  @Property({value: '', type: String})
  declare readonly selectedIDImmediate: string

  @Property({type: NodeArray, init: 'this'})
  declare options: NodeArray<Option>

  static override get Listeners() {
    return {
      // Internal scope-enforcement traffic — not public API.
      'option-selected-changed': 'onOptionSelectedChanged',
    }
  }

  constructor(args: string | number | boolean | null | undefined | OptionProps) {

    if (typeof args === 'string' || typeof args === 'number' || typeof args === 'boolean' || args === null || args === undefined) {
      args = {
        id: String(args),
        value: args,
      }
    }

    args = { ...args }
    args.id = args.id ?? ''
    args.label = args.label ?? args.id
    args.value = args.value ?? args.id
    // An Option with an action is a transient command unless told otherwise.
    if (args.mode === undefined && typeof args.action === 'function') {
      args.mode = 'none'
    }
    args.options = args.options ?? []
    args.options = args.options.map(option => {
      return (option instanceof Option) ? option : new Option(option)
    })

    const selectedOptions = (args.options as Option[]).filter(option => option.mode === 'select' && option.selected)
    for (let i = 1; i < selectedOptions.length; i++) {
      debug: console.warn('Duplicate selected options with mode "select" found!', selectedOptions)
      selectedOptions[i].selected = false
    }

    debug: if ((args.id as string).indexOf(',') !== -1) {
      console.warn(`Option id "${args.id}" may not contain a comma — it is the Path separator!`)
    }

    super(args as OptionProps)
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
  // TODO: Consider implementing readonly in core
  selectedIDImmediateChanged() {
    debug: if (this.selectedIDImmediate !== this.getSelectedIDImmediate()) {
      console.warn('"selectedIDImmediate" is read-only derived — write "selected" on the option instead!', this)
    }
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
    const hasSelected = this.options.some(option => option.selected && option.mode === 'select')
    if (!hasSelected) {
      this.setProperty('selectedIDImmediate', '')
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
    const hasSelected = this.options.some(option => option.selected && option.mode === 'select')
    if (this.mode === 'select' && hasSelected && this.options.length) {
      this.setProperties({
        selected: true,
        selectedIDImmediate: this.getSelectedIDImmediate(),
      })
    } else if (!hasSelected) {
      this.setProperty('selectedIDImmediate', '')
    }
    this.dispatchMutation()
  }

  override mutated() {
    debug: {
      if (['select', 'toggle', 'none'].indexOf(this.mode) === -1) {
        console.warn(`Unknown "mode" property "${this.mode}"!`, this)
      }
      if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
        console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this)
      }
      if (this.action && typeof this.action !== 'function') {
        console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this)
      }
    }
  }

  // Structure only — selection is not part of an Option's serialized form.
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
  fromJSON(json: OptionProps) {
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
      // selected: deliberately not read — selection is not part of the JSON form.
      options: json.options?.map(option => (option instanceof Option) ? option : new Option(option)) ?? [],
    })
    return this
  }
}
