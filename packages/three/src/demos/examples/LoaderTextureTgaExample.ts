import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, SRGBColorSpace } from 'three/webgpu'
import { TGALoader } from 'three/addons/loaders/TGALoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** Two crates textured from TGA files: 8-bit grayscale and 8-bit color. */
@Register
export class LoaderTextureTgaExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 1, 5 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    const loader = new TGALoader()
    const geometry = new BoxGeometry()

    // add box 1 - grey8 texture

    const texture1 = loader.load( 'https://threejs.org/examples/textures/crate_grey8.tga', onLoad )
    texture1.colorSpace = SRGBColorSpace
    const material1 = new MeshPhongMaterial( { color: 0xffffff, map: texture1 } )

    const mesh1 = new Mesh( geometry, material1 )
    mesh1.name = 'Grey8'
    mesh1.position.x = - 1
    this.scene.add( mesh1 )

    // add box 2 - tga texture

    const texture2 = loader.load( 'https://threejs.org/examples/textures/crate_color8.tga', onLoad )
    texture2.colorSpace = SRGBColorSpace
    const material2 = new MeshPhongMaterial( { color: 0xffffff, map: texture2 } )

    const mesh2 = new Mesh( geometry, material2 )
    mesh2.name = 'Color8'
    mesh2.position.x = 1
    this.scene.add( mesh2 )

    //

    const ambientLight = new AmbientLight( 0xffffff, 1.5 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const light = new DirectionalLight( 0xffffff, 2.5 )
    light.name = 'Key'
    light.position.set( 1, 1, 1 )
    this.scene.add( light )
  }
}
