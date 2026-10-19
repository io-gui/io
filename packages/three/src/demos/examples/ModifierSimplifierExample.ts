import { AmbientLight, BufferGeometry, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Lee Perry-Smith's head beside a copy simplified by `SimplifyModifier` (edge collapse) and flat shaded. `ratio` (the
 * share of vertices kept) is in the Document tab; each change simplifies again. The light rides on the source's camera,
 * the active camera. Static.
 */
@Register
export class ModifierSimplifierExample extends Document {

  public mesh?: Mesh
  public simplified?: Mesh
  private modifier = new SimplifyModifier()
  private simplifyCount = 0

  @Property({type: Number, value: 0.125})
  declare ratio: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const ambient = new AmbientLight( 0xffffff, 0.6 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.z = 15
    this.scene.add( camera )
    this.activeCamera = camera

    const light = new PointLight( 0xffffff, 400 )
    light.name = 'Point'
    camera.add( light )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb' )

      const mesh = gltf.scene.children[ 0 ] as Mesh<BufferGeometry, MeshStandardMaterial>
      mesh.name = 'Original'
      mesh.position.x = - 3
      mesh.rotation.y = Math.PI / 2
      this.scene.add( mesh )

      const simplified = mesh.clone()
      simplified.name = 'Simplified'
      simplified.material = simplified.material.clone()
      simplified.material.flatShading = true
      simplified.position.x = 3
      simplified.rotation.y = - Math.PI / 2
      this.scene.add( simplified )

      this.mesh = mesh
      this.simplified = simplified

      this.notify({kind: 'structure'})
      this._frameTarget = [ mesh, simplified ]

      await this.simplify()
    } catch ( e ) {
      console.error( e )
    }
  }

  ratioChanged() {
    void this.simplify()
  }

  private async simplify() {
    const { mesh, simplified } = this
    if ( ! mesh || ! simplified ) return

    const count = ++ this.simplifyCount
    const removed = Math.floor( mesh.geometry.attributes.position.count * ( 1 - this.ratio ) ) // number of vertices to remove
    const geometry = await this.modifier.modify( mesh.geometry, removed )
    if ( count !== this.simplifyCount ) {
      geometry.dispose()
      return
    }

    if ( simplified.geometry !== mesh.geometry ) simplified.geometry.dispose()
    simplified.geometry = geometry
    this.notify({kind: 'geometry'})
  }
}

registerEditorConfig(ModifierSimplifierExample, [
  ['ratio', ioNumberSlider({min: 0.01, max: 1, step: 0.01})],
])

registerEditorGroups(ModifierSimplifierExample, {
  Main: ['ratio'],
  Hidden: ['mesh', 'simplified', 'modifier', 'simplifyCount'],
})
