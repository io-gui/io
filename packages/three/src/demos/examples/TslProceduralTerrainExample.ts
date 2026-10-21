import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardNodeMaterial,
  Node,
  PerspectiveCamera,
  PlaneGeometry,
  Vector2
} from 'three/webgpu'
import { mx_noise_float, color, cross, dot, float, transformNormalToView, positionLocal, sign, step, Fn, uniform, varying, vec3, Loop } from 'three/tsl'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, threeVector2 } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A procedural island: a 500 × 500 plane displaced on the GPU by warped, layered `mx_noise_float` (normals from two
 * neighbouring elevations), colored sand, grass, rock and snow by height and slope, in glassy water
 * (`transmission: 1`) under the pedestrian overpass HDR. The terrain and water controls are in the Document tab. The
 * source's pointer drag, which slides the noise under the island, is `offset`. Static.
 */
@Register
export class TslProceduralTerrainExample extends Document {

  @Property({type: Number, value: 3})
  declare noiseIterations: number

  @Property({type: Number, value: 0.175})
  declare positionFrequency: number

  @Property({type: Number, value: 10})
  declare strength: number

  @Property({type: Number, value: 6})
  declare warpFrequency: number

  @Property({type: Number, value: 1})
  declare warpStrength: number

  @Property({type: Vector2, init: null})
  declare offset: Vector2

  @Property({type: Color, init: null})
  declare colorSand: Color

  @Property({type: Color, init: null})
  declare colorGrass: Color

  @Property({type: Color, init: null})
  declare colorSnow: Color

  @Property({type: Color, init: null})
  declare colorRock: Color

  @Property({type: Number, value: 0.5})
  declare waterRoughness: number

  @Property({type: Number, value: 1.333})
  declare waterIor: number

  @Property({type: Color, init: null})
  declare waterColor: Color

  public terrain: Mesh
  public water: Mesh<PlaneGeometry, MeshPhysicalMaterial>
  private noiseIterationsUniform = uniform( 3 )
  private positionFrequencyUniform = uniform( 0.175 )
  private warpFrequencyUniform = uniform( 6 )
  private warpStrengthUniform = uniform( 1 )
  private strengthUniform = uniform( 10 )
  private offsetUniform = uniform( new Vector2( 0, 0 ) )
  private normalLookUpShift = uniform( 0.01 )
  private colorSandUniform = uniform( color( '#ffe894' ) )
  private colorGrassUniform = uniform( color( '#85d534' ) )
  private colorSnowUniform = uniform( color( '#ffffff' ) )
  private colorRockUniform = uniform( color( '#bfbd8d' ) )

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 35, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( - 10, 8, - 2.2 )
    camera.lookAt( 0, - 0.5, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x201919 )

    // lights

    const directionalLight = new DirectionalLight( '#ffffff', 2 )
    directionalLight.name = 'Directional Light'
    directionalLight.position.set( 6.25, 3, 4 )
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set( 1024, 1024 )
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 30
    directionalLight.shadow.camera.top = 8
    directionalLight.shadow.camera.right = 8
    directionalLight.shadow.camera.bottom = - 8
    directionalLight.shadow.camera.left = - 8
    directionalLight.shadow.normalBias = 0.05
    this.scene.add( directionalLight )

    // terrain

    const material = new MeshStandardNodeMaterial( {
      metalness: 0,
      roughness: 0.5,
      color: '#85d534'
    } )

    const noiseIterations = this.noiseIterationsUniform
    const positionFrequency = this.positionFrequencyUniform
    const warpFrequency = this.warpFrequencyUniform
    const warpStrength = this.warpStrengthUniform
    const strength = this.strengthUniform
    const offset = this.offsetUniform
    const normalLookUpShift = this.normalLookUpShift
    const colorSand = this.colorSandUniform
    const colorGrass = this.colorGrassUniform
    const colorSnow = this.colorSnowUniform
    const colorRock = this.colorRockUniform

