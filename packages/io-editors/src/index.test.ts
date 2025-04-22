import EditorConfigTest from './utils/EditorConfig.test';
import EditorGroupsTest from './utils/EditorGroups.test';
import PropertyEditorTest from './elements/IoPropertyEditor.test';

export default class {
  run() {
    new EditorConfigTest().run();
    new EditorGroupsTest().run();
    new PropertyEditorTest().run();
  }
}