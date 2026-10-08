import { PerspectiveCamera, PostProcessing, Scene } from 'three/webgpu';
import { pass } from 'three/tsl';
import { RenderTargetPipeline } from './RenderTargetPipeline.js';
/**
 * A pipeline around three's `PostProcessing` and a `pass(scene, camera)` (ADR-0006). Its output stays linear;
 * the viewport tone-maps when presenting. The scene pass depth is exposed so overlays depth-test against it.
 *
 * ```ts
 * registerPipeline({id: 'bloom', create: renderer =>
 *   new PostProcessingPipeline(renderer, scenePass => scenePass.add(bloom(scenePass)))})
 * ```
 */
export class PostProcessingPipeline extends RenderTargetPipeline {
    postProcessing;
    scenePass;
    convergeFrames;
    _build;
    _camera = null;
    _framesSinceChange = 0;
    constructor(renderer, build, options = {}) {
        super();
        this._build = build;
        this.convergeFrames = options.convergeFrames ?? 0;
        this.scenePass = pass(new Scene(), new PerspectiveCamera());
        this.postProcessing = new PostProcessing(renderer);
        this.postProcessing.outputColorTransform = false;
        this.output = { color: this.target.texture, depth: this.scenePass.getTexture('depth') };
    }
    draw(ctx) {
        this.scenePass.scene = ctx.scene;
        this.scenePass.camera = ctx.camera;
        if (this._camera !== ctx.camera) {
            this._camera = ctx.camera;
            this.postProcessing.outputNode = this._build(this.scenePass, ctx.camera);
            this.postProcessing.needsUpdate = true;
        }
        this.postProcessing.render();
        const changed = ctx.reasons.has('content') || ctx.reasons.has('view') || ctx.reasons.has('resize');
        this._framesSinceChange = changed ? 0 : this._framesSinceChange + 1;
        return { converged: this._framesSinceChange >= this.convergeFrames };
    }
    dispose() {
        this.postProcessing.dispose();
        this.scenePass.dispose();
        super.dispose();
    }
}