    const vNormal = varying( vec3() )
    const vPosition = varying( vec3() )

    const terrainElevation = Fn( ( [ position ]: [ Node<'vec2'> ] ) => {
      const warpedPosition = position.add( offset ).toVar()
      warpedPosition.addAssign( mx_noise_float( warpedPosition.mul( positionFrequency ).mul( warpFrequency ), 1, 0 ).mul( warpStrength ) )

      const elevation = float( 0 ).toVar()

      Loop( { type: 'float', start: float( 1 ), end: noiseIterations.toFloat(), condition: '<=' }, ( { i } ) => {
        const noiseInput = warpedPosition.mul( positionFrequency ).mul( i.mul( 2 ) ).add( i.mul( 987 ) )
        const noise = mx_noise_float( noiseInput, 1, 0 ).div( i.add( 1 ).mul( 2 ) )
        elevation.addAssign( noise )
      } )

      const elevationSign = sign( elevation )
      elevation.assign( elevation.abs().pow( 2 ).mul( elevationSign ).mul( strength ) )

      return elevation
    } )

    material.positionNode = Fn( () => {
      // neighbours positions
      const neighbourA = positionLocal.xyz.add( vec3( normalLookUpShift, 0.0, 0.0 ) ).toVar()
      const neighbourB = positionLocal.xyz.add( vec3( 0.0, 0.0, normalLookUpShift.negate() ) ).toVar()

      // elevations
      const position = positionLocal.xyz.toVar()
      const elevation = terrainElevation( positionLocal.xz )
      position.y.addAssign( elevation )

      neighbourA.y.addAssign( terrainElevation( neighbourA.xz ) )
      neighbourB.y.addAssign( terrainElevation( neighbourB.xz ) )

      // compute normal
      const toA = neighbourA.sub( position ).normalize()
      const toB = neighbourB.sub( position ).normalize()
      vNormal.assign( cross( toA, toB ) )

      // varyings
      vPosition.assign( position.add( vec3( offset.x, 0, offset.y ) ) )

      return position
    } )()

    material.normalNode = transformNormalToView( vNormal )

    material.colorNode = Fn( () => {
      const finalColor = colorSand.toVar()

      // grass
      const grassMix = step( - 0.06, vPosition.y )
      finalColor.assign( grassMix.mix( finalColor, colorGrass ) )

      // rock
      const rockMix = step( 0.5, dot( vNormal, vec3( 0, 1, 0 ) ) ).oneMinus().mul( step( - 0.06, vPosition.y ) )
      finalColor.assign( rockMix.mix( finalColor, colorRock ) )

      // snow
      const snowThreshold = mx_noise_float( vPosition.xz.mul( 25 ), 1, 0 ).mul( 0.1 ).add( 0.45 )
      const snowMix = step( snowThreshold, vPosition.y )
      finalColor.assign( snowMix.mix( finalColor, colorSnow ) )

      return finalColor
    } )()

    const geometry = new PlaneGeometry( 10, 10, 500, 500 )
    geometry.deleteAttribute( 'uv' )
    geometry.deleteAttribute( 'normal' )
    geometry.rotateX( - Math.PI * 0.5 )

    this.terrain = new Mesh( geometry, material )
    this.terrain.name = 'Terrain'
    this.terrain.receiveShadow = true
    this.terrain.castShadow = true
    this.scene.add( this.terrain )

    // water

    this.water = new Mesh(
      new PlaneGeometry( 10, 10, 1, 1 ),
      new MeshPhysicalMaterial( {
        transmission: 1,
        roughness: this.waterRoughness,
        ior: this.waterIor,
        color: '#4db2ff'
      } )
    )
    this.water.name = 'Water'
    this.water.rotation.x = - Math.PI * 0.5
    this.water.position.y = - 0.1
    this.scene.add( this.water )

