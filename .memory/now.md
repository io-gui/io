# Current Focus

Removed all `any` from ReactiveProperty.ts — value/init → unknown, Observer params → unknown, decodeInitArgument → unknown with safe path traversal. Minimal downstream fixes in ReactiveNode.ts and IoGL.ts for compile.
