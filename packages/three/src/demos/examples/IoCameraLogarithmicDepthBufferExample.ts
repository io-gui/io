import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  SphereGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Register, ReactiveProperty } from '@io-gui/core'
import { ThreeApplet, IoThreeExample, ioThreeViewport } from '@io-gui/three'
import { Split, ioSplit } from '@io-gui/layout'

// 1 micrometer to 100 billion light years in one scene, with 1 unit = 1 meter
const NEAR = 1e-6
const FAR = 1e27

const labeldata = [
  { size: .01, scale: 0.0001, label: 'microscopic (1µm)' },
  { size: .01, scale: 0.1, label: 'minuscule (1mm)' },
  { size: .01, scale: 1.0, label: 'tiny (1cm)' },
  { size: 1, scale: 1.0, label: 'child-sized (1m)' },
  { size: 10, scale: 1.0, label: 'tree-sized (10m)' },
  { size: 100, scale: 1.0, label: 'building-sized (100m)' },
  { size: 1000, scale: 1.0, label: 'medium (1km)' },
  { size: 10000, scale: 1.0, label: 'city-sized (10km)' },
  { size: 3400000, scale: 1.0, label: 'moon-sized (3,400 Km)' },
  { size: 12000000, scale: 1.0, label: 'planet-sized (12,000 km)' },
  { size: 1400000000, scale: 1.0, label: 'sun-sized (1,400,000 km)' },
  { size: 7.47e12, scale: 1.0, label: 'solar system-sized (50Au)' },
  { size: 9.4605284e15, scale: 1.0, label: 'gargantuan (1 light year)' },
  { size: 3.08567758e16, scale: 1.0, label: 'ludicrous (1 parsec)' },
  { size: 1e19, scale: 1.0, label: 'mind boggling (1000 light years)' }
]

@Register
export class CameraLogarithmicDepthBufferExample extends ThreeApplet {

  public camera: PerspectiveCamera
  public zoompos = -100
  public zoomspeed = 0.015
  public minzoomspeed = 0.015
  public mouse = [0.5, 0.5]

  constructor() {
    super()

    // Create camera with extreme near/far planes
    this.camera = new PerspectiveCamera(50, 1, NEAR, FAR)
    this.scene.add(this.camera)

    // Lighting
    this.scene.add(new AmbientLight(0x777777))

    const light = new DirectionalLight(0xffffff, 3)
    light.position.set(100, 100, 100)
    this.scene.add(light)
  }

  async onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)

    try {
      const loader = new FontLoader()
      const font = await loader.loadAsync('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')

      const materialargs = {
        color: 0xffffff,
        specular: 0x050505,
        shininess: 50,
        emissive: 0x000000
      }

      const geometry = new SphereGeometry(0.5, 24, 12)

      for (let i = 0; i < labeldata.length; i++) {
        const scale = labeldata[i].scale || 1

        const labelgeo = new TextGeometry(labeldata[i].label, {
          font: font,
          size: labeldata[i].size,
          depth: labeldata[i].size / 2
        })

        labelgeo.computeBoundingSphere()
        labelgeo.translate(-labelgeo.boundingSphere!.radius, 0, 0)

        const material = new MeshPhongMaterial({
          ...materialargs,
          color: new Color().setHSL(Math.random(), 0.5, 0.5)
        })

        const group = new Group()
        group.position.z = -labeldata[i].size * scale
        this.scene.add(group)

        const textmesh = new Mesh(labelgeo, material)
        textmesh.scale.set(scale, scale, scale)
        textmesh.position.z = -labeldata[i].size * scale
        textmesh.position.y = labeldata[i].size / 4 * scale
        group.add(textmesh)

        const dotmesh = new Mesh(geometry, material)
        dotmesh.position.y = -labeldata[i].size / 4 * scale
        dotmesh.scale.multiplyScalar(labeldata[i].size * scale)
        group.add(dotmesh)
      }

      this.dispatchMutation()
    } catch (e) {
      console.error(e)
    }
  }

  onAnimate() {
    const minzoom = labeldata[0].size * labeldata[0].scale * 1
    const maxzoom = labeldata[labeldata.length - 1].size * labeldata[labeldata.length - 1].scale * 100
    let damping = (Math.abs(this.zoomspeed) > this.minzoomspeed ? 0.95 : 1.0)

    const zoom = MathUtils.clamp(Math.pow(Math.E, this.zoompos), minzoom, maxzoom)
    this.zoompos = Math.log(zoom)

    if ((zoom === minzoom && this.zoomspeed < 0) || (zoom === maxzoom && this.zoomspeed > 0)) {
      damping = 0.85
    }

    this.zoompos += this.zoomspeed
    this.zoomspeed *= damping

    this.camera.position.x = Math.sin(0.5 * Math.PI * (this.mouse[0] - 0.5)) * zoom
    this.camera.position.y = Math.sin(0.25 * Math.PI * (this.mouse[1] - 0.5)) * zoom
    this.camera.position.z = Math.cos(0.5 * Math.PI * (this.mouse[0] - 0.5)) * zoom
    this.camera.lookAt(this.scene.position)

    if (this.zoompos > 48) {this.zoompos = -100}
  }
}

@Register
export class IoCameraLogarithmicDepthBufferExample extends IoThreeExample {

  @ReactiveProperty({type: CameraLogarithmicDepthBufferExample, init: null})
  declare applet: CameraLogarithmicDepthBufferExample

  @ReactiveProperty({type: WebGPURenderer, init: {antialias: true, logarithmicDepthBuffer: true}})
  declare renderer: WebGPURenderer

  ready() {

    this.renderer.setPixelRatio(window.devicePixelRatio)
    void this.renderer.init()

    this.render([
      ioSplit({
        elements: [
          ioThreeViewport({id: 'SceneCamera', applet: this.applet, playing: true, cameraSelect: 'scene'}),
          ioThreeViewport({id: 'SceneCameraLog', applet: this.applet, playing: true, cameraSelect: 'scene', renderer: this.renderer}),
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
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'SceneCamera'}]},
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'SceneCameraLog'}]},
                  ]
                }
              ]
            },
          ]
        })
      })
    ])

  }

  dispose() {
    this.renderer.dispose()
    super.dispose()
  }

}

export const ioCameraLogarithmicDepthBufferExample = IoCameraLogarithmicDepthBufferExample.vConstructor
