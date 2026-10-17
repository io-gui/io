import {
  ACESFilmicToneMapping,
  BufferGeometry,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalNodeMaterial,
  Node,
  PointLight,
  SphereGeometry
} from 'three/webgpu'
import {
  Fn, add, dot, element, float, floor, int, mix, mul, normalWorld, sub, uv, vec2, vec3,
  mx_cell_noise_float,
  mx_fractal_noise_vec3,
  mx_modulo,
  mx_noise_vec3,
  mx_unifiednoise2d,
  mx_unifiednoise3d,
  mx_worley_noise_float_2d,
  mx_worley_noise_float_3d
} from 'three/tsl'
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { mxHextileComputeBlendWeights, mxHextileCoord } from 'three/addons/loaders/materialx/MaterialXHextile.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the light's path repeats: the timeline length, so looping is seamless. Its frequencies (0.75,
 * 1.25 and 1.75 rad/s) are whole multiples of 0.25 rad/s. The noise scrolls with time and does not repeat, so it
 * jumps at the wrap.
 */
const PERIOD = 8 * Math.PI

type NoiseExample = { label: string[]; createNode: () => Node }

/**
 * A grid of spheres, each colored by one MaterialX noise function in TSL (Perlin, cell, Worley, fractal, the unified
 * noises in 2D and 3D, and a hex-tiled checkerboard), with a label below, under an HDR cube map and an orbiting point
 * light. The noise scrolls with document time; the spheres turn once per loop (the source turns them 0.005 rad per
 * frame). The grid appears once the cube map and the font have loaded. Plays when opened.
 */
@Register
export class MaterialxNoiseExample extends Document {

  public particleLight: Mesh
  public group: Group
  private spheres: Mesh[] = []

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.25, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.group = new Group()
    this.group.name = 'Noises'
    this.scene.add( this.group )

    // LIGHTS

    this.particleLight = new Mesh(
      new SphereGeometry( 0.4, 8, 8 ),
      new MeshBasicMaterial( { color: 0xffffff } )
    )
    this.particleLight.name = 'ParticleLight'
    this.scene.add( this.particleLight )

    const pointLight = new PointLight( 0xffffff, 1000 )
    pointLight.name = 'Light'
    this.particleLight.add( pointLight )

