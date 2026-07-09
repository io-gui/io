# Current Focus

Binding hub-and-spoke race: `onSourceChanged` updates targets sequentially; sync `*Changed` / mutation on first spoke can re-render second spoke while still `''`.

Breaking tests in `packages/core/src/core/Binding.test.ts` (2 failing). Fix next — do not touch polygone PageModel/AssetInfoView yet (stash workaround drops duplicate guid bind).
