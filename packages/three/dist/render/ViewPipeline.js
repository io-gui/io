import { Registry } from '../utils/Registry.js';
/** Pipelines `ThreeView.pipeline` can name. */
export const pipelineTypes = new Registry();
/** The pipeline a view kind uses when `ThreeView.pipeline` is empty. */
export const DEFAULT_PIPELINES = {
    '3d': 'forward',
    'uv': 'uv',
};
