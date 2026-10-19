import { BoxGeometry, BufferGeometry, Mesh, MeshStandardMaterial, PerspectiveCamera, RectAreaLight, RectAreaLightNode, TorusKnotGeometry, Vector3 } from 'three/webgpu'
import { checker, uv } from 'three/tsl'
import { RectAreaLightTexturesLib } from 'three/addons/lights/RectAreaLightTexturesLib.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

RectAreaLightNode.setLTC( RectAreaLightTexturesLib.init() )

/** Seconds in which the lights' turns repeat (they turn at -1, 0.5 and 1 rad/s): the timeline length. */
const PERIOD = 4 * Math.PI

/**
 * A glossy torus knot lit by three turning rect area lights (red, green, blue) over a checker-rough floor. The
 * source's camera is the active camera; editor views frame the knot and the light panels behind it, which the 2000-unit
 * floor would dwarf. The light panels are the light helpers overlay. Plays when opened.
 */
@Register
export class LightsRectarealightExample extends Document {

  public rectLight1: RectAreaLight
  public rectLight2: RectAreaLight
  public rectLight3: RectAreaLight

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 5, - 15 )
    camera.lookAt( 0, 5.5, 0 )
    this.activeCamera = camera

    this.rectLight1 = new RectAreaLight( 0xff0000, 5, 4, 10 )
    this.rectLight1.name = 'Red'
    this.rectLight1.position.set( - 5, 6, 5 )
    this.scene.add( this.rectLight1 )

    this.rectLight2 = new RectAreaLight( 0x00ff00, 5, 4, 10 )
    this.rectLight2.name = 'Green'
    this.rectLight2.position.set( 0, 6, 5 )
    this.scene.add( this.rectLight2 )

    this.rectLight3 = new RectAreaLight( 0x0000ff, 5, 4, 10 )
    this.rectLight3.name = 'Blue'
    this.rectLight3.position.set( 5, 6, 5 )
    this.scene.add( this.rectLight3 )

    const geoFloor = new BoxGeometry( 2000, 0.1, 2000 )
    const matStdFloor = new MeshStandardMaterial( { color: 0x444444 } )
    matStdFloor.roughnessNode = checker( uv().mul( 400 ) )
    const mshStdFloor = new Mesh( geoFloor, matStdFloor )
    mshStdFloor.name = 'Floor'
    mshStdFloor.userData.selectable = false
    this.scene.add( mshStdFloor )

    const geoKnot = new TorusKnotGeometry( 1.5, 0.5, 200, 16 )
    const matKnot = new MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } )
    const meshKnot = new Mesh( geoKnot, matKnot )
    meshKnot.name = 'TorusKnot'
    meshKnot.position.set( 0, 5.5, 0 )
    this.scene.add( meshKnot )

    // The lights have no geometry to frame: a stand-in for the knot and the panels (4 × 10 at x = - 5, 0 and 5, z = 5,
    // turning about y).
    this._frameTarget = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 7, 1, - 2 ), new Vector3( 7, 11, 7 ) ] ) )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  override onAnimate(delta: number, time: number) {
    this.rectLight1.rotation.y = - time
    this.rectLight2.rotation.y = time * .5
    this.rectLight3.rotation.y = time
  }
}
