const BUTTONS = { LMB: 0, MMB: 1, RMB: 2 };
const MODIFIERS = { Shift: 'shift', Ctrl: 'ctrl', Alt: 'alt', Meta: 'meta' };
export function parseInput(input) {
    const parts = input.trim().split('+');
    const last = parts.pop().trim();
    const modifiers = { shift: false, ctrl: false, alt: false, meta: false };
    for (const part of parts) {
        const modifier = MODIFIERS[part.trim()];
        debug: {
            if (!modifier)
                console.error(`Keymap: unknown modifier "${part}" in "${input}"`);
        }
        if (modifier)
            modifiers[modifier] = true;
    }
    let trigger;
    const press = /^(LMB|MMB|RMB) (drag|click)$/.exec(last);
    if (press)
        trigger = { type: press[2] === 'drag' ? 'press' : 'click', button: BUTTONS[press[1]] };
    else if (last === 'wheel')
        trigger = { type: 'wheel' };
    else
        trigger = { type: 'key', code: last };
    return { trigger, modifiers };
}
function sameModifiers(a, b) {
    return a.shift === b.shift && a.ctrl === b.ctrl && a.alt === b.alt && a.meta === b.meta;
}
function sameTrigger(a, b) {
    if (a.type !== b.type)
        return false;
    if (a.type === 'press' || a.type === 'click')
        return a.button === b.button;
    if (a.type === 'key')
        return a.code === b.code;
    return true;
}
/**
 * An ordered table of bindings (ADR-0004). The first matching entry wins, so layering is concatenation:
 * `Keymap.layer(toolKeymap, viewKeymap, globalKeymap)`.
 */
export class Keymap {
    entries;
    _parsed;
    constructor(entries) {
        this.entries = entries;
        this._parsed = entries.map(entry => parseInput(entry.input));
    }
    static layer(...keymaps) {
        return new Keymap(keymaps.flatMap(keymap => keymap.entries));
    }
    /** First entry matching a `pointerdown`, `wheel` or `keydown` event, optionally limited to some actions. */
    match(event, actions) {
        let trigger;
        if (event.type === 'pointerdown')
            trigger = { type: 'press', button: event.button };
        else if (event.type === 'click')
            trigger = { type: 'click', button: event.button };
        else if (event.type === 'wheel')
            trigger = { type: 'wheel' };
        else if (event.type === 'keydown')
            trigger = { type: 'key', code: event.code };
        else
            return null;
        const viewKind = event.view?.kind;
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            const parsed = this._parsed[i];
            if (actions && !actions(entry.action))
                continue;
            if (entry.when?.viewKind && entry.when.viewKind !== viewKind)
                continue;
            if (entry.when?.mode && entry.when.mode !== event.host.mode)
                continue;
            if (!sameTrigger(parsed.trigger, trigger))
                continue;
            if (!sameModifiers(parsed.modifiers, event.modifiers))
                continue;
            return entry;
        }
        return null;
    }
    /** Pairs of entries bound to the same input for overlapping view kinds (the later one never fires). */
    findConflicts() {
        const conflicts = [];
        for (let i = 0; i < this.entries.length; i++) {
            for (let j = i + 1; j < this.entries.length; j++) {
                const a = this.entries[i];
                const b = this.entries[j];
                const kindsOverlap = !a.when?.viewKind || !b.when?.viewKind || a.when.viewKind === b.when.viewKind;
                const modesOverlap = !a.when?.mode || !b.when?.mode || a.when.mode === b.when.mode;
                if (!kindsOverlap || !modesOverlap)
                    continue;
                if (sameTrigger(this._parsed[i].trigger, this._parsed[j].trigger) && sameModifiers(this._parsed[i].modifiers, this._parsed[j].modifiers)) {
                    conflicts.push([a, b]);
                }
            }
        }
        return conflicts;
    }
}
const axisKeys = (front, right, top, mod = 'Ctrl') => [
    { input: front, action: 'view.axis', props: { axis: 'front' } },
    { input: `${mod}+${front}`, action: 'view.axis', props: { axis: 'back' } },
    { input: right, action: 'view.axis', props: { axis: 'right' } },
    { input: `${mod}+${right}`, action: 'view.axis', props: { axis: 'left' } },
    { input: top, action: 'view.axis', props: { axis: 'top' } },
    { input: `${mod}+${top}`, action: 'view.axis', props: { axis: 'bottom' } },
];
/** Navigation bindings. `default` matches three.js OrbitControls, so viewports feel as before. */
export const navigationKeymaps = {
    default: new Keymap([
        { input: 'LMB drag', action: 'view.orbit' },
        { input: 'RMB drag', action: 'view.pan' },
        { input: 'Shift+LMB drag', action: 'view.pan' },
        { input: 'Ctrl+LMB drag', action: 'view.pan' },
        { input: 'Meta+LMB drag', action: 'view.pan' },
        { input: 'MMB drag', action: 'view.dolly' },
        { input: 'wheel', action: 'view.zoom' },
        { input: 'Ctrl+wheel', action: 'view.zoom' },
        { input: 'Home', action: 'view.frameAll' },
        { input: 'KeyF', action: 'view.frameSelected' },
    ]),
    blender: new Keymap([
        { input: 'MMB drag', action: 'view.orbit' },
        { input: 'Shift+MMB drag', action: 'view.pan' },
        { input: 'Ctrl+MMB drag', action: 'view.dolly' },
        { input: 'wheel', action: 'view.zoom' },
        { input: 'Ctrl+wheel', action: 'view.zoom' },
        { input: 'Home', action: 'view.frameAll' },
        { input: 'NumpadDecimal', action: 'view.frameSelected' },
        ...axisKeys('Numpad1', 'Numpad3', 'Numpad7'),
    ]),
    maya: new Keymap([
        { input: 'Alt+LMB drag', action: 'view.orbit' },
        { input: 'Alt+MMB drag', action: 'view.pan' },
        { input: 'Alt+RMB drag', action: 'view.dolly' },
        { input: 'wheel', action: 'view.zoom' },
        { input: 'Ctrl+wheel', action: 'view.zoom' },
        { input: 'KeyA', action: 'view.frameAll' },
        { input: 'KeyF', action: 'view.frameSelected' },
    ]),
};
/**
 * Selection bindings. Clicks share LMB with drag navigation in the default preset; box select there is
 * `Alt+LMB drag`. Blender and Maya keep LMB drag free for box select.
 */
