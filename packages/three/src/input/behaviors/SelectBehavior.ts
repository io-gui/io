import { Behavior, BehaviorPriority } from '../Behavior.js'
import { Keymap, keymaps } from '../Keymap.js'
import { InputHost, ViewInputEvent } from '../ViewInputEvent.js'
import { CLICK_TOLERANCE } from '../InputRouter.js'
import { Picker, PickHit, collectSelectable, defaultPicker } from '../../selection/Picker.js'
import type { SelectionModel } from '../../selection/SelectionModel.js'

export type SelectMode = 'set' | 'extend' | 'toggle' | 'subtract'

/**
 * Object selection in the fallback band (ADR-0004, ADR-0007): click select through router clicks
 * (`select.click`), box select (`select.box`), and `select.all` / `select.none` / `select.invert` keys.
 * Bindings come from the keymap; picking from a Picker. Edits the host's `selection`.
 */
export class SelectBehavior implements Behavior {

  readonly priority: number = BehaviorPriority.fallback
  keymap: Keymap
  picker: Picker

  private readonly _host: InputHost
  private _box: {x0: number; y0: number; x1: number; y1: number; mode: SelectMode} | null = null
  private _marquee: HTMLElement | null = null

  constructor(host: InputHost, keymap: Keymap = keymaps.default, picker: Picker = defaultPicker) {
    this._host = host
    this.keymap = keymap
    this.picker = picker
  }

  private get _selection(): SelectionModel | null {
    return this._host.selection ?? null
  }

  wantsCapture(event: ViewInputEvent): boolean {
    if (event.type !== 'pointerdown' || !this._selection) return false
    const entry = this.keymap.match(event, action => action === 'select.box')
    if (!entry) return false
    this._box = {x0: event.x, y0: event.y, x1: event.x, y1: event.y, mode: (entry.props?.mode as SelectMode) ?? 'set'}
    return true
  }

  begin() {}

  update(event: ViewInputEvent) {
    if (!this._box || event.type !== 'pointermove') return
    this._box.x1 = event.x
    this._box.y1 = event.y
    this._drawMarquee()
  }

  end() {
    const box = this._box
    this._reset()
    const selection = this._selection
    if (!box || !selection) return
    // A press without a drag is a click; the router offers it as one.
    if (Math.abs(box.x1 - box.x0) <= CLICK_TOLERANCE && Math.abs(box.y1 - box.y0) <= CLICK_TOLERANCE) return
    void this.picker.pickRect(this._host, box).then(hits => {
      if (this._selection !== selection) return
      apply(selection, box.mode, hits.map(hit => hit.uuid), '')
    })
  }

  cancel() {
    this._reset()
  }

  click(event: ViewInputEvent): boolean {
    const selection = this._selection
    if (!selection) return false
    const entry = this.keymap.match(event, action => action === 'select.click')
    if (!entry) return false
    const mode = (entry.props?.mode as SelectMode) ?? 'set'
    void this.picker.pick(this._host, event.x, event.y).then((hit: PickHit | null) => {
      if (this._selection !== selection) return
      apply(selection, mode, hit ? [hit.uuid] : [], hit?.uuid ?? '')
    })
    return true
  }

  key(event: ViewInputEvent): boolean {
    const selection = this._selection
    if (event.type !== 'keydown' || !selection) return false
    const entry = this.keymap.match(event, action => action === 'select.all' || action === 'select.none' || action === 'select.invert')
    if (!entry) return false
    if (entry.action === 'select.none') {
      selection.clear()
      return true
    }
    const scene = this._host.scene
    if (!scene) return true
    const all = collectSelectable(scene).map(object => object.uuid)
    if (entry.action === 'select.all') selection.set(all, selection.active || undefined)
    else selection.edit().set(all.filter(uuid => !selection.has(uuid))).commit()
    return true
  }

  private _drawMarquee() {
    const box = this._box!
    if (!this._marquee) {
      this._marquee = document.createElement('div')
      this._marquee.style.cssText = 'position:absolute;pointer-events:none;border:1px dashed var(--io_colorWhite, #fff);background:rgba(255,255,255,0.08);'
      this._host.appendChild(this._marquee)
    }
    const style = this._marquee.style
    style.left = `${Math.min(box.x0, box.x1)}px`
    style.top = `${Math.min(box.y0, box.y1)}px`
    style.width = `${Math.abs(box.x1 - box.x0)}px`
    style.height = `${Math.abs(box.y1 - box.y0)}px`
  }

  private _reset() {
    this._box = null
    this._marquee?.remove()
    this._marquee = null
  }
}

function apply(selection: SelectionModel, mode: SelectMode, uuids: string[], active: string) {
  const edit = selection.edit()
  switch (mode) {
    case 'set': edit.set(uuids, active || undefined); break
    case 'extend': edit.add(uuids); if (active) edit.setActive(active); break
    case 'toggle': edit.toggle(uuids); if (active && !selection.has(active)) edit.setActive(active); break
    case 'subtract': edit.remove(uuids); break
  }
  edit.commit()
}
