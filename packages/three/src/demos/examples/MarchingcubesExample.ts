import {
  AmbientLight,
  BufferAttribute,
  Color,
  CubeRefractionMapping,
  CubeTextureLoader,
  DirectionalLight,
  Material,
  MeshBasicNodeMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PointLight,
  RepeatWrapping,
  SRGBColorSpace,
  StaticDrawUsage,
  TextureLoader
} from 'three/webgpu'
import {
  abs,
  cameraPosition,
  dot,
  float,
  Fn,
  length,
  max,
  normalize,
  normalView,
  normalWorld,
  positionWorld,
  pow,
  refract,
  screenCoordinate,
  select,
  smoothstep,
  uniform,
  vec3
} from 'three/tsl'
import type { Node } from 'three/webgpu'
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const rainbow = [
  new Color( 0xff0000 ),
  new Color( 0xffbb00 ),
  new Color( 0xffff00 ),
  new Color( 0x00ff00 ),
  new Color( 0x0000ff ),
  new Color( 0x9400bd ),
  new Color( 0xc800eb )
]

/**
 * `MarchingCubes` creates its buffers (100000 polygons) with `DynamicDrawUsage`, which WebGPURenderer uploads whole on
 * every draw of every view, changed or not. Static buffers upload when `update()` marks them, within update ranges.
 */
function staticUsage( effect: MarchingCubes ) {
  for ( const attribute of Object.values( effect.geometry.attributes ) as BufferAttribute[] ) attribute.setUsage( StaticDrawUsage )
}

/** A color as a constant `vec3` of its working-space components. */
function rgb( c: Color ) {
  return vec3( c.r, c.g, c.b )
}

/** `x mod y` with GLSL's sign (WGSL's `%` keeps the dividend's). */
function glslMod( x: Node<'float'>, y: number ) {
  return x.sub( float( y ).mul( x.div( y ).floor() ) )
}

/**
 * Metaballs polygonized by `MarchingCubes` each frame, dipping into a floor and optional walls. `material` picks one of
 * thirteen looks; the four GLSL toon shaders (`ToonShader1`, `ToonShader2`, hatching, dotted) are ported to TSL color
 * nodes. `speed`, `numBlobs`, `resolution`, `isolation`, `floor`, `wallx` and `wallz` are in the Document tab. The blobs
 * move by `delta` times `speed`, so scrubbing moves them back. Plays when opened.
 */
@Register
export class MarchingcubesExample extends Document {

  public effect: MarchingCubes
  private materials: Record<string, Material>
  /** Simulation time: document time scaled by `speed`. */
  private simTime = 0

  @Property({type: String, value: 'shiny'})
  declare material: string

  @Property({type: Number, value: 1.0})
  declare speed: number

  @Property({type: Number, value: 10})
  declare numBlobs: number

  @Property({type: Number, value: 28})
  declare resolution: number

  @Property({type: Number, value: 80})
  declare isolation: number

  @Property({type: Boolean, value: true})
  declare floor: boolean

  @Property({type: Boolean, value: false})
  declare wallx: boolean

