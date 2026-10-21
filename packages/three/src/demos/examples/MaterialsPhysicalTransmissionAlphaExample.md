---
source: webgl_materials_physical_transmission_alpha
synced: d94661f706
---

# MaterialsPhysicalTransmissionAlpha

[`webgl_materials_physical_transmission_alpha`](https://threejs.org/examples/#webgl_materials_physical_transmission_alpha), converted 2026-10-20 (batch 5)

## Deviations

- **Backdrop:** the source draws on a transparent canvas over an HTML table of colored cells; here a `Table` of four unlit quads behind the model stands in for it, tone mapped with the frame, so paler than the CSS colors.
- **Controls:** every control starts from the dragon's material; the source reads nine of them. The source's exposure is the document's (Rendering).

## History

- 2026-10-20: Converted (batch 5) with the transmission rows, once `transmission-views` stopped reproducing. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits, playing in four views while the window resizes, all batch 5 documents in one page without errors.
