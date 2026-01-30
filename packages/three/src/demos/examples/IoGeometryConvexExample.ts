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
import { Register, ReactiveProperty } from '@io-gui/core'
import { ThreeApplet, IoThreeExample } from '@io-gui/three'
import { ioSplit, Split } from '@io-gui/layout'
import { ioThreeViewport } from '@io-gui/three'

@Register
export class GeometryConvexExample extends ThreeApplet {

  public group: Group

  constructor() {
    super()

    // ambient light

    this.scene.add( new AmbientLight( 0x666666 ) )

    // point light

    const light = new PointLight( 0xffffff, 3, 0, 0 )
    light.position.set( 15, 20, 30 )
    this.scene.add( light )

    // textures

    const loader = new TextureLoader()
    const spriteTexture = loader.load( 'https://threejs.org/examples/textures/sprites/disc.png' )
    spriteTexture.colorSpace = SRGBColorSpace

    this.group = new Group()
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
    this.group.add( mesh )
  }

  onAnimate() {
    this.group.rotation.y += 0.005
  }
}

@Register
export class IoGeometryConvexExample extends IoThreeExample {

  @ReactiveProperty({type: GeometryConvexExample, init: null})
  declare applet: GeometryConvexExample

  ready() {

    this.render([
      ioSplit({
        elements: [
          ioThreeViewport({id: 'Top', applet: this.applet, playing: true, cameraSelect: 'top'}),
          ioThreeViewport({id: 'Left', applet: this.applet, playing: true, cameraSelect: 'left'}),
          ioThreeViewport({id: 'Perspective', applet: this.applet, playing: true, cameraSelect: 'perspective'}),
          ioThreeViewport({id: 'SceneCamera', applet: this.applet, playing: true, cameraSelect: 'scene'}),
        ],
        split: new Split({
          type: 'split',
          orientation: 'horizontal',
          children: [
            {
              type: 'split',
              flex: '2 1 auto',
              orientation: 'vertical',
              children: [
                {
                  type: 'split',
                  flex: '1 1 50%',
                  orientation: 'horizontal',
                  children: [
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Top'}]},
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Left'}]}
                  ]
                },
                {
                  type: 'split',
                  flex: '1 1 50%',
                  orientation: 'horizontal',
                  children: [
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Perspective'}]},
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'SceneCamera'}]},
                  ]
                }
              ]
            }
          ]
        })
      })
    ])

  }

}

export const ioGeometryConvexExample = IoGeometryConvexExample.vConstructor
