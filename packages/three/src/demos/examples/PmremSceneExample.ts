import { CubeTexture, CubeTextureLoader, Mesh, MeshBasicMaterial, MeshBasicNodeMaterial, PerspectiveCamera, PMREMGenerator, SphereGeometry, WebGPURenderer } from 'three/webgpu'
import { normalWorld, uniform, pmremTexture } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The colored spheres around the center, by name: color and position. */
const SPHERES: [ string, number, [ number, number, number ] ][] = [
  [ 'Blue', 0x0000ff, [ 0, 0, - 1 ] ],
  [ 'Red', 0xff0000, [ 0, 0, 1 ] ],
  [ 'Magenta', 0xff00ff, [ 1, 0, 0 ] ],
  [ 'Cyan', 0x00ffff, [ - 1, 0, 0 ] ],
  [ 'Yellow', 0xffff00, [ 0, - 1, 0 ] ],
  [ 'Green', 0x00ff00, [ 0, 1, 0 ] ],
]

/**
 * Six colored spheres around a center sphere that shows a PMREM of the scene (park cube map background and the six
 * spheres) at a `roughness` set in the Document tab. The PMREM is generated once, with the first renderer, after the
 * background has loaded; the center sphere appears then. Static.
 */
@Register
export class PmremSceneExample extends Document {

  private pmremRoughness = uniform( .5 )
  /** The background, loading from construction. */
  private background: Promise<CubeTexture>
  private preparing?: Promise<void>

  @Property({type: Number, value: .5})
  declare roughness: number

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( - 1.8, 0.6, 2.7 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const loader = new CubeTextureLoader().setPath( 'https://threejs.org/examples/textures/cube/Park3Med/' )
    this.background = loader.loadAsync( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] ).then( texture => {
      this.scene.background = texture
      this.notify({kind: 'material'})
      return texture
    } )

    for ( const [ name, color, position ] of SPHERES ) {
      const model = new Mesh( new SphereGeometry( .2, 64, 64 ), new MeshBasicMaterial( { color } ) )
      model.name = name
      model.position.set( ...position )
      this.scene.add( model )
    }
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.preparing ??= this.prepare( renderer )
  }

  /** Generates the PMREM of the scene with the first renderer, before the center sphere joins it. */
  private async prepare(renderer: WebGPURenderer) {
    try {
      await this.background

      const sceneRT = new PMREMGenerator( renderer ).fromScene( this.scene )

      //

      const pmremNode = pmremTexture( sceneRT.texture, normalWorld, this.pmremRoughness )

      const center = new Mesh( new SphereGeometry( .5, 64, 64 ), new MeshBasicNodeMaterial( { colorNode: pmremNode } ) )
      center.name = 'PMREM'
      this.scene.add( center )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  roughnessChanged() { this.pmremRoughness.value = this.roughness }
}

registerEditorConfig(PmremSceneExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.001})],
])

registerEditorGroups(PmremSceneExample, {
  Main: ['roughness'],
  Hidden: ['pmremRoughness', 'background', 'preparing'],
})
