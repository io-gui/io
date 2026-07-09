# Current Focus

Binding hub-spoke mid-push race fixed: `onSourceChanged` now debounce-writes all spokes then `dispatchQueue()` per dirty target. Binding.test.ts green (11). Polygone PageModel/AssetInfoView still unfixed locally (stash workaround optional now).
