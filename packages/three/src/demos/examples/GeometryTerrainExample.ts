import {
  BoxGeometry,
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  FogExp2,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

const worldWidth = 256, worldDepth = 256

/** The source replaces `Math.random` with this seeded generator for the whole page; here it stays local. */
function seededRandom() {
  let seed = Math.PI / 4
  return function () {
    const x = Math.sin( seed ++ ) * 10000
    return x - Math.floor( x )
  }
}

function generateHeight( width: number, height: number, random: () => number ) {

  const size = width * height, data = new Uint8Array( size )
  const perlin = new ImprovedNoise(), z = random() * 100

  let quality = 1

  for ( let j = 0; j < 4; j ++ ) {

    for ( let i = 0; i < size; i ++ ) {

      const x = i % width, y = ~ ~ ( i / width )
      data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 )

    }

    quality *= 5

  }

  return data

}

function generateTexture( data: Uint8Array, width: number, height: number, random: () => number ) {

  let context, image, imageData, shade

  const vector3 = new Vector3( 0, 0, 0 )

  const sun = new Vector3( 1, 1, 1 )
  sun.normalize()

  const canvas = new OffscreenCanvas( width, height )

  context = canvas.getContext( '2d' )!
  context.fillStyle = '#000'
  context.fillRect( 0, 0, width, height )

  image = context.getImageData( 0, 0, canvas.width, canvas.height )
  imageData = image.data

  for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

    vector3.x = data[ j - 2 ] - data[ j + 2 ]
    vector3.y = 2
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ]
    vector3.normalize()

    shade = vector3.dot( sun )

    imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 )
    imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 )
    imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 )

  }

  context.putImageData( image, 0, 0 )

  // Scaled 4x

  const canvasScaled = new OffscreenCanvas( width * 4, height * 4 )

  context = canvasScaled.getContext( '2d' )!
  context.scale( 4, 4 )
  context.drawImage( canvas, 0, 0 )

  image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height )
  imageData = image.data

  for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

    const v = ~ ~ ( random() * 5 )

    imageData[ i ] += v
    imageData[ i + 1 ] += v
    imageData[ i + 2 ] += v

  }

  context.putImageData( image, 0, 0 )

  return canvasScaled

}

/**
 * A 7500-unit terrain from Perlin noise, with baked shading painted on an `OffscreenCanvas`, in dense exponential fog.
 * `FirstPersonControls` are dropped: the source camera is the active camera. Whole-scene framing would stand beyond the
 * fog, so views frame what the source camera looks at. Static.
 */
@Register
export class GeometryTerrainExample extends Document {

  public mesh: Mesh<PlaneGeometry, MeshBasicMaterial>

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0xefd1b5 )
    this.scene.fog = new FogExp2( 0xefd1b5, 0.0025 )

    const random = seededRandom()
    const data = generateHeight( worldWidth, worldDepth, random )

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 10000 )
    camera.name = 'Camera'
    camera.position.set( 100, 800, - 800 )
    camera.lookAt( - 100, 810, - 800 )
    this.activeCamera = camera

    const geometry = new PlaneGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 )
    geometry.rotateX( - Math.PI / 2 )

    const vertices = geometry.attributes.position.array

    for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

      vertices[ j + 1 ] = data[ i ] * 10

    }

    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    const texture = new CanvasTexture( generateTexture( data, worldWidth, worldDepth, random ) )
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping
    texture.colorSpace = SRGBColorSpace

    this.mesh = new Mesh( geometry, new MeshBasicMaterial( { map: texture } ) )
    this.mesh.name = 'Terrain'
    this.scene.add( this.mesh )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  /**
   * Whole-scene framing would put the views far outside the terrain, where the fog hides everything: frame a detached
   * stand-in 300 units ahead of the source camera, so the views open about where it stands, once the document is on
   * screen.
   */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const focus = new Mesh( new BoxGeometry( 150, 150, 150 ) )
    focus.position.set( - 200, 810, - 800 )
    focus.updateMatrixWorld()
    this._frameTarget = focus
  }
}
