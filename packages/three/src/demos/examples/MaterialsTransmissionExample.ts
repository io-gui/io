import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  DoubleSide,
  EquirectangularReflectionMapping,
  Mesh,
  MeshPhysicalMaterial,
  NearestFilter,
  PerspectiveCamera,
  RepeatWrapping,
  SphereGeometry
} from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Horizontal stripes: the bottom row of a 2 × 2 canvas is white, the top transparent. */
function generateTexture() {
  const canvas = new OffscreenCanvas( 2, 2 )
  const context = canvas.getContext( '2d' )!
  context.fillStyle = 'white'
  context.fillRect( 0, 1, 2, 1 )
  return canvas
}

/**
 * A striped glass sphere (`MeshPhysicalMaterial.transmission`, an alpha map of stripes) in front of the Royal
 * Esplanade HDR, which is also its environment map. The material's controls are in the Document tab, exposure in
 * Rendering. The stripes are drawn on an `OffscreenCanvas` instead of a DOM canvas.
 */
@Register
export class MaterialsTransmissionExample extends Document {

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Number, value: 1})
  declare transmission: number

  @Property({type: Number, value: 1})
  declare opacity: number

  @Property({type: Number, value: 0})
  declare metalness: number

  @Property({type: Number, value: 0})
  declare roughness: number

  @Property({type: Number, value: 1.5})
  declare ior: number

  @Property({type: Number, value: 0.01})
  declare thickness: number

  @Property({type: Number, value: 1})
  declare specularIntensity: number

  @Property({type: Color, init: null})
  declare specularColor: Color

  @Property({type: Number, value: 1})
  declare envMapIntensity: number

  public mesh: Mesh
  private material: MeshPhysicalMaterial

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 120 )
    this.activeCamera = camera

    const geometry = new SphereGeometry( 20, 64, 32 )

    const texture = new CanvasTexture( generateTexture() )
    texture.magFilter = NearestFilter
    texture.wrapT = RepeatWrapping
    texture.wrapS = RepeatWrapping
    texture.repeat.set( 1, 3.5 )

    this.material = new MeshPhysicalMaterial( {
      color: 0xffffff,
      metalness: this.metalness,
      roughness: this.roughness,
      ior: this.ior,
      thickness: this.thickness,
      alphaMap: texture,
      envMapIntensity: this.envMapIntensity,
      transmission: this.transmission, // use material.transmission for glass materials
      specularIntensity: this.specularIntensity,
      specularColor: 0xffffff,
      opacity: this.opacity,
      side: DoubleSide,
      transparent: true
    } )

    this.mesh = new Mesh( geometry, this.material )
    this.mesh.name = 'Sphere'
    this.scene.add( this.mesh )

    this.color.copy( this.material.color )
    this.specularColor.copy( this.material.specularColor )

    void this.loadEnvironment()
  }

  private async loadEnvironment() {
    try {
      const hdrEquirect = await new UltraHDRLoader()
        .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
        .loadAsync( 'royal_esplanade_2k.hdr.jpg' )

      hdrEquirect.mapping = EquirectangularReflectionMapping

      this.scene.background = hdrEquirect
      this.material.envMap = hdrEquirect
      this.material.needsUpdate = true

      this.notify({kind: 'other'})
    } catch ( e ) {
      console.error( e )
    }
  }

  colorChanged() { this.colorMutated() }
  specularColorChanged() { this.specularColorMutated() }

  /** The color editors change the colors in place. */
  colorMutated() {
    if ( ! this.material ) return
    this.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }

  specularColorMutated() {
    if ( ! this.material ) return
    this.material.specularColor.copy( this.specularColor )
    this.notify({kind: 'material'})
  }

  transmissionChanged() { this.updateMaterial() }
  opacityChanged() { this.updateMaterial() }
  metalnessChanged() { this.updateMaterial() }
  roughnessChanged() { this.updateMaterial() }
  iorChanged() { this.updateMaterial() }
  thicknessChanged() { this.updateMaterial() }
  specularIntensityChanged() { this.updateMaterial() }
  envMapIntensityChanged() { this.updateMaterial() }

  private updateMaterial() {
    const material = this.material
    if ( ! material ) return
    material.transmission = this.transmission
    material.opacity = this.opacity
    material.metalness = this.metalness
    material.roughness = this.roughness
    material.ior = this.ior
    material.thickness = this.thickness
    material.specularIntensity = this.specularIntensity
    material.envMapIntensity = this.envMapIntensity
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(MaterialsTransmissionExample, [
  ['transmission', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['ior', ioNumberSlider({min: 1, max: 2, step: 0.01})],
  ['thickness', ioNumberSlider({min: 0, max: 5, step: 0.01})],
  ['specularIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['envMapIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsTransmissionExample, {
  Main: [
    'color', 'transmission', 'opacity', 'metalness', 'roughness', 'ior', 'thickness', 'specularIntensity',
    'specularColor', 'envMapIntensity',
  ],
  Hidden: ['mesh', 'material'],
})
