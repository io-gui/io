//@ts-nocheck
import { Register, ReactiveElement } from '@io-gui/core'

export class IoMarkdownDemo extends ReactiveElement {
  ready() {}
}
Register(IoMarkdownDemo)
export const ioMarkdownDemo = (arg0: any) => IoMarkdownDemo.vConstructor(arg0)
