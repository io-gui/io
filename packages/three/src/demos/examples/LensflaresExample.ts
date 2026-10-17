import {
  BoxGeometry,
  Color,
  DirectionalLight,
  Euler,
  Fog,
  InstancedMesh,
  Matrix4,
  MeshPhongNodeMaterial,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  SRGBColorSpace,
  TextureLoader,
  Vector3
} from 'three/webgpu'
import { LensflareMesh, LensflareElement } from 'three/addons/objects/LensflareMesh.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * Three point lights with `LensflareMesh` flares among 3000 boxes spread over 16000 units. The flares are drawn in
 * screen space by each view at its own size, and hidden where the boxes occlude the lights. `FlyControls` are dropped;
 * the source camera is kept as `Camera`, inside the field looking at the lights. The boxes are one `InstancedMesh`
 * (the source adds 3000 meshes). Static.
 */
@Register
export class LensflaresExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color().setHSL( 0.51, 0.4, 0.01, SRGBColorSpace )
    this.scene.fog = new Fog( this.scene.background, 3500, 15000 )

    // world

    const s = 250

    const geometry = new BoxGeometry( s, s, s )
    const material = new MeshPhongNodeMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } )

    const count = 3000
    const boxes = new InstancedMesh( geometry, material, count )
    boxes.name = 'Boxes'

    const matrix = new Matrix4()
    const position = new Vector3()
    const rotation = new Euler()
    const quaternion = new Quaternion()
    const scale = new Vector3( 1, 1, 1 )

    for ( let i = 0; i < count; i ++ ) {
      position.x = 8000 * ( 2.0 * Math.random() - 1.0 )
      position.y = 8000 * ( 2.0 * Math.random() - 1.0 )
      position.z = 8000 * ( 2.0 * Math.random() - 1.0 )

      rotation.x = Math.random() * Math.PI
      rotation.y = Math.random() * Math.PI
      rotation.z = Math.random() * Math.PI

      boxes.setMatrixAt( i, matrix.compose( position, quaternion.setFromEuler( rotation ), scale ) )
    }

    this.scene.add( boxes )

    // lights

    const dirLight = new DirectionalLight( 0xffffff, 0.15 )
    dirLight.name = 'Directional'
    dirLight.position.set( 0, - 1, 0 ).normalize()
    dirLight.color.setHSL( 0.1, 0.7, 0.5 )
    this.scene.add( dirLight )

    // lensflares

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})

    const textureFlare0 = textureLoader.load( 'https://threejs.org/examples/textures/lensflare/lensflare0.png', onLoad )
    const textureFlare3 = textureLoader.load( 'https://threejs.org/examples/textures/lensflare/lensflare3.png', onLoad )

    textureFlare0.colorSpace = SRGBColorSpace
    textureFlare3.colorSpace = SRGBColorSpace

    const addLight = ( name: string, h: number, s: number, l: number, x: number, y: number, z: number ) => {
      const light = new PointLight( 0xffffff, 1.5, 2000, 0 )
      light.name = name
      light.color.setHSL( h, s, l )
      light.position.set( x, y, z )
      this.scene.add( light )

      const lensflare = new LensflareMesh()
      lensflare.name = 'Lensflare'
      lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) )
      lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) )
      lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) )
      lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) )
      lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) )
      light.add( lensflare )
    }

    addLight( 'Blue', 0.55, 0.95, 0.6, 5000, 0, - 1000 )
    addLight( 'Orange', 0.1, 0.85, 0.65, 0, 0, - 1000 )
    addLight( 'Red', 0.995, 0.5, 0.95, 5000, 5000, - 1000 )

    // The flares are seen from inside the field, facing the lights.
    const camera = new PerspectiveCamera( 40, 1, 1, 15000 )
    camera.name = 'Camera'
    camera.position.z = 250
    this.scene.add( camera )
  }
}
