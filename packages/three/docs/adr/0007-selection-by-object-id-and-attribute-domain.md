---
status: accepted
---

# Selection is stored by object id and attribute domain, changed through transactions

There is one `SelectionModel` per document per editor session, and every view in that session shares it. Selection is session state, not document data: the editor keeps one model per document id, and with multi-user editing each user has their own selection that never syncs (ADR-0008). Views filter what they can pick and decide how to show it. Hover (pre-selection) is per view and never enters the model.

Levels are attribute domains, using Houdini's vocabulary with `object` on top: `object`, `point`, `edge`, `primitive`, `corner`, plus domains registered by geometry adapters (`bone`, `instance`, ...). Objects are keyed by `Object3D.uuid`, not by reference, so undo, serialisation, workers and loader rebuilds work. Component selections are bitsets per object per domain. A million points cost 125 KB, and the bitset uploads as-is to the GPU for highlighting.

All changes go through `selection.edit()` transactions. A commit bumps one reactive `version`, sends one change notification and, when undo exists, may record one local undo step (ADR-0008). Reactive properties are only the ones the UI binds to: `domain`, `version`, `active` and `uvSync`. The sets themselves are plain fields.

UV selection is a `corner` selection, because UVs are stored per face corner. With `uvSync` on, UV picks map to mesh domains. With it off, the UV view keeps its own corner selection and shows only primitives selected in 3D. There is no second selection system.

The model knows nothing about meshes. A `GeometryAdapter` per object type provides domain sizes, element positions, the ID-pass drawing used for picking, and highlight drawing.

## Consequences

- Component indices are valid for one topology version. Topology-changing operators must remap or clear the selection.
- `BufferGeometry` has no edges and splits points at seams, so a derived topology cache (welded points, edge table, versioned) is required for `point` and `edge`.
- Picking goes through a `Picker` interface per view kind whose queries return a `Promise`, because GPU readback is asynchronous. The first implementation is a plain `Raycaster` (resolves immediately). Planned replacements behind the same interface: a `three-mesh-bvh` accelerated raycast (optional peer dependency) for objects, and a rasterised ID buffer for components and large scenes. Hover may use a synchronous fast path where the implementation offers one.
- An outliner on io-menus keeps its own `Option.selected` state (menus ADR-0001) and syncs object-domain selection through a small two-way adapter. `SelectionModel` stays the source of truth.
