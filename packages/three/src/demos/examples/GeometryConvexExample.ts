import {
  AmbientLight,
  BufferGeometry,
  DodecahedronGeometry,
  Group,
  InstancedBufferAttribute,
  Mesh,
  MeshLambertMaterial,
  PointLight,
  PointsNodeMaterial,
  SRGBColorSpace,
  Sprite,
  TextureLoader,
  Vector3,
  DoubleSide
} from 'three/webgpu'
import { instancedBufferAttribute, texture, float, color } from 'three/tsl'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Register } from '@io-gui/core'
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three'

/** The convex hull of a dodecahedron's vertices, drawn as points and a translucent mesh. Spins while playing; plays when opened. */
@Register
export class GeometryConvexExample extends ThreeDocument {

  public group: Group

  constructor(args?: ThreeDocumentProps) {
    super({autoplay: true, ...args})

    // ambient light

    const ambientLight = new AmbientLight( 0x666666 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // point light

    const light = new PointLight( 0xffffff, 3, 0, 0 )
    light.name = 'Point'
    light.position.set( 15, 20, 30 )
    this.scene.add( light )

    // textures

    const loader = new TextureLoader()
    // Views draw on document changes only, so report the texture when it arrives.
    const spriteTexture = loader.load( 'https://threejs.org/examples/textures/sprites/disc.png', () => this.notify({kind: 'material'}) )
    spriteTexture.colorSpace = SRGBColorSpace

    this.group = new Group()
    this.group.name = 'Convex'
    this.scene.add( this.group )

    // points

    let dodecahedronGeometry: BufferGeometry = new DodecahedronGeometry( 10 )

    // if normal and uv attributes are not removed, mergeVertices() can't consolidate identical vertices with different normal/uv data

    dodecahedronGeometry.deleteAttribute( 'normal' )
    dodecahedronGeometry.deleteAttribute( 'uv' )

    dodecahedronGeometry = BufferGeometryUtils.mergeVertices( dodecahedronGeometry )

    const vertices: Vector3[] = []
    const positionAttribute = dodecahedronGeometry.getAttribute( 'position' )

    for ( let i = 0; i < positionAttribute.count; i++ ) {

      const vertex = new Vector3()
      vertex.fromBufferAttribute( positionAttribute, i )
      vertices.push( vertex )

    }

    // Create instanced points using PointsNodeMaterial and Sprite
    const positions: number[] = []

    for ( const vertex of vertices ) {
      positions.push( vertex.x, vertex.y, vertex.z )
    }

    const positionInstancedAttribute = new InstancedBufferAttribute( new Float32Array( positions ), 3 )

    const pointsMaterial = new PointsNodeMaterial( {
      colorNode: color( 0x0080ff ).mul( texture( spriteTexture ) ),
      opacityNode: texture(spriteTexture).a,
      positionNode: instancedBufferAttribute( positionInstancedAttribute ),
      sizeNode: float( 10 ),
      sizeAttenuation: false,
      transparent: true,
      alphaTest: 0.5
    } )

    const instancedPoints = new Sprite( pointsMaterial )
    instancedPoints.name = 'Points'
    instancedPoints.count = vertices.length
    this.group.add( instancedPoints )

    // convex hull

    const meshMaterial = new MeshLambertMaterial( {
      color: 0xffffff,
      opacity: 0.5,
      side: DoubleSide,
      transparent: true
    } )

    const meshGeometry = new ConvexGeometry( vertices )

    const mesh = new Mesh( meshGeometry, meshMaterial )
    mesh.name = 'Hull'
    this.group.add( mesh )
  }

  override onAnimate() {
    this.group.rotation.y += 0.005
  }
}
