# Current Focus

Normalized VDOM children API: `VDOMElement.children` is always `Array<VDOMChild> | undefined`. String sugar only at factory boundary via `createVDOMElement` / `normalizeVDOMChildren`. Removed string branch from `IoElement.traverse`.
