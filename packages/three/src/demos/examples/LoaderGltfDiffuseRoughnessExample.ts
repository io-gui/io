import {
  BufferGeometry,
  Mesh,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  WebGPURenderer
} from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** The sample asset came with r187's `KHR_materials_diffuse_roughness` support and is not on threejs.org before that release. */
const MODEL_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DiffuseRoughnessParameterSweep.glb'

/**
 * The Khronos `DiffuseRoughnessParameterSweep` glTF (`KHR_materials_diffuse_roughness`): spheres whose diffuse
 * roughness rises across the rows, flattening their diffuse falloff, in a blurred room environment. The draft asset's
 * triangles wind clockwise, so the indices are flipped after loading, as in the source. Static.
 */
@Register
export class LoaderGltfDiffuseRoughnessExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, ...args})

    const camera = new PerspectiveCamera( 35, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 10 )
    this.activeCamera = camera

    this.scene.backgroundBlurriness = 0.5

    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const envMap = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
    this.scene.background = envMap
    this.scene.environment = envMap
  }

  private async load() {
    try {
      const gltf = await new GLTFLoader().loadAsync( MODEL_URL )
      const model = gltf.scene

      // The draft sample asset currently uses clockwise triangle winding.
      const geometries = new Set<BufferGeometry>()

      model.traverse( function ( object ) {
        const geometry = ( object as Mesh ).geometry as BufferGeometry | undefined
        if ( geometry === undefined ) return
        if ( geometries.has( geometry ) ) return

        const index = geometry.index!

        for ( let i = 0; i < index.count; i += 3 ) {
          const second = index.getX( i + 1 )
          index.setX( i + 1, index.getX( i + 2 ) )
          index.setX( i + 2, second )
        }

        index.needsUpdate = true
        geometries.add( geometry )
      } )

      this.scene.add( model )

      this._frameTarget = model
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }
}
