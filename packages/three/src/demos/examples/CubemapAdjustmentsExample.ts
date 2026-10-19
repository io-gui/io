import {
  DataTexture,
  EquirectangularReflectionMapping,
  LinearMipmapLinearFilter,
  LinearToneMapping,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Node,
  PerspectiveCamera,
  SphereGeometry
} from 'three/webgpu'
import { uniform, mix, pmremTexture, reference, positionLocal, hue, saturation, positionWorld, normalWorld, positionWorldDirection, reflectVector } from 'three/tsl'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * The Damaged Helmet between a mirror and a rough metal sphere, lit by an environment node that blends two HDR
 * panoramas by height, rotates each, and adjusts the result's intensity, hue and saturation; the background shows
 * the same node, blurred by `blur`. The adjustments are in the Document tab and reach the shaders through reference
 * nodes to the document's own properties, as the source's nodes refer to its settings object. Static.
 */
@Register
export class CubemapAdjustmentsExample extends Document {

  private rotateY1Matrix = new Matrix4()
  private rotateY2Matrix = new Matrix4()

  @Property({type: Number, value: 0})
  declare mix: number

  @Property({type: Number, value: 0})
  declare blur: number

  @Property({type: Number, value: 0})
  declare offsetHDR1: number

  @Property({type: Number, value: 0})
  declare offsetHDR2: number

  @Property({type: Number, value: 0})
  declare procedural: number

  @Property({type: Number, value: 1})
  declare intensity: number

  @Property({type: Number, value: 0})
  declare hue: number

  @Property({type: Number, value: 1})
  declare saturation: number

  constructor(args?: DocumentProps) {
    super({toneMapping: LinearToneMapping, ...args})

    const initialDistance = 2
    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( - 1.8 * initialDistance, 0.6 * initialDistance, 2.7 * initialDistance )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // scene objects

    const sphereGeometry = new SphereGeometry( .5, 64, 32 )

    const sphereRightView = new Mesh( sphereGeometry, new MeshStandardMaterial( { roughness: 0, metalness: 1 } ) )
    sphereRightView.name = 'Smooth'
    sphereRightView.position.x += 2

    const sphereLeftView = new Mesh( sphereGeometry, new MeshStandardMaterial( { roughness: 1, metalness: 1 } ) )
    sphereLeftView.name = 'Rough'
    sphereLeftView.position.x -= 2

    this.scene.add( sphereLeftView )
    this.scene.add( sphereRightView )

    void this.loadEnvironment()
    void this.loadModel()
  }

  private async loadEnvironment() {
    try {
      // HDR textures

      const loadHDR = async ( url: string ) => {
        const texture = await new HDRLoader().loadAsync( url ) as DataTexture
        texture.mapping = EquirectangularReflectionMapping
        texture.generateMipmaps = true
        texture.minFilter = LinearMipmapLinearFilter
        return texture
      }

      const [ hdr1Texture, hdr2Texture ] = await Promise.all( [
        loadHDR( 'https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr' ),
        loadHDR( 'https://threejs.org/examples/textures/equirectangular/752-hdri-skies-com_1k.hdr' ),
      ] )

      // nodes and environment

      const mixNode = reference( 'mix', 'float', this )
      const proceduralNode = reference( 'procedural', 'float', this )
      const intensityNode = reference( 'intensity', 'float', this )
      const hueNode = reference( 'hue', 'float', this )
      const saturationNode = reference( 'saturation', 'float', this )

      const getEnvironmentNode = ( reflectNode: Node<'vec3'>, positionNode: Node<'vec3'> ) => {
        const custom1UV = reflectNode.xyz.mul( uniform( this.rotateY1Matrix ) )
        const custom2UV = reflectNode.xyz.mul( uniform( this.rotateY2Matrix ) )

        const mixCubeMaps = mix( pmremTexture( hdr1Texture, custom1UV ), pmremTexture( hdr2Texture, custom2UV ), positionNode.y.add( mixNode ).clamp() )

        const proceduralEnv = mix( mixCubeMaps, normalWorld, proceduralNode )

        const intensityFilter = proceduralEnv.mul( intensityNode )
        const hueFilter = hue( intensityFilter, hueNode )
        return saturation( hueFilter, saturationNode )
      }

      const blurNode = reference( 'blur', 'float', this )

      this.scene.environmentNode = getEnvironmentNode( reflectVector, positionWorld )

      this.scene.backgroundNode = getEnvironmentNode( positionWorldDirection, positionLocal ).context( {
        getTextureLevel: () => blurNode
      } )

      this.notify({kind: 'material'})
    } catch ( e ) {
      console.error( e )
    }
  }

  private async loadModel() {
    try {
      const loader = new GLTFLoader().setPath( 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/' )
      const gltf = await loader.loadAsync( 'DamagedHelmet.gltf' )
      gltf.scene.name = 'DamagedHelmet'
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  offsetHDR1Changed() { this.rotateY1Matrix.makeRotationY( this.offsetHDR1 ) }
  offsetHDR2Changed() { this.rotateY2Matrix.makeRotationY( this.offsetHDR2 ) }
}

registerEditorConfig(CubemapAdjustmentsExample, [
  ['mix', ioNumberSlider({min: - 1, max: 2, step: 0.01})],
  ['blur', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['offsetHDR1', ioNumberSlider({min: 0, max: Math.PI * 2, step: 0.01})],
  ['offsetHDR2', ioNumberSlider({min: 0, max: Math.PI * 2, step: 0.01})],
  ['procedural', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['intensity', ioNumberSlider({min: 0, max: 5, step: 0.01})],
  ['hue', ioNumberSlider({min: 0, max: Math.PI * 2, step: 0.01})],
  ['saturation', ioNumberSlider({min: 0, max: 2, step: 0.01})],
])

registerEditorGroups(CubemapAdjustmentsExample, {
  Main: ['mix', 'blur', 'offsetHDR1', 'offsetHDR2', 'procedural', 'intensity', 'hue', 'saturation'],
  Hidden: ['rotateY1Matrix', 'rotateY2Matrix'],
})
