import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  Color,
  CylinderGeometry,
  ExtrudeGeometry,
  Fog,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshBasicNodeMaterial,
  MeshPhysicalNodeMaterial,
  MeshStandardNodeMaterial,
  Node,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  Shape,
  SphereGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { color, mix, mx_noise_float, positionLocal, positionWorld, materialColor, materialRoughness, reflector, transformNormalToView, vec2, vec3 } from 'three/tsl'
import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'
import { Register, Property } from '@io-gui/core'
import { Bloom, Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Traffic cones on wet asphalt at night, lit by a flashlight: the cones' white bands are retroreflective
 * (`retroreflectivity`), so they glow toward the light's source. The flashlight rides on the source camera, kept as
 * `Camera`: look through it to see the bands light up; other views see them from away from the light. A second light
 * mirrored below the ground stands in for the beam bounced off the puddles. The floor is a TSL asphalt with puddles
 * that mirror the scene through a blurred `reflector()`. `enabled`, `amount` and `flashLight` are in the Document tab.
 * The source's bloom (strength 0.15) is the document's `bloom`, drawn by views that follow it (the Scene Camera view in
 * the demo host). The night environment is a PMREM of a small procedural city, generated in `onRendererInitialized`.
 * Static.
 */
@Register
export class MaterialsRetroreflectionExample extends Document {

  public frontLight: PointLight
  public reflectedFlashLight: PointLight
  public cones: Group
  private bandMaterial!: MeshPhysicalNodeMaterial

  @Property({type: Boolean, value: true})
  declare enabled: boolean

  @Property({type: Number, value: 1.0})
  declare amount: number

  @Property({type: Number, value: 5.0})
  declare flashLight: number

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, bloom: new Bloom({enabled: true, strength: 0.15, radius: 0, threshold: 0}), ...args})

    this.scene.background = new Color( 0x0f131a )
    this.scene.fog = new Fog( 0x0f131a, 4, 18 )

    const camera = new PerspectiveCamera( 45, 1, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 2.3, 1.32, 3.25 )
    camera.lookAt( 0, 0.33, 0 )
    this.scene.add( camera )

    // camera-mounted LED flashlight (~6500K = sRGB white)
    this.frontLight = new PointLight( 0xffffff, this.flashLight, 12 )
    this.frontLight.name = 'FlashLight'
    camera.add( this.frontLight )

    // the flashlight's mirror image below the ground: it stands in for the
    // puddle-bounced beam, so the retro bands also light up in the reflection
    this.reflectedFlashLight = new PointLight( 0xffffff, this.flashLight * 0.35, 12 )
    this.reflectedFlashLight.name = 'ReflectedFlashLight'
    this.reflectedFlashLight.position.set( camera.position.x, - camera.position.y, camera.position.z )
    this.scene.add( this.reflectedFlashLight )

    this.createFloor()
    this.cones = this.createCones()

    this.updateMaterial()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)

    const pmremGenerator = new PMREMGenerator( renderer )
    this.scene.environment = pmremGenerator.fromScene( this.createNightEnvironment(), 0.02 ).texture
    pmremGenerator.dispose()
    this.notify({kind: 'material'})

    // The 40-unit floor would dominate whole-scene framing.
    this.dispatch('frame-object', {object: this.cones}, true)
  }

  private createNightEnvironment() {
    const environment = new Scene()

    // sky: faint city glow at the horizon fading to a dark zenith
    const skyMaterial = new MeshBasicNodeMaterial( { side: BackSide } )
    skyMaterial.colorNode = mix( color( 0x05070c ), color( 0x2a3148 ), positionLocal.normalize().y.abs().oneMinus().pow( 4 ) )
    environment.add( new Mesh( new SphereGeometry( 10 ), skyMaterial ) )

    // distant buildings with sparse lit windows
    const buildingMaterial = new MeshBasicNodeMaterial()
    const cell = vec2( positionWorld.x.add( positionWorld.z.mul( 1.7 ) ).mul( 3 ), positionWorld.y.mul( 2.5 ) )
    const cellUV = cell.fract()
    const window_ = cellUV.x.smoothstep( 0.15, 0.3 ).mul( cellUV.x.smoothstep( 0.7, 0.85 ).oneMinus() ).mul( cellUV.y.smoothstep( 0.2, 0.35 ) ).mul( cellUV.y.smoothstep( 0.65, 0.8 ).oneMinus() )
    const lit = mx_noise_float( cell.floor().mul( 0.731 ).add( 0.37 ) ).smoothstep( 0.0, 0.1 )
    const windowColor = mix( color( 0x88a8ff ), color( 0xffc16b ), mx_noise_float( cell.floor().mul( 0.317 ) ).add( 1 ).mul( 0.5 ) )
    buildingMaterial.colorNode = mix( color( 0x05060a ), windowColor.mul( 12 ), window_.mul( lit ) )

    for ( let i = 0; i < 8; i ++ ) {
      const angle = ( i / 8 ) * Math.PI * 2 + 0.35
      const height = 2.5 + ( ( i * 2.7 ) % 3.5 )
      const building = new Mesh( new BoxGeometry( 2, height, 1 ), buildingMaterial )
      building.position.set( Math.cos( angle ) * 9, height / 2 - 0.5, Math.sin( angle ) * 9 )
      building.lookAt( 0, height / 2 - 0.5, 0 )
      environment.add( building )
    }

    // street lamps: sodium and LED
    const warmLampMaterial = new MeshBasicMaterial()
    warmLampMaterial.color.setRGB( 18, 11, 4 )
    const coolLampMaterial = new MeshBasicMaterial()
    coolLampMaterial.color.setRGB( 7, 9, 13 )

    for ( let i = 0; i < 6; i ++ ) {
      const angle = ( i / 6 ) * Math.PI * 2 + 0.7
      const lamp = new Mesh( new SphereGeometry( 0.35 ), i % 3 === 2 ? coolLampMaterial : warmLampMaterial )
      lamp.position.set( Math.cos( angle ) * 8, 2.5 + ( i % 3 ), Math.sin( angle ) * 8 )
      environment.add( lamp )
    }

    // moon
    const moonMaterial = new MeshBasicMaterial()
    moonMaterial.color.setRGB( 2.5, 3, 4 )
    const moon = new Mesh( new SphereGeometry( 0.6 ), moonMaterial )
    moon.position.set( 4, 7, - 5 )
    environment.add( moon )

    return environment
  }

  private createFloor() {
    // `NodeMaterial` applies `emissiveNode` on any material; @types/three 0.186 declares it only on some.
    const material = new MeshStandardNodeMaterial( {
      color: 0x1b1e23,
      roughness: 0.6
    } ) as MeshStandardNodeMaterial & {emissiveNode: Node | null}

    const reflection = reflector( { resolutionScale: 0.5 } )
    reflection.target.name = 'Reflector'
    reflection.target.rotateX( - Math.PI / 2 )
    this.scene.add( reflection.target )

    const position = positionWorld.xz

    // fade procedural detail as its period approaches the pixel footprint,
    // which grows anisotropically at grazing angles and with distance
    const bandlimit = ( p: Node<'vec2'> ) => p.fwidth().length().smoothstep( 0.5, 1.5 ).oneMinus()

    // asphalt: tonal grain and broad worn patches
    const grain = mx_noise_float( position.mul( 60 ) ).mul( bandlimit( position.mul( 60 ) ) ).mul( 0.2 )
    const patches = mx_noise_float( position.mul( 1.5 ) ).mul( 0.08 )
    const asphalt = materialColor.mul( grain.add( patches ).add( 1 ) )

    // puddles: flat, dark and mirror-like
    const puddle = mx_noise_float( position.mul( 0.45 ).add( 6.27 ) ).smoothstep( 0.25, 0.45 )

    // bump: heightfield normal from finite differences of a fine noise, flattened in puddles
    const bumpNoise = ( p: Node<'vec2'> ) => mx_noise_float( p.mul( 180 ) )
    const e = 0.002
    const strength = puddle.oneMinus().mul( bandlimit( position.mul( 180 ) ) ).mul( 0.0015 )
    const h = bumpNoise( position )
    const hx = bumpNoise( position.add( vec2( e, 0 ) ) )
    const hz = bumpNoise( position.add( vec2( 0, e ) ) )
    const bump = vec3( h.sub( hx ).mul( strength ), hz.sub( h ).mul( strength ), e ).normalize()

    material.normalNode = transformNormalToView( bump )

    // the surface relief wobbles the reflection; puddles stay calm
    reflection.uvNode = reflection.uvNode!.add( bump.xy.mul( 0.03 ) )

    material.colorNode = mix( asphalt, asphalt.mul( 0.3 ), puddle )
    material.roughnessNode = mix( mx_noise_float( position.mul( 50 ) ).mul( bandlimit( position.mul( 50 ) ) ).mul( 0.15 ).add( materialRoughness ), 0.05, puddle )

    // rain-soaked: the whole surface reflects, streaky on wet asphalt and sharpest in the puddles
    const wetness = mix( 0.15, 0.7, puddle )
    const reflectionBlur = mix( 0.08, 0.005, puddle )

    material.emissiveNode = hashBlur( reflection, reflectionBlur, { repeats: 32 } ).rgb.mul( wetness )

    const floor = new Mesh( new PlaneGeometry( 40, 40 ), material )
    floor.name = 'Floor'
    floor.rotation.x = - Math.PI / 2
    floor.userData.selectable = false
    this.scene.add( floor )
  }

  private createCones() {
    const orangeMaterial = new MeshPhysicalNodeMaterial( {
      color: 0xff6a00,
      roughness: 0.45
    } )

    // worn plastic: uncorrelated noise on roughness and tone
    orangeMaterial.roughnessNode = mx_noise_float( positionLocal.mul( 30 ) ).mul( 0.2 ).add( materialRoughness )
    orangeMaterial.colorNode = materialColor.mul( mx_noise_float( positionLocal.add( 7.3 ).mul( 20 ) ).mul( 0.1 ).add( 1 ) )

    this.bandMaterial = new MeshPhysicalNodeMaterial( {
      color: 0xf7f0d6,
      roughness: 0.22,
      retroreflectivity: this.amount
    } )

    const cones = new Group()
    cones.name = 'Cones'
    this.scene.add( cones )

    const count = 5
    const radius = 1.1

    for ( let i = 0; i < count; i ++ ) {
      const cone = this.createCone( orangeMaterial, this.bandMaterial )
      cone.name = `Cone${ i + 1 }`
      const angle = ( i / count ) * Math.PI * 2
      cone.position.set( Math.cos( angle ) * radius, 0, Math.sin( angle ) * radius )
      cones.add( cone )
    }

    return cones
  }

  private createCone( orangeMaterial: MeshPhysicalNodeMaterial, bandMaterial: MeshPhysicalNodeMaterial ) {
    const cone = new Group()

    const base = new Mesh(
      createBaseGeometry( 0.42, 0.04, 0.08 ),
      orangeMaterial
    )
    base.name = 'Base'
    cone.add( base )

    const bodyHeight = 0.71
    const bodyBottom = 0.04
    const bodyRadiusBottom = 0.17
    const bodyRadiusTop = 0.035

    const body = new Mesh(
      new CylinderGeometry( bodyRadiusTop, bodyRadiusBottom, bodyHeight, 96, 1, false ),
      orangeMaterial
    )
    body.name = 'Body'
    body.position.y = bodyBottom + bodyHeight * 0.5
    cone.add( body )

    const bands = [
      { center: bodyBottom + bodyHeight * 0.6, height: 0.10 },
      { center: bodyBottom + bodyHeight * 0.4, height: 0.06 }
    ]

    for ( const { center, height } of bands ) {
      const bandRadiusBottom = radiusAtHeight( center - height * 0.5, bodyBottom, bodyHeight, bodyRadiusBottom, bodyRadiusTop ) * 1.01
      const bandRadiusTop = radiusAtHeight( center + height * 0.5, bodyBottom, bodyHeight, bodyRadiusBottom, bodyRadiusTop ) * 1.01

      const band = new Mesh(
        new CylinderGeometry( bandRadiusTop, bandRadiusBottom, height, 96, 1, true ),
        bandMaterial
      )
      band.name = 'Band'
      band.position.y = center
      cone.add( band )
    }

    return cone
  }

  enabledChanged() { this.updateMaterial() }
  amountChanged() { this.updateMaterial() }

  flashLightChanged() {
    if ( ! this.frontLight ) return
    this.frontLight.intensity = this.flashLight
    this.reflectedFlashLight.intensity = this.flashLight * 0.35
  }

  private updateMaterial() {
    if ( ! this.bandMaterial ) return
    this.bandMaterial.retroreflectivity = this.enabled ? this.amount : 0
    this.notify({kind: 'material'})
  }
}

