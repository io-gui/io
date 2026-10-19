import { ACESFilmicToneMapping, Color, Mesh, MeshMatcapNodeMaterial, PerspectiveCamera, TextureLoader } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * The Lee Perry-Smith head shaded by an OpenEXR matcap with a normal map; its `color` is in the Document tab. The
 * source's exposure control is the document's `toneMappingExposure`; its drag-and-drop matcap loading is dropped (a
 * document reads no DOM). Static.
 */
@Register
export class MaterialsMatcapExample extends Document {

  public material: MeshMatcapNodeMaterial

  @Property({type: Color, init: null})
  declare color: Color

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 13 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    // matcap
    const matcap = new EXRLoader().load( 'https://threejs.org/examples/textures/matcaps/040full.exr', onLoad )

    // normalmap
    const normalmap = new TextureLoader().load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg', onLoad )

    this.material = new MeshMatcapNodeMaterial( {
      color: new Color().setHex( 0xffffff ), // sRGB
      matcap: matcap,
      normalMap: normalmap
    } )

    void this.loadModel()

    this.colorChanged()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb' )
      const mesh = gltf.scene.children[ 0 ] as Mesh
      mesh.name = 'LeePerrySmith'
      mesh.position.y = - 0.25
      mesh.material = this.material
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.material ) return
    this.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }
}

registerEditorGroups(MaterialsMatcapExample, {
  Main: ['color'],
  Hidden: ['material'],
})
