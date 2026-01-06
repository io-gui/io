# Io-Gui: UI Framework for Three.js

[![NPM Package][npm]][npm-url]
[![DeepScan][deepscan]][deepscan-url]
[![License][license]][license-url]

Io-Gui is a reactive web UI framework that provides a consistent reactive foundation that supports multiple architectural patterns. It takes a multi-paradigm approach because different UI problems require different architectural solutions. Io-Gui adapts its architecture to the problem domain while maintaining consistent reactive principles throughout.

Io-Gui relies on interoperable reactive **nodes** and **elements** that respond to state changes and mutations. They provide a base for a reactive architecture that combines the best aspects of declarative component-based design, with reactive and composable development patterns.

To learn about Io-Gui, read the [quick start] and the [deep dive] guide.

Stay in touch on [github], [twitter] and [bluesky].

## Development

Io-Gui has no runtime dependencies and only a few development dependencies. Aside from the typescript compiler, Io-Gui relies on minimal tooling for development, Io-Gui uses [pnpm] for package management, [vite] and [vitest] for development and testing. Using IoGui (esnext) in your project requires no compilation or build tools.

To download and develop Io-Gui locally:

```bash
git clone https://github.com/io-gui/io.git && cd io
pnpm i && pnpm dev
```

This will install dev dependencies and start the vite watch script and server.

To learn more Io-Gui development, please read [contributing guide](https://github.com/io-gui/io/blob/main/.github/CONTRIBUTING.md) and [code of conduct](https://github.com/io-gui/io/blob/main/.github/CODE_OF_CONDUCT.md), browse and submit [issues](https://github.com/io-gui/io/issues).

[npm]: https://img.shields.io/npm/v/io-core
[npm-url]: https://www.npmjs.com/package/io-core
[deepscan]: https://deepscan.io/api/teams/18863/projects/22152/branches/651706/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18863&pid=22152&bid=651706
[license]: https://img.shields.io/github/license/io-core/io
[license-url]: https://github.com/io-gui/io/blob/main/LICENSE

[github]: https://github.com/io-gui/io/
[bluesky]: https://bsky.app/profile/akirodic.com
[twitter]: https://x.com/akirodic
[pnpm]: https://pnpm.io/
[vite]: https://vite.dev/
[vitest]: https://vitest.dev/


[io-core.dev]: https://iogui.dev/io/
[index.html]: https://github.com/io-gui/io/blob/main/index.html
[quick start]: https://iogui.dev/io/#path=Docs,Quick%20Start
[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive