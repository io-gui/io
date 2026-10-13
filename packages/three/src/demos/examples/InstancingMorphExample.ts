import {
  AnimationMixer,
  Color,
  Fog,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { SunLight } from 'three/addons/lights/SunLight.js'
import { SunLightNode } from 'three/addons/lights/SunLightNode.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

const offset = 5000
const count = 1024

/**
 * Seconds of playback: 42 gallops of the 1.5 s clip, and one loop of the camera's path (20π s) to within 0.2 s, so
 * looping is seamless.
 */
const DURATION = 63

/**
 * A herd of 1024 instanced horses, each galloping at its own offset into the clip: per instance, the clip is sampled
 * at its time and the morph weights are copied with `setMorphAt`. Lit by a sun light with cascaded shadows (fitted
 * to each view's camera). The source's camera, flying over the herd, is the scene camera `Camera`. Plays when opened.
 */
@Register
export class InstancingMorphExample extends Document {

  public mesh?: InstancedMesh
  public mixer?: AnimationMixer
  public camera: PerspectiveCamera
  private dummy?: Mesh
  private timeOffsets = new Float32Array( count )

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    this.camera = new PerspectiveCamera( 60, 1, 100, 10000 )
    this.camera.name = 'Camera'
    this.scene.add( this.camera )

    for ( let i = 0; i < count; i ++ ) {
      this.timeOffsets[ i ] = Math.random() * 3
    }

    this.scene.background = new Color( 0x99DDFF )
    this.scene.fog = new Fog( 0x99DDFF, 5000, 10000 )

    const light = new SunLight( 0xffffff, 1 )
    light.name = 'Sun'
    light.position.set( 200, 1000, 50 )
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.castShadow = true
    light.shadow.camera.far = 10000
    this.scene.add( light )

    const hemi = new HemisphereLight( 0x99DDFF, 0x669933, 1 / 3 )
    hemi.name = 'Hemisphere'
    this.scene.add( hemi )

    const ground = new Mesh(
      new PlaneGeometry( 1000000, 1000000 ),
      new MeshStandardMaterial( { color: 0x669933 } )
    )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    this.pose( 0 )
    void this.loadModel()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    renderer.library.addLight( SunLightNode, SunLight )
  }

  private async loadModel() {
    try {
      const glb = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Horse.glb' )

      const dummy = glb.scene.children[ 0 ] as Mesh

      const mesh = new InstancedMesh( dummy.geometry, new MeshStandardNodeMaterial( {
        flatShading: true,
      } ), count )
      mesh.name = 'Horses'
      mesh.castShadow = true

      for ( let x = 0, i = 0; x < 32; x ++ ) {
        for ( let y = 0; y < 32; y ++ ) {
          dummy.position.set( offset - 300 * x + 200 * Math.random(), 0, offset - 300 * y )
          dummy.updateMatrix()
          mesh.setMatrixAt( i, dummy.matrix )
          mesh.setColorAt( i, new Color( `hsl(${Math.random() * 360}, 50%, 66%)` ) )
          i ++
        }
      }

      this.scene.add( mesh )

      this.mixer = new AnimationMixer( glb.scene )
      this.mixer.clipAction( glb.animations[ 0 ] ).play()

      this.mesh = mesh
      this.dummy = dummy
      this.pose( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      // The herd, not the scene: the ground spans a million units. Closer than the whole herd, which spans 10000
      // units: the fog hides what is farther than that.
      this.dispatch('frame-object', {object: mesh, overscan: 0.5}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const r = 3000
    this.camera.position.set( Math.sin( time / 10 ) * r, 1500 + 1000 * Math.cos( time / 5 ), Math.cos( time / 10 ) * r )
    this.camera.lookAt( 0, 0, 0 )

    if ( ! this.mesh || ! this.mixer || ! this.dummy ) return

    for ( let i = 0; i < count; i ++ ) {
      this.mixer.setTime( time + this.timeOffsets[ i ] )
      this.mesh.setMorphAt( i, this.dummy )
    }

    this.mesh.morphTexture!.needsUpdate = true
  }
}

registerEditorGroups(InstancingMorphExample, {
  Hidden: ['mixer'],
})
