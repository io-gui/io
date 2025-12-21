import { AnyConstructor } from '../nodes/Node.js'

export const styleDecorators: WeakMap<AnyConstructor, string> = new WeakMap()

export function Style(style: string) {
  return (target: AnyConstructor) => {
    // Add the Style static property to the class
    Object.defineProperty(target, 'Style', {
      get() {
        return style
      },
      configurable: true,
      enumerable: true
    })

    // Also store in WeakMap for potential future use
    styleDecorators.set(target, style)
  }
}