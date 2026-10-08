import { BehaviorPriority } from '../Behavior.js';
import { keymaps } from '../Keymap.js';
import { CLICK_TOLERANCE } from '../InputRouter.js';
import { collectSelectable, defaultPicker } from '../../selection/Picker.js';
import { getGeometryAdapter } from '../../geometry/GeometryAdapter.js';
/**
 * Selection in the fallback band (ADR-0004, ADR-0007): click select through router clicks
 * (`select.click`), box select (`select.box`), and `select.all` / `select.none` / `select.invert` keys.
 * Bindings come from the keymap; picking from a Picker. Edits the host's `selection`.
 * In edit mode the same bindings select components through the host's `componentPicker`, and
 * `mode.editToggle` / `select.mode` keys run the `object.editmode_toggle` / `mesh.select_mode` operators.
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
    /** The component picker while the host is in edit mode. */
    get _components() {
        return this._host.mode === 'edit' ? this._host.componentPicker ?? null : null;
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
        this._select(selection, box.mode, false, components => components.pickRect(this._host, box), picker => picker.pickRect(this._host, box));
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
        this._select(selection, mode, true, components => components.pick(this._host, event.x, event.y), picker => picker.pick(this._host, event.x, event.y).then(hit => hit ? [hit] : []));
        return true;
    }
    key(event) {
        const selection = this._selection;
        if (event.type !== 'keydown' || !selection)
            return false;
        const entry = this.keymap.match(event, action => KEY_ACTIONS.has(action));
        if (!entry)
            return false;
        if (entry.action === 'mode.editToggle' || entry.action === 'select.mode') {
            const operators = this._host.editor?.operators;
            if (!operators)
                return false;
            const status = entry.action === 'mode.editToggle'
                ? operators.run('object.editmode_toggle')
                : operators.run('mesh.select_mode', { domain: entry.props?.domain });
            return status !== 'cancelled' || entry.action === 'select.mode';
        }
        const components = this._components;
        if (components) {
            const objects = components.objects(this._host);
            const domain = components.domain(this._host);
            const edit = selection.edit();
            for (const object of objects) {
                const size = getGeometryAdapter(object)?.domainSize(object, domain) ?? 0;
                if (!size)
                    continue;
                const set = edit.components(object.uuid, domain, size);
                if (entry.action === 'select.all')
                    set.fill();
                else if (entry.action === 'select.none')
                    set.clear();
                else
                    set.invert();
            }
            edit.commit();
            return true;
        }
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
    /**
     * Picks components in edit mode, objects otherwise, and applies the hits when the pick resolves, unless the
     * host shows another selection by then. A click (`setsActive`) makes its hit the active object.
     */
    _select(selection, mode, setsActive, pickComponents, pickObjects) {
        const components = this._components;
        if (components) {
            const objects = components.objects(this._host);
            const domain = components.domain(this._host);
            void pickComponents(components).then(hits => {
                if (this._selection === selection)
                    applyComponents(selection, mode, hits, objects, domain);
            });
        }
        else {
            void pickObjects(this._picker).then(hits => {
                if (this._selection === selection)
                    apply(selection, mode, hits.map(hit => hit.uuid), setsActive ? hits[0]?.uuid ?? '' : '');
            });
        }
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
const KEY_ACTIONS = new Set(['select.all', 'select.none', 'select.invert', 'select.mode', 'mode.editToggle']);
/** Applies component hits: `set` first clears `domain` on the picker's objects (a click on nothing deselects). */
function applyComponents(selection, mode, hits, objects, domain) {
    const edit = selection.edit();
    if (mode === 'set')
        edit.clearComponents(domain, objects.map(object => object.uuid));
    const groups = new Map();
    for (const hit of hits) {
        const key = `${hit.uuid}\n${hit.domain}`;
        const group = groups.get(key);
        if (group)
            group.push(hit);
        else
            groups.set(key, [hit]);
    }
    for (const group of groups.values()) {
        const { uuid, domain: hitDomain, size } = group[0];
        const set = edit.components(uuid, hitDomain, size);
        // Toggling a group (a UV vertex is several corners) flips it as one element.
        const remove = mode === 'subtract' || (mode === 'toggle' && group.every(hit => set.has(hit.index)));
        for (const hit of group) {
            if (remove)
                set.delete(hit.index);
            else
                set.add(hit.index);
        }
    }
    edit.commit();
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