function radiusAtHeight( y: number, bodyBottom: number, bodyHeight: number, radiusBottom: number, radiusTop: number ) {
  const t = MathUtils.clamp( ( y - bodyBottom ) / bodyHeight, 0, 1 )
  return MathUtils.lerp( radiusBottom, radiusTop, t )
}

function createBaseGeometry( size: number, thickness: number, radius: number ) {
  const half = size / 2
  const shape = new Shape()

  shape.moveTo( - half + radius, - half )
  shape.lineTo( half - radius, - half )
  shape.absarc( half - radius, - half + radius, radius, - Math.PI / 2, 0 )
  shape.lineTo( half, half - radius )
  shape.absarc( half - radius, half - radius, radius, 0, Math.PI / 2 )
  shape.lineTo( - half + radius, half )
  shape.absarc( - half + radius, half - radius, radius, Math.PI / 2, Math.PI )
  shape.lineTo( - half, - half + radius )
  shape.absarc( - half + radius, - half + radius, radius, Math.PI, Math.PI * 1.5 )

  const geometry = new ExtrudeGeometry( shape, { depth: thickness, bevelEnabled: false } )
  geometry.rotateX( - Math.PI / 2 )

  return geometry
}

registerEditorConfig(MaterialsRetroreflectionExample, [
  ['amount', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['flashLight', ioNumberSlider({min: 0, max: 30, step: 0.1})],
])

registerEditorGroups(MaterialsRetroreflectionExample, {
  Main: ['enabled', 'amount', 'flashLight'],
  Hidden: ['frontLight', 'reflectedFlashLight', 'cones', 'bandMaterial'],
})
