import { BufferGeometryLoader, Color, DynamicDrawUsage, InstancedMesh, MeshBasicMaterial, Object3D } from 'three/webgpu'
import { mix, range, normalWorld, oscSine } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds in which the motion repeats: the group sways over 8π s, the instances turn every 2π s. The color mix
 * (`oscSine` of time × 0.1, 10 s) jumps at the wrap.
 */
const PERIOD = 8 * Math.PI

const amount = 10
const count = Math.pow( amount, 3 )
const dummy = new Object3D()

/**
 * A 10×10×10 block of Suzanne heads in one `InstancedMesh`, each turning in a wave, colored between normals and a
 * random color per instance. The instance count is in the Document tab. Plays when opened.
 */
@Register
export class InstanceMeshExample extends Document {

  public mesh?: InstancedMesh

  @Property({type: Number, value: count})
  declare instanceCount: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})
    void this.loadModel()
  }

  private async loadModel() {
    const material = new MeshBasicMaterial()

    // random colors between instances from 0x000000 to 0xFFFFFF
    const randomColors = range( new Color( 0x000000 ), new Color( 0xFFFFFF ) )

    material.colorNode = mix( normalWorld, randomColors, oscSine( this.timeline.timeNode.mul( .1 ) ) )

    try {
      const geometry = await new BufferGeometryLoader().loadAsync( 'https://threejs.org/examples/models/json/suzanne_buffergeometry.json' )
      geometry.computeVertexNormals()
      geometry.scale( 0.5, 0.5, 0.5 )

      const mesh = new InstancedMesh( geometry, material, count )
      mesh.name = 'Suzannes'
      mesh.instanceMatrix.setUsage( DynamicDrawUsage )
      this.scene.add( mesh )

      this.mesh = mesh
      this.instanceCountChanged()
      this.pose( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  instanceCountChanged() {
    if ( this.mesh ) this.mesh.count = this.instanceCount
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const mesh = this.mesh
    if ( ! mesh ) return

    mesh.rotation.x = Math.sin( time / 4 )
    mesh.rotation.y = Math.sin( time / 2 )

    let i = 0
    const offset = ( amount - 1 ) / 2

    for ( let x = 0; x < amount; x ++ ) {
      for ( let y = 0; y < amount; y ++ ) {
        for ( let z = 0; z < amount; z ++ ) {
          dummy.position.set( offset - x, offset - y, offset - z )
          dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) )
          dummy.rotation.z = dummy.rotation.y * 2

          dummy.updateMatrix()

          mesh.setMatrixAt( i ++, dummy.matrix )
        }
      }
    }

    mesh.instanceMatrix.needsUpdate = true
  }
}

registerEditorConfig(InstanceMeshExample, [
  ['instanceCount', ioNumberSlider({min: 1, max: count, step: 1})],
])

registerEditorGroups(InstanceMeshExample, {
  Main: ['instanceCount'],
})
