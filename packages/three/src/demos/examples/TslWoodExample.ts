import {
  CircleGeometry,
  Color,
  EquirectangularReflectionMapping,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshBasicNodeMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  Node,
  PerspectiveCamera,
  Vector3
} from 'three/webgpu'
import * as TSL from 'three/tsl'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { WoodNodeMaterial, WoodGenuses, Finishes } from 'three/addons/materials/WoodNodeMaterial.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The custom wood's parameters with their slider ranges: [name, min, max, step]. */
const CUSTOM_PARAMETERS: [ string, number, number, number ][] = [
  [ 'centerSize', 0.0, 2.0, 0.01 ],
  [ 'largeWarpScale', 0.0, 1.0, 0.001 ],
  [ 'largeGrainStretch', 0.0, 1.0, 0.001 ],
  [ 'smallWarpStrength', 0.0, 0.2, 0.001 ],
  [ 'smallWarpScale', 0.0, 5.0, 0.01 ],
  [ 'fineWarpStrength', 0.0, 0.05, 0.001 ],
  [ 'fineWarpScale', 0.0, 50.0, 0.1 ],
  [ 'ringThickness', 0.0, 0.1, 0.001 ],
  [ 'ringBias', - 0.2, 0.2, 0.001 ],
  [ 'ringSizeVariance', 0.0, 0.2, 0.001 ],
  [ 'ringVarianceScale', 0.0, 10.0, 0.1 ],
  [ 'barkThickness', 0.0, 1.0, 0.01 ],
  [ 'splotchScale', 0.0, 1.0, 0.01 ],
  [ 'splotchIntensity', 0.0, 1.0, 0.01 ],
  [ 'cellScale', 100, 2000, 1 ],
  [ 'cellSize', 0.01, 0.5, 0.001 ],
  [ 'clearcoat', 0.0, 1.0, 0.01 ],
  [ 'clearcoatRoughness', 0.0, 1.0, 0.01 ],
]

// Helper function to get grid position
function getGridPosition( woodIndex: number, finishIndex: number ) {
  return new Vector3(
    0,
    ( finishIndex - Finishes.length / 2 ) * 1.0,
    ( woodIndex - WoodGenuses.length / 2 + 0.45 ) * 1.0
  )
}

