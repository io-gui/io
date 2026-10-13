import { ACESFilmicToneMapping, AnimationMixer, Color, Mesh, PMREMGenerator, WebGPURenderer } from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * The facecap head (KTX2 textures, meshopt geometry) playing its captured performance in a room environment. Its
 * ARKit blend shape weights are the `expressions` sliders (Document tab): they follow the clip while it plays and
 * hold what you set while paused. Plays when opened.
 */
@Register
export class MorphtargetsFaceExample extends Document {

  public mixer?: AnimationMixer

  /** The head's morph target influences, by blend shape name. Empty until the model loads. */
  @Property({type: Object, init: null})
  declare expressions: Record<string, number>

  /** Loads once, for the first renderer: KTX2 picks its transcode target from the renderer. */
  private loading?: Promise<void>

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true}), ...args})
    this.scene.background = new Color( 0x666666 )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.scene.environment = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
    this.loading ??= this.loadModel( renderer )
  }

  private async loadModel(renderer: WebGPURenderer) {
    const ktx2Loader = new KTX2Loader().detectSupport( renderer )

    try {
      const gltf = await new GLTFLoader()
        .setKTX2Loader( ktx2Loader )
        .setMeshoptDecoder( MeshoptDecoder )
        .loadAsync( 'https://threejs.org/examples/models/gltf/facecap.glb' )

      // Keeps its glTF name: the clip's tracks target the head by name.
      const mesh = gltf.scene.children[ 0 ]
      this.scene.add( mesh )

      this.timeline.duration = gltf.animations[ 0 ].duration
      this.mixer = new AnimationMixer( mesh )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()
      this.mixer.setTime( this.timeline.currentTime )

      const head = mesh.getObjectByName( 'mesh_2' ) as Mesh
      const influences = head.morphTargetInfluences!
      const expressions: Record<string, number> = {}

      for ( const [ key, index ] of Object.entries( head.morphTargetDictionary! ) ) {
        Object.defineProperty( expressions, key.replace( 'blendShape1.', '' ), {
          get: () => influences[ index ],
          set: ( value: number ) => { influences[ index ] = value },
          enumerable: true,
        } )
      }

      this.expressions = expressions

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  /** A slider moved: the head's influences changed in place. */
  expressionsMutated() {
    this.notify({kind: 'geometry'})
  }

  override onAnimate(delta: number) {
    if ( ! this.mixer ) return
    this.mixer.update( delta )
    debug: {
      // Let the sliders follow the clip.
      this.dispatchMutation( this.expressions )
    }
  }
}

registerEditorConfig(MorphtargetsFaceExample, [
  // Wide labels: blend shapes differ only in their `_L` / `_R` suffix.
  ['expressions', ioObject({expanded: true, labelWidth: '120px', config: [[Number, ioNumberSlider({min: 0, max: 1, step: 0.01})]]})],
])

registerEditorGroups(MorphtargetsFaceExample, {
  Main: ['expressions'],
  Hidden: ['mixer'],
})