  @Property({type: Boolean, value: false})
  declare wallz: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: 60}), ...args})

    this.scene.background = new Color( 0x050505 )

    // LIGHTS

    const light = new DirectionalLight( 0xffffff, 3 )
    light.name = 'Key'
    light.position.set( 0.5, 0.5, 1 )
    this.scene.add( light )

    const pointLight = new PointLight( 0xff7c00, 3, 0, 0 )
    pointLight.name = 'Point'
    pointLight.position.set( 0, 0, 100 )
    this.scene.add( pointLight )

    const ambientLight = new AmbientLight( 0x323232, 3 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // MATERIALS

    this.materials = this.generateMaterials( light, ambientLight )

    // MARCHING CUBES

    this.effect = new MarchingCubes( this.resolution, this.materials[ this.material ], true, true, 100000 )
    this.effect.name = 'MarchingCubes'
    this.effect.position.set( 0, 0, 0 )
    this.effect.scale.set( 700, 700, 700 )

    this.effect.enableUvs = false
    this.effect.enableColors = false
    staticUsage( this.effect )

    this.scene.add( this.effect )

    this.updateCubes()
  }

  private generateMaterials(light: DirectionalLight, ambientLight: AmbientLight) {

    // environment map

    const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/'
    const format = '.jpg'
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ]

    // toons

    const toonMaterial1 = createToonMaterial( 'toon1', light, ambientLight )
    const toonMaterial2 = createToonMaterial( 'toon2', light, ambientLight )
    const hatchingMaterial = createToonMaterial( 'hatching', light, ambientLight )
    const dottedMaterial = createToonMaterial( 'dotted', light, ambientLight )

    // Views draw on document changes only, so report the texture when it arrives.
    const texture = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', () => this.notify({kind: 'material'}) )
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.colorSpace = SRGBColorSpace

    const shiny = new MeshStandardMaterial( { color: 0x9c0000, roughness: 0.1, metalness: 1.0 } )
    const chrome = new MeshLambertMaterial( { color: 0xffffff } )
    const liquid = new MeshLambertMaterial( { color: 0xffffff, refractionRatio: 0.85 } )

    // A cube map that is still loading fails WebGPU validation as an `envMap`: assign the maps once they arrive.
    const cubeTextureLoader = new CubeTextureLoader()
    cubeTextureLoader.load( urls, ( reflectionCube ) => {
      shiny.envMap = reflectionCube
      chrome.envMap = reflectionCube
      shiny.needsUpdate = chrome.needsUpdate = true
      this.notify({kind: 'material'})
    } )
    cubeTextureLoader.load( urls, ( refractionCube ) => {
      refractionCube.mapping = CubeRefractionMapping
      liquid.envMap = refractionCube
      liquid.needsUpdate = true
      this.notify({kind: 'material'})
    } )

    const materials: Record<string, Material> = {
      'shiny': shiny,
      'chrome': chrome,
      'liquid': liquid,
      'matte': new MeshPhongMaterial( { specular: 0x494949, shininess: 1 } ),
      'flat': new MeshLambertMaterial( { /*TODO flatShading: true */ } ),
      'textured': new MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 1, map: texture } ),
      'colors': new MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 2, vertexColors: true } ),
      'multiColors': new MeshPhongMaterial( { shininess: 2, vertexColors: true } ),
      'plastic': new MeshPhongMaterial( { specular: 0xc1c1c1, shininess: 250 } ),
      'toon1': toonMaterial1,
      'toon2': toonMaterial2,
      'hatching': hatchingMaterial,
      'dotted': dottedMaterial
    }

    return materials

  }

  materialChanged() {
    if ( ! this.effect ) return
    this.effect.material = this.materials[ this.material ]
    this.effect.enableUvs = ( this.material === 'textured' ) ? true : false
    this.effect.enableColors = ( this.material === 'colors' || this.material === 'multiColors' ) ? true : false
    this.updateCubes()
  }

  resolutionChanged() {
    if ( ! this.effect ) return
    this.effect.init( Math.floor( this.resolution ) )
    staticUsage( this.effect )
    this.updateCubes()
  }

  isolationChanged() { this.updateCubes() }
  numBlobsChanged() { this.updateCubes() }
  floorChanged() { this.updateCubes() }
  wallxChanged() { this.updateCubes() }
  wallzChanged() { this.updateCubes() }

  override onAnimate(delta: number) {
    this.simTime += delta * this.speed * 0.5
    this.updateCubes()
  }

  // this controls content of marching cubes voxel field

  private updateCubes() {
    const object = this.effect
    if ( ! object ) return

    const time = this.simTime
    const numblobs = this.numBlobs

    object.isolation = this.isolation

    object.reset()

    // fill the field with some metaballs

    const subtract = 12
    const strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 )

    for ( let i = 0; i < numblobs; i ++ ) {

      const ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5
      const bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77 // dip into the floor
      const ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5

      if ( this.material === 'multiColors' ) {

        object.addBall( ballx, bally, ballz, strength, subtract, rainbow[ i % 7 ] )

      } else {

        object.addBall( ballx, bally, ballz, strength, subtract )

      }

    }

    if ( this.floor ) object.addPlaneY( 2, 12 )
    if ( this.wallz ) object.addPlaneZ( 2, 12 )
    if ( this.wallx ) object.addPlaneX( 2, 12 )

    object.update()

    // Upload only the vertices drawn.
    for ( const attribute of Object.values( object.geometry.attributes ) as BufferAttribute[] ) {
      attribute.clearUpdateRanges()
      attribute.addUpdateRange( 0, object.count * attribute.itemSize )
    }

    // `MarchingCubes.count` is its vertex count, already in the draw range; WebGPURenderer reads a mesh's `count` as its
    // instance count, so it would draw the mesh once per vertex. `update()` starts counting from 0 again.
    object.count = 1

    this.notify({kind: 'geometry'})
  }
}

/**
 * `ToonShader1`, `ToonShader2`, `ToonShaderHatching` and `ToonShaderDotted` as color nodes of a basic material: the
 * same math on the view-space normal, the light's position as its direction and its color, and the ambient color.
 */
