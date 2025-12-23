# Io-Gui: UI Framework for JavaScript

[![NPM Package][npm]][npm-url]
[![DeepScan][deepscan]][deepscan-url]
[![License][license]][license-url]

Io-Gui is a reactive web UI framework that provides a consistent reactive foundation that supports multiple architectural patterns. It takes a multi-paradigm approach because different UI problems require different architectural solutions. Io-Gui adapts its architecture to the problem domain while maintaining consistent reactive principles throughout.

Io-Gui relies on interoperable reactive **nodes** and **elements** that respond to state changes and mutations. They provide a base for a reactive architecture that combines the best aspects of declarative component-based design, with reactive and composable development patterns.

To learn about Io-Gui, read the [quick start] and the [deep dive] guide.

Stay in touch on [github] and [bluesky].

## Development

Io-Gui has no runtime dependencies and only a few development dependencies. Aside from the typescript compiler, Io-Gui relies on minimal tooling for development, linting and testing. You should be able to just type `tsc` and get started. However, for the sake of convenience, it uses [pnpm] to run a few development scripts. Using IoGui (esnext) in your project requires no compilation or build tools.

To download and develop Io-Gui locally:

```bash
git clone https://github.com/io-gui/io.git && cd io
pnpm i && pnpm dev:core
```

This will install dev dependencies and start the typescript watch script. You will also need to run `pnpm serve` to run @web/dev-server. Or you can run any other web server of your choice.

To learn more Io-Gui development, please read [contributing guide](https://github.com/io-gui/io/blob/main/.github/CONTRIBUTING.md) and [code of conduct](https://github.com/io-gui/io/blob/main/.github/CODE_OF_CONDUCT.md), browse and submit [issues](https://github.com/io-gui/io/issues).

[npm]: https://img.shields.io/npm/v/io-core
[npm-url]: https://www.npmjs.com/package/io-core
[deepscan]: https://deepscan.io/api/teams/18863/projects/22152/branches/651706/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18863&pid=22152&bid=651706
[license]: https://img.shields.io/github/license/io-core/io
[license-url]: https://github.com/io-gui/io/blob/main/LICENSE

[github]: https://github.com/io-gui/io/
[bluesky]: https://bsky.app/profile/akirodic.com
[pnpm]: https://pnpm.io/


[io-core.dev]: https://iogui.dev/io/
[index.html]: https://github.com/io-gui/io/blob/main/index.html
[quick start]: https://iogui.dev/io/#path=Docs,Quick%20Start
[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive