import { BufferGeometry, Color, Mesh, MeshNormalNodeMaterial, Node, PerspectiveCamera } from 'three/webgpu'
import { cos, positionLocal, normalLocal, sin, transformNormalToView, vec3 } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/** Seconds of one twist cycle (`sin` of time in seconds): the timeline length, so looping is seamless. */
const PERIOD = 2 * Math.PI

/**
 * Two normal-shaded heads twisted about their vertical axis in opposite directions, by an angle that waves with height
 * and document time. The source patches the shader with `onBeforeCompile`; here a TSL `positionNode` turns the
 * positions and a `normalNode` the normals. Plays when opened.
 */
@Register
export class MaterialsModifiedExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 27, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 20 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb' )

      const geometry = ( gltf.scene.children[ 0 ] as Mesh<BufferGeometry> ).geometry

      const left = new Mesh( geometry, this.buildTwistMaterial( 2.0 ) )
      left.name = 'Left'
      left.position.x = - 3.5
      left.position.y = - 0.5
      this.scene.add( left )

      const right = new Mesh( geometry, this.buildTwistMaterial( - 2.0 ) )
      right.name = 'Right'
      right.position.x = 3.5
      right.position.y = - 0.5
      this.scene.add( right )

      this.notify({kind: 'structure'})
      this._frameTarget = [ left, right ]
    } catch ( e ) {
      console.error( e )
    }
  }

  private buildTwistMaterial( amount: number ) {
    const material = new MeshNormalNodeMaterial()

    const theta = sin( this.timeline.timeNode.add( positionLocal.y ) ).div( amount )
    const c = cos( theta )
    const s = sin( theta )

    // `vec3 * mat3( c, 0, s, 0, 1, 0, -s, 0, c )` in the source's GLSL: a turn about the Y axis.
    const twist = ( v: Node<'vec3'> ) => vec3( c.mul( v.x ).add( s.mul( v.z ) ), v.y, c.mul( v.z ).sub( s.mul( v.x ) ) )

    material.positionNode = twist( positionLocal )
    material.normalNode = transformNormalToView( twist( normalLocal ) ).toVertexStage()

    return material
  }
}
