import EditorConfigTest from './utils/EditorConfig.test.js';
import EditorGroupsTest from './utils/EditorGroups.test.js';
import PropertyEditorTest from './elements/IoPropertyEditor.test.js';

export default class {
  run() {
    new EditorConfigTest().run();
    new EditorGroupsTest().run();
    new PropertyEditorTest().run();
  }
}