import IoMarkdownElementTest from './elements/IoMarkdown.test.js';
import IoMarkdownThemeTest from './elements/IoMarkdownTheme.test.js';

export default class {
  run() {
    new IoMarkdownElementTest().run();
    new IoMarkdownThemeTest().run();
  }
}