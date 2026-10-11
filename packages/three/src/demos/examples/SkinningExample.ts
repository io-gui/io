import { AmbientLight, AnimationMixer, LinearToneMapping, PointLight } from 'three/webgpu'
import { color, screenUV } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** The skinned, animated Michelle model over a blue gradient background. Plays when opened. */
@Register
export class SkinningExample extends Document {

  public mixer?: AnimationMixer

  constructor(args?: DocumentProps) {
    super({toneMapping: LinearToneMapping, toneMappingExposure: 0.4, timeline: new Timeline({autoplay: true}), ...args})

    this.scene.backgroundNode = screenUV.y.mix( color( 0x66bbff ), color( 0x4466ff ) )

    //lights

    // The source attaches the light to its camera at (1, 2, 3).
    const light = new PointLight( 0xffffff, 1, 100 )
    light.name = 'Point'
    light.power = 2500
    light.position.set( 1, 2, 3 )
    this.scene.add( light )

    const ambient = new AmbientLight( 0x4466ff, 1 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Michelle.glb' )
      const object = gltf.scene

      this.timeline.duration = gltf.animations[ 0 ].duration
      this.mixer = new AnimationMixer( object )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()
      this.mixer.setTime( this.timeline.currentTime )

      this.scene.add( object )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}