function createToonMaterial(shader: 'toon1' | 'toon2' | 'hatching' | 'dotted', light: DirectionalLight, ambientLight: AmbientLight) {
  const dirLightPos = uniform( light.position )
  const dirLightColor = rgb( light.color )
  const ambientLightColor = rgb( ambientLight.color )

  const vNormal = normalize( normalView )
  const directionalLightWeighting = dot( vNormal, dirLightPos ).max( 0.0 )
  const lightWeighting = ambientLightColor.add( dirLightColor.mul( directionalLightWeighting ) )

  const fragCoordX = screenCoordinate.x
  const fragCoordY = screenCoordinate.y

  let colorNode: Node<'vec3'>

  if ( shader === 'toon1' ) {

    const baseColor = rgb( new Color( 0xffffff ) )

    colorNode = Fn( () => {
      const intensity = smoothstep( - 0.5, 1.0, pow( length( lightWeighting ), 20.0 ) ).toVar()
      intensity.addAssign( length( lightWeighting ).mul( 0.2 ) )

      const vRefract = refract( normalize( positionWorld.sub( cameraPosition ) ), normalWorld, 1.02 )
      const cameraWeighting = dot( vNormal, vRefract )
      intensity.addAssign( pow( max( float( 1.0 ).sub( abs( cameraWeighting ) ), 0.0 ), 6.0 ) )
      intensity.assign( intensity.mul( 0.2 ).add( 0.3 ) )

      return select(
        intensity.lessThan( 0.5 ),
        baseColor.mul( intensity.mul( 2.0 ) ),
        vec3( 1.0 ).sub( vec3( 1.0 ).sub( baseColor ).mul( float( 1.0 ).sub( intensity ).mul( 2.0 ) ) )
      )
    } )()

  } else if ( shader === 'toon2' ) {

    const baseColor = rgb( new Color( 0xeeeeee ) )
    const lineColor1 = rgb( new Color( 0x808080 ) )
    const lineColor2 = rgb( new Color( 0x000000 ) )

    const camera = dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ).max( 0.4 )
    const lit = dot( vNormal, dirLightPos ).max( 0.0 )

    const shade1 = select( length( ambientLightColor.add( dirLightColor.mul( lit ) ) ).lessThan( 1.0 ), lineColor1, vec3( 1.0 ) )
    const shade2 = select( length( ambientLightColor.add( dirLightColor.mul( camera ) ) ).lessThan( 0.5 ), lineColor2, vec3( 1.0 ) )

    colorNode = baseColor.mul( shade1 ).mul( shade2 )

  } else if ( shader === 'hatching' ) {

    // All four line colors are black.
    const weight = length( lightWeighting )
    const line1 = weight.lessThan( 1.00 ).and( glslMod( fragCoordX.add( fragCoordY ), 10.0 ).equal( 0.0 ) )
    const line2 = weight.lessThan( 0.75 ).and( glslMod( fragCoordX.sub( fragCoordY ), 10.0 ).equal( 0.0 ) )
    const line3 = weight.lessThan( 0.50 ).and( glslMod( fragCoordX.add( fragCoordY ).sub( 5.0 ), 10.0 ).equal( 0.0 ) )
    const line4 = weight.lessThan( 0.3465 ).and( glslMod( fragCoordX.sub( fragCoordY ).sub( 5.0 ), 10.0 ).equal( 0.0 ) )

    colorNode = select( line1.or( line2 ).or( line3 ).or( line4 ), vec3( 0.0 ), vec3( 1.0 ) )

  } else {

    const weight = length( lightWeighting )
    const dot1 = weight.lessThan( 1.00 ).and( glslMod( fragCoordX, 4.001 ).add( glslMod( fragCoordY, 4.0 ) ).greaterThan( 6.00 ) )
    const dot2 = weight.lessThan( 0.50 ).and( glslMod( fragCoordX.add( 2.0 ), 4.001 ).add( glslMod( fragCoordY.add( 2.0 ), 4.0 ) ).greaterThan( 6.00 ) )

    colorNode = select( dot1.or( dot2 ), vec3( 0.0 ), vec3( 1.0 ) )

  }

  return new MeshBasicNodeMaterial( { colorNode } )
}

registerEditorConfig(MarchingcubesExample, [
  ['material', ioOptionSelect({model: new Menu({options: [ 'shiny', 'chrome', 'liquid', 'matte', 'flat', 'textured', 'colors', 'multiColors', 'plastic', 'toon1', 'toon2', 'hatching', 'dotted' ]})})],
  ['speed', ioNumberSlider({min: 0.1, max: 8.0, step: 0.05})],
  ['numBlobs', ioNumberSlider({min: 1, max: 50, step: 1})],
  ['resolution', ioNumberSlider({min: 14, max: 100, step: 1})],
  ['isolation', ioNumberSlider({min: 10, max: 300, step: 1})],
])

registerEditorGroups(MarchingcubesExample, {
  Main: ['material', 'speed', 'numBlobs', 'resolution', 'isolation', 'floor', 'wallx', 'wallz'],
  Hidden: ['effect', 'materials', 'simTime'],
})
