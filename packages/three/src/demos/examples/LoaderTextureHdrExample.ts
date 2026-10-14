import { Mesh, MeshBasicMaterial, PlaneGeometry, ReinhardToneMapping } from 'three/webgpu'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * An HDR image from a Radiance HDR file on a plane of its aspect, Reinhard tone mapped. The source's exposure control
 * is the document's `toneMappingExposure` (Document tab); its orthographic camera is dropped.
 */
@Register
export class LoaderTextureHdrExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: 2.0, ...args})
    void this.loadTexture()
  }

  private async loadTexture() {
    try {
      const texture = await new HDRLoader().loadAsync( 'https://threejs.org/examples/textures/memorial.hdr' )
      const { width, height } = texture.image

      const material = new MeshBasicMaterial( { map: texture } )
      const quad = new PlaneGeometry( 1.5 * width / height, 1.5 )
      const mesh = new Mesh( quad, material )
      mesh.name = 'Image'
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
