# Current Focus

Binding network races: single-hub batch fix insufficient for multi-hub cascades.

`Binding.network.test.ts` — 5 failing / 2 passing. Root cause: each hub still `dispatchQueue()`s its dirty spokes in sequence; nested hubs only push *their* leaves on their own dispatch. Sibling branches + attachment-order variants expose mid-wave stale leaves / half-joins.

No network-level fix yet — failing tests only.
