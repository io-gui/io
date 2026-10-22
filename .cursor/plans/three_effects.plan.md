---
name: io-three Effects
overview: "Post-processing as document data. A document lists `Effect` objects: a declarative envelope (id, enabled, stage, inputs, parameters) around an imperative TSL build. Each 3D view compiles its own graph from the effects it shows, around the view's TRAA and an output transform. Replaces Document.bloom, View.bloom and BloomStage, and unblocks the conversion plan's document-pipeline examples. Also fixes TRAA velocity across views (confirmed 2026-10-22). Background research: reports/Threejs effect pipeline design.md (untracked)."
todos:
  - id: velocity-per-view
    content: "TRAA views after the first one drawn in a frame saw no object motion (three keeps one previous matrix per object), so moving objects smeared there. Done 2026-10-22: ViewVelocityNode / viewVelocity (render/ViewVelocityNode.ts) in the demo host's TRAA, as MRT output and TRAA context velocity; a canary test fails once three tracks it per camera. Upstream: velocity-per-view in three_upstream_fixes.plan.md"
    status: completed
  - id: effect-model
    content: "Effect base class (static type and stage; id, enabled; requires, active, buildKey, build returning a node or an instance {output, update, dispose}); Document.effects (NodeArray) whose mutations notify {kind: 'effects'}; Bloom extends Effect (stage post); Document.bloom removed and the 5 bloom examples moved to effects"
    status: pending
  - id: effect-pipeline
    content: "EffectPipeline for 3D views: draws the scene directly when the view shows no effects, else a per-view graph (scene pass, hdr, resolve, post) rebuilt when its key changes, instances disposed. 'forward' and 'traa' registered in the package builtins (TRAA moves out of the demo host). RenderTargetPipeline loses bloom, BloomStage is deleted, PostProcessingPipeline stays for host graphs"
    status: pending
  - id: view-effects
    content: "View.effects: switches by effect id, '*' for all; an effect without a switch is drawn only in views that follow the document's active camera, never in navigation or UV views. View.bloom and its drop-down removed, old JSON bloom read into effects.bloom; effect edits redraw only views that show effects"
    status: pending
  - id: present-tone-mapping
    content: "Canvas render without tone mapping: the present material tone-maps scene-referred pipeline output (view ?? pipeline ?? document, exposure as a uniform). Overlays are no longer tone-mapped (decided 2026-10-22)"
    status: pending
  - id: effects-docs
    content: "ADR-0013 (documents declare effects, views compile graphs), ADR-0006 bloom sentence, README, SKILL.md, CONTEXT.md glossary, index.ts exports, conversion plan (Map row, post rule, blocker), future-work pointers"
    status: pending
  - id: effects-check
    content: "Tests (View rule and JSON, pipeline key, listens and dispose, present tone mapping) and headless: Active view of the 5 bloom examples unchanged, navigation and UV views without bloom, bloom edits leave TRAA views converged, rebuild time measured. Convert PostprocessingBloom and TslVfxLinkedparticles"
    status: pending
  - id: view-display-ui
    content: "View tab: checkboxes for the overlays registered for the view's kind and for the document's effects (resolved state; writes View.overlays / View.effects). Takes over overlay-toggles"
    status: pending
  - id: effects-editor-ui
    content: "Document tab: the effects list with add (effectTypes registry), remove, reorder within a stage and enable; each effect shows its own editor config"
    status: pending
  - id: display-stage
    content: "display stage: when a display effect runs, the graph applies the output transform itself (tone mapping, sRGB, display effects, back to linear; output marked displayReferred). Validate: MaterialsNormalmap gets back its bleach bypass, color correction and FXAA"
    status: pending
  - id: mrt-channels
    content: "requires() and ctx.channel(): one MRT node per channel layout, shared by views; ctx.output(id); Bloom input (color or emissive) and resolutionScale (takes over bloom-emissive). Validate: PostprocessingBloomEmissive, PostprocessingLensflare, Water restored, GeneratorCity's quarter-resolution bloom restored"
    status: pending
  - id: content-mrt
    content: "Channels written by content (material.mrtNode) in views with another MRT layout or none. Validate: PostprocessingBloomSelective in the Active, Perspective and TRAA views"
    status: pending
  - id: per-view-update
    content: "Instance update(ctx) before each draw, with the view camera; depth input. Validate: PostprocessingDof, PostprocessingDofBasic; Reflection and SkinningInstancing get their depth blur back"
    status: pending
  - id: document-inputs
    content: "Effects that hold document objects (a light and its shadow map). Validate: PostprocessingGodrays"
    status: pending
  - id: selection-effects
    content: "Effects over an object list, with extra scene renders per view and the timeline's time instead of TSL time. Validate: PostprocessingOutline"
    status: pending
  - id: extra-passes
    content: "ctx.addPass (layers, resolution scale); content that reads the drawing view's pipeline depth. Validate: VolumeLighting"
    status: pending
  - id: scene-replacement
    content: "A scene-stage effect that replaces the scene pass (one per view; conflicts reported in the UI, not thrown). Validate: Oit; MaterialsAlphahash (SSAA) and MaterialsToon (toon outline) restored"
    status: pending
  - id: lighting-contexts
    content: "ctx.addLighting (AO, SSS, GI into the scene pass) and a document anti-aliasing preference for views that follow the document (TRAA in the Active view). Validate: PostprocessingSss, then PostprocessingAo"
    status: pending
  - id: post-batch
    content: "Remaining document-pipeline TODO rows on the proven parts; re-decide the screen-space filter demos the conversion plan files as view pipelines"
    status: pending
