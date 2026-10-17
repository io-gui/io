import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicNodeMaterial,
  MeshStandardNodeMaterial,
  Vector3
} from 'three/webgpu'
import { Flow } from 'three/addons/modifiers/CurveModifierGPU.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline, type Transaction } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds of one trip of the text around the curve (the source's 0.001 of the curve per frame, at 60 fps): the
 * timeline length, so looping is seamless.
 */
const PERIOD = 50 / 3

/**
 * Text bent along a closed Catmull-Rom curve on the GPU (`CurveModifierGPU` `Flow`) and moving around it with document
 * time. The curve runs through four handles: move them (the translate tool, or the Inspector) and the curve and the
 * text follow. The source's `TransformControls` are dropped. Plays when opened.
 */
@Register
export class ModifierCurveExample extends Document {

  public handles: Group
  public curve: CatmullRomCurve3
  public line: Line
  public flow?: Flow
  /** Handle positions the line and the flow were last built for. */
  private builtPoints: Vector3[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const initialPoints = [
      { x: 1, y: 0, z: - 1 },
      { x: 1, y: 0, z: 1 },
      { x: - 1, y: 0, z: 1 },
      { x: - 1, y: 0, z: - 1 },
    ]

    const boxGeometry = new BoxGeometry( 0.1, 0.1, 0.1 )
    const boxMaterial = new MeshBasicNodeMaterial()

    this.handles = new Group()
    this.handles.name = 'Handles'
    this.scene.add( this.handles )

    initialPoints.forEach( ( handlePos, i ) => {
      const handle = new Mesh( boxGeometry, boxMaterial )
      handle.name = `Handle${ i + 1 }`
      handle.position.copy( handlePos )
      this.handles.add( handle )
    } )

    // The curve holds the handles' position vectors, so it follows them.
    this.curve = new CatmullRomCurve3(
      this.handles.children.map( ( handle ) => handle.position )
    )
    this.curve.curveType = 'centripetal'
    this.curve.closed = true

    this.line = new Line(
      new BufferGeometry(),
      new LineBasicMaterial( { color: 0x00ff00 } )
    )
    this.line.name = 'Curve'
    this.line.userData.selectable = false
    this.scene.add( this.line )

    const light = new DirectionalLight( 0xffaa33, 3 )
    light.name = 'Key'
    light.position.set( - 10, 10, 10 )
    this.scene.add( light )

    const light2 = new AmbientLight( 0x003973, 3 )
    light2.name = 'Ambient'
    this.scene.add( light2 )

    void this.loadText()

    this.updateCurve()

    // Moves made with tools are committed; rebuild the curve then, even while paused.
    this.addEventListener( 'commit', ( event: CustomEvent<Transaction> ) => {
      const ids = new Set( this.handles.children.map( ( handle ) => handle.uuid ) )
      if ( event.detail.patches.some( ( patch ) => 'id' in patch && ids.has( patch.id ) ) ) this.updateCurve()
    } )
  }

  private async loadText() {
    try {
      const font = await new FontLoader().loadAsync( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' )

      const geometry = new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 0.2,
        depth: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5,
      } )

      geometry.rotateX( Math.PI )

      const material = new MeshStandardNodeMaterial( {
        color: 0x99ffff
      } )

      const objectToCurve = new Mesh( geometry, material )

      this.flow = new Flow( objectToCurve )
      this.flow.updateCurve( 0, this.curve )
      this.flow.object3D.name = 'Text'
      this.scene.add( this.flow.object3D )

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  /** Rebuilds the line and the flow's spline texture from the handles. */
  private updateCurve() {
    const points = this.curve.getPoints( 50 )
    this.line.geometry.setFromPoints( points )
    this.flow?.updateCurve( 0, this.curve )
    this.builtPoints = this.handles.children.map( ( handle ) => handle.position.clone() )
    this.notify({kind: 'geometry'})
  }

  override onAnimate(delta: number, time: number) {
    // Inspector edits are not committed: pick them up while playing.
    if ( this.handles.children.some( ( handle, i ) => ! handle.position.equals( this.builtPoints[ i ] ) ) ) this.updateCurve()
    this.pose( time )
  }

  private pose(time: number) {
    if ( this.flow ) this.flow.uniforms.pathOffset = time / PERIOD
  }
}

registerEditorGroups(ModifierCurveExample, {
  Hidden: ['handles', 'curve', 'line', 'flow', 'builtPoints'],
})
