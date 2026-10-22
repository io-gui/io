import { CubeCamera, CubeRenderTarget, CubeTexture, CubeTextureLoader, LightProbe, Material, MeshBasicNodeMaterial, Node, PerspectiveCamera, WebGPURenderer } from 'three/webgpu'
import { getShIrradianceAt, normalWorld } from 'three/tsl'
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelperGPU.js'
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Gives a light probe helper a basic material that draws the same irradiance. Workaround (upstream:
 * triage-fragment-node-mrt): the helper's own material sets `fragmentNode`, which writes only the first color output:
 * in the TRAA views' MRT pass (color and velocity) WebGPU rejects its pipeline.
 */
function useBasicMaterial( helper: LightProbeHelper ) {
  const { _sh: sh, _intensity: intensity } = helper as unknown as { _sh: Node; _intensity: Node<'float'> }

  const material = new MeshBasicNodeMaterial()
  material.colorNode = ( getShIrradianceAt( normalWorld, sh ) as Node<'vec3'> ).mul( 1 / Math.PI ).mul( intensity )

  const previous = helper.material as Material
  helper.material = material
  previous.dispose()
}

/**
 * A light probe generated from a cube camera's render of the scene (the Pisa cube map background), shown by a light
 * probe helper at the origin: the probe's lighting on a sphere. The helper is the content, the source's subject; the
 * probe helpers overlay's small sphere for the same probe sits inside it. The cube camera renders once, with the first
 * renderer, after the background has loaded.
 */
@Register
export class LightprobeCubecameraExample extends Document {

  public lightProbe: LightProbe
  private cubeRenderTarget: CubeRenderTarget
  private cubeCamera: CubeCamera
  /** The background, loading from construction. */
  private background: Promise<CubeTexture>
  private preparing?: Promise<void>

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 30 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.cubeRenderTarget = new CubeRenderTarget( 256 )
    this.cubeCamera = new CubeCamera( 1, 1000, this.cubeRenderTarget )

    // probe

    this.lightProbe = new LightProbe()
    this.lightProbe.name = 'LightProbe'
    this.scene.add( this.lightProbe )

    // envmap

    const genCubeUrls = function ( prefix: string, postfix: string ) {
      return [
        prefix + 'px' + postfix, prefix + 'nx' + postfix,
        prefix + 'py' + postfix, prefix + 'ny' + postfix,
        prefix + 'pz' + postfix, prefix + 'nz' + postfix
      ]
    }

    const urls = genCubeUrls( 'https://threejs.org/examples/textures/cube/pisa/', '.png' )

    this.background = new CubeTextureLoader().loadAsync( urls ).then( cubeTexture => {
      this.scene.background = cubeTexture
      this.notify({kind: 'material'})
      return cubeTexture
    } )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.preparing ??= this.prepare( renderer )
  }

  /** Renders the scene into the cube camera with the first renderer and generates the probe from it. */
  private async prepare(renderer: WebGPURenderer) {
    try {
      await this.background

      this.cubeCamera.update( renderer, this.scene )

      const probe = await LightProbeGenerator.fromCubeRenderTarget( renderer, this.cubeRenderTarget )

      this.lightProbe.copy( probe )
      this.lightProbe.name = 'LightProbe' // `copy` takes the generated probe's (empty) name

      const helper = new LightProbeHelper( this.lightProbe, 5 )
      useBasicMaterial( helper )
      helper.name = 'LightProbeHelper'
      helper.userData.selectable = false
      this.scene.add( helper )

      this.notify({kind: 'structure'})
      this._frameTarget = helper
    } catch ( e ) {
      console.error( e )
    }
  }
}

registerEditorGroups(LightprobeCubecameraExample, {
  Hidden: ['cubeRenderTarget', 'cubeCamera', 'background', 'preparing'],
})
