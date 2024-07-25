
# Io-Gui: Experimental JavaScript Framework

[![NPM Package][npm]][npm-url]
[![DeepScan][deepscan]][deepscan-url]
[![License][license]][license-url]

> ⚠️ **WARNING!** Io-Gui is an experiment currently under development. This code is not production ready!

Io-Gui is an experimental UI framework aimed at simplicity and performance. It lets you write fast and reactive custom elements that respond to state changes, data binding events and object mutations. It can support single page applications with routing, navigation and code splitting.

The goal of this project is to provide a strong foundation for complex applications and tools such as 3D editors and demo tools for [threejs].

To learn about Io-Gui, read the [quick start] and the [deep dive] guide.

You can also check out the collection of built-in [elements].

Stay in touch on [github] and [twitter].

## Design system

Io-Gui includes a design system built with a simple and effective CSS framework. It's built-in element library includes editors for basic data types and **user input**, various types of **sliders**, **color editors**, configurable **object editors**, **menu systems**, **selectors** and **layout** elements.

## Reactive WebGL Elements

One of the unique features of Io-Gui is its ability to render custom elements using WebGL shaders. Elements that extend the `IoGl` element have the ability to render their contents using GLSL shading language. Element properties and CSS theme variables are reactively mapped to shader uniforms.  

## Development

Io-Gui has no runtime dependencies and only a few development dependencies. Aside from the typescript compiler, Io-Gui relies on very little tooling for development, linting and testing. You should be able to just type `tsc` and get started. However, for the sake of convenience, it uses [nodejs] and [yarn] to run development scripts.

To download and develop Io-Gui locally:

```bash
git clone https://github.com/io-gui/io.git && cd io
yarn && yarn dev
```

This will install dev dependencies and start the typescript watch script. You will also need to **run a static file server** of your choice.

```bash
yarn build
```

To learn more Io-Gui development, please read [contributing guide](https://github.com/io-gui/io/blob/main/.github/CONTRIBUTING.md) and [code of conduct](https://github.com/io-gui/io/blob/main/.github/CODE_OF_CONDUCT.md), browse and submit [issues](https://github.com/io-gui/io/issues).

## Documentation

The Io-Gui documentation is hosted on [io-gui.dev] via github pages from the main branch of this [github] repository. The UI of the website is created using Io-Gui and the source code is contained in [index.html]. The website content is loaded from `.md` files in the `docs/` directory and `.js` files in the `demos/` directory. The website itself is the most up-to-date reference on how to build a documentation website using Io-Gui. It also contains examples on how to use different nodes and elements.

The files in `docs/tsdoc` are a work in progress. The files are automatically generated using typedoc and typedoc-plugin-markdown plugin.

[npm]: https://img.shields.io/npm/v/io-gui
[npm-url]: https://www.npmjs.com/package/io-gui
[deepscan]: https://deepscan.io/api/teams/18863/projects/22152/branches/651706/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18863&pid=22152&bid=651706
[license]: https://img.shields.io/github/license/io-gui/io
[license-url]: https://github.com/io-gui/io/blob/main/LICENSE

[github]: https://github.com/io-gui/io/
[twitter]: https://x.com/akirodic
[threejs]: https://threejs.org
[nodejs]: https://nodejs.org
[yarn]: https://yarnpkg.com


[io-gui.dev]: https://iogui.dev/io/
[index.html]: https://github.com/io-gui/io/blob/main/index.html#L125
[quick start]: https://iogui.dev/io/#path=Docs,Quick%20Start
[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive
[elements]: https://iogui.dev/io/#path=Demos,Elements