isProject: false
---

# io-three Effects

## Decisions (2026-10-22)

- **Effects are document data.** `Document.effects` is an ordered list of `Effect` objects. Documents fill it imperatively (in the constructor, after a load). The envelope is the standard shape the editor lists, switches and inspects. The body is TSL, so a source graph moves in nearly verbatim.
- **Each view compiles its own graph.** three binds a scene pass and every effect node to one camera, one canvas size and one render per frame. So views share the document's effect objects, and each builds its own nodes and targets.
- **Fixed stages.** List order applies within a stage. No engine in the research lets users reorder built-in effects freely.
- **Overlays stay outside the pipeline and are no longer tone-mapped.** The user prefers this.
- **Default visibility:** only views that follow the document's active camera draw effects. Navigation views (free perspective, axis views) draw none, and UV views never do. A view can switch effects on or off.
- **Bloom is the first `Effect`.** `Document.bloom`, `View.bloom`, the Document/On/Off drop-down and `BloomStage` go.

Background: the deep-research report `reports/Threejs effect pipeline design.md` and its notes in `research_notes/Threejs effect pipeline design/` (both untracked at the repo root). Where the report differs from this plan, the plan wins. In particular, the report's `scope: 'look'` and its `View.effects` modes ('document', 'look', 'none') are dropped by the visibility decision.

## TRAA velocity across views (confirmed 2026-10-22)

**Finding.** `VelocityNode.update` (three `src/nodes/accessors/VelocityNode.js:111-152`) copies the object's previous world matrix into its uniform before each draw. `updateAfter` (`:159-161`, `updateAfterType = OBJECT`) then overwrites it with the current matrix after each draw. The matrix is stored per object (`getData( object )`). The camera half is per camera and frame, and skinning shifts previous bone matrices once per skeleton and frame (`Skinning.js:243-262`). So only object motion is lost, in two ways:
- Of several views drawing velocity in one frame, only the first sees an object move.
- A view that skipped frames gets the motion since any view's last draw, not since its own.

**Checks** (headless; scratch scripts in the session scratchpad):
- **three alone** (dev build d94661f706). Setup: two passes with `mrt({output, velocity})`, two cameras, a box moved 0.1 per frame.
  - The view drawn first reads velocity.x 0.0476 at the box; the second reads 0.
  - Swapping the order swaps them.
  - One view alone reads 0.0476.
- **io demo host** (:3000, GeometriesExample, one sphere moved once). Front, Right and Top are on screen together. Front, drawn first, has velocity on 3895 pixels; Right and Top on 0.
- **Visible.** A sphere moves at constant speed under Top, and Top's pipelines freeze right after the last move.
  - Drawn after Front, the sphere's wire pattern is smeared.
  - Drawn first (Top focused, priority 2), it is crisp.
  - Mean pixel difference: 4.97 on the sphere, 0.83 elsewhere.

