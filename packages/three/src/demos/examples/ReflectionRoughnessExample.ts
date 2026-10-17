import {
  BoxGeometry,
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardNodeMaterial,
  NeutralToneMapping,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, vec2, vec4, texture, uv, textureBicubic, rangeFogFactor, reflector } from 'three/tsl'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds in which the roughness noise scrolls one texture width (0.1 per second): the timeline length. */
const PERIOD = 10

/**
 * A UV-grid box over a metal floor whose TSL `reflector()` reflection is blurred with `textureBicubic` by a
 * scrolling noise roughness. The auto-rotating camera is dropped; the views frame the box (50-unit floor). Plays when
 * opened.
 */
@Register
export class ReflectionRoughnessExample extends Document {

  public box: Mesh

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, toneMappingExposure: 1.5, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    new UltraHDRLoader().load( 'https://threejs.org/examples/textures/equirectangular/spruit_sunrise_2k.hdr.jpg', ( texture ) => {
      texture.mapping = EquirectangularReflectionMapping
      texture.needsUpdate = true

      this.scene.background = texture
      this.scene.environment = texture
      this.notify({kind: 'material'})
    } )

    // textures

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})

    const uvMap = textureLoader.load( 'https://threejs.org/examples/textures/uv_grid_directx.jpg', onLoad )
    uvMap.colorSpace = SRGBColorSpace

    const perlinMap = textureLoader.load( 'https://threejs.org/examples/textures/noises/perlin/rgb-256x256.png', onLoad )
    perlinMap.wrapS = RepeatWrapping
    perlinMap.wrapT = RepeatWrapping
    perlinMap.colorSpace = SRGBColorSpace

    // uv box for debugging

    this.box = new Mesh(
      new BoxGeometry( 1, 1, 1 ),
      new MeshStandardNodeMaterial( {
        map: uvMap,
        roughnessMap: uvMap,
        emissiveMap: uvMap,
        emissive: 0xffffff
      } )
    )
    this.box.name = 'UVBox'
    this.box.position.set( 0, 1.25, 0 )
    this.box.scale.setScalar( 2 )
    this.scene.add( this.box )

    // reflection

    const reflection = reflector( { resolutionScale: .5, bounces: false, generateMipmaps: true } ) // 0.5 is half of the rendering view
    reflection.target.name = 'Reflector'
    reflection.target.rotateX( - Math.PI / 2 )
    this.scene.add( reflection.target )

    const animatedUV = uv().mul( 10 ).add( vec2( this.timeline.timeNode.mul( .1 ), 0 ) )
    const roughness = texture( perlinMap, animatedUV ).r.mul( 2 ).saturate()

    const floorMaterial = new MeshStandardNodeMaterial()
    floorMaterial.transparent = true
    floorMaterial.metalness = 1
    floorMaterial.roughnessNode = roughness.mul( .2 )
    floorMaterial.colorNode = Fn( () => {
      // blur reflection using textureBicubic()
      const dirtyReflection = textureBicubic( reflection, roughness.mul( .9 ) )

      // falloff opacity by distance like an opacity-fog
      const opacity = rangeFogFactor( 7, 25 ).oneMinus()

      return vec4( dirtyReflection.rgb, opacity )
    } )()

    const floor = new Mesh( new BoxGeometry( 50, .001, 50 ), floorMaterial )
    floor.name = 'Floor'
    floor.position.set( 0, 0, 0 )
    floor.userData.selectable = false
    this.scene.add( floor )
  }

  /** The 50-unit floor would dominate whole-scene framing: frame the box once the document is on screen. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.dispatch('frame-object', {object: this.box}, true)
  }
}

registerEditorGroups(ReflectionRoughnessExample, {
  Hidden: ['box'],
})
