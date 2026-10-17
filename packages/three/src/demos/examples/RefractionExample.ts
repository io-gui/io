import {
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicNodeMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  TextureLoader
} from 'three/webgpu'
import { viewportSafeUV, viewportSharedTexture, screenUV, texture, uv } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the icosahedron's motion repeats (it circles at 1 rad/s): the timeline length, so looping is
 * seamless.
 */
const PERIOD = 2 * Math.PI

/**
 * A room split by a refracting pane: the pane's `backdropNode` samples the view's own frame (`viewportSharedTexture`)
 * through a normal map, so each view refracts what it drew behind the pane. A bouncing icosahedron moves through it.
 * The room is unselectable scenery. Plays when opened.
 */
@Register
export class RefractionExample extends Document {

  public smallSphere: Mesh

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const geometry = new IcosahedronGeometry( 5, 0 )
    const material = new MeshPhongMaterial( { color: 0xffffff, emissive: 0x7b7b7b, flatShading: true } )
    this.smallSphere = new Mesh( geometry, material )
    this.smallSphere.name = 'SmallSphere'
    this.scene.add( this.smallSphere )

    // textures

    // Views draw on document changes only, so report the texture when it arrives.
    const loader = new TextureLoader()

    const floorNormal = loader.load( 'https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Normal.jpg', () => this.notify({kind: 'material'}) )
    floorNormal.wrapS = RepeatWrapping
    floorNormal.wrapT = RepeatWrapping

    // refractor

    const verticalNormalScale = 0.1
    const verticalUVOffset = texture( floorNormal, uv().mul( 5 ) ).xy.mul( 2 ).sub( 1 ).mul( verticalNormalScale )

    const refractorUV = screenUV.add( verticalUVOffset )
    const verticalRefractor = viewportSharedTexture( viewportSafeUV( refractorUV ) )

    const planeGeo = new PlaneGeometry( 100.1, 100.1 )

    const planeRefractor = new Mesh( planeGeo, new MeshBasicNodeMaterial( {
      backdropNode: verticalRefractor
    } ) )
    planeRefractor.name = 'Refractor'
    planeRefractor.material.transparent = true
    planeRefractor.position.y = 50
    this.scene.add( planeRefractor )

    // walls

    const room = new Group()
    room.name = 'Room'
    room.userData.selectable = false
    this.scene.add( room )

    const planeTop = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) )
    planeTop.name = 'Top'
    planeTop.position.y = 100
    planeTop.rotateX( Math.PI / 2 )
    room.add( planeTop )

    const planeBottom = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) )
    planeBottom.name = 'Floor'
    planeBottom.rotateX( - Math.PI / 2 )
    room.add( planeBottom )

    const planeBack = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x7f7fff } ) )
    planeBack.name = 'Back'
    planeBack.position.z = - 50
    planeBack.position.y = 50
    room.add( planeBack )

    const planeRight = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x00ff00 } ) )
    planeRight.name = 'Right'
    planeRight.position.x = 50
    planeRight.position.y = 50
    planeRight.rotateY( - Math.PI / 2 )
    room.add( planeRight )

    const planeLeft = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xff0000 } ) )
    planeLeft.name = 'Left'
    planeLeft.position.x = - 50
    planeLeft.position.y = 50
    planeLeft.rotateY( Math.PI / 2 )
    room.add( planeLeft )

    // lights

    const mainLight = new PointLight( 0xe7e7e7, 2.5, 250, 0 )
    mainLight.name = 'Main'
    mainLight.position.y = 60
    this.scene.add( mainLight )

    const greenLight = new PointLight( 0x00ff00, 0.5, 1000, 0 )
    greenLight.name = 'Green'
    greenLight.position.set( 550, 50, 0 )
    this.scene.add( greenLight )

    const redLight = new PointLight( 0xff0000, 0.5, 1000, 0 )
    redLight.name = 'Red'
    redLight.position.set( - 550, 50, 0 )
    this.scene.add( redLight )

    const blueLight = new PointLight( 0xbbbbfe, 0.5, 1000, 0 )
    blueLight.name = 'Blue'
    blueLight.position.set( 0, 50, 550 )
    this.scene.add( blueLight )

    this.pose( this.timeline.currentTime )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.smallSphere.position.set(
      Math.cos( time ) * 30,
      Math.abs( Math.cos( time * 2 ) ) * 20 + 5,
      Math.sin( time ) * 30
    )
    this.smallSphere.rotation.y = ( Math.PI / 2 ) - time
    this.smallSphere.rotation.z = time * 8
  }
}

registerEditorGroups(RefractionExample, {
  Hidden: ['smallSphere'],
})
