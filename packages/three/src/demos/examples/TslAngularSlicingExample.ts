import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  Mesh,
  MeshPhysicalNodeMaterial,
  MeshStandardMaterial,
  Node,
  PerspectiveCamera,
  PlaneGeometry,
  Vector3
} from 'three/webgpu'
import { If, TWO_PI, atan, color, frontFacing, output, positionLocal, Fn, uniform, vec4 } from 'three/tsl'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A gearbox whose outer hull is cut open by an angular slice in TSL: a mask discards the hull inside the angle range,
 * and back faces seen through the cut are drawn in a flat color. `sliceStart`, `sliceArc` and `sliceColor` are in
 * the Document tab. The source camera is the active camera: the cut faces it. The key light is a `DirectionalLight` as
 * at HEAD (r186 had `SunLight`). Static.
 */
@Register
export class TslAngularSlicingExample extends Document {

  private sliceStartUniform = uniform( 1.75 )
  private sliceArcUniform = uniform( 1.25 )
  private sliceColorUniform = uniform( color( '#b62f58' ) )

  @Property({type: Number, value: 1.75})
  declare sliceStart: number

  @Property({type: Number, value: 1.25})
  declare sliceArc: number

  @Property({type: Color, init: null})
  declare sliceColor: Color

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1, ...args})

    // environment

    const hdrLoader = new UltraHDRLoader()
    hdrLoader.load( 'https://threejs.org/examples/textures/equirectangular/royal_esplanade_2k.hdr.jpg', ( environmentMap ) => {
      environmentMap.mapping = EquirectangularReflectionMapping

      this.scene.background = environmentMap
      this.scene.environment = environmentMap
      this.notify({kind: 'material'})
    } )

    // lights

    const directionalLight = new DirectionalLight( '#ffffff', 4 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 6.25, 3, 4 )
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set( 2048, 2048 )
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 30
    directionalLight.shadow.camera.top = 8
    directionalLight.shadow.camera.right = 8
    directionalLight.shadow.camera.bottom = - 8
    directionalLight.shadow.camera.left = - 8
    directionalLight.shadow.normalBias = 0.05
    this.scene.add( directionalLight )

    // TSL functions

    const inAngle = Fn( ( [ position, angleStart, angleArc ]: [ Node<'vec2'>, Node<'float'>, Node<'float'> ] ) => {
      const angle = atan( position.y, position.x ).sub( angleStart ).mod( TWO_PI ).toVar()

      return angle.greaterThan( 0 ).and( angle.lessThan( angleArc ) )
    } )

    // materials

    const defaultMaterial = new MeshPhysicalNodeMaterial( {
      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: '#858080'
    } )

    const slicedMaterial = new MeshPhysicalNodeMaterial( {
      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: '#858080',
      side: DoubleSide
    } )

    // mask

    const mask = inAngle( positionLocal.xy, this.sliceStartUniform, this.sliceArcUniform ).not()
    slicedMaterial.maskNode = mask
    //slicedMaterial.maskShadowNode = mask; // optional: custom mask shadows

    // output

    const sliceColor = this.sliceColorUniform

    slicedMaterial.outputNode = Fn( () => {
      // backface color

      const finalOutput = output

      If( frontFacing.not(), () => {
        finalOutput.assign( vec4( sliceColor, 1 ) )
      } )

      return finalOutput
    } )()

    void this.loadModel( slicedMaterial, defaultMaterial )

    // plane

    const plane = new Mesh(
      new PlaneGeometry( 10, 10, 10 ),
      new MeshStandardMaterial( { color: '#aaaaaa' } )
    )
    plane.name = 'Backdrop'
    plane.receiveShadow = true
    plane.position.set( - 4, - 3, - 4 )
    plane.lookAt( new Vector3( 0, 0, 0 ) )
    plane.userData.selectable = false
    this.scene.add( plane )

    // The cut faces the source's camera.
    const camera = new PerspectiveCamera( 35, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( - 5, 5, 12 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.sliceColor.copy( this.sliceColorUniform.value )
  }

  private async loadModel( slicedMaterial: MeshPhysicalNodeMaterial, defaultMaterial: MeshPhysicalNodeMaterial ) {
    try {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath( DRACO_GLTF_CONFIG )

      const gltfLoader = new GLTFLoader()
      gltfLoader.setDRACOLoader( dracoLoader )

      const gltf = await gltfLoader.loadAsync( 'https://threejs.org/examples/models/gltf/gears.glb' )
      const model = gltf.scene
      model.name = 'Gears'

      model.traverse( ( child ) => {
        if ( ( child as Mesh ).isMesh ) {
          if ( child.name === 'outerHull' )
            ( child as Mesh ).material = slicedMaterial
          else
            ( child as Mesh ).material = defaultMaterial

          child.castShadow = true
          child.receiveShadow = true
        }
      } )

      this.scene.add( model )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  sliceStartChanged() { this.sliceStartUniform.value = this.sliceStart }
  sliceArcChanged() { this.sliceArcUniform.value = this.sliceArc }

  sliceColorChanged() {
    this.sliceColorMutated()
  }

  /** The color editor changes the color in place. */
  sliceColorMutated() {
    if ( ! this.sliceColorUniform ) return
    this.sliceColorUniform.value.copy( this.sliceColor )
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(TslAngularSlicingExample, [
  ['sliceStart', ioNumberSlider({min: - Math.PI, max: Math.PI, step: 0.001})],
  ['sliceArc', ioNumberSlider({min: 0, max: Math.PI * 2, step: 0.001})],
])

registerEditorGroups(TslAngularSlicingExample, {
  Main: ['sliceStart', 'sliceArc', 'sliceColor'],
  Hidden: ['sliceStartUniform', 'sliceArcUniform', 'sliceColorUniform'],
})
