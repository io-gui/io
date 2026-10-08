const _pipelines = new Map();
/** Registers a pipeline for `ThreeView.pipeline` to name. Replaces one with the same id. */
export function registerPipeline(type) {
    _pipelines.set(type.id, type);
}
export function getPipelineType(id) {
    return _pipelines.get(id);
}
export function listPipelines(viewKind) {
    return [..._pipelines.values()].filter(type => !viewKind || (type.viewKinds ?? ['3d']).includes(viewKind));
}
/** The pipeline a view kind uses when `ThreeView.pipeline` is empty. */
export const DEFAULT_PIPELINES = {
    '3d': 'forward',
    'uv': 'uv',
};
