import { AdditiveBlending, Box3, Color, InstancedMesh, PerspectiveCamera, PlaneGeometry, Sphere, SpriteNodeMaterial, Vector3 } from 'three/webgpu'
import { color, cos, float, mix, range, sin, uniform, uv, vec3, vec4, TWO_PI } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. Each particle turns at its own rate, so the swirl jumps at the wrap. */
const DURATION = 60

/**
 * A three-armed spiral galaxy of 20000 additive sprites, placed and turned on the GPU from TSL `range()` values and
 * document time. Size and inner and outer colors are in the Document tab. Plays when opened.
 */
@Register
export class TslGalaxyExample extends Document {

  public galaxy: InstancedMesh
  private sizeUniform = uniform( 0.08 )
  private colorInsideUniform = uniform( color( '#ffa575' ) )
  private colorOutsideUniform = uniform( color( '#311599' ) )

  @Property({type: Number, value: 0.08})
  declare size: number

  @Property({type: Color, init: null})
  declare colorInside: Color

  @Property({type: Color, init: null})
  declare colorOutside: Color

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 4, 2, 5 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x201919 )

    // galaxy

    const material = new SpriteNodeMaterial( {
      depthWrite: false,
      blending: AdditiveBlending
    } )

    material.scaleNode = range( 0, 1 ).mul( this.sizeUniform )

    const radiusRatio = range( 0, 1 )
    const radius = radiusRatio.pow( 1.5 ).mul( 5 ).toVar()

    const branches = 3
    const branchAngle = range( 0, branches ).floor().mul( TWO_PI.div( branches ) )
    const angle = branchAngle.add( this.timeline.timeNode.mul( radiusRatio.oneMinus() ) )

    const position = vec3(
      cos( angle ),
      0,
      sin( angle )
    ).mul( radius )

    const randomOffset = range( vec3( - 1 ), vec3( 1 ) ).pow3().mul( radiusRatio ).add( 0.2 )

    material.positionNode = position.add( randomOffset )

    const colorFinal = mix( this.colorInsideUniform, this.colorOutsideUniform, radiusRatio.oneMinus().pow( 2 ).oneMinus() )
    const alpha = float( 0.1 ).div( uv().sub( 0.5 ).length() ).sub( 0.2 )
    material.colorNode = vec4( colorFinal, alpha )

    this.galaxy = new InstancedMesh( new PlaneGeometry( 1, 1 ), material, 20000 )
    this.galaxy.name = 'Galaxy'
    // The sprites are placed on the GPU; the instance matrices are all identity. Bounds for framing and culling:
    // radius up to 5, offsets in [-0.8, 1.2] on each axis.
    this.galaxy.boundingBox = new Box3( new Vector3( - 5.8, - 0.8, - 5.8 ), new Vector3( 6.2, 1.2, 6.2 ) )
    this.galaxy.boundingSphere = this.galaxy.boundingBox.getBoundingSphere( new Sphere() )
    this.scene.add( this.galaxy )

    this.colorInside.copy( this.colorInsideUniform.value )
    this.colorOutside.copy( this.colorOutsideUniform.value )
  }

  sizeChanged() { this.sizeUniform.value = this.size }

  colorInsideChanged() { this.colorInsideMutated() }
  colorOutsideChanged() { this.colorOutsideMutated() }

  /** The color editors change the colors in place. */
  colorInsideMutated() {
    if ( ! this.galaxy ) return
    this.colorInsideUniform.value.copy( this.colorInside )
    this.notify({kind: 'material'})
  }

  colorOutsideMutated() {
    if ( ! this.galaxy ) return
    this.colorOutsideUniform.value.copy( this.colorOutside )
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(TslGalaxyExample, [
  ['size', ioNumberSlider({min: 0, max: 1, step: 0.001})],
])

registerEditorGroups(TslGalaxyExample, {
  Main: ['size', 'colorInside', 'colorOutside'],
})
