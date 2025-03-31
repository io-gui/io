import { Register, IoElement } from 'io-gui';

export class IoMarkdownDemo extends IoElement {
  init() {}
}
Register(IoMarkdownDemo);

export const ioMarkdownDemo = IoMarkdownDemo._vDOMFactory;
