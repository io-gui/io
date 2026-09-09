---
name: io-gui-inputs
description: >-
  Use IoField-based inputs (IoButton, IoString, IoNumber, IoBoolean, IoSwitch) and
  the number ladder singleton. Use when working with @io-gui/inputs or basic field UI.
---

# @io-gui/inputs

## Defaults

- Import from `@io-gui/inputs`.
- Base is **`IoField`**. Appearance: `neutral` | `inset` | `outset`.
- `live` on string/number = commit per keystroke; otherwise blur/Enter.
- Number fine control: `ladder: true` → `IoNumberLadderSingleton`.

## Gotchas

- Ladder singleton owns drag/step — `IoNumber` forwards pointer; don't reimplement scrub UI.
- `conversion` is display multiplier only; stored value stays in model units.
- String/number: arrow keys move focus at text boundaries (Ctrl overrides).
- `IoNumber`: comma→period; Home/End → min/max.
- Boolean labels may be icon refs (`io:check`).
- Events: `value-input` on fields; `io-button-clicked` on buttons.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
