import {
  Group,
  Mesh,
  PlaneGeometry,
  Texture,
} from 'three/webgpu'
import { DebugStateMaterial, type DebugStateTextureIndex } from './materials/DebugStateMaterial.js'

const DEBUG_PLANE_Z = 2
const PREVIEW_HEIGHT_FRACTION = 0.1

export class DebugPlanes extends Group {

  private readonly _planes: Array<Mesh<PlaneGeometry, DebugStateMaterial>>
  private readonly _planeGeometry: PlaneGeometry

  constructor(padsTexture: Texture = new Texture(), layer0Texture: Texture = new Texture(), layer1Texture: Texture = new Texture()) {
    super()
    this._planeGeometry = new PlaneGeometry(1, 1)
    this._planes = [
      this._createPlane(0, padsTexture, layer0Texture, layer1Texture),
      this._createPlane(1, padsTexture, layer0Texture, layer1Texture),
      this._createPlane(2, padsTexture, layer0Texture, layer1Texture),
    ]
    this.visible = false
  }

  update(boardWidth: number, boardHeight: number, padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture) {
    if (boardWidth < 2 || boardHeight < 2) {
      this.visible = false
      return
    }

    const segmentWidth = boardWidth - 1
    const segmentHeight = boardHeight - 1
    const boardAspect = boardWidth / boardHeight

    let planeHeight = segmentHeight * PREVIEW_HEIGHT_FRACTION
    let planeWidth = planeHeight * boardAspect
    const maxPreviewWidth = segmentWidth * 0.35

    if (planeWidth > maxPreviewWidth) {
      planeWidth = maxPreviewWidth
      planeHeight = planeWidth / boardAspect
    }

    const leftCenterX = planeWidth / 2
    const topCenterY = segmentHeight - planeHeight / 2

    for (let i = 0; i < this._planes.length; i++) {
      const plane = this._planes[i]
      plane.material.setTextures(padsTexture, layer0Texture, layer1Texture)
      plane.position.set(-leftCenterX, topCenterY - i * (planeHeight), DEBUG_PLANE_Z)
      plane.scale.set(planeWidth, planeHeight, 1)
    }

    this.visible = true
  }

  dispose() {
    for (const plane of this._planes) {
      plane.material.dispose()
    }
    this._planeGeometry.dispose()
  }

  private _createPlane(textureIndex: DebugStateTextureIndex, padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture) {
    const material = new DebugStateMaterial(padsTexture, layer0Texture, layer1Texture)
    material.setTextureIndex(textureIndex)
    const plane = new Mesh(this._planeGeometry, material)
    this.add(plane)
    return plane
  }
}
