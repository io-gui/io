// import { getEditorGroups } from '@io-gui/editors';

export default class {
  run() {
    describe('EditorGroups.test', () => {
      it('should return default groups for an object', () => {
        // const groups = getEditorGroups({
        //   _hidden: 'hidden',
        // });
        // expect(groups).to.eql({
        //   main: [],
        //   hidden: ['_hidden'],
        // });
      })
      it('should return default groups for a HTMLElement', () => {
        // const groups = getEditorGroups(document.createElement('div'));
        // expect(groups).to.eql({
        //   main: [],
        // });
        // expect(groups).to.eql({
        //   main: ['localName', 'tagName', 'nodeName', 'class'],
        //   display: ['width', 'height', 'top', 'left', 'scroll', 'style'],
        //   hierarchy: ['parent', 'child', 'element', 'root', 'slot', 'sibling', 'document'],
        // });
      })
    })
  }
}