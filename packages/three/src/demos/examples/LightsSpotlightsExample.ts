import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  SpotLight,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds between new light targets (the source's `setTimeout`). */
const INTERVAL = 5

/** Targets per loop: the timeline is `STEPS * INTERVAL` seconds and starts from the last targets, so looping is seamless. */
const STEPS = 8

/** One light's tween targets for one interval: each eases in its own 2 to 5 seconds. */
interface Step {
  angle: number
  penumbra: number
  shapeDuration: number
  position: Vector3
  positionDuration: number
}

/** `TWEEN.Easing.Quadratic.Out`. */
function quadraticOut( k: number ) {
  return k * ( 2 - k )
}

function createSpotlight( color: number, name: string ) {
  const newObj = new SpotLight( color, 10 )
  newObj.name = name

  newObj.castShadow = true
  newObj.angle = 0.3
  newObj.penumbra = 0.2
  newObj.decay = 2
  newObj.distance = 50

  return newObj
}

function randomStep(): Step {
  return {
    angle: ( Math.random() * 0.7 ) + 0.1,
    penumbra: Math.random() + 1,
    shapeDuration: Math.random() * 3 + 2,
    position: new Vector3(
      ( Math.random() * 3 ) - 1.5,
      ( Math.random() * 1 ) + 1.5,
      ( Math.random() * 3 ) - 1.5
    ),
    positionDuration: Math.random() * 3 + 2,
  }
}

const _position = new Vector3()

/**
 * Three colored spot lights wandering over a box on a floor, each easing to a new random position, angle and penumbra
 * every five seconds. The source tweens with tween.js on the wall clock; here the targets are drawn once and the tweens
 * derived from document time. Spot light helpers come from the light helpers overlay. The floor is unselectable and
 * views frame the lit area. Plays when opened.
 */
@Register
export class LightsSpotlightsExample extends Document {

  public spotLights: SpotLight[]
  private steps: Step[][]
  private focus: Mesh

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: STEPS * INTERVAL}), ...args})

    const matFloor = new MeshPhongMaterial( { color: 0x808080 } )
    const matBox = new MeshPhongMaterial( { color: 0xaaaaaa } )

    const geoFloor = new PlaneGeometry( 100, 100 )
    const geoBox = new BoxGeometry( 0.3, 0.1, 0.2 )

    const mshFloor = new Mesh( geoFloor, matFloor )
    mshFloor.name = 'Floor'
    mshFloor.rotation.x = - Math.PI * 0.5
    mshFloor.receiveShadow = true
    mshFloor.position.set( 0, - 0.05, 0 )
    mshFloor.userData.selectable = false

    const mshBox = new Mesh( geoBox, matBox )
    mshBox.name = 'Box'
    mshBox.castShadow = true
    mshBox.receiveShadow = true
    mshBox.position.set( 0, 0.5, 0 )

    const ambient = new AmbientLight( 0x444444 )
    ambient.name = 'Ambient'

    this.spotLights = [
      createSpotlight( 0xFF7F00, 'Orange' ),
      createSpotlight( 0x00FF7F, 'Green' ),
      createSpotlight( 0x7F00FF, 'Purple' ),
    ]

    this.scene.add( mshFloor )
    this.scene.add( mshBox )
    this.scene.add( ambient )
    this.scene.add( ...this.spotLights )

    this.steps = this.spotLights.map( () => Array.from( { length: STEPS }, randomStep ) )

    // The floor dwarfs the scene: views frame the space the lights move in, a detached stand-in box.
    this.focus = new Mesh( new BoxGeometry( 3, 2.5, 3 ) )
    this.focus.position.set( 0, 1.25, 0 )
    this.focus.updateMatrixWorld()

    this.pose( this.timeline.currentTime )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.dispatch('frame-object', {object: this.focus}, true)
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** Eases each light from the previous interval's targets toward the current ones. */
  private pose(time: number) {
    const index = Math.min( Math.max( Math.floor( time / INTERVAL ), 0 ), STEPS - 1 )
    const elapsed = time - index * INTERVAL

    for ( let i = 0; i < this.spotLights.length; i ++ ) {

      const light = this.spotLights[ i ]
      const from = this.steps[ i ][ ( index + STEPS - 1 ) % STEPS ]
      const to = this.steps[ i ][ index ]

      const shape = quadraticOut( Math.min( elapsed / to.shapeDuration, 1 ) )
      light.angle = from.angle + ( to.angle - from.angle ) * shape
      light.penumbra = from.penumbra + ( to.penumbra - from.penumbra ) * shape

      const move = quadraticOut( Math.min( elapsed / to.positionDuration, 1 ) )
      light.position.copy( _position.lerpVectors( from.position, to.position, move ) )

    }
  }
}
