import {
  BoxGeometry,
  HemisphereLight,
  Material,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  ReinhardToneMapping,
  RepeatWrapping,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/** Seconds of one bob of the bulb (0.5 rad/s): the timeline length, so looping is seamless. */
const PERIOD = 4 * Math.PI

// ref for lumens: http://www.power-sure.com/lumens.htm
const bulbLuminousPowers: Record<string, number> = {
  '110000 lm (1000W)': 110000,
  '3500 lm (300W)': 3500,
  '1700 lm (100W)': 1700,
  '800 lm (60W)': 800,
  '400 lm (40W)': 400,
  '180 lm (25W)': 180,
  '20 lm (4W)': 20,
  'Off': 0
}

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
const hemiLuminousIrradiances: Record<string, number> = {
  '0.0001 lx (Moonless Night)': 0.0001,
  '0.002 lx (Night Airglow)': 0.002,
  '0.5 lx (Full Moon)': 0.5,
  '3.4 lx (City Twilight)': 3.4,
  '50 lx (Living Room)': 50,
  '100 lx (Very Overcast)': 100,
  '350 lx (Office Room)': 350,
  '400 lx (Sunrise/Sunset)': 400,
  '1000 lx (Overcast)': 1000,
  '18000 lx (Daylight)': 18000,
  '50000 lx (Direct Sun)': 50000
}

/**
 * A bobbing light bulb over a wooden floor with brick cubes and an earth ball, in physical units: the bulb's
 * luminous power (`bulbPower`, lumens) and the hemisphere light's irradiance (`irradiance`, lux) are dropdowns in the
 * Document tab. The source's exposure slider (0.68, raised to the fifth power) is the document's
 * `toneMappingExposure` (0.68⁵ ≈ 0.145), and its `shadows` toggle, which switches the renderer's shadow map, turns
 * the bulb's shadow off instead. Plays when opened.
 */
@Register
export class LightsPhysicalExample extends Document {

  public bulbLight: PointLight
  public bulbMat: MeshStandardMaterial
  public hemiLight: HemisphereLight
  private materials: Material[]

  @Property({type: String, value: Object.keys( bulbLuminousPowers )[ 4 ]})
  declare bulbPower: string

  @Property({type: String, value: Object.keys( hemiLuminousIrradiances )[ 0 ]})
  declare irradiance: string

  @Property({type: Boolean, value: true})
  declare shadows: boolean

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: Math.pow( 0.68, 5.0 ), timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( - 4, 2, 4 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const bulbGeometry = new SphereGeometry( 0.02, 16, 8 )
    this.bulbLight = new PointLight( 0xffee88, 1, 100, 2 )
    this.bulbLight.name = 'Bulb'

    this.bulbMat = new MeshStandardMaterial( {
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000
    } )
    this.bulbLight.add( new Mesh( bulbGeometry, this.bulbMat ) )
    this.bulbLight.position.set( 0, 2, 0 )
    this.scene.add( this.bulbLight )

    this.hemiLight = new HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 )
    this.hemiLight.name = 'Hemisphere'
    this.scene.add( this.hemiLight )

    const floorMat = new MeshStandardMaterial( {
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 1
    } )

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader().setPath( 'https://threejs.org/examples/textures/' )
    const load = ( url: string, onLoad: ( map: Texture ) => void ) => {
      textureLoader.load( url, map => {
        onLoad( map )
        this.notify({kind: 'material'})
      } )
    }

    load( 'hardwood2_diffuse.jpg', map => {
      map.wrapS = RepeatWrapping
      map.wrapT = RepeatWrapping
      map.anisotropy = 4
      map.repeat.set( 10, 24 )
      map.colorSpace = SRGBColorSpace
      floorMat.map = map
      floorMat.needsUpdate = true
    } )
    load( 'hardwood2_bump.jpg', map => {
      map.wrapS = RepeatWrapping
      map.wrapT = RepeatWrapping
      map.anisotropy = 4
      map.repeat.set( 10, 24 )
      floorMat.bumpMap = map
      floorMat.needsUpdate = true
    } )
    load( 'hardwood2_roughness.jpg', map => {
      map.wrapS = RepeatWrapping
      map.wrapT = RepeatWrapping
      map.anisotropy = 4
      map.repeat.set( 10, 24 )
      floorMat.roughnessMap = map
      floorMat.needsUpdate = true
    } )

    const cubeMat = new MeshStandardMaterial( {
      roughness: 0.7,
      color: 0xffffff,
      bumpScale: 1,
      metalness: 0.2
    } )
    load( 'brick_diffuse.jpg', map => {
      map.wrapS = RepeatWrapping
      map.wrapT = RepeatWrapping
      map.anisotropy = 4
      map.repeat.set( 1, 1 )
      map.colorSpace = SRGBColorSpace
      cubeMat.map = map
      cubeMat.needsUpdate = true
    } )
    load( 'brick_bump.jpg', map => {
      map.wrapS = RepeatWrapping
      map.wrapT = RepeatWrapping
      map.anisotropy = 4
      map.repeat.set( 1, 1 )
      cubeMat.bumpMap = map
      cubeMat.needsUpdate = true
    } )

    const ballMat = new MeshStandardMaterial( {
      color: 0xffffff,
      roughness: 0.5,
      metalness: 1.0
    } )
    load( 'planets/earth_atmos_2048.jpg', map => {
      map.anisotropy = 4
      map.colorSpace = SRGBColorSpace
      ballMat.map = map
      ballMat.needsUpdate = true
    } )
    load( 'planets/earth_specular_2048.jpg', map => {
      map.anisotropy = 4
      map.colorSpace = SRGBColorSpace
      ballMat.metalnessMap = map
      ballMat.needsUpdate = true
    } )

    this.materials = [ floorMat, cubeMat, ballMat ]

    const floorGeometry = new PlaneGeometry( 20, 20 )
    const floorMesh = new Mesh( floorGeometry, floorMat )
    floorMesh.name = 'Floor'
    floorMesh.receiveShadow = true
    floorMesh.rotation.x = - Math.PI / 2.0
    floorMesh.userData.selectable = false
    this.scene.add( floorMesh )

    const ballGeometry = new SphereGeometry( 0.25, 32, 32 )
    const ballMesh = new Mesh( ballGeometry, ballMat )
    ballMesh.name = 'Ball'
    ballMesh.position.set( 1, 0.25, 1 )
    ballMesh.rotation.y = Math.PI
    ballMesh.castShadow = true
    this.scene.add( ballMesh )

    const boxGeometry = new BoxGeometry( 0.5, 0.5, 0.5 )
    const boxPositions: [ number, number, number ][] = [ [ - 0.5, 0.25, - 1 ], [ 0, 0.25, - 5 ], [ 7, 0.25, 0 ] ]
    boxPositions.forEach( ( position, i ) => {
      const boxMesh = new Mesh( boxGeometry, cubeMat )
      boxMesh.name = `Box ${i + 1}`
      boxMesh.position.set( ...position )
      boxMesh.castShadow = true
      this.scene.add( boxMesh )
    } )

    this.bulbPowerChanged()
    this.irradianceChanged()
    this.shadowsChanged()
    this.pose( this.timeline.currentTime )
  }

  bulbPowerChanged() {
    if ( ! this.bulbLight ) return
    this.bulbLight.power = bulbLuminousPowers[ this.bulbPower ]
    this.bulbMat.emissiveIntensity = this.bulbLight.intensity / Math.pow( 0.02, 2.0 ) // convert from intensity to irradiance at bulb surface
  }

  irradianceChanged() {
    if ( this.hemiLight ) this.hemiLight.intensity = hemiLuminousIrradiances[ this.irradiance ]
  }

  shadowsChanged() {
    if ( ! this.bulbLight ) return
    this.bulbLight.castShadow = this.shadows
    for ( const material of this.materials ) material.needsUpdate = true
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(elapsed: number) {
    const time = elapsed * 0.5
    this.bulbLight.position.y = Math.cos( time ) * 0.75 + 1.25
  }
}

registerEditorConfig(LightsPhysicalExample, [
  ['bulbPower', ioOptionSelect({model: new Menu({options: Object.keys( bulbLuminousPowers )})})],
  ['irradiance', ioOptionSelect({model: new Menu({options: Object.keys( hemiLuminousIrradiances )})})],
])

registerEditorGroups(LightsPhysicalExample, {
  Main: ['irradiance', 'bulbPower', 'shadows'],
  Hidden: ['bulbLight', 'bulbMat', 'hemiLight', 'materials'],
})
