# Three examples

three.js examples converted to `Document`s for the demo editor, each with a sidecar that records how it differs from its source and keeps it in step with three.js. The index, rules and workflows are in [ExamplesConversion.plan.md](ExamplesConversion.plan.md); Document, Timeline, Live document, Active camera and Frame target are terms of the [Three context](../../CONTEXT.md).

## Language

### Examples and sources

**Example**:
A `Document` subclass in `examples/`, converted from one three.js example.
_Avoid_: demo, sample, applet

**Source**:
The three.js example an example is converted from, `examples/<source>.html` in `../three.js`.
_Avoid_: original, upstream example

**Linked build**:
The `../three.js` checkout that `packages/three` links as `three`, ahead of the release (r187dev since 2026-10-20).
_Avoid_: dev build, local three

**Synced commit**:
The linked checkout's commit through which upstream changes to a source have been reviewed; a sidecar's `synced`.
_Avoid_: version, baseline

### Records

**Sidecar**:
`<Name>Example.md` next to an example: its deviations, workarounds, open items, upstream record and history.
_Avoid_: audit, audit row, notes

**Deviation**:
An intended difference between an example and its source at the synced commit.
_Avoid_: change, divergence

**Workaround**:
Example code that differs from its source because of an upstream bug, marked `Workaround (upstream: <id>)` and removed once the fix reaches the linked build.
_Avoid_: hack, patch

**Open item**:
Unfinished work on a converted example, named by a todo or blocker id.
_Avoid_: issue, bug

**Tag**:
A trait several examples share, with when to revisit them.
_Avoid_: label, category

### Planning

**Candidate**:
A source that fits a document and is not converted yet.
_Avoid_: todo (as a noun)

**Blocker**:
A framework feature or fix that a candidate waits for, named by id (`document-pipeline`, `view-camera`, ...).
_Avoid_: prerequisite

**Batch**:
Examples converted and checked together; a row of the plan's Log.
_Avoid_: round

### Framing

**Stand-in**:
A detached object whose bounds views frame instead of the content (ADR-0012).
_Avoid_: proxy, dummy
