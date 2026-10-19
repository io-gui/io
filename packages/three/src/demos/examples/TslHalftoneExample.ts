import { AmbientLight, Color, DirectionalLight, Mesh, MeshStandardMaterial, MeshStandardNodeMaterial, Node, PerspectiveCamera, SphereGeometry, TorusKnotGeometry, Vector3 } from 'three/webgpu'
import { mix, normalWorld, output, Fn, reference, vec4, rotate, screenCoordinate, screenSize } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the highlight's direction (1 rad/s): the timeline length, so looping is seamless. */
const PERIOD = 2 * Math.PI

type HalftoneProps = ReactiveObjectProps & {
  count?: number
  color?: Color
  direction?: Vector3
  start?: number
  end?: number
  mixLow?: number
  mixHigh?: number
  radius?: number
}

/** One halftone layer: a dot grid in screen space, its dots sized by how much the surface faces `direction`. */
@Register
export class Halftone extends ReactiveObject {

  @Property({type: Number, value: 140})
  declare count: number

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Vector3, init: null})
  declare direction: Vector3

  @Property({type: Number, value: 1})
  declare start: number

  @Property({type: Number, value: 0})
  declare end: number

  @Property({type: Number, value: 0})
  declare mixLow: number

  @Property({type: Number, value: 0.5})
  declare mixHigh: number

  @Property({type: Number, value: 0.8})
  declare radius: number

  constructor(args?: HalftoneProps) {
    super(args)
  }
}

registerEditorConfig(Halftone, [
  ['count', ioNumberSlider({min: 1, max: 200, step: 1})],
  ['start', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
  ['end', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
  ['mixLow', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['mixHigh', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['radius', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

/**
 * A torus knot, a sphere and Michelle shaded with two halftone layers in each material's `outputNode`: purple dots in
 * the shade and cyan dots in a highlight whose direction circles with document time. The light intensities, the
 * material color and each layer's settings (`shade`, `highlight`) are in the Document tab; the layers reach the
 * shaders through reference nodes to their properties. Plays when opened.
 */
@Register
export class TslHalftoneExample extends Document {

  public ambientLight: AmbientLight
  public directionalLight: DirectionalLight
  public material: MeshStandardNodeMaterial

  @Property({type: Number, value: 3})
  declare ambient: number

  @Property({type: Number, value: 8})
  declare directional: number

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Halftone})
  declare shade: Halftone

  @Property({type: Halftone})
  declare highlight: Halftone

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 25, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 6, 3, 10 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // lights

    this.ambientLight = new AmbientLight( '#ffffff', this.ambient )
    this.ambientLight.name = 'Ambient'
    this.scene.add( this.ambientLight )

    this.directionalLight = new DirectionalLight( '#ffffff', this.directional )
    this.directionalLight.name = 'Key'
    this.directionalLight.position.set( 4, 3, 1 )
    this.scene.add( this.directionalLight )

    // halftone settings

    // purple shade
    this.shade = new Halftone( {
      count: 140,
      color: new Color( '#fb00ff' ),
      direction: new Vector3( - 0.4, - 1, 0.5 ),
      start: 1,
      end: 0,
      mixLow: 0,
      mixHigh: 0.5,
      radius: 0.8
    } )

    // cyan highlight
    this.highlight = new Halftone( {
      count: 180,
      color: new Color( '#94ffd1' ),
      direction: new Vector3( 0.5, 0.5, - 0.2 ),
      start: 0.55,
      end: 0.2,
      mixLow: 0.5,
      mixHigh: 1,
      radius: 0.8
    } )

    // halftone functions

    const halftone = Fn( ( [ count, color, direction, start, end, radius, mixLow, mixHigh ]: [ Node<'float'>, Node<'color'>, Node<'vec3'>, Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'> ] ) => {
      // grid pattern

      let gridUv = screenCoordinate.xy.div( screenSize.yy ).mul( count )
      gridUv = rotate( gridUv, Math.PI * 0.25 ).mod( 1 )

      // orientation strength

      const orientationStrength = normalWorld
        .dot( direction.normalize() )
        .remapClamp( end, start, 0, 1 )

      // mask

      const mask = orientationStrength.mul( radius ).mul( 0.5 )
        .step( gridUv.sub( 0.5 ).length() )
        .mul( mix( mixLow, mixHigh, orientationStrength ) )

      return vec4( color, mask )
    } )

    const layers = [ this.shade, this.highlight ]

    const halftones = Fn( ( [ input ]: [ Node<'vec4'> ] ) => {
      const halftonesOutput = input

      for ( const layer of layers ) {
        const halfToneOutput = halftone(
          reference( 'count', 'float', layer ),
          reference( 'color', 'color', layer ),
          reference( 'direction', 'vec3', layer ),
          reference( 'start', 'float', layer ),
          reference( 'end', 'float', layer ),
          reference( 'radius', 'float', layer ),
          reference( 'mixLow', 'float', layer ),
          reference( 'mixHigh', 'float', layer )
        )

        halftonesOutput.rgb.assign( mix( halftonesOutput.rgb, halfToneOutput.rgb, halfToneOutput.a ) )
      }

      return halftonesOutput
    } )

    // default material

    this.material = new MeshStandardNodeMaterial( { color: '#ff622e' } )
    this.material.outputNode = halftones( output )

    // objects

    const torusKnot = new Mesh(
      new TorusKnotGeometry( 0.6, 0.25, 128, 32 ),
      this.material
    )
    torusKnot.name = 'TorusKnot'
    torusKnot.position.x = 3
    this.scene.add( torusKnot )

    const sphere = new Mesh(
      new SphereGeometry( 1, 64, 64 ),
      this.material
    )
    sphere.name = 'Sphere'
    sphere.position.x = - 3
    this.scene.add( sphere )

    void this.loadModel( halftones )

    this.color.copy( this.material.color )
    this.pose( this.timeline.currentTime )
  }

  private async loadModel( halftones: ( input: Node<'vec4'> ) => Node<'vec4'> ) {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Michelle.glb' )
      const model = gltf.scene
      model.name = 'Michelle'
      model.position.y = - 2
      model.scale.setScalar( 2.5 )

      model.traverse( ( child ) => {
        if ( ( child as Mesh ).isMesh )
          ( ( child as Mesh ).material as MeshStandardMaterial & { outputNode: Node } ).outputNode = halftones( output )
      } )

      this.scene.add( model )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  ambientChanged() { if ( this.ambientLight ) this.ambientLight.intensity = this.ambient }
  directionalChanged() { if ( this.directionalLight ) this.directionalLight.intensity = this.directional }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.material ) return
    this.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }

  /** Edits inside a layer reach the shaders through its reference nodes; views only need to redraw. */
  shadeMutated() { this.notify({kind: 'material'}) }
  highlightMutated() { this.notify({kind: 'material'}) }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.highlight.direction.x = Math.cos( time )
    this.highlight.direction.y = Math.sin( time )
  }
}

registerEditorConfig(TslHalftoneExample, [
  ['ambient', ioNumberSlider({min: 0, max: 10, step: 0.001})],
  ['directional', ioNumberSlider({min: 0, max: 20, step: 0.001})],
  ['shade', ioObject({expanded: true})],
  ['highlight', ioObject({expanded: true})],
])

registerEditorGroups(TslHalftoneExample, {
  Main: ['ambient', 'directional', 'color', 'shade', 'highlight'],
  Hidden: ['ambientLight', 'directionalLight', 'material'],
})
