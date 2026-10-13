import { DataArrayTexture, FileLoader, Mesh, MeshBasicNodeMaterial, Node, PlaneGeometry, RedFormat } from 'three/webgpu'
import { texture, uv, oscTriangle } from 'three/tsl'
import { unzipSync } from 'three/addons/libs/fflate.module.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one sweep through the layers and back (`oscTriangle` of time × 0.5): the timeline length. */
const PERIOD = 2

const planeWidth = 50
const planeHeight = 50

/**
 * A 256×256×109 head scan as a `DataArrayTexture` on a plane, sweeping through its layers and back with document time.
 * Plays when opened.
 */
@Register
export class Textures2dArrayExample extends Document {

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})
    void this.load()
  }

  private async load() {
    try {
      // width 256, height 256, depth 109, 8-bit, zip archived raw data
      const data = await new FileLoader()
        .setResponseType( 'arraybuffer' )
        .loadAsync( 'https://threejs.org/examples/textures/3d/head256x256x109.zip' ) as ArrayBuffer

      const zip = unzipSync( new Uint8Array( data ) )
      const array = new Uint8Array( zip[ 'head256x256x109' ].buffer )

      const map = new DataArrayTexture( array, 256, 256, 109 )
      map.format = RedFormat
      map.needsUpdate = true

      let coord: Node<'vec2'> = uv()
      coord = coord.setY( coord.y.oneMinus() ) // flip y

      let oscLayers = oscTriangle( this.timeline.timeNode.mul( .5 ) ) // [ /\/ ] triangle osc animation
      oscLayers = oscLayers.add( 1 ).mul( .5 ) // convert osc range of [ -1, 1 ] to [ 0, 1 ]
      oscLayers = oscLayers.mul( map.image.depth ) // scale osc range to texture depth

      const material = new MeshBasicNodeMaterial()
      material.colorNode = texture( map, coord ).depth( oscLayers ).r.remap( 0, 1, - .1, 1.8 ) // remap to make it more visible

      const geometry = new PlaneGeometry( planeWidth, planeHeight )

      const mesh = new Mesh( geometry, material )
      mesh.name = 'Head'
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