// @types/three 0.186 types the TSL math helpers loosely: the grid functions' nodes go through `any`.
/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper function to create the grid plane
function createGridPlane() {
  const material = new MeshBasicNodeMaterial()

  const gridXZ = TSL.Fn( ( [ gridSize = TSL.float( 1.0 ), dotWidth = TSL.float( 0.1 ), lineWidth = TSL.float( 0.02 ) ]: any[] ) => {
    const coord = TSL.positionWorld.xz.div( gridSize )
    const grid = TSL.fract( coord )

    // Screen-space derivative for automatic antialiasing
    const fw = TSL.fwidth( coord )
    const smoothing = TSL.max( fw.x, fw.y ).mul( 0.5 )

    // Create squares at cell centers
    const squareDist = TSL.max( TSL.abs( grid.x.sub( 0.5 ) ), TSL.abs( grid.y.sub( 0.5 ) ) )
    const dots = TSL.smoothstep( dotWidth.add( smoothing ), dotWidth.sub( smoothing ), squareDist )

    // Create grid lines
    const lineX = TSL.smoothstep( lineWidth.add( smoothing ), lineWidth.sub( smoothing ), TSL.abs( grid.x.sub( 0.5 ) ) )
    const lineZ = TSL.smoothstep( lineWidth.add( smoothing ), lineWidth.sub( smoothing ), TSL.abs( grid.y.sub( 0.5 ) ) )
    const lines = TSL.max( lineX, lineZ )

    return TSL.max( dots, lines )
  } )

  const radialGradient = TSL.Fn( ( [ radius = TSL.float( 10.0 ), falloff = TSL.float( 1.0 ) ]: any[] ) => {
    return TSL.smoothstep( radius, radius.sub( falloff ), TSL.length( TSL.positionWorld ) )
  } )

  // Create grid pattern
  const gridPattern = ( gridXZ as any )( 1.0, 0.03, 0.005 )
  const baseColor = TSL.vec4( 1.0, 1.0, 1.0, 0.0 )
  const gridColor = TSL.vec4( 0.5, 0.5, 0.5, 1.0 )

  // Mix base color with grid lines
  material.colorNode = gridPattern.mix( baseColor, gridColor ).mul( ( radialGradient as any )( 30.0, 20.0 ) ) as Node<'vec4'>
  material.transparent = true

  const plane = new Mesh( new CircleGeometry( 40 ), material )
  plane.rotation.x = - Math.PI / 2
  plane.renderOrder = - 1

  return plane
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Procedural wood in TSL: a block for every wood genus (columns) and finish (rows) from `WoodNodeMaterial` presets,
 * with labels, over a grid floor, plus a custom wood whose parameters are the `custom` sliders in the Document tab.
 * The source adds the blocks one per task to keep the page responsive; here they are all built at once. Labels
 * appear when the font has loaded. Static.
 */
@Register
export class TslWoodExample extends Document {

  public base: Group
  public customMaterial: WoodNodeMaterial
  private blockGeometry = new RoundedBoxGeometry( 0.125, 0.9, 0.9, 10, 0.02 )

  /** The custom wood's parameters: accessors over its material. */
  @Property({type: Object, init: null})
  declare custom: Record<string, number | Color>

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, toneMappingExposure: 1.0, ...args})

    const camera = new PerspectiveCamera( 75, 400 / 250, 0.1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 0.1, 5, 0.548 )
    camera.lookAt( 0, 0, 0.548 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xffffff )

    this.base = new Group()
    this.base.name = 'Woods'
    this.base.rotation.set( 0, 0, - Math.PI / 2 )
    this.base.position.set( 0, 0, 0.548 )
    this.scene.add( this.base )

    // Create and add the grid plane
    const plane = createGridPlane()
    plane.name = 'Floor'
    plane.userData.selectable = false
    this.scene.add( plane )

    new HDRLoader()
      .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
      .load( 'san_giuseppe_bridge_2k.hdr', ( texture ) => {
        texture.mapping = EquirectangularReflectionMapping
        this.scene.environment = texture
        this.scene.environmentIntensity = 2
        this.notify({kind: 'material'})
      } )

    // Create wood blocks
    for ( let x = 0; x < WoodGenuses.length; x ++ ) {
      for ( let y = 0; y < Finishes.length; y ++ ) {
        const material = WoodNodeMaterial.fromPreset( WoodGenuses[ x ], Finishes[ y ] )
        const cube = new Mesh( this.blockGeometry, material )
        cube.name = `${WoodGenuses[ x ]} ${Finishes[ y ]}`
        cube.position.copy( getGridPosition( x, y ) )
        material.transformationMatrix = new Matrix4().setPosition( new Vector3( - 0.1, 0, Math.random() ) )
        this.base.add( cube )
      }
    }

    this.customMaterial = this.addCustomWood()

    void this.loadLabels()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private addCustomWood() {
    // Create custom wood material with unique parameters
    const customMaterial = new WoodNodeMaterial( {
      centerSize: 1.11,
      largeWarpScale: 0.32,
      largeGrainStretch: 0.24,
      smallWarpStrength: 0.059,
      smallWarpScale: 2,
      fineWarpStrength: 0.006,
      fineWarpScale: 32.8,
      ringThickness: 1 / 34,
      ringBias: 0.03,
      ringSizeVariance: 0.03,
      ringVarianceScale: 4.4,
      barkThickness: 0.3,
      splotchScale: 0.2,
      splotchIntensity: 0.541,
      cellScale: 910,
      cellSize: 0.1,
      darkGrainColor: new Color( '#0c0504' ),
      lightGrainColor: new Color( '#926c50' ),
      clearcoat: 1,
      clearcoatRoughness: 0.2
    } )

    const cube = new Mesh( this.blockGeometry, customMaterial )
    cube.name = 'Custom'
    customMaterial.transformationMatrix = new Matrix4().setPosition( new Vector3( - 0.1, 0, Math.random() ) )
    cube.position.copy( getGridPosition( Math.round( WoodGenuses.length / 2 ), 5 ) )
    this.base.add( cube )

    // The source's GUI: the parameters, then the grain colors, which the editors change in place.
    const parameters = customMaterial as unknown as Record<string, number | Color>
    const custom: Record<string, number | Color> = {}

    for ( const [ name ] of CUSTOM_PARAMETERS ) {
      Object.defineProperty( custom, name, {
        get: () => parameters[ name ],
        set: ( value: number ) => { parameters[ name ] = value },
        enumerable: true,
      } )
    }

    custom.darkGrainColor = customMaterial.darkGrainColor
    custom.lightGrainColor = customMaterial.lightGrainColor

    this.custom = custom

    return customMaterial
  }

  /** Edits in the custom sliders reach the shader through the material's object-update uniforms. */
  customMutated() {
    this.notify({kind: 'material'})
  }

  private async loadLabels() {
    try {
      const font = await new FontLoader().loadAsync( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' )

      const textMaterial = new MeshStandardMaterial()
      textMaterial.colorNode = TSL.color( '#000000' )

      // Create finish labels (using negative wood index for left column)
      for ( let y = 0; y < Finishes.length; y ++ ) {
        this.createLabel( Finishes[ y ], font, textMaterial, getGridPosition( - 1, y ) )
      }

      // Create wood labels (using negative finish index for top row)
      for ( let x = 0; x < WoodGenuses.length; x ++ ) {
        this.createLabel( WoodGenuses[ x ], font, textMaterial, getGridPosition( x, - 1 ) )
      }

      // Add "Custom" label (positioned at the end of the grid)
      this.createLabel( 'custom', font, textMaterial, getGridPosition( Math.round( WoodGenuses.length / 2 - 1 ), 5 ) )

      this.notify({kind: 'structure'})
      // The 40-unit floor would dominate whole-scene framing.
      this._frameTarget = this.base
    } catch ( e ) {
      console.error( e )
    }
  }

  // Helper function to create and position labels
  private createLabel( text: string, font: Font, material: Material, position: Vector3 ) {
    const txt_geo = new TextGeometry( text, {
      font: font,
      size: 0.1,
      depth: 0.001,
      curveSegments: 12,
      bevelEnabled: false
    } )

    txt_geo.computeBoundingBox()
    const offx = - 0.5 * ( txt_geo.boundingBox!.max.x - txt_geo.boundingBox!.min.x )
    const offy = - 0.5 * ( txt_geo.boundingBox!.max.y - txt_geo.boundingBox!.min.y )
    const offz = - 0.5 * ( txt_geo.boundingBox!.max.z - txt_geo.boundingBox!.min.z )
    txt_geo.translate( offx, offy, offz )

    const label = new Group()
    label.name = `${text} Label`
    const mesh = new Mesh( txt_geo, material )
    mesh.name = text
    label.add( mesh )

    // Apply default rotation for labels
    label.rotateY( - Math.PI / 2 )
    label.position.copy( position )
    this.base.add( label )
  }
}

registerEditorConfig(TslWoodExample, [
  ['custom', ioObject({expanded: true, labelWidth: '140px', config: CUSTOM_PARAMETERS.map( ( [ name, min, max, step ] ) => [ name, ioNumberSlider({min, max, step}) ] )})],
])

registerEditorGroups(TslWoodExample, {
  Main: ['custom'],
  Hidden: ['base', 'customMaterial', 'blockGeometry'],
})
