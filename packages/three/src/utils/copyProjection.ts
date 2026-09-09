import { OrthographicCamera, PerspectiveCamera } from 'three/webgpu'

export function copyProjection(source: PerspectiveCamera | OrthographicCamera, target: PerspectiveCamera | OrthographicCamera) {
  if (target instanceof PerspectiveCamera && source instanceof PerspectiveCamera) {
    target.fov = source.fov
    target.aspect = source.aspect
    target.focus = source.focus
    target.filmGauge = source.filmGauge
    target.filmOffset = source.filmOffset
  } else if (target instanceof OrthographicCamera && source instanceof OrthographicCamera) {
    target.left = source.left
    target.right = source.right
    target.top = source.top
    target.bottom = source.bottom
  }
  target.zoom = source.zoom
  target.near = source.near
  target.far = source.far
  if (source.view) target.view = {...source.view}
  else target.clearViewOffset()
  target.updateProjectionMatrix()
}
