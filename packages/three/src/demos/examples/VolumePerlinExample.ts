import { Mesh, NodeMaterial, Data3DTexture, RedFormat, LinearFilter, Vector3, BackSide, BoxGeometry, Texture3DNode, Node, UniformNode } from 'three/webgpu'
import { Break, If, Loop, select, bool, vec3, vec4, texture3D, uniform, Fn } from 'three/tsl'
import { RaymarchingBox } from 'three/addons/tsl/utils/Raymarching.js'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { ioNumberSlider } from '@io-gui/sliders'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'

const REFINEMENT_STEPS = 4

/** A Perlin noise volume raymarched in a box, with threshold, step count and surface refinement in the Document tab. */
@Register
export class VolumePerlinExample extends Document {
  private thresholdUniform: UniformNode<'float', number>
  private stepsUniform: UniformNode<'float', number>
  private refineUniform: UniformNode<'bool', boolean>

  @Property({type: Number, value: 0.6})
  declare threshold: number

  @Property({type: Number, value: 200})
  declare steps: number

  /** Bisects between the last two samples to find the surface crossing, instead of taking the first sample past it. */
  @Property({type: Boolean, value: true})
  declare refine: boolean

  constructor(args?: DocumentProps) {
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

    const opaqueRaymarchingTexture = Fn(({texture, steps, threshold, refine}: {texture: Texture3DNode; steps: UniformNode<'float', number>; threshold: UniformNode<'float', number>; refine: UniformNode<'bool', boolean>}) => {
      const finalColor = vec4(0).toVar()
      const positionPrev = vec3(0).toVar()
      const hasPrev = bool(false).toVar()
      RaymarchingBox(steps, ({positionRay}: {positionRay: Node<'vec3'>}) => {
        const mapValue = texture.sample(positionRay.add(0.5)).r.toVar()
        If( mapValue.greaterThan(threshold), () => {
          const surfacePos = positionRay.toVar()
          If( refine.and(hasPrev), () => {
            // The surface lies between the previous sample (below the threshold) and this one (above it).
            const p0 = positionPrev.toVar()
            const p1 = positionRay.toVar()
            Loop( REFINEMENT_STEPS, () => {
              const pm = p0.add(p1).mul(0.5).toConst()
              const dm = texture.sample(pm.add(0.5)).r.toConst()
              const isGreater = dm.greaterThan(threshold)
              p1.assign(select(isGreater, pm, p1).uniformFlow())
              p0.assign(select(isGreater, p0, pm).uniformFlow())
            })
            surfacePos.assign(p1)
          })
          const p = vec3(surfacePos).add(0.5)
          finalColor.rgb.assign(texture.normal(p).mul(0.5).add(surfacePos.mul(1.5).add(0.25)))
          finalColor.a.assign(1)
          Break()
        })
        positionPrev.assign(positionRay)
        hasPrev.assign(bool(true))
      })
      return finalColor
    })

    this.thresholdUniform = uniform(this.threshold)
    this.stepsUniform = uniform(this.steps)
    this.refineUniform = uniform(this.refine)

    const material = new NodeMaterial()
    material.colorNode = opaqueRaymarchingTexture({
      texture: texture3D( texture, null, 0 ),
      steps: this.stepsUniform,
      threshold: this.thresholdUniform,
      refine: this.refineUniform,
    })
    material.side = BackSide
    material.transparent = true

    const mesh = new Mesh( new BoxGeometry( 1, 1, 1 ), material )
    mesh.name = 'Volume'
    this.scene.add( mesh )
  }

  thresholdChanged() {
    this.thresholdUniform.value = this.threshold
  }

  stepsChanged() {
    this.stepsUniform.value = this.steps
  }

  refineChanged() {
    this.refineUniform.value = this.refine
  }
}

registerEditorConfig(VolumePerlinExample, [
  ['threshold', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['steps', ioNumberSlider({min: 0, max: 300, step: 1})]
])

registerEditorGroups(VolumePerlinExample, {
  Main: ['threshold', 'steps', 'refine'],
  // Hide all
  Hidden: [new RegExp(/^[\s\S]*$/)]
})