**Workaround** (done 2026-10-22): `ViewVelocityNode` and its shared instance `viewVelocity` (`packages/three/src/render/ViewVelocityNode.ts`, exported).
- **How.** Per object and camera, the node keeps the world matrices of the last two frames in which that camera drew the object. The shader gets the earlier one. `updateAfter` no longer writes the per-object matrix. The camera half is three's own.
- **Use.** The demo host's TRAA writes it in the MRT and names it as TRAA's context `velocity`: `context(traa(...), {velocity: viewVelocity})`. TRAA un-jitters the velocity node its context names (three #32274), otherwise three's `velocity`. The README and SKILL.md show this.
- **Tests.** `ViewVelocityNode.test.ts` checks that each camera measures against its own last draw, also across skipped frames. A canary asserts that three's `velocity` still loses the second camera's motion, so it fails once upstream fixes it.
- **Checked headlessly** (:3000, GeometriesExample):
  - In the frame of the move, Front had 3898 moving pixels, Right 1278 (other objects hide part of the sphere along X) and Top 3904. Before the fix: 3895, 0 and 0.
  - All views read 0 in the following frames, so TRAA's un-jittered projection reaches the node.
  - On the sphere, Top drawn after Front now differs from Top drawn first by 0.54 (2.72 before).
- **Not done:** one MRT node shared by the TRAA views. The MRT node is part of each render object's cache key, so sharing could mean fewer material variants (read from the code). Left for `effect-pipeline`, which builds one MRT per channel layout.

## Design

### Effect

```ts
type EffectStage = 'scene' | 'hdr' | 'post' | 'display'

/** What one view's graph holds of an effect. */
interface EffectInstance {
  readonly output: Node
  /** Before each draw of the view: parameters into uniforms, values from the view camera. */
  update?(ctx: EffectContext): void
  dispose?(): void
}

@Register
export class Effect extends ReactiveObject {
  /** Registry and serialization id, and the default `id`. */
  static readonly type: string = ''
  static readonly stage: EffectStage = 'post'
  /** Unique in the document; views switch effects by it. */
  @Property({type: String, value: ''}) declare id: string
  @Property({type: Boolean, value: true}) declare enabled: boolean
  /** Scene inputs it reads: 'depth', 'normal', 'velocity', 'emissive', 'metalrough', or a channel content writes. */
  requires(): readonly string[] { return [] }
  /** Whether it runs in this view (SSGI needs a perspective camera); the editor shows why not. */
  active(ctx: EffectContext): boolean { return this.enabled }
  /** Parameters baked into the graph. A change rebuilds the graphs that run it; uniform parameters stay out. */
  buildKey(): string { return '' }
  /** Once per view graph build. */
  build(input: Node, ctx: EffectContext): Node | EffectInstance { return input }
}
```

`EffectContext` is per view build. It grows with the phases:
- **Phase 1:**
  - `renderer`, `document`, `scene`;
  - `camera`: the view's draw camera (ADR-0005), never the document's;
  - `resolve`: 'none' or 'traa';
  - `samples`;
  - `scenePass`;
  - `time`: the document timeline's time, not TSL `time`.
- **Added by `mrt-channels`:** `channel(name)` and `output(id)`.
- **Added by `extra-passes`:** `addPass(options)`.
- **Added by `lighting-contexts`:** `addLighting(node)`.

Bloom in phase 1 (input and resolution scale come with `mrt-channels`):

```ts
@Register
export class Bloom extends Effect {
  static override readonly type = 'bloom'
  static override readonly stage = 'post'
  @Property({type: Number, value: 1}) declare strength: number
  @Property({type: Number, value: 0}) declare radius: number
  @Property({type: Number, value: 0}) declare threshold: number
  override build(color: Node) {
    const glow = bloom(color)
    return {
      output: color.add(glow),
      update: () => {
        glow.strength.value = this.strength
        glow.radius.value = this.radius
        glow.threshold.value = this.threshold
      },
      dispose: () => glow.dispose(),
    }
  }
}
```

- **Documents.**
  - GeneratorCity, Ocean, MaterialsRetroreflection and TslVfxTornado move from `bloom: new Bloom({...})` to `effects: [new Bloom({...})]`.
  - Watch keeps `enabled: false`.
  - Example-local effects subclass `Effect` in the example file.
  - Built-in effects go in `src/editor/effects/` (Bloom moves there), with editor configs and groups as `Bloom.ts` has today.

### Document

```ts
/** Post-processing, run by stage and by list order within a stage, in views that show it (ADR-0013). */
@Property({type: NodeArray, init: 'this'})
declare effects: NodeArray<Effect>

effectsMutated() {
  this.notify({kind: 'effects'})
}
```

- **Change kind.** `ChangeKind` gains `'effects'`, with `ids` naming the effect when the mutation says which.
- **Setup.** `DocumentProps.effects` sets up the list as `Panel.tabs` does in the layout package.
- **Check:** that a nested property change reaches `effectsMutated`.
- **Removed from Document:** the `bloom` prop and property, `bloomMutated`, and its editor config and group entries (`Document.ts:16, 58-60, 255-257, 350, 356`).

### Stages and a view's graph

| Stage | Runs on | Typical effects |
|---|---|---|
| `scene` | The scene pass: MRT, lighting contexts, layers, or a replacement pass | AO, SSS and GI contexts; OIT, SSAA, pixelation, retro |
| `hdr` | Linear scene color before the resolve (jittered under TRAA) | SSR and SSGI composites, godrays, fog, volumetrics |
| resolve | The view's: TRAA (`traa` pipeline) or none; MSAA lives on the scene pass | |
| `post` | Linear color after the resolve | DOF, motion blur, bloom, lens flare |
| output | Tone mapping and exposure, from the view, then the pipeline, then the document. Done in the present material, or in the graph when a display effect runs | |
| `display` | Display-referred sRGB | LUT and grading, bleach bypass, chromatic aberration, Sobel, film, FXAA |

The order follows the engines:
- Temporal AA runs before DOF, bloom and tone mapping.
- The tonemapper is the boundary between HDR and LDR.
- io already draws bloom after TRAA.

One source is out of reach: PostprocessingSsrDenoise runs TRAA after its grading. It stays deferred.

### EffectPipeline

- **Registration.** One class for 3D views, registered in `render/builtins.ts` under two ids:
  - `'forward'`: `new EffectPipeline(renderer)`;
  - `'traa'`: `new EffectPipeline(renderer, {resolve: 'traa', convergeFrames: 32})`, which takes no MSAA (as today).

  The demo host then only picks ids (`IoEditorExample.ts:12-19` goes).
- **Effects shown.** The document's effects that are enabled, shown by the view (`view.showsEffect`) and `active(ctx)`, sorted by stage, then by list order.
- **No effects and no resolve:** `renderer.render(scene, camera)` into the target, as `ForwardPipeline` today, so navigation views pay nothing new.
- **Otherwise, the graph.** A three `RenderPipeline` (`outputColorTransform = false`) runs `pass(scene, camera)`, then scene, hdr, TRAA if any, post, and output and display when a display effect runs, into the target.
- **Rebuilds.** The graph is keyed by:
  - resolve, sample count and camera object;
  - each shown effect's `type:id:buildKey()`;
  - the channel layout;
  - with a display effect, the tone mapping.

  When the key changes, the pipeline disposes every instance, pass and node it made, then rebuilds. `RenderPipeline.dispose()` frees none of them, and `BloomNode.setup()` keeps adding blur materials when re-run, so each build makes fresh nodes. Comparing the key at draw time keeps ADR-0003's rule that `listens` only answers.
- **Each draw:** `instance.update?.(ctx)`, then render; convergence as today.
- **`listens`.** An `'effects'` change is `'content'` only when the view shows effects, otherwise `false`. So a bloom slider no longer redraws, or restarts the TRAA of, views that do not draw bloom. Other changes behave as today.
- **Output:** `{color, depth, displayReferred}`.
- **Leaves the rest:**
  - `RenderTargetPipeline` loses `_bloom` and `_drawBloom` (`:17, 52-64`).
  - `BloomStage` is deleted.
  - `UVPipeline` runs no effects.
  - `PostProcessingPipeline` stays for host-registered graphs, without document effects. Its stale `registerPipeline` docstring (`:30-33`) is fixed.

### View

```ts
/**
 * Effects drawn in this view, by effect id, and '*' for all. An effect without a switch is drawn only when the view
 * follows the document's active camera (`setCameraView()`). Replace the object, as with `overlays`.
 */
@Property({type: Object, init: null})
declare effects: Readonly<ViewEffects>

showsEffect(effect: Effect) {
  if (this.kind !== '3d') return false
  return this.effects[effect.id] ?? this.effects['*'] ?? this.followsActiveCamera
}
```

- **Rule.** `followsActiveCamera` exposes `_followDocument`. A view on a named scene camera is a navigation choice and draws none by default.
- **Apps.** An app with a single free viewport sets `effects: {'*': true}`.
- **Removed:** `View.bloom`, its editor config and the `Main` group entry (`View.ts:104-106, 436, 451-460`).
- **JSON.** `toJSON` writes `effects`. `applyJSON` reads an old `bloom: true | false` into `effects.bloom`.
- **Demo host.** Its views drop `bloom: false` (`IoEditorExample.ts:398-406`). The rule gives the decided defaults, and the docblock says so.

### Tone mapping in the present

- **Canvas render.** `ViewCompositor.render` sets `renderer.toneMapping = NoToneMapping` for the canvas render (`ViewCompositor.ts:158-159`). `getDefaultRenderer` stops setting `NeutralToneMapping`. three then only encodes sRGB on the canvas.
- **Present material.** Its color becomes `toneMapping(mapping, exposure, texture)` for scene-referred output, and the plain texture for `displayReferred` output. A change of mapping rebuilds the material; exposure is a uniform.
- **Overlays** are sRGB-encoded only. Grid, gizmo and helper colors change in tone-mapped documents, as decided.
- **Fewer rebuilds.** three's `RenderPipeline`s inside views no longer see `renderer.toneMapping` flip between views. Since r184 they rebuild on that change.
- **Check:** the Active view of the 5 bloom examples is pixel-equal before and after.

### Editor

- **Document tab, Rendering group:** tone mapping, exposure, effects (each with its editor config). `effects-editor-ui` adds add, remove and reorder, through an `effectTypes` registry built like `overlayTypes`.
- **View tab:** overlay and effect checklists for the focused view (`view-display-ui`). Until then, views switch effects only in code, and the rule gives the decided defaults.

## Phases and validation

1. **`velocity-per-view`.** Independent and small; fixes today's TRAA views.
2. **Core:** `effect-model`, `effect-pipeline`, `view-effects`, `present-tone-mapping`, `effects-docs` and `effects-check`.
   - **Why bloom first:** bloom is the only part whose rendered content must stay identical, which makes it the cheapest check of the moved tone mapping.
   - **Unblocked right after:** PostprocessingBloom and TslVfxLinkedparticles only need bloom of the scene color.
3. **UI:** `view-display-ui` and `effects-editor-ui`.
4. **Capabilities.** One per step, each proved by the examples in its todo, in this order:
   1. `display-stage`
   2. `mrt-channels`
   3. `content-mrt`
   4. `per-view-update`
   5. `document-inputs`
   6. `selection-effects`
   7. `extra-passes`
   8. `scene-replacement`
   9. `lighting-contexts`

   SSS goes before AO because GTAO is still changing upstream: #35073 merged on 10-18, and #35052 is open.
5. **`post-batch`.**
   - **On the proven parts:** Ssr, Ssgi, Vxgi, VolumeLightingTraa, CustomFogBackground (display), CustomFogScattering and BackdropWater (hdr on depth), PointsDynamic.
   - **Defer:** SsrDenoise (patches `PhysicalLightingModel` globally), VolumeFire, PostprocessingFog, ComputeParticlesSnow.
   - **Skip as near-duplicates:** VxgiSponza, VolumeLightingRectarea, SsgiBallpool (also needs a physics package).
   - **Re-decide:** the screen-space filter demos that the conversion plan files as "view pipelines".

**Conversion plan changes, as the phases land:**
- The bloom Map row (`ExamplesConversion.plan.md:480`) becomes `effects: [new Bloom(...)]`.
- The rule "other cosmetic post-processing is dropped and noted" (`:261`) becomes "port the source graph into `Effect` subclasses": built-in or example-local, the camera from `ctx`, timeline time.
- The `document-pipeline` blocker (`:284`) shrinks per phase.
- Each validating example's sidecar records the restore under History.

## Risks (test in the phase that meets them)

- **Rebuild cost** is unmeasured. Time an `enabled` toggle in `effects-check`. If it is slow, keep fused effects in the graph and bypass them with a uniform `select`; multi-pass nodes still need the rebuild to stop rendering.
- **`fragmentNode` materials break MRT** (`triage-fragment-node-mrt`). Request MRT only for shown effects that need channels, and list the offending materials in the UI.
- **Content channels** (`material.mrtNode`) could lose color in views with another layout (read from the code, `MRTNode.js:203-229`). Covered by `content-mrt`.
- **TRAA jitter ownership.** TemporalReproject claims the camera offset without jittering. Assert after each build that TRAA owns it.
- **Memory per view.** Bloom holds 11 half-float targets, Outline 8 plus two scene renders, DOF 6. The default rule keeps them to the Active view.
- **Upstream churn** in the display nodes. Wrap three's nodes in io `Effect` classes and persist only the envelope, never three's constructor signatures.

## Verification (every phase)

- `npx tsc -p packages/three/tsconfig.json --noEmit --incremental false --composite false`
- `npx eslint <files>`
- `source .env && pnpm test packages/three`
- `node packages/three/scripts/examples.mjs check`
- Headless on :3000:
  - Active view against the source screenshot;
  - navigation views;
  - play and scrub;
  - switching effects;
  - console clean.