    this.colorSand.copy( colorSand.value )
    this.colorGrass.copy( colorGrass.value )
    this.colorSnow.copy( colorSnow.value )
    this.colorRock.copy( colorRock.value )
    this.waterColor.copy( this.water.material.color )

    void this.loadEnvironment()
  }

  private async loadEnvironment() {
    try {
      const environmentMap = await new HDRLoader().loadAsync( 'https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr' )
      environmentMap.mapping = EquirectangularReflectionMapping
      this.scene.background = environmentMap
      this.scene.backgroundBlurriness = 0.5
      this.scene.environment = environmentMap
      this.notify({kind: 'other'})
    } catch ( e ) {
      console.error( e )
    }
  }

  noiseIterationsChanged() { this.noiseIterationsUniform.value = this.noiseIterations }
  positionFrequencyChanged() { this.positionFrequencyUniform.value = this.positionFrequency }
  strengthChanged() { this.strengthUniform.value = this.strength }
  warpFrequencyChanged() { this.warpFrequencyUniform.value = this.warpFrequency }
  warpStrengthChanged() { this.warpStrengthUniform.value = this.warpStrength }

  offsetChanged() { this.offsetMutated() }
  colorSandChanged() { this.colorSandMutated() }
  colorGrassChanged() { this.colorGrassMutated() }
  colorSnowChanged() { this.colorSnowMutated() }
  colorRockChanged() { this.colorRockMutated() }
  waterColorChanged() { this.waterColorMutated() }

  /** The vector and color editors change the values in place. */
  offsetMutated() {
    if ( ! this.terrain ) return
    this.offsetUniform.value.copy( this.offset )
    this.notify({kind: 'material'})
  }

  colorSandMutated() { this.copyColor( this.colorSandUniform.value, this.colorSand ) }
  colorGrassMutated() { this.copyColor( this.colorGrassUniform.value, this.colorGrass ) }
  colorSnowMutated() { this.copyColor( this.colorSnowUniform.value, this.colorSnow ) }
  colorRockMutated() { this.copyColor( this.colorRockUniform.value, this.colorRock ) }

  waterColorMutated() {
    if ( ! this.water ) return
    this.copyColor( this.water.material.color, this.waterColor )
  }

  private copyColor( target: Color, source: Color ) {
    if ( ! this.terrain ) return
    target.copy( source )
    this.notify({kind: 'material'})
  }

  waterRoughnessChanged() {
    if ( ! this.water ) return
    this.water.material.roughness = this.waterRoughness
    this.notify({kind: 'material'})
  }

  waterIorChanged() {
    if ( ! this.water ) return
    this.water.material.ior = this.waterIor
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(TslProceduralTerrainExample, [
  ['noiseIterations', ioNumberSlider({min: 0, max: 10, step: 1})],
  ['positionFrequency', ioNumberSlider({min: 0, max: 1, step: 0.001})],
  ['strength', ioNumberSlider({min: 0, max: 20, step: 0.001})],
  ['warpFrequency', ioNumberSlider({min: 0, max: 20, step: 0.001})],
  ['warpStrength', ioNumberSlider({min: 0, max: 2, step: 0.001})],
  ['offset', threeVector2({step: 0.01})],
  ['waterRoughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['waterIor', ioNumberSlider({min: 1, max: 2, step: 0.001})],
])

registerEditorGroups(TslProceduralTerrainExample, {
  Main: [
    'noiseIterations', 'positionFrequency', 'strength', 'warpFrequency', 'warpStrength', 'offset',
    'colorSand', 'colorGrass', 'colorSnow', 'colorRock',
  ],
  Water: ['waterRoughness', 'waterIor', 'waterColor'],
  Hidden: [
    'terrain', 'water', 'noiseIterationsUniform', 'positionFrequencyUniform', 'warpFrequencyUniform',
    'warpStrengthUniform', 'strengthUniform', 'offsetUniform', 'normalLookUpShift', 'colorSandUniform',
    'colorGrassUniform', 'colorSnowUniform', 'colorRockUniform',
  ],
})
