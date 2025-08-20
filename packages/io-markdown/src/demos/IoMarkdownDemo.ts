//@ts-nocheck
import { Register, IoElement } from 'io-gui';

export class IoMarkdownDemo extends IoElement {
  ready() {}
}
Register(IoMarkdownDemo);
export const ioMarkdownDemo = IoMarkdownDemo.vConstructor;
