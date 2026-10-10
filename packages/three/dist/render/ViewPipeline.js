import { Registry } from '../utils/Registry.js';
/** Pipelines `View.pipeline` can name. */
export const pipelineTypes = new Registry();
/** The pipeline a view kind uses when `View.pipeline` is empty. */
export const DEFAULT_PIPELINES = {
    '3d': 'forward',
    'uv': 'uv',
};
