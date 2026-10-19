---
status: accepted
---

# Documents name what editor views frame; the editor asks

A view frames its document by itself the first time it shows it. The whole scene is the wrong thing to frame when scenery dwarfs the subject (a 50-unit floor, a sky dome, a fogged cube), so a document names its objects of interest with `Document.getEditorFrameTarget()`. `null` (the default) frames the whole scene. Framing is an editor concern: a document also runs where there are no editor views (a player, a page, a test), so the hook is editor-only by name and nothing else calls it. Only the document knows what its subject is, so the answer lives with it; the editor asks for it whenever it frames and stores nothing.

A view that frames by itself (`View.autoFrame`) keeps the key of the target it framed in its navigation (`ViewNavigation.autoFramed`, object uuids). Before each draw a viewport asks again; when the answer changes, a view still framing itself frames again. So a model that loads after the first draw replaces the scene as what is framed, and a viewport made later (a tab opened after loading) or a document shown later (switched away from while it loaded) frames the model when it first shows. Navigating, framing on request (`View.frame`, F) or changing the axis view ends it: the view keeps what was asked for. The key is session state, saved and restored per document with the rest of the navigation (ADR-0002). Framing with nothing selected (F) frames the target too; frame all (Home) frames the whole scene.

Before this, documents dispatched a `frame-object` event with `{object, overscan}` after loading. It reached only viewports that existed and listened at that moment. Viewports in unopened tabs are made when their tab is first selected (the layout caches its tabs reactively), so they missed it and framed the whole scene, ground and all. The event also went nowhere when its document was not the editor's document by the time it loaded. Its `overscan` scaled the fitted box, which compounded the view's own `overscan`: the margin belongs to the view (`View.overscan`), not to a framing request.

## Considered Options

- **The `frame-object` event** (the previous rule). A one-off signal: views that do not exist or do not listen when it fires never learn it.
- **A `Document.frameTarget` property.** Reads as content state that every runtime should honor. Framing is meaningful only in the editor.
- **An event that the editor stores in a `WeakMap<Document, target>`.** Clearly editor-side, but still a one-off signal: the editor is the parent of its current document only, so a document that finishes loading while another is shown loses it.
- **The host frames every view on the event.** Example-specific logic in the host, and still misses documents that are not shown.
- **Skip scenery when framing (`userData.selectable === false`).** Implicit, and an enclosing curtain or a fog range still needs an explicit extent.

## Consequences

- Examples return their model once loaded (`@Field(null) declare private _frameTarget`), or a two-point stand-in `Mesh` for an extent: inside enclosing scenery (GeometryLoft's curtain) or within a fog range (the snow cubes, InstancingMorph's herd), where the old event passed an `overscan` below 1.
- Views ask before every draw while they frame themselves, so the hook is cheap: return a field, do not search the scene.
- A view framing itself updates the scene's world matrices before it frames, so content built or loaded since the last draw (fresh `SkeletonUtils` clones, objects under a loaded file's transforms) frames at its real place.
- `View.frame(object, fitScale = 1)` and `ViewNavigation.frame` scale the fitted box by `fitScale`; no caller scales today. `frameUV` lost its 1.05 margin to the same rule: the view's `overscan` is the margin.
- Content whose bounds move (AnimationKeyframes' box travels 30 units) still frames its rest pose; a document can return a stand-in extent of the motion.
- Future: an editor-side `WeakMap<Document, FrameTarget>` for targets the editor or a tool sets at runtime ("frame this from now on"), overriding the document's answer. Nothing needs it yet.
