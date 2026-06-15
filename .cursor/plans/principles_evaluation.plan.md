---
name: Principles Reconsideration Evaluation
overview: Structured evaluation of six architectural principles flagged for reconsideration, producing per-principle decision records with evidence. Builds on completed roadmap work (ReactiveCore, observer consolidation, VDOM keys, packaging) and defers implementation until decisions are made.
todos:
  - id: eval-setup
    content: Create principles-decisions.md template with shared criteria + 'principles to affirm' section
    status: pending
  - id: p1-diff-audit
    content: "P1: Diff ReactiveNode vs IoElement instance APIs; list duplication vs intentional DOM-only surface"
    status: pending
  - id: p1-subclass-survey
    content: "P1: Survey packages for RN vs IE subclass/extension patterns"
    status: pending
  - id: p1-decision
    content: "P1: Write decision record — Keep shared free functions vs extract ReactiveOwner mixin"
    status: pending
  - id: p2-listener-inventory
    content: "P2: Inventory all `-changed` / Binding listeners (core + packages); classify internal vs app-facing"
    status: pending
  - id: p2-alloc-audit
    content: "P2: Document per-setProperty allocation path (ChangeQueue → dispatch → bubble)"
    status: pending
  - id: p2-fastpath-sketch
    content: "P2: Sketch dual-path design (internal subscribers vs public events) with API compatibility notes"
    status: pending
  - id: p2-benchmark
    content: "P2 (optional): Vitest micro-benchmark — setProperty+Binding with/without event dispatch"
    status: pending
  - id: p2-decision
    content: "P2: Write decision record for internal transport mechanism"
    status: pending
  - id: p3-dispatch-inventory
    content: "P3: Classify all production `dispatch(..., true)` sites — node bubble vs DOM-only"
    status: pending
  - id: p3-parent-graph-audit
    content: "P3: Find node-graph cases that require `_parents` synthetic bubbling (exclude core tests)"
    status: pending
  - id: p3-complexity-cost
    content: "P3: Estimate complexity cost of hasVisitedDomAncestor + parent graph maintenance"
    status: pending
  - id: p3-decision
    content: "P3: Write decision record — keep / opt-in bubble / demote to explicit subscription"
    status: pending
  - id: p4-object-prop-audit
    content: "P4: Audit every production `type: Object` reactive prop — mutation style (in-place vs replace)"
    status: pending
  - id: p4-mutation-usage
    content: "P4: Inventory explicit `dispatchMutation` usage outside core/NodeArray"
    status: pending
  - id: p4-failure-matrix
    content: "P4: Document failure modes (Color, shared objects, arrays, Storage wire format)"
    status: pending
  - id: p4-alternatives
    content: "P4: Compare alternatives A/B/C (explicit / proxy wrap / window bus) with migration notes"
    status: pending
  - id: p4-decision
    content: "P4: Write decision record for plain-object observation policy"
    status: pending
  - id: p5-reactivity-inventory
    content: "P5: Grep production usage of `reactivity` overrides and class defaults"
    status: pending
  - id: p5-scheduler-alternatives
    content: "P5: Document global rAF batch vs per-node mode tradeoffs + Binding interaction"
    status: pending
  - id: p5-decision
    content: "P5: Write decision record — keep node mode / global default / per-write flag"
    status: pending
  - id: p6-sideeffect-audit
    content: "P6: Audit sideEffects + import-time registration per package (Register, singletons, configs)"
    status: pending
  - id: p6-treeshake-test
    content: "P6: Tree-shake experiment — minimal import from inputs/editors/three; record what loads"
    status: pending
  - id: p6-product-modes
    content: "P6: Draft library vs framework vs hybrid positioning doc aligned with npm/publish story"
    status: pending
  - id: p6-decision
    content: "P6: Write decision record for framework/library identity + sideEffects policy"
    status: pending
  - id: eval-synthesis
    content: "Synthesis: summary table, recommended Phase 1–3 implementation order, link to follow-up plans"
    status: pending
  - id: eval-unresolved
    content: Resolve open questions (benchmarks scope, primary audience, semver target) before Phase 1
    status: pending
isProject: false
---

# Principles Reconsideration Evaluation Plan

Evaluate six architectural principles from the design review. **Goal:** decision record per principle (Keep / Modify / Demote / Abandon) with evidence — not implementation yet.

**Already addressed elsewhere (baseline, not in scope):**
- ReactiveCore + unified parent graph ([packages/core/src/core/ReactiveCore.ts](packages/core/src/core/ReactiveCore.ts)) — original concern #1 largely mitigated
- One window mutation listener per node ([packages/core/src/core/ReactiveProperty.ts](packages/core/src/core/ReactiveProperty.ts) `ensureWindowMutationListener`)
- VDOM keys — done in original roadmap
- Packaging: `exports` → dist, narrowed `sideEffects`, incremental `tsc -b` ([packages/core/package.json](packages/core/package.json))
- Package-layer refactors → [package_layer.plan.md](.cursor/plans/package_layer.plan.md)
- Three config lazy-loading → [three.js_ui_configs.plan.md](.cursor/plans/three.js_ui_configs.plan.md)

