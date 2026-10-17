import { Mesh, MeshStandardNodeMaterial, PointLight, RepeatWrapping, SphereGeometry, TextureLoader } from 'three/webgpu'
import { color, fog, rangeFogFactor, texture, lights, normalMap } from 'three/tsl'
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds in which the light paths repeat: the timeline length, so looping is seamless. The source's light
 * frequencies (0.15, 0.25 and 0.35 rad/s) are whole multiples of 0.05 rad/s.
 */
const PERIOD = 40 * Math.PI

/**
 * Three standard teapots under four moving point lights: the left one lit only by the red light (roughness map), the
 * center one by all (normal map), the right one only by the blue light (metalness map). The center teapot's
 * `roughness` and `metalness` are in the Document tab. Plays when opened.
 */
@Register
export class LightsSelectiveExample extends Document {

  public light1: PointLight
  public light2: PointLight
  public light3: PointLight
  public light4: PointLight
  public centerObject: Mesh<TeapotGeometry, MeshStandardNodeMaterial>

  @Property({type: Number, value: 0.5})
  declare roughness: number

  @Property({type: Number, value: 0.5})
  declare metalness: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.fogNode = fog( color( 0xFF00FF ), rangeFogFactor( 12, 30 ) )

    const sphereGeometry = new SphereGeometry( 0.1, 16, 8 )

    // textures

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})
    const textureLoader = new TextureLoader()

    const normalMapTexture = textureLoader.load( 'https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg', onLoad )
    normalMapTexture.wrapS = RepeatWrapping
    normalMapTexture.wrapT = RepeatWrapping

    const alphaTexture = textureLoader.load( 'https://threejs.org/examples/textures/roughness_map.jpg', onLoad )
    alphaTexture.wrapS = RepeatWrapping
    alphaTexture.wrapT = RepeatWrapping

    // lights

    const addLight = ( name: string, hexColor: number, power = 1700, distance = 100 ) => {
      const material = new MeshStandardNodeMaterial()
      material.colorNode = color( hexColor )
      material.lights = false

      const mesh = new Mesh( sphereGeometry, material )

      const light = new PointLight( hexColor, 1, distance )
      light.name = name
      light.power = power
      light.add( mesh )

      this.scene.add( light )

      return light
    }

    this.light1 = addLight( 'Red', 0xff0040 )
    this.light2 = addLight( 'Blue', 0x0040ff )
    this.light3 = addLight( 'Green', 0x80ff80 )
    this.light4 = addLight( 'Orange', 0xffaa00 )

    // light nodes ( selective lights )

    const redLightsNode = lights( [ this.light1 ] )
    const blueLightsNode = lights( [ this.light2 ] )

    // models

    const geometryTeapot = new TeapotGeometry( .8, 18 )

    const leftMaterial = new MeshStandardNodeMaterial( { color: 0x555555 } )
    leftMaterial.lightsNode = redLightsNode
    leftMaterial.roughnessNode = texture( alphaTexture )
    leftMaterial.metalness = 0
    const leftObject = new Mesh( geometryTeapot, leftMaterial )
    leftObject.name = 'Left'
    leftObject.position.x = - 3
    this.scene.add( leftObject )

    const centerMaterial = new MeshStandardNodeMaterial( { color: 0x555555 } )
    centerMaterial.normalNode = normalMap( texture( normalMapTexture ) )
    centerMaterial.metalness = this.metalness
    centerMaterial.roughness = this.roughness
    this.centerObject = new Mesh( geometryTeapot, centerMaterial )
    this.centerObject.name = 'Center'
    this.scene.add( this.centerObject )

    const rightMaterial = new MeshStandardNodeMaterial( { color: 0x555555 } )
    rightMaterial.lightsNode = blueLightsNode
    rightMaterial.metalnessNode = texture( alphaTexture )
    const rightObject = new Mesh( geometryTeapot, rightMaterial )
    rightObject.name = 'Right'
    rightObject.position.x = 3
    this.scene.add( rightObject )

    leftObject.rotation.y = this.centerObject.rotation.y = rightObject.rotation.y = Math.PI * - 0.5
    leftObject.position.y = this.centerObject.position.y = rightObject.position.y = - 1

    this.pose( this.timeline.currentTime )
  }

  roughnessChanged() {
    if ( this.centerObject ) this.centerObject.material.roughness = this.roughness
  }

  metalnessChanged() {
    if ( this.centerObject ) this.centerObject.material.metalness = this.metalness
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const lightTime = time * 0.5

    this.light1.position.x = Math.sin( lightTime * 0.7 ) * 3
    this.light1.position.y = Math.cos( lightTime * 0.5 ) * 4
    this.light1.position.z = Math.cos( lightTime * 0.3 ) * 3

    this.light2.position.x = Math.cos( lightTime * 0.3 ) * 3
    this.light2.position.y = Math.sin( lightTime * 0.5 ) * 4
    this.light2.position.z = Math.sin( lightTime * 0.7 ) * 3

    this.light3.position.x = Math.sin( lightTime * 0.7 ) * 3
    this.light3.position.y = Math.cos( lightTime * 0.3 ) * 4
    this.light3.position.z = Math.sin( lightTime * 0.5 ) * 3

    this.light4.position.x = Math.sin( lightTime * 0.3 ) * 3
    this.light4.position.y = Math.cos( lightTime * 0.7 ) * 4
    this.light4.position.z = Math.sin( lightTime * 0.5 ) * 3
  }
}

registerEditorConfig(LightsSelectiveExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(LightsSelectiveExample, {
  Main: ['roughness', 'metalness'],
  Hidden: ['light1', 'light2', 'light3', 'light4', 'centerObject'],
})
