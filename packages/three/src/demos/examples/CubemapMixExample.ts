import { CubeTextureLoader, LinearMipmapLinearFilter, LinearToneMapping, PerspectiveCamera } from 'three/webgpu'
import { mix, oscSine, pmremTexture, float } from 'three/tsl'
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/** Seconds of one environment cross-fade cycle (`oscSine` of time × 0.1): the timeline length. */
const PERIOD = 10

/** The Damaged Helmet lit by an environment that cross-fades between the Milky Way and the Pisa HDR cube maps. Plays when opened. */
@Register
export class CubemapMixExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: LinearToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( - 1.8, 0.6, 2.7 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera
    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    try {
      const hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ]
      const cube1Texture = new HDRCubeTextureLoader()
        .setPath( 'https://threejs.org/examples/textures/cube/pisaHDR/' )
        .load( hdrUrls )

      cube1Texture.generateMipmaps = true
      cube1Texture.minFilter = LinearMipmapLinearFilter

      const cube2Urls = [ 'dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg' ]
      const cube2Texture = await new CubeTextureLoader()
        .setPath( 'https://threejs.org/examples/textures/cube/MilkyWay/' )
        .loadAsync( cube2Urls )

      cube2Texture.generateMipmaps = true
      cube2Texture.minFilter = LinearMipmapLinearFilter

      const environmentNode = mix( pmremTexture( cube2Texture ), pmremTexture( cube1Texture ), oscSine( this.timeline.timeNode.mul( .1 ) ) )
      this.scene.environmentNode = environmentNode
      this.scene.backgroundNode = environmentNode.context( {
        getTextureLevel: () => float( .5 )
      } )

      const gltf = await new GLTFLoader()
        .setPath( 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/' )
        .loadAsync( 'DamagedHelmet.gltf' )

      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