**Principles to affirm (no evaluation needed):** domain models separate from views, zero runtime deps, `debug:` blocks, convention-based handlers — document as non-negotiables in the decision doc intro.

---

## Shared evaluation framework

For each principle, produce a short **Decision Record** (ADR-style) with:

| Criterion | Question |
|-----------|----------|
| **Correctness** | Does the principle hold under edge cases (dispose, shared values, DOM boundaries)? |
| **Performance** | Measurable hot-path cost? (allocations, listener count, dispatch depth) |
| **DX / API** | Does it match how apps actually use Io-Gui? |
| **Complexity budget** | Lines + concepts vs benefit (e.g. `hasVisitedDomAncestor`, window mutation bus) |
| **Migration cost** | Breaking changes, test churn, docs |
| **Alternatives** | What replaces it if modified/abandoned? |

**Deliverable:** `.cursor/plans/principles-decisions.md` (or `docs/architecture/principles.md`) with 6 sections + final summary table.

**Evidence methods:**
- Static audit (grep, call-graph notes)
- Micro-benchmarks in Vitest (optional, for principles 2 and 5)
- Usage inventory (production packages only, exclude `*.test.ts` and `demos/`)

---

## Principle 1: Universal reactivity via parallel base classes

**Current state:** [ReactiveCore.ts](packages/core/src/core/ReactiveCore.ts) shares internals; [ReactiveNode.ts](packages/core/src/nodes/ReactiveNode.ts) and [IoElement.ts](packages/core/src/elements/IoElement.ts) still duplicate instance API (~150+ lines each: `setProperty`, `dispatch`, bindings, queue).

```mermaid
flowchart LR
  subgraph today [Current]
    RN[ReactiveNode]
    IE[IoElement]
    RC[ReactiveCore free functions]
    RN --> RC
    IE --> RC
    IE --> RN
  end
```

**Evaluation tasks:**
- Diff RN vs IE public/instance methods; list remaining duplication and intentional divergences (VDOM, ResizeObserver, `connectedCallback`)
- Check circular import RN ↔ IE — is it a long-term liability?
- Survey subclass patterns: do apps extend RN, IE, or both?

**Decision options:**
- **Keep:** shared free functions + two bases (status quo, document contract)
- **Modify:** extract `ReactiveOwner` mixin/abstract layer for shared methods; IE extends HTMLElement + mixin
- **Abandon dual-class goal:** not recommended — conflicts with CE + node model split

---

## Principle 2: Events as internal reactivity transport

**Current state:** Every property change → handler → `dispatch('[prop]-changed')` ([ChangeQueue.ts](packages/core/src/core/ChangeQueue.ts) ~L125–138). [Binding.ts](packages/core/src/core/Binding.ts) listens to `-changed` events for sync. Internal and public consumers share one path.

```mermaid
flowchart TD
  setProp[setProperty] --> CQ[ChangeQueue.dispatch]
  CQ --> handler[propChanged]
  CQ --> evt["dispatch prop-changed"]
  evt --> binding[Binding.onSourceChanged]
  evt --> listeners[static Listeners / addEventListener]
  evt --> bubble[EventDispatcher bubble]
```

**Evaluation tasks:**
- Inventory `-changed` listeners: Binding vs app `Listeners` vs imperative `addEventListener`
- Count allocations per `setProperty` (Change object, event name string, CustomEvent/synthetic payload)
- Identify cases where handler + event duplicate work (same node, same tick)
- Prototype design sketch: **internal subscribers** (Binding, coalesced batch) vs **public events** (opt-in dispatch when listeners exist)

**Decision options:**
- **Keep:** single event path — simplicity, one mental model
- **Modify (recommended candidate):** fast path for `*Changed` handlers + Binding; events only when listeners registered or `bubbles: true`
- **Abandon events for property changes:** replace with signals — high migration cost, conflicts with DOM event interop

---

## Principle 3: Synthetic bubbling through `_parents`

**Current state:** [EventDispatcher.dispatchEvent](packages/core/src/core/EventDispatcher.ts) walks `_parents` for non-DOM nodes (~L367–372). DOM elements rely on native bubbling + `hasVisitedDomAncestor` dedup (~L77–85). Production `dispatch(..., true)` usage is mostly **IoElement → DOM tree** (layout, inputs, menus, three).

