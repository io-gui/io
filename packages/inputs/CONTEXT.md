# Inputs

The `@io-gui/inputs` context: basic field controls built on `IoField`. Appearance, live commit, and the number ladder are the package-specific vocabulary; values are ordinary strings, numbers, and booleans.

## Language

**IoField**:
Base element for package inputs — value display/edit chrome with pointer capture, appearance, icon/label, and focus routing. Buttons, strings, numbers, and booleans extend it.
_Avoid_: input wrapper, form control base (generic)

**Appearance**:
Visual mode on IoField: `neutral` (flat), `inset` (sunken field), or `outset` (raised control). Defaults differ by subclass (e.g. button outset, string/number inset).
_Avoid_: variant, style, theme mode

**Live**:
Whether string/number fields commit on every keystroke (`true`) or on blur/Enter (`false`).
_Avoid_: realtime, immediate, debounce flag

**Conversion**:
Display multiplier on `IoNumber`: shown value = model value × conversion. Edits divide back. Does not change the stored unit.
_Avoid_: scale, unit factor (as a separate property name)

**Ladder**:
Exponential step overlay (`IoNumberLadderSingleton`) for fine/coarse number adjustment via pointer. The singleton owns drag/step behavior; `IoNumber` forwards the gesture when `ladder` is enabled.
_Avoid_: spinner, stepper, scrubber
