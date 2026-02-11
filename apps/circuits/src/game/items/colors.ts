import { Color } from 'three/webgpu'

export const COLORS = {
  white: new Color('#ffffff'),
  red: new Color('#e52800'),
  green: new Color('#005923'),
  blue: new Color('#06afff'),
  pink: new Color('#ef47cc'),
  yellow: new Color('#fec41a'),
  orange: new Color('#ff6910'),
  purple: new Color('#760281'),
}

export type ColorName = keyof typeof COLORS