import { CubeTextureLoader, LinearMipmapLinearFilter, LinearToneMapping } from 'three/webgpu'
import { mix, oscSine, pmremTexture, float } from 'three/tsl'
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one environment cross-fade cycle (`oscSine` of time × 0.1): the timeline length. */
const PERIOD = 10

/** The Damaged Helmet lit by an environment that cross-fades between the Milky Way and the Pisa HDR cube maps. Plays when opened. */
@Register
export class CubemapMixExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: LinearToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})
    void this.load()
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
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
