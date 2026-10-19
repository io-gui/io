import {
  AmbientLight,
  BackSide,
  BoxGeometry,
  CanvasTexture,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhongNodeMaterial,
  NearestFilter,
  PerspectiveCamera,
  PointLight,
  RepeatWrapping,
  SphereGeometry
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The light paths (0.6, 0.7 and
 * 0.8 rad/s) are whole multiples of 0.1 rad/s; the lights spin at 1 rad/s.
 */
const PERIOD = 20 * Math.PI

/** The second light runs this many seconds ahead of the first, as in the source. */
const OFFSET = 10000

/** Two stripes: transparent on top, opaque below. Repeated over a sphere, they cut it into rings. */
function generateTexture() {
  const canvas = new OffscreenCanvas( 2, 2 )
  const context = canvas.getContext( '2d' )!
  context.fillStyle = 'white'
  context.fillRect( 0, 1, 2, 1 )
  return canvas
}

/**
 * Two point lights, each inside a slotted sphere, wander through a room and cast striped shadows on its walls and on
 * each other. Plays when opened.
 */
@Register
export class ShadowmapPointlightExample extends Document {

  public pointLight: PointLight
  public pointLight2: PointLight

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 10, 40 )
    camera.lookAt( 0, 10, 0 )
    this.activeCamera = camera

    const ambientLight = new AmbientLight( 0x111122, 3 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // lights

    function createLight( name: string, color: number ) {
      const intensity = 200

      const light = new PointLight( color, intensity, 20 )
      light.name = name
      light.castShadow = true
      light.shadow.bias = - 0.005 // reduces self-shadowing on double-sided objects
      light.shadow.mapSize.setScalar( 128 )
      light.shadow.radius = 10

      const bulbMaterial = new MeshBasicMaterial( { color: color } )
      bulbMaterial.color.multiplyScalar( intensity )
      const bulb = new Mesh( new SphereGeometry( 0.3, 12, 6 ), bulbMaterial )
      bulb.name = 'Bulb'
      light.add( bulb )

      const texture = new CanvasTexture( generateTexture() )
      texture.magFilter = NearestFilter
      texture.wrapT = RepeatWrapping
      texture.wrapS = RepeatWrapping
      texture.repeat.set( 1, 4.5 )

      const material = new MeshPhongNodeMaterial( {
        side: DoubleSide,
        alphaMap: texture,
        alphaTest: 0.5
      } )

      const sphere = new Mesh( new SphereGeometry( 2, 32, 8 ), material )
      sphere.name = 'Cage'
      sphere.castShadow = true
      sphere.receiveShadow = true
      light.add( sphere )

      return light
    }

    this.pointLight = createLight( 'Blue', 0x0088ff )
    this.scene.add( this.pointLight )

    this.pointLight2 = createLight( 'Pink', 0xff8888 )
    this.scene.add( this.pointLight2 )

    //

    const geometry = new BoxGeometry( 30, 30, 30 )

    const material = new MeshPhongNodeMaterial( {
      color: 0xa0adaf,
      shininess: 10,
      specular: 0x111111,
      side: BackSide
    } )

    const mesh = new Mesh( geometry, material )
    mesh.name = 'Room'
    mesh.position.y = 10
    mesh.receiveShadow = true
    mesh.userData.selectable = false
    this.scene.add( mesh )

    this.pose( this.timeline.currentTime )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(elapsed: number) {
    let time = elapsed

    this.pointLight.position.x = Math.sin( time * 0.6 ) * 9
    this.pointLight.position.y = Math.sin( time * 0.7 ) * 9 + 6
    this.pointLight.position.z = Math.sin( time * 0.8 ) * 9

    this.pointLight.rotation.x = time
    this.pointLight.rotation.z = time

    time += OFFSET

    this.pointLight2.position.x = Math.sin( time * 0.6 ) * 9
    this.pointLight2.position.y = Math.sin( time * 0.7 ) * 9 + 6
    this.pointLight2.position.z = Math.sin( time * 0.8 ) * 9

    this.pointLight2.rotation.x = time
    this.pointLight2.rotation.z = time
  }
}