**Evaluation tasks:**
- Classify all `dispatch(..., true)` call sites: node-graph bubble vs DOM-only vs both
- Find node-only graphs that rely on `_parents` bubbling (exclude EventDispatcher tests)
- Measure complexity: `hasVisitedDomAncestor`, `_parents`/`_children` maintenance, dispose cleanup
- Compare alternative: explicit `parent.addEventListener` / Binding / callback injection for the N real cross-node cases

**Decision options:**
- **Keep:** synthetic bubble as core guarantee for node graphs
- **Modify:** default `bubbles: false` for node dispatch; bubble opt-in per event name
- **Demote:** node graphs use explicit subscription; keep DOM bubbling only — remove or simplify `_parents` walk

---

## Principle 4: Automatic observation of plain objects

**Current state:** `type: Object` props use window `io-object-mutation` bus (one listener per node, improved). Io values listen directly; `NodeArray` uses proxy + self-listener. `Color` in-place mutation still invisible ([packages/core/src/core/Color.ts](packages/core/src/core/Color.ts)).

**Production `type: Object` usage:** layout (`IoSplit`, `IoPanel`, `IoDrawer`), editors (`IoInspector`, `IoObject`, `IoPropertyEditor`), three (`IoVectorBase`, `IoBuildGeometry`).

**Evaluation tasks:**
- For each production `type: Object` prop: is value mutated in place, replaced, or wrapped in Node/NodeArray?
- Count `dispatchMutation` calls outside core — do apps use explicit mutation today?
- Document failure modes: shared plain objects, array mutation without proxy, `Color.r =`
- Compare alternatives:
  - **A:** explicit only — plain objects require `dispatchMutation` or replacement
  - **B:** proxy wrapper at assignment boundary (one-time wrap)
  - **C:** keep window bus, document limits

**Decision options:**
- **Keep:** automatic observation via window bus
- **Modify:** require `NodeArray` or Io types for collections; plain objects replace-only unless `dispatchMutation`
- **Abandon auto-observation for plain objects:** explicit mutation signaling (simplest mental model)

---

## Principle 5: Per-node `reactivity` timing mode

**Current state:** `reactivity: 'immediate' | 'throttled' | 'debounced'` on every owner ([ReactiveNode.ts](packages/core/src/nodes/ReactiveNode.ts) `dispatchQueue` ~L445–450). Default applied via reactive property definition.

**Evaluation tasks:**
- Grep production (non-test) assignments/overrides of `reactivity` — likely near-zero outside Theme/Storage patterns
- Map which nodes use `debounced`/`throttled` implicitly via class defaults
- Identify footguns: composing nodes with different modes; Binding bypassing `setProperty` debounce flags
- Compare: global rAF batch (default) + `@immediate` property decorator or per-call `setProperty(..., {sync: true})`

**Decision options:**
- **Keep:** per-node mode for Theme, Storage, heavy inspectors
- **Modify:** global default rAF batch; node mode deprecated to explicit per-write flag
- **Abandon node-wide mode:** single scheduler — document migration from `reactivity` property

---

## Principle 6: Framework vs library identity

**Current state:** Packages describe themselves as "library" ([packages/core/package.json](packages/core/package.json)); registration still side-effectful (`sideEffects: ["**/elements/**", "**/nodes/**"]`). `@io-gui/three` config registration moving to lazy plan.

**Evaluation tasks:**
- Audit registration side effects per package: `@Register`, singleton module init, config `registerEditorConfig`
- Tree-shake test: import single symbol from `@io-gui/inputs` — what still loads?
- Define two explicit product modes:
  - **Library:** granular imports, minimal side effects, consumer calls `registerIoGui()` or imports elements explicitly
  - **Framework:** meta-package or app template, full registration, batteries included
- Align with publish story: dist bundles vs granular packages

**Decision options:**
- **Library-first:** narrow sideEffects to entry/register modules; lazy CE registration API
- **Framework-first:** embrace full import side effects; document "import package = register all"
- **Hybrid (likely):** core + inputs as library; editors/three as opt-in framework layers

---

## Implementation phasing (after evaluation only)

Do **not** start refactors until all six decision records exist.

| Phase | Trigger | Action |
|-------|---------|--------|
| **Phase 0** | This plan | Audits + decision doc |
| **Phase 1** | Low-cost + high-confidence decisions | e.g. document Color replace-only; default `bubbles: false` for nodes if evidence supports |
| **Phase 2** | Decisions with perf proof | e.g. Binding fast-path if benchmarks justify |
| **Phase 3** | Breaking changes | e.g. remove synthetic bubble, drop `reactivity` property |

Cross-links: perf work stays in package_layer plan; three lazy configs in three.js_ui_configs plan.

---

## Unresolved questions

- Should evaluation include **Vitest micro-benchmarks** for principles 2 and 5, or static audit only?
- For principle 6, which product mode is the **primary audience** today (internal demos vs npm consumers)?
- After decisions, should breaking changes target **3.0** or stay in 2.x alpha?
