import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

const worldWidth = 128, worldDepth = 128
const worldHalfWidth = worldWidth / 2
const worldHalfDepth = worldDepth / 2

function generateHeight( width: number, height: number ) {

  const data: number[] = [], perlin = new ImprovedNoise(),
    size = width * height, z = Math.random() * 100

  let quality = 2

  for ( let j = 0; j < 4; j ++ ) {

    if ( j === 0 ) for ( let i = 0; i < size; i ++ ) data[ i ] = 0

    for ( let i = 0; i < size; i ++ ) {

      const x = i % width, y = ( i / width ) | 0
      data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality

    }

    quality *= 4

  }

  return data

}

/**
 * A 128 × 128 block terrain from Perlin noise, merged into one mesh of only the visible block faces and textured from a
 * Minecraft atlas. `FirstPersonControls` are dropped: the source camera is the active camera, standing above the middle of
 * the world. Static.
 */
@Register
export class GeometryMinecraftExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const data = generateHeight( worldWidth, worldDepth )

    const getY = ( x: number, z: number ) => {

      return ( data[ x + z * worldWidth ] * 0.15 ) | 0

    }

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 20000 )
    camera.name = 'Camera'
    camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100
    this.activeCamera = camera

    this.scene.background = new Color( 0xbfd1e5 )

    // sides

    const matrix = new Matrix4()

    const pxGeometry = new PlaneGeometry( 100, 100 )
    pxGeometry.attributes.uv.array[ 1 ] = 0.5
    pxGeometry.attributes.uv.array[ 3 ] = 0.5
    pxGeometry.rotateY( Math.PI / 2 )
    pxGeometry.translate( 50, 0, 0 )

    const nxGeometry = new PlaneGeometry( 100, 100 )
    nxGeometry.attributes.uv.array[ 1 ] = 0.5
    nxGeometry.attributes.uv.array[ 3 ] = 0.5
    nxGeometry.rotateY( - Math.PI / 2 )
    nxGeometry.translate( - 50, 0, 0 )

    const pyGeometry = new PlaneGeometry( 100, 100 )
    pyGeometry.attributes.uv.array[ 5 ] = 0.5
    pyGeometry.attributes.uv.array[ 7 ] = 0.5
    pyGeometry.rotateX( - Math.PI / 2 )
    pyGeometry.translate( 0, 50, 0 )

    const pzGeometry = new PlaneGeometry( 100, 100 )
    pzGeometry.attributes.uv.array[ 1 ] = 0.5
    pzGeometry.attributes.uv.array[ 3 ] = 0.5
    pzGeometry.translate( 0, 0, 50 )

    const nzGeometry = new PlaneGeometry( 100, 100 )
    nzGeometry.attributes.uv.array[ 1 ] = 0.5
    nzGeometry.attributes.uv.array[ 3 ] = 0.5
    nzGeometry.rotateY( Math.PI )
    nzGeometry.translate( 0, 0, - 50 )

    //

    const geometries: BufferGeometry[] = []

    for ( let z = 0; z < worldDepth; z ++ ) {

      for ( let x = 0; x < worldWidth; x ++ ) {

        const h = getY( x, z )

        matrix.makeTranslation(
          x * 100 - worldHalfWidth * 100,
          h * 100,
          z * 100 - worldHalfDepth * 100
        )

        const px = getY( x + 1, z )
        const nx = getY( x - 1, z )
        const pz = getY( x, z + 1 )
        const nz = getY( x, z - 1 )

        geometries.push( pyGeometry.clone().applyMatrix4( matrix ) )

        if ( ( px !== h && px !== h + 1 ) || x === 0 ) {

          geometries.push( pxGeometry.clone().applyMatrix4( matrix ) )

        }

        if ( ( nx !== h && nx !== h + 1 ) || x === worldWidth - 1 ) {

          geometries.push( nxGeometry.clone().applyMatrix4( matrix ) )

        }

        if ( ( pz !== h && pz !== h + 1 ) || z === worldDepth - 1 ) {

          geometries.push( pzGeometry.clone().applyMatrix4( matrix ) )

        }

        if ( ( nz !== h && nz !== h + 1 ) || z === 0 ) {

          geometries.push( nzGeometry.clone().applyMatrix4( matrix ) )

        }

      }

    }

    const geometry = BufferGeometryUtils.mergeGeometries( geometries )
    geometry.computeBoundingSphere()

    // Views draw on document changes only, so report the texture when it arrives.
    const texture = new TextureLoader().load( 'https://threejs.org/examples/textures/minecraft/atlas.png', () => this.notify({kind: 'material'}) )
    texture.colorSpace = SRGBColorSpace
    texture.magFilter = NearestFilter

    const mesh = new Mesh( geometry, new MeshLambertMaterial( { map: texture, side: DoubleSide } ) )
    mesh.name = 'World'
    this.scene.add( mesh )

    const ambientLight = new AmbientLight( 0xeeeeee, 3 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffffff, 12 )
    directionalLight.name = 'Sun'
    directionalLight.position.set( 1, 1, 0.5 ).normalize()
    this.scene.add( directionalLight )
  }
}
