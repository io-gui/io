import { Register, Property, WithBinding } from '@io-gui/core'
import { Option, OptionProps, OptionData } from './Option.js'

export type MenuData = OptionData & {
  selectedID?: string
  path?: string
  expandedIDs?: string
}

export type MenuProps = OptionProps & {
  selectedID?: WithBinding<string>
  path?: WithBinding<string>
  expandedIDs?: WithBinding<string>
}

/**
 * The root model of a whole menu tree. Owns everything tree-scoped: selection
 * tracking (`selectedID`, `path`), tree disclosure (`expandedIDs`), default
 * selection, serialization, and invariants no single Option can see.
 *
 * `Option.selected` (within each selection scope) is the only source of truth
 * for selection. `path` and `selectedID` are derived projections that stay
 * writable on purpose — they are the entry points for persistence and routing:
 * writing a Path performs a stale-tolerant restore (the deepest surviving id
 * wins). This is deliberate, not a sync bug (see ADR 0001).
 *
 * Serialized Menu JSON is structure only; selection persists exclusively
 * through Path/`selectedID` bindings.
 */
@Register
export class Menu extends Option {

  // Derived from selection, writable as a selection entry point (see ADR 0001).
  @Property({value: '', type: String})
  declare selectedID: string

  // Derived from selection, writable as a stale-tolerant restore/routing entry point.
  @Property({value: '', type: String})
  declare path: string

  // Tree disclosure: comma-joined ids of expanded tree branches.
  @Property({value: '', type: String})
  declare expandedIDs: string

  private _syncingSelection = false

  constructor(args: MenuProps) {

    if (typeof args === 'object') {
      if (args.id !== undefined) args.id = 'root'
    }

    super(args as OptionProps)

    // Tree-scoped props — not part of an Option's wire format.
    if (typeof args === 'object') {
      if (args.expandedIDs !== undefined) this.setProperty('expandedIDs', args.expandedIDs, true)
      if (args.selectedID !== undefined) this.setProperty('selectedID', args.selectedID, true)
      // Path last — it is the more specific selection entry point.
      if (args.path !== undefined) this.setProperty('path', args.path, true)
      this.dispatchQueue()
    }
  }
  selectedIDChanged() {
    if (this._syncingSelection) return
    const option = this.findOptionById(this.selectedID)
    if (option && option !== this) {
      option.selected = true
    } else if (!option) {
      this.unselectSuboptions()
    }
  }
  pathChanged() {
    if (this._syncingSelection) return
    const path = this.path ? this.path.split(',') : []
    for (let i = path.length - 1; i >= 0; i--) {
      if (this.findOptionById(path[i])) {
        this.selectedID = path[i]
        return
      }
    }
  }
  updatePaths() {
    const chain = this.getSelectedChain().map(option => option.id)
    const path = chain.join(',')
    const selectedID = chain.length ? chain[chain.length - 1] : ''
    this._syncingSelection = true
    if (this.path !== path) this.path = path
    if (this.selectedID !== selectedID) this.selectedID = selectedID
    this._syncingSelection = false
  }
  override optionsMutated() {
    super.optionsMutated()
    this.updatePaths()
    debug: {
      const ids = new Set()
      const options = this.getAllOptions()
      for (let i = 0; i < options.length; i++) {
        if (options[i] === this) continue
        if (ids.has(options[i].id)) console.warn(`Duplicate id "${options[i].id}" — Option ids must be unique per Menu!`, this)
        ids.add(options[i].id)
      }
    }
  }
  getDisclosed(): string[] {
    return this.expandedIDs ? this.expandedIDs.split(',') : []
  }
  isDisclosed(id: string) {
    return this.getDisclosed().indexOf(id) !== -1
  }
  setDisclosed(id: string, disclosed: boolean) {
    const ids = this.getDisclosed()
    const index = ids.indexOf(id)
    if (disclosed && index === -1) {
      ids.push(id)
    } else if (!disclosed && index !== -1) {
      ids.splice(index, 1)
    } else {
      return
    }
    this.expandedIDs = ids.join(',')
  }
}
