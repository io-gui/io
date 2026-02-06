import { Register, IoElement, IoElementProps, ReactiveProperty, WithBinding, div } from '@io-gui/core'
import { ioButton } from '@io-gui/inputs'
import { ioPropertyEditor } from '@io-gui/editors'
import { BufferGeometry, type NormalOrGLBufferAttributes } from 'three/webgpu'

type GeometryConstructor<T extends BufferGeometry<NormalOrGLBufferAttributes>> = new (...args: any[]) => T

export type IoBuildGeometryProps = IoElementProps & {
  value?: WithBinding<BufferGeometry<NormalOrGLBufferAttributes>>
}

@Register
export class IoBuildGeometry extends IoElement {

  @ReactiveProperty({type: Object, init: null})
  declare value: BufferGeometry<NormalOrGLBufferAttributes> | null

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > div {
        display: flex;
        flex-direction: row;
      }
      :host > div > * {
        flex: 1 1 auto;
      }
    `
  }

  constructor(args: IoBuildGeometryProps = {}) {
    super(args)
  }

  buildGeometry() {
    const geometry = this.value
    if (!geometry) return

    const parameters = (geometry as any).parameters
    if (!parameters) {
      debug: {
        console.warn('IoBuildGeometry: geometry has no parameters property')
      }
      return
    }

    const GeometryClass = geometry.constructor as GeometryConstructor<typeof geometry>
    const parameterValues = Object.values(parameters)

    const newGeometry = new GeometryClass(...parameterValues)

    geometry.copy(newGeometry as BufferGeometry)
    newGeometry.dispose()

    geometry.computeVertexNormals()

    if (geometry.index && geometry.attributes.position && geometry.attributes.normal && geometry.attributes.uv) {
      geometry.computeTangents()
    }

    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()

    this.dispatchMutation(geometry)
    this.dispatchMutation(geometry.boundingBox!)
    this.dispatchMutation(geometry.boundingSphere!)
  }

  changed() {
    const geometry = this.value
    if (!geometry) {
      this.render([])
      return
    }
    const hasParameters = geometry && (geometry as any).parameters
    const hasIndexNormalsUv = geometry.index && geometry.attributes.position && geometry.attributes.normal && geometry.attributes.uv
    this.render([
      ioPropertyEditor({
        widget: null,
        value: geometry as any,
        properties: ['parameters'],
        labeled: false,
      }),
      div([
        ioButton({
          label: 'Build',
          action: () => this.buildGeometry(),
          disabled: !hasParameters,
        }),
        ioButton({
          label: 'vtx',
          action: () => {
            geometry?.computeVertexNormals()
          },
        }),
        ioButton({
          label: 'tng',
          disabled: !hasIndexNormalsUv,
          action: () => {
            geometry?.computeTangents()
          },
        }),
        ioButton({
          label: 'bSphere',
          action: () => {
            geometry?.computeBoundingSphere()
            this.dispatchMutation(geometry!.boundingSphere!)
            this.dispatchMutation(geometry!.boundingSphere!.center!)
          },
        }),
        ioButton({
          label: 'bBox',
          action: () => {
            geometry?.computeBoundingBox()
            this.dispatchMutation(geometry!.boundingBox!.max!)
            this.dispatchMutation(geometry!.boundingBox!.min!)
          },
        }),
      ])
    ])
  }
}

export const ioBuildGeometry = function(arg0?: IoBuildGeometryProps) {
  return IoBuildGeometry.vConstructor(arg0)
}
