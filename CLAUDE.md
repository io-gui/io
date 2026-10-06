# CLAUDE.md

## Context Map

./CONTEXT.md # context map
./packages/<package_name>/CONTEXT.md # package context

# Architecture Decision Records

./packages/<package_name>/docs/adr/*.md # architecture decision records (currently core, layout, menus)

## Cursor rules (`.cursor/rules/*.mdc`)

Each `.mdc` file has YAML frontmatter (`description`, `globs`, `alwaysApply`) followed by markdown instructions.

- `alwaysApply: true` — always in effect. These are imported below so they load every session.
- `globs: ...` — apply when working on matching files; read the rule before editing those files.
- Otherwise — "apply intelligently": if the `description` matches the task, read the rule first.

When starting a task, list `.cursor/rules/` and check frontmatter for any rule not imported below.

@.cursor/rules/io-gui.mdc
@.cursor/rules/ai-persona.mdc
@.cursor/rules/memory.mdc

Other rules (read on demand):

- `caveman.mdc` — compressed writing style; used when writing `.memory/working.md`.
- `grilling.md`, `grill-with-docs.md`, `domain-modeling/` — skill-style workflows (not `.mdc`). Use when the user asks to "grill" a plan or to model a domain; `domain-modeling/` defines the CONTEXT.md and ADR formats.

## Cursor plans (`.cursor/plans/*.plan.md`)

Design plans for past/ongoing work (frontmatter has `name`, `overview`, and a `todos` list with statuses). Check them for context before working on related features (layout package improvements, principles evaluation, three.js example conversion, three.js UI configs).

## CI

`.github/workflows/ci.yml` runs `pnpm lint:check`, `tsc -b`, `pnpm test`, and the bundle. Commands are listed in `io-gui.mdc`.

## Skills

Agent skills shipped to consumers live in `packages/<pkg>/skills/io-gui-<pkg>/`; root `skills/` holds symlinks to them. Edit the package copy. When changing a package's public API, check whether its skill needs updating too.

## Memory

Project memory lives in `.memory/` (see `memory.mdc`), not in Claude's auto-memory directory.
