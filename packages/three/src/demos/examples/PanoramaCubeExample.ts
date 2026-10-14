import { BoxGeometry, ImageLoader, Mesh, MeshBasicMaterial, PerspectiveCamera, SRGBColorSpace, Texture } from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * A skybox: a unit box seen from inside, its six faces cut from one image strip (with `createImageBitmap` instead of a
 * DOM canvas). The panorama shows through the source's camera at its center, kept as the scene camera `Camera`; other
 * views see the box from outside. The box is scenery (unselectable).
 */
@Register
export class PanoramaCubeExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 90, 1, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.z = 0.01
    this.scene.add( camera )

    const textures = this.getTexturesFromAtlasFile( 'https://threejs.org/examples/textures/cube/sun_temple_stripe.jpg', 6 )

    const materials = []

    for ( let i = 0; i < 6; i ++ ) {
      materials.push( new MeshBasicMaterial( { map: textures[ i ] } ) )
    }

    const skyBox = new Mesh( new BoxGeometry( 1, 1, 1 ), materials )
    skyBox.name = 'SkyBox'
    skyBox.geometry.scale( 1, 1, - 1 )
    skyBox.userData.selectable = false
    this.scene.add( skyBox )
  }

  private getTexturesFromAtlasFile(atlasImgUrl: string, tilesNum: number) {
    const textures: Texture[] = []

    for ( let i = 0; i < tilesNum; i ++ ) {
      textures[ i ] = new Texture()
    }

    void ( async () => {
      try {
        const image = await new ImageLoader().loadAsync( atlasImgUrl )
        const tileWidth = image.height

        await Promise.all( textures.map( async ( texture, i ) => {
          texture.colorSpace = SRGBColorSpace
          texture.image = await createImageBitmap( image, tileWidth * i, 0, tileWidth, tileWidth )
          texture.needsUpdate = true
        } ) )

        // Views draw on document changes only, so report the faces when they arrive.
        this.notify({kind: 'material'})
      } catch ( e ) {
        console.error( e )
      }
    } )()

    return textures
  }
}
