---
source: webgpu_loader_jpegxl
synced: d94661f706
tags: [types]
---

# LoaderJpegxl

[`webgpu_loader_jpegxl`](https://threejs.org/examples/#webgpu_loader_jpegxl), converted 2026-10-20 (batch 5)

## Deviations

- **Controls:** the source's tone mapping and exposure controls are the document's (Rendering).
- **Dropped:** the HTML labels; the planes are named.
- **Asset:** the JPEG XL image loads from the dev branch on raw.githubusercontent.com; it reaches threejs.org with r187.
- **Types:** `JXLLoader` (r187) is imported with `@ts-expect-error`; `@types/three` 0.186 does not have it.

## Open

- `r187-followups`: load the image from threejs.org and drop the `@ts-expect-error` import once r187 and its typings are out.

## History

- 2026-10-20: Converted (batch 5) from the source at `d94661f706`, which is newer than r186. Ran on the linked r187dev build. Checked headlessly on the fallback only: headless Chromium has no float16 `srgb-linear` canvas, so the JPEG XL plane is dark and warns, as the source does there.
