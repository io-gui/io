import IoMarkdownTest from './elements/IoMarkdown.test.js'
import IoMarkdownThemeTest from './elements/IoMarkdownTheme.test.js'

export default class {
  run() {
    new IoMarkdownTest().run()
    new IoMarkdownThemeTest().run()
  }
}