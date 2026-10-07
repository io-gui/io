import { BehaviorPriority } from '../Behavior.js';
import { keymaps } from '../Keymap.js';
import { CLICK_TOLERANCE } from '../InputRouter.js';
import { collectSelectable, defaultPicker } from '../../selection/Picker.js';
/**
 * Object selection in the fallback band (ADR-0004, ADR-0007): click select through router clicks
 * (`select.click`), box select (`select.box`), and `select.all` / `select.none` / `select.invert` keys.
 * Bindings come from the keymap; picking from a Picker. Edits the host's `selection`.
 */
export class SelectBehavior {
    priority = BehaviorPriority.fallback;
    keymap;
    /** Used unless the host provides its own (`InputHost.picker`). */
    picker;
    _host;
    _box = null;
    _marquee = null;
    constructor(host, keymap = keymaps.default, picker = defaultPicker) {
        this._host = host;
        this.keymap = keymap;
        this.picker = picker;
    }
    get _picker() {
        return this._host.picker ?? this.picker;
    }
    get _selection() {
        return this._host.selection ?? null;
    }
    wantsCapture(event) {
        if (event.type !== 'pointerdown' || !this._selection)
            return false;
        const entry = this.keymap.match(event, action => action === 'select.box');
        if (!entry)
            return false;
        this._box = { x0: event.x, y0: event.y, x1: event.x, y1: event.y, mode: entry.props?.mode ?? 'set' };
        return true;
    }
    begin() { }
    update(event) {
        if (!this._box || event.type !== 'pointermove')
            return;
        this._box.x1 = event.x;
        this._box.y1 = event.y;
        this._drawMarquee();
    }
    end() {
        const box = this._box;
        this._reset();
        const selection = this._selection;
        if (!box || !selection)
            return;
        // A press without a drag is a click; the router offers it as one.
        if (Math.abs(box.x1 - box.x0) <= CLICK_TOLERANCE && Math.abs(box.y1 - box.y0) <= CLICK_TOLERANCE)
            return;
        void this._picker.pickRect(this._host, box).then(hits => {
            if (this._selection !== selection)
                return;
            apply(selection, box.mode, hits.map(hit => hit.uuid), '');
        });
    }
    cancel() {
        this._reset();
    }
    click(event) {
        const selection = this._selection;
        if (!selection)
            return false;
        const entry = this.keymap.match(event, action => action === 'select.click');
        if (!entry)
            return false;
        const mode = entry.props?.mode ?? 'set';
        void this._picker.pick(this._host, event.x, event.y).then((hit) => {
            if (this._selection !== selection)
                return;
            apply(selection, mode, hit ? [hit.uuid] : [], hit?.uuid ?? '');
        });
        return true;
    }
    key(event) {
        const selection = this._selection;
        if (event.type !== 'keydown' || !selection)
            return false;
        const entry = this.keymap.match(event, action => action === 'select.all' || action === 'select.none' || action === 'select.invert');
        if (!entry)
            return false;
        if (entry.action === 'select.none') {
            selection.clear();
            return true;
        }
        const scene = this._host.scene;
        if (!scene)
            return true;
        const all = collectSelectable(scene).map(object => object.uuid);
        if (entry.action === 'select.all')
            selection.set(all, selection.active || undefined);
        else
            selection.edit().set(all.filter(uuid => !selection.has(uuid))).commit();
        return true;
    }
    _drawMarquee() {
        const box = this._box;
        if (!this._marquee) {
            this._marquee = document.createElement('div');
            this._marquee.style.cssText = 'position:absolute;pointer-events:none;border:1px dashed var(--io_colorWhite, #fff);background:rgba(255,255,255,0.08);';
            this._host.appendChild(this._marquee);
        }
        const style = this._marquee.style;
        style.left = `${Math.min(box.x0, box.x1)}px`;
        style.top = `${Math.min(box.y0, box.y1)}px`;
        style.width = `${Math.abs(box.x1 - box.x0)}px`;
        style.height = `${Math.abs(box.y1 - box.y0)}px`;
    }
    _reset() {
        this._box = null;
        this._marquee?.remove();
        this._marquee = null;
    }
}
function apply(selection, mode, uuids, active) {
    const edit = selection.edit();
    switch (mode) {
        case 'set':
            edit.set(uuids, active || undefined);
            break;
        case 'extend':
            edit.add(uuids);
            if (active)
                edit.setActive(active);
            break;
        case 'toggle':
            edit.toggle(uuids);
            if (active && !selection.has(active))
                edit.setActive(active);
            break;
        case 'subtract':
            edit.remove(uuids);
            break;
    }
    edit.commit();
}
