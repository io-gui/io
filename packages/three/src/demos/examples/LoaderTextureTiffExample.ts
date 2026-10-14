import { Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three/webgpu'
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The same crate image from three TIFF files: uncompressed, LZW and JPEG compressed. No background (source: black clear). */
@Register
export class LoaderTextureTiffExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    const loader = new TIFFLoader()
    const geometry = new PlaneGeometry()

    const files: [string, string, number][] = [
      [ 'Uncompressed', 'crate_uncompressed.tif', - 1.5 ],
      [ 'LZW', 'crate_lzw.tif', 0 ],
      [ 'JPEG', 'crate_jpeg.tif', 1.5 ],
    ]

    for ( const [ name, file, x ] of files ) {
      const texture = loader.load( 'https://threejs.org/examples/textures/tiff/' + file, onLoad )
      texture.colorSpace = SRGBColorSpace

      const material = new MeshBasicMaterial( { map: texture } )
      const mesh = new Mesh( geometry, material )
      mesh.name = name
      mesh.position.set( x, 0, 0 )
      this.scene.add( mesh )
    }
  }
}