    this.pose( this.timeline.currentTime )
    void this.load()
  }

  private async load() {
    try {
      const [ hdrTexture, font ] = await Promise.all( [
        new HDRCubeTextureLoader()
          .setPath( 'https://threejs.org/examples/textures/cube/pisaHDR/' )
          .loadAsync( [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ] ),
        new FontLoader().loadAsync( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' )
      ] )

      const geometry = new SphereGeometry( 5, 64, 32 )
      const labelMaterial = new MeshBasicMaterial( { color: 0xffffff } )

      this.createNoiseGrid( this.createNoiseExamples(), geometry, font, labelMaterial )

      this.scene.background = hdrTexture
      this.scene.environment = hdrTexture

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.group}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  // @types/three 0.186 types the MaterialX functions loosely: the node arguments go through `any`.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private createNoiseExamples(): NoiseExample[] {
    const time = this.timeline.timeNode

    const position2D = uv( 0 ).mul( 12 ).add( vec2( time.mul( .35 ), time.mul( .19 ) ) )
    const position3D = normalWorld.mul( 4 ).add( vec3( time.mul( .35 ), time.mul( .19 ), time.mul( .27 ) ) )

    const fractal2D = vec3( position2D.x, position2D.y, 0 ).mul( .35 )
    const fractal3D = position3D.mul( .35 )

    const unifiedOffset2D = vec2( time.mul( .35 ), time.mul( .19 ) )
    const unifiedOffset3D = vec3( time.mul( .35 ), time.mul( .19 ), time.mul( .27 ) )

    const unifiedNoise3D = ( noiseType: any, position: any, freq: any, offset: any, jitter = 1, outmin = 0, outmax = 1, clampoutput = false, octaves = 1, lacunarity = 2, diminish = .5, style = 0 ) => Fn( () => ( mx_unifiednoise3d as any )( noiseType, position, freq, offset, jitter, outmin, outmax, clampoutput, octaves, lacunarity, diminish, style ) )()

    const textileTexcoord = ( speedX: number, speedY: number ) => uv( 0 ).mul( 3 ).add( vec2( time.mul( speedX ), time.mul( speedY ) ) )

    const checkerboard = ( color1: Node<'vec3'>, color2: Node<'vec3'>, uvtiling: Node<'vec2'>, uvoffset: Node<'vec2'>, texcoord: Node<'vec2'> ) => {
      const tiledUv = sub( mul( texcoord, uvtiling ), uvoffset )
      const checkerMix = ( mx_modulo as any )( dot( floor( tiledUv ), vec2( 1, 1 ) ), float( 2 ) )
      return mix( color2, color1, checkerMix )
    }

    const hextiledCheckerboard = ( texcoord: any, {
      color1 = vec3( 1, 1, 1 ),
      color2 = vec3( 0, 0, 0 ),
      uvtiling = vec2( 4, 4 ),
      uvoffset = vec2( 0, 0 ),
      tiling = vec2( 1, 1 ),
      rotation = 0,
      rotationrange = vec2( 0, 360 ),
      scale = 0,
      scalerange = vec2( .5, 2 ),
      offset = 0,
      offsetrange = vec2( 0, 1 ),
      falloff = .5,
      falloffcontrast = .5,
      lumacoeffs = vec3( 0.2722287, 0.6740818, 0.0536895 )
    }: Record<string, any> = {} ) => {
      const tileData = ( mxHextileCoord as any )( mul( texcoord, tiling ), rotation, rotationrange, scale, scalerange, offset, offsetrange )

      const c0 = checkerboard( color1, color2, uvtiling, uvoffset, tileData.coords[ 0 ] )
      const c1 = checkerboard( color1, color2, uvtiling, uvoffset, tileData.coords[ 1 ] )
      const c2 = checkerboard( color1, color2, uvtiling, uvoffset, tileData.coords[ 2 ] )

      const luminanceWeights = mix(
        vec3( 1, 1, 1 ),
        vec3( dot( c0, lumacoeffs ), dot( c1, lumacoeffs ), dot( c2, lumacoeffs ) ),
        vec3( falloffcontrast, falloffcontrast, falloffcontrast )
      )

      const blendWeights = ( mxHextileComputeBlendWeights as any )( luminanceWeights, tileData.weights, falloff )

      return add( add( mul( element( blendWeights, 0 ), c0 ), mul( element( blendWeights, 1 ), c1 ) ), mul( element( blendWeights, 2 ), c2 ) )
    }

    const unifiednoise2d = mx_unifiednoise2d as any

    return [
      { label: [ 'Noise', '2D' ], createNode: () => mx_noise_vec3( position2D ) },
      { label: [ 'Noise', '3D' ], createNode: () => mx_noise_vec3( position3D ) },
      { label: [ 'Cellnoise', '2D' ], createNode: () => mx_cell_noise_float( position2D ) },
      { label: [ 'Cellnoise', '3D' ], createNode: () => mx_cell_noise_float( position3D ) },
      { label: [ 'Worley', '2D style 0' ], createNode: () => mx_worley_noise_float_2d( position2D, 1, 0 ) },
      { label: [ 'Worley', '3D style 0' ], createNode: () => mx_worley_noise_float_3d( position3D, 1, 0 ) },
      { label: [ 'Worley', '2D style 1' ], createNode: () => mx_worley_noise_float_2d( position2D, 1, 1 ) },
      { label: [ 'Worley', '3D style 1' ], createNode: () => mx_worley_noise_float_3d( position3D, 1, 1 ) },
      { label: [ 'Fractal', '2D' ], createNode: () => mx_fractal_noise_vec3( fractal2D ) },
      { label: [ 'Fractal', '3D' ], createNode: () => mx_fractal_noise_vec3( fractal3D ) },
      { label: [ 'Unified Perlin', '2D' ], createNode: () => unifiednoise2d( int( 0 ), position2D, vec2( 1, 1 ), unifiedOffset2D ) },
      { label: [ 'Unified Perlin', '3D' ], createNode: () => unifiedNoise3D( int( 0 ), position3D, vec3( 1, 1, 1 ), unifiedOffset3D ) },
      { label: [ 'Unified Cell', '2D' ], createNode: () => unifiednoise2d( int( 1 ), position2D, vec2( 1, 1 ), unifiedOffset2D ) },
      { label: [ 'Unified Cell', '3D' ], createNode: () => unifiedNoise3D( int( 1 ), position3D, vec3( 1, 1, 1 ), unifiedOffset3D ) },
      { label: [ 'Unified Worley', '2D style 0' ], createNode: () => unifiednoise2d( int( 2 ), position2D, vec2( 1, 1 ), unifiedOffset2D, 1, 0, 1, false, 1, 2, .5, 0 ) },
      { label: [ 'Unified Worley', '3D style 0' ], createNode: () => unifiedNoise3D( int( 2 ), position3D, vec3( 1, 1, 1 ), unifiedOffset3D, 1, 0, 1, false, 1, 2, .5, 0 ) },
      { label: [ 'Unified Worley', '2D style 1' ], createNode: () => unifiednoise2d( int( 2 ), position2D, vec2( 1, 1 ), unifiedOffset2D, 1, 0, 1, false, 1, 2, .5, 1 ) },
      { label: [ 'Unified Worley', '3D style 1' ], createNode: () => unifiedNoise3D( int( 2 ), position3D, vec3( 1, 1, 1 ), unifiedOffset3D, 1, 0, 1, false, 1, 2, .5, 1 ) },
      { label: [ 'Unified Fractal', '2D' ], createNode: () => unifiednoise2d( int( 3 ), position2D, vec2( 1, 1 ), unifiedOffset2D, 1, 0, 1, false, 3 ) },
      { label: [ 'Unified Fractal', '3D' ], createNode: () => unifiedNoise3D( int( 3 ), position3D, vec3( 1, 1, 1 ), unifiedOffset3D, 1, 0, 1, false, 3 ) },
      {
        label: [ 'Hex Tiled', 'checkerboard' ],
        createNode: () => hextiledCheckerboard( textileTexcoord( .08, .04 ), {
          color1: vec3( 1, 1, 1 ),
          color2: vec3( 0, 0, 0 ),
          uvtiling: vec2( 8, 8 ),
          tiling: vec2( 2.2, 2.2 ),
          rotation: .25,
          scale: .1,
          offset: .2,
          falloff: .35,
          falloffcontrast: .25
        } )
      }
    ]
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private createNoiseGrid( noiseExamples: NoiseExample[], geometry: BufferGeometry, font: Font, labelMaterial: Material ) {
    const columns = 7
    const spacingX = 15.5
    const spacingY = 18
    const rowOffset = ( Math.ceil( noiseExamples.length / columns ) - 1 ) * spacingY * .5
    const columnOffset = ( columns - 1 ) * spacingX * .5
    const errorMaterial = new MeshBasicMaterial( { color: 0xff3333 } )

    for ( let i = 0; i < noiseExamples.length; i ++ ) {
      const example = noiseExamples[ i ]
      const column = i % columns
      const row = Math.floor( i / columns )
      const x = column * spacingX - columnOffset
      const y = rowOffset - row * spacingY
      const labelLines = example.label.slice()

      const material = new MeshPhysicalNodeMaterial()

      try {
        material.colorNode = example.createNode() as Node<'vec3'>
      } catch ( error ) {
        console.error( `Failed to create MaterialX noise sample: ${ example.label.join( ' ' ) }`, error )
        labelLines.push( 'Failed' )
      }

      const mesh = new Mesh( geometry, material.colorNode ? material : errorMaterial )
      mesh.name = example.label.join( ' ' )
      mesh.position.set( x, y, 0 )
      this.group.add( mesh )
      this.spheres.push( mesh )

      const label = this.createLabel( labelLines, font, labelMaterial )
      label.name = `${mesh.name} Label`
      label.position.set( x, y - 7.5, 0 )
      this.group.add( label )
    }
  }

  private createLabel( lines: string[], font: Font, material: Material ) {
    const label = new Group()
    const lineHeight = 1.55
    const startY = ( lines.length - 1 ) * lineHeight * .5

    for ( let i = 0; i < lines.length; i ++ ) {
      const textGeometry = new TextGeometry( lines[ i ], {
        font: font,
        size: 1.15,
        depth: 0.02,
        curveSegments: 2
      } )

      textGeometry.computeBoundingBox()

      const boundingBox = textGeometry.boundingBox!
      const offsetX = - 0.5 * ( boundingBox.max.x - boundingBox.min.x )
      const offsetY = - 0.5 * ( boundingBox.max.y - boundingBox.min.y )

      textGeometry.translate( offsetX, offsetY, 0 )

      const textMesh = new Mesh( textGeometry, material )
      textMesh.name = lines[ i ]
      textMesh.position.y = startY - i * lineHeight
      label.add( textMesh )
    }

    return label
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const timer = time * 0.25

    this.particleLight.position.x = Math.sin( timer * 7 ) * 30
    this.particleLight.position.y = Math.cos( timer * 5 ) * 40
    this.particleLight.position.z = Math.cos( timer * 3 ) * 30

    for ( const sphere of this.spheres ) {
      sphere.rotation.y = time / PERIOD * Math.PI * 2
    }
  }
}

registerEditorGroups(MaterialxNoiseExample, {
  Hidden: ['spheres'],
})
