import { BufferGeometry, InstancedBufferAttribute, InstancedMesh, PerspectiveCamera, PlaneGeometry, Points, PointsMaterial, PointsNodeMaterial, Sphere } from 'three/webgpu'
import { instancedBufferAttribute, materialColor } from 'three/tsl'
import { XYZLoader } from 'three/addons/loaders/XYZLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/**
 * Seconds in which the tumble repeats: the timeline length, so looping is seamless. The source turns 0.2 rad/s about x
 * and 0.5 rad/s about y: two and five turns in 20π s.
 */
const PERIOD = 20 * Math.PI

/**
 * A helix of points from an XYZ file, tumbling with document time. WebGPU draws `Points` 1 px wide, so a child
 * `InstancedMesh` named `Sprites` draws a quad per point at the source's size (see LoaderPcd). No background (source:
 * black clear). Plays when opened.
 */
@Register
export class LoaderXyzExample extends Document {

  public points?: Points<BufferGeometry, PointsMaterial>

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 10, 7, 10 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera
    void this.loadPoints()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadPoints() {
    try {
      const geometry = await new XYZLoader().loadAsync( 'https://threejs.org/examples/models/xyz/helix_201.xyz' )
      geometry.center()

      const vertexColors = ( geometry.hasAttribute( 'color' ) === true )
      const material = new PointsMaterial( { size: 0.1, vertexColors: vertexColors } )

      this.points = new Points( geometry, material )
      this.points.name = 'Helix'
      this.points.add( createSprites( this.points ) )
      this.pose( this.timeline.currentTime )
      this.scene.add( this.points )

      this.notify({kind: 'structure'})
      this._frameTarget = this.points
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( ! this.points ) return
    this.points.rotation.x = time * 0.2
    this.points.rotation.y = time * 0.5
  }
}

/** A quad per point of `points`, drawn at the points material's size. */
function createSprites(points: Points<BufferGeometry, PointsMaterial>) {
  const geometry = points.geometry
  const position = geometry.getAttribute( 'position' )
  const color = geometry.getAttribute( 'color' )

  const material = new PointsNodeMaterial( {
    positionNode: instancedBufferAttribute( new InstancedBufferAttribute( position.array, 3 ) ),
    size: points.material.size,
    sizeAttenuation: true,
  } )

  if ( color ) {
    material.colorNode = materialColor.mul( instancedBufferAttribute( new InstancedBufferAttribute( color.array, 3 ) ) )
  }

  const sprites = new InstancedMesh( new PlaneGeometry( 1, 1 ), material, position.count )
  sprites.name = 'Sprites'
  sprites.userData.selectable = false

  // The instance matrices stay identity: the bounds of one quad. Use the cloud's.
  geometry.computeBoundingBox()
  sprites.boundingBox = geometry.boundingBox!.clone()
  sprites.boundingSphere = sprites.boundingBox.getBoundingSphere( new Sphere() )

  return sprites
}
