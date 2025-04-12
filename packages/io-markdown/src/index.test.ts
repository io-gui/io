import IoMarkdownElementTest from './elements/IoMarkdown.test';
import IoMarkdownThemeTest from './elements/IoMarkdownTheme.test';

export default class {
  run() {
    new IoMarkdownElementTest().run();
    new IoMarkdownThemeTest().run();
  }
}