import { IoColorPicker } from '@io-gui/colors'
// import { expect } from 'chai';

const element = new IoColorPicker()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

export default class {
  run() {
    describe('IoColorPicker.test', () => {
    })
  }
}
