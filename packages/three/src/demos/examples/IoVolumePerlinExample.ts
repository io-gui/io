import { Mesh, NodeMaterial, Data3DTexture, RedFormat, LinearFilter, Vector3, BackSide, BoxGeometry, Texture3DNode, Node, UniformNode } from 'three/webgpu'
import { Break, If, vec3, vec4, texture3D, uniform, Fn} from 'three/tsl'
import { RaymarchingBox } from 'three/addons/tsl/utils/Raymarching.js'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'
import { Register, ReactiveProperty } from '@io-gui/core'
import { ThreeApplet, IoThreeExample, ThreeAppletProps, ioThreeViewport } from '@io-gui/three'
import { ioPropertyEditor } from '@io-gui/editors'
import { ioSplit, Split } from '@io-gui/layout'
import { ioNumberSlider } from '@io-gui/sliders'

@Register
export class VolumePerlinExample extends ThreeApplet {
  private thresholdUniform: UniformNode<number>
  private stepsUniform: UniformNode<number>

  @ReactiveProperty({type: Number, value: 0.6})
  declare threshold: number

  @ReactiveProperty({type: Number, value: 200})
  declare steps: number

  constructor(args: ThreeAppletProps) {
    super(args)

    const size = 128
    const data = new Uint8Array( size * size * size )

    let i = 0
    const perlin = new ImprovedNoise()
    const vector = new Vector3()

    for ( let z = 0; z < size; z ++ ) {
      for ( let y = 0; y < size; y ++ ) {
        for ( let x = 0; x < size; x ++ ) {
          vector.set( x, y, z ).divideScalar( size )
          const d = perlin.noise( vector.x * 6.5, vector.y * 6.5, vector.z * 6.5 )
          data[ i ++ ] = d * 128 + 128
        }
      }
    }

    const texture = new Data3DTexture( data, size, size, size )
    texture.format = RedFormat
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.unpackAlignment = 1
    texture.needsUpdate = true

    const opaqueRaymarchingTexture = Fn(({texture, steps, threshold}: {texture: Texture3DNode; steps: UniformNode<number>; threshold: UniformNode<number>}) => {
      const finalColor = vec4(0).toVar()
      RaymarchingBox(steps, ({positionRay}: {positionRay: Node}) => {
        const mapValue = texture.sample(positionRay.add(0.5)).r.toVar()
        If( mapValue.greaterThan(threshold), () => {
          const p = vec3(positionRay).add(0.5)
          finalColor.rgb.assign(texture.normal(p).mul(0.5).add(positionRay.mul(1.5).add(0.25)))
          finalColor.a.assign(1)
          Break()
        })
      })
      return finalColor
    })

    this.thresholdUniform = uniform(this.threshold)
    this.stepsUniform = uniform(this.steps)

    const material = new NodeMaterial()
    material.colorNode = opaqueRaymarchingTexture({
      texture: texture3D( texture, null, 0 ),
      steps: this.stepsUniform,
      threshold: this.thresholdUniform
    })
    material.side = BackSide
    material.transparent = true

    const mesh = new Mesh( new BoxGeometry( 1, 1, 1 ), material )
    this.scene.add( mesh )
  }

  thresholdChanged() {
    this.thresholdUniform.value = this.threshold
  }

  stepsChanged() {
    this.stepsUniform.value = this.steps
  }
}

@Register
export class IoVolumePerlinExample extends IoThreeExample {

  @ReactiveProperty({type: VolumePerlinExample, init: null})
  declare applet: VolumePerlinExample

  ready() {

    this.render([
      ioSplit({
        elements: [
          ioThreeViewport({id: 'Perspective', applet: this.applet, cameraSelect: 'perspective'}),
          ioPropertyEditor({id: 'PropertyEditor', value: this.applet,
            properties: ['threshold', 'steps'],
            config: [
              ['threshold', ioNumberSlider({min: 0, max: 1, step: 0.01})],
              ['steps', ioNumberSlider({min: 0, max: 300, step: 1})]
            ]
          })
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
                {type: 'panel',flex: '1 1 100%',tabs: [{id: 'Perspective'}]},
              ]
            },
            {
              type: 'panel',
              flex: '0 0 320px',
              tabs: [{id: 'PropertyEditor'}]
            }
          ]
        })
      })
    ])

  }

}

export const ioVolumePerlinExample = IoVolumePerlinExample.vConstructor
