import { CanvasTarget, RenderTarget, Texture, TextureSource, ViewportTextureNode } from 'three/webgpu'

/**
 * A runtime fix for a three.js defect, kept until three fixes it. Patches apply when this module loads.
 * `threePatches.test.ts` fails once unpatched three no longer has a patch's defect: then delete the patch.
 */
export interface ThreePatch {
  readonly id: string
  /** Whether unpatched three still has the defect. */
  hasDefect(): boolean
}

/** `ViewportTextureNode` fields that @types/three 0.186 does not declare. */
type ViewportTextureNodeFields = ViewportTextureNode & {defaultFramebuffer: Texture; referenceNode: ViewportTextureNode | null}

const getTextureForReference = ViewportTextureNode.prototype.getTextureForReference

/** The texture three clones for each render target: the base node's `defaultFramebuffer`. */
function getBaseTexture(node: ViewportTextureNode) {
  const fields = node as ViewportTextureNodeFields
  return ((fields.referenceNode ?? fields) as ViewportTextureNodeFields).defaultFramebuffer
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
const viewportTextureSource: ThreePatch = {
  id: 'viewport-texture-source',
  hasDefect() {
    const node = new ViewportTextureNode()
    return getTextureForReference.call(node, new RenderTarget()).source === getBaseTexture(node).source
  },
}

ViewportTextureNode.prototype.getTextureForReference = function(this: ViewportTextureNode, reference: RenderTarget | CanvasTarget | null = null) {
  const texture = getTextureForReference.call(this, reference)
  const base = getBaseTexture(this)
  // A framebuffer copy's `image` is only its size.
  if (texture !== base && texture.source === base.source) texture.source = new TextureSource({...(base.image as {width: number; height: number})})
  return texture
}

/** The patches in effect. */
export const threePatches: readonly ThreePatch[] = [viewportTextureSource]
