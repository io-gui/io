# Agent Skills catalog

Installable Agent Skills ([agentskills.io](https://agentskills.io)) for Io-Gui packages.

Entries here are **symlinks** into each package’s `skills/io-gui-<pkg>/` folder — edit the package copy; do not duplicate.

## Install (consumer projects)

```bash
npx skills add io-gui/io
```

That copies/links skills into agent folders (`.agents/skills/`, `.cursor/skills/`, …).

If you already depend on `@io-gui/*` via npm, you can also wire skills from `node_modules` with a linker such as `npx skills-npm`.

## Source of truth

| Surface | Location |
|---------|----------|
| Skill instructions | `packages/<pkg>/skills/io-gui-<pkg>/SKILL.md` |
| Glossary | `packages/<pkg>/CONTEXT.md` |
| Human API docs | `packages/<pkg>/README.md` |
| This catalog | `skills/io-gui-<pkg>` → package skill dir |
