//@ts-nocheck
import { Register, IoElement } from 'io-core'

export class IoMarkdownDemo extends IoElement {
  ready() {}
}
Register(IoMarkdownDemo)
export const ioMarkdownDemo = IoMarkdownDemo.vConstructor