export const selectionKeymaps = {
    default: new Keymap([
        { input: 'LMB click', action: 'select.click', props: { mode: 'set' } },
        { input: 'Shift+LMB click', action: 'select.click', props: { mode: 'toggle' } },
        { input: 'Ctrl+LMB click', action: 'select.click', props: { mode: 'subtract' } },
        { input: 'Alt+LMB drag', action: 'select.box', props: { mode: 'set' } },
        { input: 'Shift+Alt+LMB drag', action: 'select.box', props: { mode: 'extend' } },
        { input: 'Ctrl+KeyA', action: 'select.all' },
        { input: 'Escape', action: 'select.none' },
    ]),
    blender: new Keymap([
        { input: 'LMB click', action: 'select.click', props: { mode: 'set' } },
        { input: 'Shift+LMB click', action: 'select.click', props: { mode: 'toggle' } },
        { input: 'Ctrl+LMB click', action: 'select.click', props: { mode: 'subtract' } },
        { input: 'LMB drag', action: 'select.box', props: { mode: 'set' } },
        { input: 'Shift+LMB drag', action: 'select.box', props: { mode: 'extend' } },
        { input: 'Ctrl+LMB drag', action: 'select.box', props: { mode: 'subtract' } },
        { input: 'KeyA', action: 'select.all' },
        { input: 'Alt+KeyA', action: 'select.none' },
        { input: 'Ctrl+KeyI', action: 'select.invert' },
    ]),
    maya: new Keymap([
        { input: 'LMB click', action: 'select.click', props: { mode: 'set' } },
        { input: 'Shift+LMB click', action: 'select.click', props: { mode: 'toggle' } },
        { input: 'Ctrl+LMB click', action: 'select.click', props: { mode: 'subtract' } },
        { input: 'LMB drag', action: 'select.box', props: { mode: 'set' } },
        { input: 'Shift+LMB drag', action: 'select.box', props: { mode: 'toggle' } },
        { input: 'Ctrl+LMB drag', action: 'select.box', props: { mode: 'subtract' } },
        { input: 'Ctrl+Shift+KeyI', action: 'select.invert' },
    ]),
};
/** Navigation and selection together, per preset. Behaviors pick their own actions (`view.*`, `select.*`). */
export const keymaps = {
    default: Keymap.layer(navigationKeymaps.default, selectionKeymaps.default),
    blender: Keymap.layer(navigationKeymaps.blender, selectionKeymaps.blender),
    maya: Keymap.layer(navigationKeymaps.maya, selectionKeymaps.maya),
};
