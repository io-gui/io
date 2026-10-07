import { BufferGeometry, Float32BufferAttribute, Group, LineBasicNodeMaterial, LineSegments } from 'three/webgpu'
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js'

const DIVISIONS = 40

function gridGeometry() {
  const positions: number[] = []
  const half = DIVISIONS / 2
  for (let i = -half; i <= half; i++) {
    if (i === 0) continue // axes draw the center lines
    positions.push(-half, 0, i, half, 0, i, i, 0, -half, i, 0, half)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geometry
}

function axisLine(x: number, y: number, z: number, color: number) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute([-x, -y, -z, x, y, z], 3))
  const material = new LineBasicNodeMaterial({color, transparent: true, opacity: 0.8})
  return new LineSegments(geometry, material)
}

/**
 * Floor grid with colored axes. Drawn in the plane facing an axis view (XY for front/back, YZ for left/right),
 * otherwise on XZ. The spacing follows the view distance in powers of ten. Depth-tested against content.
 */
export class GridOverlay implements Overlay {

  readonly root = new Group()

  private readonly _grid: LineSegments
  private readonly _axes: Group = new Group()
  private readonly _x = axisLine(1, 0, 0, 0xd9534f)
  private readonly _y = axisLine(0, 1, 0, 0x5cb85c)
  private readonly _z = axisLine(0, 0, 1, 0x428bca)

  constructor() {
    this.root.name = 'GridOverlay'
    this._grid = new LineSegments(gridGeometry(), new LineBasicNodeMaterial({color: 0x808080, transparent: true, opacity: 0.35, depthWrite: false}))
    this._axes.add(this._x, this._y, this._z)
    this.root.add(this._grid, this._axes)
  }

  prepare(ctx: OverlayContext) {
    const nav = ctx.view.navigation
    const unit = 10 ** Math.floor(Math.log10(Math.max(nav.distance, 1e-6) / 2))
    const axis = nav.axisView
    const plane = axis === 'front' || axis === 'back' ? 'xy' : axis === 'left' || axis === 'right' ? 'yz' : 'xz'
    const grid = this._grid
    grid.scale.setScalar(unit)
    grid.rotation.set(plane === 'xy' ? Math.PI / 2 : 0, 0, plane === 'yz' ? Math.PI / 2 : 0)
    const target = nav.target
    // Snap to grid lines so the grid seems fixed in the world while it follows the view.
    const snap = (value: number) => Math.round(value / unit) * unit
    grid.position.set(plane === 'yz' ? 0 : snap(target.x), plane === 'xz' ? 0 : snap(target.y), plane === 'xy' ? 0 : snap(target.z))
    const length = unit * DIVISIONS * 50
    this._axes.scale.setScalar(length)
    this._x.visible = plane !== 'yz'
    this._y.visible = plane !== 'xz'
    this._z.visible = plane !== 'xy'
  }

  dispose() {
    this._grid.geometry.dispose()
    ;(this._grid.material as LineBasicNodeMaterial).dispose()
    for (const line of [this._x, this._y, this._z]) {
      line.geometry.dispose()
      ;(line.material as LineBasicNodeMaterial).dispose()
    }
  }
}

export const gridOverlayType: OverlayType = {
  id: 'grid',
  label: 'Grid',
  viewKinds: ['3d'],
  enabledByDefault: false,
  order: 0,
  create: () => new GridOverlay(),
}
