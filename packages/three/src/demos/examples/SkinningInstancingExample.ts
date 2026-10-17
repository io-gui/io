import {
  AnimationMixer,
  Color,
  InstancedBufferAttribute,
  Mesh,
  MeshBasicMaterial,
  MeshStandardNodeMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  SkinnedMesh
} from 'three/webgpu'
import { mix, range, color, oscSine } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Thirty instances of the skinned, animated Michelle model: the skinned mesh is flagged as instanced (the source's
 * hack), and each instance blends to its own random color and metalness on a slow oscillator of document time (it
 * jumps at the wrap; duration = the clip). The depth-of-field blur post is dropped (`document-pipeline`). The source
 * camera is kept as `Camera`, and its light is placed at its position. The black ground is unselectable. Plays when
 * opened.
 */
@Register
export class SkinningInstancingExample extends Document {

  public mixer?: AnimationMixer

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    // lights

    const centerLight = new PointLight( 0xff9900, 1, 100 )
    centerLight.name = 'Center'
    centerLight.position.y = 4.5
    centerLight.position.z = - 2
    centerLight.power = 400
    this.scene.add( centerLight )

    // The source attaches this light to its camera at (1, 2, 3).
    const cameraLight = new PointLight( 0x0099ff, 1, 100 )
    cameraLight.name = 'CameraLight'
    cameraLight.power = 400
    cameraLight.position.set( 1, 2, 3 )
    this.scene.add( cameraLight )

    const camera = new PerspectiveCamera( 50, 1, 0.01, 40 )
    camera.name = 'Camera'
    camera.position.set( 1, 2, 3 )
    camera.lookAt( 0, 1, 0 )
    this.scene.add( camera )

    const geometry = new PlaneGeometry( 1000, 1000 )
    geometry.rotateX( - Math.PI / 2 )

    const plane = new Mesh( geometry, new MeshBasicMaterial( { color: 0x000000, visible: true } ) )
    plane.name = 'Ground'
    plane.userData.selectable = false
    this.scene.add( plane )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Michelle.glb' )
      const object = gltf.scene
      object.name = 'Michelle'

      this.timeline.duration = gltf.animations[ 0 ].duration
      this.mixer = new AnimationMixer( object )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()
      this.mixer.setTime( this.timeline.currentTime )

      const instanceCount = 30
      const dummy = new Object3D()

      object.traverse( ( child ) => {
        if ( ( child as SkinnedMesh ).isMesh ) {
          const mesh = child as SkinnedMesh & {isInstancedMesh: boolean; instanceMatrix: InstancedBufferAttribute; instanceColor: InstancedBufferAttribute | null; count: number}

          const oscNode = oscSine( this.timeline.timeNode.mul( .1 ) )

          // random colors between instances from 0x000000 to 0xFFFFFF
          const randomColors = range( new Color( 0x000000 ), new Color( 0xFFFFFF ) )

          // random [ 0, 1 ] values between instances
          const randomMetalness = range( 0, 1 )

          const material = new MeshStandardNodeMaterial()
          material.roughness = .1
          material.metalnessNode = mix( 0.0, randomMetalness, oscNode )
          material.colorNode = mix( color( 0xFFFFFF ), randomColors, oscNode )
          mesh.material = material

          mesh.isInstancedMesh = true // TODO: Resolve this hack
          mesh.instanceMatrix = new InstancedBufferAttribute( new Float32Array( instanceCount * 16 ), 16 )
          mesh.instanceColor = null
          mesh.count = instanceCount

          for ( let i = 0; i < instanceCount; i ++ ) {
            dummy.position.x = - 200 + ( ( i % 5 ) * 70 )
            dummy.position.y = Math.floor( i / 5 ) * - 200

            dummy.updateMatrix()

            dummy.matrix.toArray( mesh.instanceMatrix.array, i * 16 )
          }
        }
      } )

      this.scene.add( object )

      this.notify({kind: 'structure'})
      // The 1000-unit ground would dominate whole-scene framing. Framing sees one instance.
      this.dispatch('frame-object', {object}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}

registerEditorGroups(SkinningInstancingExample, {
  Hidden: ['mixer'],
})
