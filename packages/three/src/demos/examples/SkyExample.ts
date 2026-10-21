import {
  ACESFilmicToneMapping,
  CubeCamera,
  CubeRenderTarget,
  HalfFloatType,
  MathUtils,
  Mesh,
  MeshBasicNodeMaterial,
  PerspectiveCamera,
  SphereGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { overrideNode, time } from 'three/tsl'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. The clouds drift without repeating, so they jump at the wrap. */
const DURATION = 60

/**
 * A mirror sphere under a `SkyMesh` sky with clouds: a `CubeCamera` captures the sky around the sphere before each
 * draw (`onBeforeDraw`), so sky edits show in the reflection too. Sky and sun controls are in the Document tab, the
 * clouds in Clouds; the source's `exposure` is the document's exposure (Rendering). The clouds drift on the timeline
 * (the source drifts them on TSL's global `time`). Plays when opened.
 */
@Register
export class SkyExample extends Document {

  @Property({type: Number, value: 10})
  declare turbidity: number

  @Property({type: Number, value: 3})
  declare rayleigh: number

  @Property({type: Number, value: 0.005})
  declare mieCoefficient: number

  @Property({type: Number, value: 0.7})
  declare mieDirectionalG: number

  @Property({type: Number, value: 65})
  declare elevation: number

  @Property({type: Number, value: 0})
  declare azimuth: number

  @Property({type: Boolean, value: true})
  declare showSunDisc: boolean

  @Property({type: Number, value: 0.4})
  declare cloudCoverage: number

  @Property({type: Number, value: 0.4})
  declare cloudDensity: number

  @Property({type: Number, value: 0.5})
  declare cloudElevation: number

  public sky: SkyMesh
  public sphere: Mesh<SphereGeometry, MeshBasicNodeMaterial>
  private cubeCamera: CubeCamera

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.05,
      timeline: new Timeline({autoplay: true, duration: DURATION}),
      ...args,
    })

    const camera = new PerspectiveCamera( 60, 400 / 250, 100, 2000000 )
    camera.name = 'Camera'
    camera.position.set( 0, 100, 2000 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.sky = new SkyMesh()
    this.sky.name = 'Sky'
    this.sky.scale.setScalar( 450000 )
    this.sky.material.contextNode = overrideNode( time, this.timeline.timeNode )
    this.sky.userData.selectable = false
    this.scene.add( this.sky )

    const cubeRenderTarget = new CubeRenderTarget( 256, { type: HalfFloatType } )
    this.cubeCamera = new CubeCamera( 1, 1000, cubeRenderTarget )

    this.sphere = new Mesh(
      new SphereGeometry( 400, 64, 32 ),
      new MeshBasicNodeMaterial( { envMap: cubeRenderTarget.texture } )
    )
    this.sphere.name = 'Sphere'
    this.scene.add( this.sphere )

    this.updateSky()
  }

  /** The sky dwarfs the sphere. */
  override getEditorFrameTarget() {
    return this.sphere
  }

  turbidityChanged() { this.updateSky() }
  rayleighChanged() { this.updateSky() }
  mieCoefficientChanged() { this.updateSky() }
  mieDirectionalGChanged() { this.updateSky() }
  elevationChanged() { this.updateSky() }
  azimuthChanged() { this.updateSky() }
  showSunDiscChanged() { this.updateSky() }
  cloudCoverageChanged() { this.updateSky() }
  cloudDensityChanged() { this.updateSky() }
  cloudElevationChanged() { this.updateSky() }

  private updateSky() {
    const sky = this.sky
    if ( ! sky ) return

    sky.turbidity.value = this.turbidity
    sky.rayleigh.value = this.rayleigh
    sky.mieCoefficient.value = this.mieCoefficient
    sky.mieDirectionalG.value = this.mieDirectionalG
    sky.cloudCoverage.value = this.cloudCoverage
    sky.cloudDensity.value = this.cloudDensity
    sky.cloudElevation.value = this.cloudElevation
    sky.showSunDisc.value = this.showSunDisc

    const phi = MathUtils.degToRad( 90 - this.elevation )
    const theta = MathUtils.degToRad( this.azimuth )

    sky.sunPosition.value.setFromSphericalCoords( 1, phi, theta )
  }

  /** Captures the sky around the sphere, without it: on every change, so sky edits and drifting clouds show. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    const material = this.sphere.material
    const visible = material.visible

    material.visible = false

    this.cubeCamera.update( renderer, this.scene )

    material.visible = visible
  }
}

registerEditorConfig(SkyExample, [
  ['turbidity', ioNumberSlider({min: 0, max: 20, step: 0.1})],
  ['rayleigh', ioNumberSlider({min: 0, max: 4, step: 0.001})],
  ['mieCoefficient', ioNumberSlider({min: 0, max: 0.1, step: 0.001})],
  ['mieDirectionalG', ioNumberSlider({min: 0, max: 1, step: 0.001})],
  ['elevation', ioNumberSlider({min: 0, max: 90, step: 0.1})],
  ['azimuth', ioNumberSlider({min: - 180, max: 180, step: 0.1})],
  ['cloudCoverage', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['cloudDensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['cloudElevation', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(SkyExample, {
  Main: ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG', 'elevation', 'azimuth', 'showSunDisc'],
  Clouds: ['cloudCoverage', 'cloudDensity', 'cloudElevation'],
  Hidden: ['sky', 'sphere', 'cubeCamera'],
})
