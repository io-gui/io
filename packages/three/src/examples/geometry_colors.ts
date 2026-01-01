import {
  BufferAttribute,
  CanvasTexture,
  Color,
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  SRGBColorSpace
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { ThreeApplet } from '@io-gui/three'

@Register
export class GeometryColorsExample extends ThreeApplet {

  constructor() {
    super()

    this.scene.background = new Color( 0xffffff )

    const light = new DirectionalLight( 0xffffff, 3 )
    light.position.set( 0, 0, 1 )
    this.scene.add( light )

    // shadow

    const canvas = document.createElement( 'canvas' )
    canvas.width = 128
    canvas.height = 128

    const context = canvas.getContext( '2d' )!
    const gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 )
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' )
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' )

    context.fillStyle = gradient
    context.fillRect( 0, 0, canvas.width, canvas.height )

    const shadowTexture = new CanvasTexture( canvas )

    const shadowMaterial = new MeshBasicMaterial( { map: shadowTexture } )
    const shadowGeo = new PlaneGeometry( 300, 300, 1, 1 )

    let shadowMesh

    shadowMesh = new Mesh( shadowGeo, shadowMaterial )
    shadowMesh.position.y = -250
    shadowMesh.rotation.x = -Math.PI / 2
    this.scene.add( shadowMesh )

    shadowMesh = new Mesh( shadowGeo, shadowMaterial )
    shadowMesh.position.y = -250
    shadowMesh.position.x = -400
    shadowMesh.rotation.x = -Math.PI / 2
    this.scene.add( shadowMesh )

    shadowMesh = new Mesh( shadowGeo, shadowMaterial )
    shadowMesh.position.y = -250
    shadowMesh.position.x = 400
    shadowMesh.rotation.x = -Math.PI / 2
    this.scene.add( shadowMesh )

    const radius = 200

    const geometry1 = new IcosahedronGeometry( radius, 1 )

    const count = geometry1.attributes.position.count
    // Note: Original uses Float16Array if available, but WebGPU requires stride to be multiple of 4 bytes
    // Float16 × 3 = 6 bytes which is invalid, so we always use Float32Array for WebGPU compatibility
    geometry1.setAttribute( 'color', new BufferAttribute( new Float32Array( count * 3 ), 3 ) )

    const geometry2 = geometry1.clone()
    const geometry3 = geometry1.clone()

    const color = new Color()
    const positions1 = geometry1.attributes.position
    const positions2 = geometry2.attributes.position
    const positions3 = geometry3.attributes.position
    const colors1 = geometry1.attributes.color
    const colors2 = geometry2.attributes.color
    const colors3 = geometry3.attributes.color

    for ( let i = 0; i < count; i++ ) {

      color.setHSL( ( positions1.getY( i ) / radius + 1 ) / 2, 1.0, 0.5, SRGBColorSpace )
      colors1.setXYZ( i, color.r, color.g, color.b )

      color.setHSL( 0, ( positions2.getY( i ) / radius + 1 ) / 2, 0.5, SRGBColorSpace )
      colors2.setXYZ( i, color.r, color.g, color.b )

      color.setRGB( 1, 0.8 - ( positions3.getY( i ) / radius + 1 ) / 2, 0, SRGBColorSpace )
      colors3.setXYZ( i, color.r, color.g, color.b )

    }

    const material = new MeshPhongMaterial( {
      color: 0xffffff,
      flatShading: true,
      vertexColors: true,
      shininess: 0
    } )

    const wireframeMaterial = new MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } )

    let mesh = new Mesh( geometry1, material )
    let wireframe = new Mesh( geometry1, wireframeMaterial )
    mesh.add( wireframe )
    mesh.position.x = -400
    mesh.rotation.x = -1.87
    this.scene.add( mesh )

    mesh = new Mesh( geometry2, material )
    wireframe = new Mesh( geometry2, wireframeMaterial )
    mesh.add( wireframe )
    mesh.position.x = 400
    this.scene.add( mesh )

    mesh = new Mesh( geometry3, material )
    wireframe = new Mesh( geometry3, wireframeMaterial )
    mesh.add( wireframe )
    this.scene.add( mesh )
  }
}
