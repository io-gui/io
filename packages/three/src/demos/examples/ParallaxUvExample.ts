import {
  CircleGeometry,
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardNodeMaterial,
  NoColorSpace,
  PerspectiveCamera,
  ReinhardToneMapping,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { texture, parallaxUV, blendOverlay, uv, normalMap, uniform } from 'three/tsl'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * An ice disc whose lower layer is offset by a displacement texture (`parallaxUV`), so it seems to lie deep below
 * the surface, under an HDR sky. `blurriness`, `parallaxScale` and `uvScale` are in the Document tab. The active
 * camera stands where the source's auto-rotation starts. Static.
 */
@Register
export class ParallaxUvExample extends Document {

  private scaleUV = uniform( 3 )
  private parallaxScaleUniform = uniform( 0.5 ) // parallax scale

  @Property({type: Number, value: 0.4})
  declare blurriness: number

  @Property({type: Number, value: 0.5})
  declare parallaxScale: number

  @Property({type: Number, value: 3})
  declare uvScale: number

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: 6, ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 15, 7, 15 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    // environment

    new HDRLoader().load( 'https://threejs.org/examples/textures/equirectangular/752-hdri-skies-com_1k.hdr', environmentTexture => {
      environmentTexture.mapping = EquirectangularReflectionMapping

      this.scene.environment = environmentTexture
      this.scene.background = environmentTexture
      onLoad()
    } )

    // textures

    const loader = new TextureLoader().setPath( 'https://threejs.org/examples/textures/ambientcg/' )
    const load = ( url: string, colorSpace: string ) => {
      const texture = loader.load( url, onLoad )
      texture.colorSpace = colorSpace
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      return texture
    }

    const topTexture = load( 'Ice002_1K-JPG_Color.jpg', SRGBColorSpace )
    const roughnessTexture = load( 'Ice002_1K-JPG_Roughness.jpg', NoColorSpace )
    const normalTexture = load( 'Ice002_1K-JPG_NormalGL.jpg', NoColorSpace )
    const displaceTexture = load( 'Ice002_1K-JPG_Displacement.jpg', NoColorSpace )

    //

    const bottomTexture = load( 'Ice003_1K-JPG_Color.jpg', SRGBColorSpace )

    // parallax effect

    const scaledUV = uv().mul( this.scaleUV )

    const offsetUV = texture( displaceTexture, scaledUV ).mul( this.parallaxScaleUniform )
    const parallaxUVOffset = parallaxUV( scaledUV, offsetUV )
    const parallaxResult = texture( bottomTexture, parallaxUVOffset )

    const iceNode = blendOverlay( texture( topTexture, scaledUV ), parallaxResult )

    // material

    const material = new MeshStandardNodeMaterial()
    material.colorNode = iceNode.mul( 5 ) // increase the color intensity to 5 ( contrast )
    material.roughnessNode = texture( roughnessTexture, scaledUV )
    material.normalNode = normalMap( texture( normalTexture, scaledUV ) )
    material.metalness = 0

    const geometry = new CircleGeometry( 25, 64 )

    const ground = new Mesh( geometry, material )
    ground.name = 'Ice'
    ground.rotateX( - Math.PI / 2 )
    this.scene.add( ground )

    this.blurrinessChanged()
  }

  blurrinessChanged() { this.scene.backgroundBlurriness = this.blurriness }
  parallaxScaleChanged() { this.parallaxScaleUniform.value = this.parallaxScale }
  uvScaleChanged() { this.scaleUV.value = this.uvScale }
}

registerEditorConfig(ParallaxUvExample, [
  ['blurriness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['parallaxScale', ioNumberSlider({min: .2, max: .5, step: 0.01})],
  ['uvScale', ioNumberSlider({min: 1, max: 5, step: 0.01})],
])

registerEditorGroups(ParallaxUvExample, {
  Main: ['blurriness', 'parallaxScale', 'uvScale'],
  Hidden: ['scaleUV', 'parallaxScaleUniform'],
})
