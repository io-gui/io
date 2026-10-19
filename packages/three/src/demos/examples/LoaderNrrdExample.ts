import {
  BoxGeometry,
  BoxHelper,
  DirectionalLight,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera
} from 'three/webgpu'
import { NRRDLoader } from 'three/addons/loaders/NRRDLoader.js'
import { Volume } from 'three/addons/misc/Volume.js'
import { VolumeSlice } from 'three/addons/misc/VolumeSlice.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** `I.nrrd`'s RAS dimensions and value range, for the slider ranges (editor configs are per class, set before loading). */
const DIMENSIONS = [ 240, 240, 169 ]
const MAX_VALUE = 3952

/**
 * A brain MRI volume from an NRRD file, cut by three axis-aligned slices (`VolumeSlice`) inside the volume's bounding box.
 * `indexX`, `indexY` and `indexZ` move the slices; `lowerThreshold`, `upperThreshold`, `windowLow` and `windowHigh`
 * shape their gray levels (Document tab). The slices paint on canvases the addon creates. The source's camera is the active
 * camera; its trackball is dropped. Static.
 */
@Register
export class LoaderNrrdExample extends Document {

  public volume?: Volume
  private sliceX?: VolumeSlice
  private sliceY?: VolumeSlice
  private sliceZ?: VolumeSlice

  @Property({type: Number, value: Math.floor( DIMENSIONS[ 0 ] / 2 )})
  declare indexX: number

  @Property({type: Number, value: Math.floor( DIMENSIONS[ 1 ] / 2 )})
  declare indexY: number

  @Property({type: Number, value: Math.floor( DIMENSIONS[ 2 ] / 4 )})
  declare indexZ: number

  @Property({type: Number, value: 0})
  declare lowerThreshold: number

  @Property({type: Number, value: MAX_VALUE})
  declare upperThreshold: number

  @Property({type: Number, value: 0})
  declare windowLow: number

  @Property({type: Number, value: MAX_VALUE})
  declare windowHigh: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.01, 1e10 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 300 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    // light

    const hemiLight = new HemisphereLight( 0xffffff, 0x000000, 3 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    const dirLight = new DirectionalLight( 0xffffff, 1.5 )
    dirLight.name = 'Key'
    dirLight.position.set( 200, 200, 200 )
    this.scene.add( dirLight )

    void this.loadVolume()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadVolume() {
    try {
      const volume = await new NRRDLoader().loadAsync( 'https://threejs.org/examples/models/nrrd/I.nrrd' )
      this.volume = volume

      //box helper to see the extend of the volume
      const geometry = new BoxGeometry( volume.xLength, volume.yLength, volume.zLength )
      const material = new MeshBasicMaterial( { color: 0x00ff00 } )
      const cube = new Mesh( geometry, material )
      cube.name = 'Volume'
      cube.visible = false
      const box = new BoxHelper( cube )
      box.name = 'Bounds'
      box.userData.selectable = false
      this.scene.add( box )
      // NRRDLoader sets a Matrix4 (the typings say Matrix3).
      box.applyMatrix4( volume.matrix as unknown as Matrix4 )
      this.scene.add( cube )

      //z plane
      this.sliceZ = volume.extractSlice( 'z', this.indexZ )
      this.sliceZ.mesh.name = 'Slice Z'
      this.scene.add( this.sliceZ.mesh )

      //y plane
      this.sliceY = volume.extractSlice( 'y', this.indexY )
      this.sliceY.mesh.name = 'Slice Y'
      this.scene.add( this.sliceY.mesh )

      //x plane
      this.sliceX = volume.extractSlice( 'x', this.indexX )
      this.sliceX.mesh.name = 'Slice X'
      this.scene.add( this.sliceX.mesh )

      this.repaintAll()

      this.notify({kind: 'structure'})
      box.updateMatrixWorld( true )
      this._frameTarget = box
    } catch ( e ) {
      console.error( e )
    }
  }

  indexXChanged() { this.repaint( this.sliceX, this.indexX ) }
  indexYChanged() { this.repaint( this.sliceY, this.indexY ) }
  indexZChanged() { this.repaint( this.sliceZ, this.indexZ ) }

  lowerThresholdChanged() { this.repaintAll() }
  upperThresholdChanged() { this.repaintAll() }
  windowLowChanged() { this.repaintAll() }
  windowHighChanged() { this.repaintAll() }

  private repaint(slice: VolumeSlice | undefined, index: number) {
    if ( ! slice ) return
    slice.index = index
    slice.repaint()
    this.notify({kind: 'material'})
  }

  private repaintAll() {
    const volume = this.volume
    if ( ! volume ) return
    volume.lowerThreshold = this.lowerThreshold
    volume.upperThreshold = this.upperThreshold
    // Missing from the typings.
    const levels = volume as Volume & { windowLow: number; windowHigh: number }
    levels.windowLow = this.windowLow
    levels.windowHigh = this.windowHigh
    volume.repaintAllSlices()
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(LoaderNrrdExample, [
  ['indexX', ioNumberSlider({min: 0, max: DIMENSIONS[ 0 ], step: 1})],
  ['indexY', ioNumberSlider({min: 0, max: DIMENSIONS[ 1 ], step: 1})],
  ['indexZ', ioNumberSlider({min: 0, max: DIMENSIONS[ 2 ], step: 1})],
  ['lowerThreshold', ioNumberSlider({min: 0, max: MAX_VALUE, step: 1})],
  ['upperThreshold', ioNumberSlider({min: 0, max: MAX_VALUE, step: 1})],
  ['windowLow', ioNumberSlider({min: 0, max: MAX_VALUE, step: 1})],
  ['windowHigh', ioNumberSlider({min: 0, max: MAX_VALUE, step: 1})],
])

registerEditorGroups(LoaderNrrdExample, {
  Main: ['indexX', 'indexY', 'indexZ', 'lowerThreshold', 'upperThreshold', 'windowLow', 'windowHigh'],
  Hidden: ['volume', 'sliceX', 'sliceY', 'sliceZ'],
})
