import {
  Color,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhongMaterial,
  MeshPhongNodeMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  SRGBColorSpace,
  SphereGeometry,
  TextureLoader
} from 'three/webgpu'
import { reflector, uv, texture, color } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The small sphere circles at
 * 1 rad/s and the half sphere turns at 0.1 rad/s (the source's 0.002 rad per frame, rounded so it closes the loop).
 */
const PERIOD = 20 * Math.PI

/**
 * A walled room whose floor and back wall are TSL `reflector()` mirrors, bent by normal maps, with a turning half
 * sphere and a bouncing icosahedron. Each view draws its own reflections (the reflector keeps a virtual camera per
 * drawing camera). The room is unselectable scenery. Plays when opened.
 */
@Register
export class MirrorExample extends Document {

  public sphereGroup: Object3D
  public smallSphere: Mesh

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x000000 )

    let geometry, material

    this.sphereGroup = new Object3D()
    this.sphereGroup.name = 'SphereGroup'
    this.scene.add( this.sphereGroup )

    geometry = new CylinderGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 )
    material = new MeshPhongMaterial( { color: 0xffffff, emissive: 0x8d8d8d } )
    const sphereCap = new Mesh( geometry, material )
    sphereCap.name = 'Cap'
    sphereCap.position.y = - 15 * Math.sin( Math.PI / 180 * 30 ) - 0.05
    sphereCap.rotateX( - Math.PI )

    geometry = new SphereGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 )
    const halfSphere = new Mesh( geometry, material )
    halfSphere.name = 'HalfSphere'
    halfSphere.add( sphereCap )
    halfSphere.rotateX( - Math.PI / 180 * 135 )
    halfSphere.rotateZ( - Math.PI / 180 * 20 )
    halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 )

    this.sphereGroup.add( halfSphere )

    geometry = new IcosahedronGeometry( 5, 0 )
    material = new MeshPhongMaterial( { color: 0xffffff, emissive: 0x7b7b7b, flatShading: true } )
    this.smallSphere = new Mesh( geometry, material )
    this.smallSphere.name = 'SmallSphere'
    this.scene.add( this.smallSphere )

    // textures

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})

    const floorNormal = textureLoader.load( 'https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Normal.jpg', onLoad )
    floorNormal.wrapS = RepeatWrapping
    floorNormal.wrapT = RepeatWrapping

    const decalDiffuse = textureLoader.load( 'https://threejs.org/examples/textures/decal/decal-diffuse.png', onLoad )
    decalDiffuse.colorSpace = SRGBColorSpace

    const decalNormal = textureLoader.load( 'https://threejs.org/examples/textures/decal/decal-normal.jpg', onLoad )

    // reflectors / mirrors

    const groundReflector = reflector()
    const verticalReflector = reflector()
    groundReflector.target.name = 'Reflector'
    verticalReflector.target.name = 'Reflector'

    const groundNormalScale = - 0.08
    const verticalNormalScale = 0.1

    const groundUVOffset = texture( decalNormal ).xy.mul( 2 ).sub( 1 ).mul( groundNormalScale )
    const verticalUVOffset = texture( floorNormal, uv().mul( 5 ) ).xy.mul( 2 ).sub( 1 ).mul( verticalNormalScale )

    groundReflector.uvNode = groundReflector.uvNode!.add( groundUVOffset )
    verticalReflector.uvNode = verticalReflector.uvNode!.add( verticalUVOffset )

    const groundNode = texture( decalDiffuse ).a.mix( color( 0xffffff ), groundReflector )
    const verticalNode = color( 0x0000ff ).mul( .1 ).add( verticalReflector )

    // walls

    const room = new Group()
    room.name = 'Room'
    room.userData.selectable = false
    this.scene.add( room )

    const planeGeo = new PlaneGeometry( 100.1, 100.1 )

    const planeBottom = new Mesh( planeGeo, new MeshPhongNodeMaterial( {
      colorNode: groundNode
    } ) )
    planeBottom.name = 'Floor'
    planeBottom.rotateX( - Math.PI / 2 )
    planeBottom.add( groundReflector.target )
    room.add( planeBottom )

    const planeBack = new Mesh( planeGeo, new MeshPhongNodeMaterial( {
      colorNode: verticalNode
    } ) )
    planeBack.name = 'Back'
    planeBack.position.z = - 50
    planeBack.position.y = 50
    planeBack.add( verticalReflector.target )
    room.add( planeBack )

    const planeTop = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) )
    planeTop.name = 'Top'
    planeTop.position.y = 100
    planeTop.rotateX( Math.PI / 2 )
    room.add( planeTop )

    const planeFront = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x7f7fff } ) )
    planeFront.name = 'Front'
    planeFront.position.z = 50
    planeFront.position.y = 50
    planeFront.rotateY( Math.PI )
    room.add( planeFront )

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
    this.sphereGroup.rotation.y = - time * 0.1

    this.smallSphere.position.set(
      Math.cos( time ) * 30,
      Math.abs( Math.cos( time * 2 ) ) * 20 + 5,
      Math.sin( time ) * 30
    )
    this.smallSphere.rotation.y = ( Math.PI / 2 ) - time
    this.smallSphere.rotation.z = time * 8
  }
}

registerEditorGroups(MirrorExample, {
  Hidden: ['sphereGroup', 'smallSphere'],
})
