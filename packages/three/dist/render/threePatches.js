import { RenderTarget, TextureSource, ViewportTextureNode } from 'three/webgpu';
const getTextureForReference = ViewportTextureNode.prototype.getTextureForReference;
/** The texture three clones for each render target: the base node's `defaultFramebuffer`. */
function getBaseTexture(node) {
    const fields = node;
    return (fields.referenceNode ?? fields).defaultFramebuffer;
}
/**
 * Viewport textures share one size across render targets (three r186; still in three dev on 2026-10-10).
 *
 * `ViewportTextureNode` (transmission, `viewportTexture()`) copies the framebuffer into a texture per render target,
 * made with `defaultFramebuffer.clone()`. `Texture.copy` shares the `TextureSource`, so every copy shares one `image`
 * size. Views of different sizes then resize each other's copy, and three reallocates it on every draw. A draw that
 * does not refresh its bindings samples the destroyed texture: WebGPU logs "Destroyed texture … used in a submit" and
 * drops that view's frame. The patch gives each copy its own `TextureSource`.
 *
 * Pipelines draw in their own render context (`RenderTargetPipeline.scope`), so this patch is what keeps a view's
 * bindings valid. Without it, a view whose copy another view resized keeps sampling the destroyed texture.
 */
const viewportTextureSource = {
    id: 'viewport-texture-source',
    hasDefect() {
        const node = new ViewportTextureNode();
        return getTextureForReference.call(node, new RenderTarget()).source === getBaseTexture(node).source;
    },
};
ViewportTextureNode.prototype.getTextureForReference = function (reference = null) {
    const texture = getTextureForReference.call(this, reference);
    const base = getBaseTexture(this);
    // A framebuffer copy's `image` is only its size.
    if (texture !== base && texture.source === base.source)
        texture.source = new TextureSource({ ...base.image });
    return texture;
};
/** The patches in effect. */
export const threePatches = [viewportTextureSource];
