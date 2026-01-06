import { Register, IoElement, IoElementProps, ReactiveProperty, WithBinding } from '@io-gui/core'
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
    geometry.computeTangents()
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()

    this.dispatchMutation(geometry)
    this.dispatchMutation(geometry.boundingBox!)
    this.dispatchMutation(geometry.boundingSphere!)
  }

  changed() {
    const hasParameters = this.value && (this.value as any).parameters
    this.render([
      ioPropertyEditor({
        value: this.value as any,
        properties: ['parameters'],
        labeled: false,
      }),
      ioButton({
        label: 'Build Geometry',
        action: () => this.buildGeometry(),
        disabled: !hasParameters,
      }),
      ioButton({
        label: 'Compute Vertex Normals',
        action: () => {
          this.value?.computeVertexNormals()
        },
      }),
      ioButton({
        label: 'Compute Tangents',
        action: () => {
          this.value?.computeTangents()
        },
      }),
      ioButton({
        label: 'Compute Bounding Sphere',
        action: () => {
          this.value?.computeBoundingSphere()
          this.dispatchMutation(this.value!.boundingSphere!)
          this.dispatchMutation(this.value!.boundingSphere!.center!)
        },
      }),
      ioButton({
        label: 'Compute Bounding Box',
        action: () => {
          this.value?.computeBoundingBox()
          this.dispatchMutation(this.value!.boundingBox!.max!)
          this.dispatchMutation(this.value!.boundingBox!.min!)
        },
      }),
    ])
  }
}

export const ioBuildGeometry = function(arg0?: IoBuildGeometryProps) {
  return IoBuildGeometry.vConstructor(arg0)
}
