
# Io-Gui: Experimental JavaScript Framework

[![NPM Package][npm]][npm-url]
[![DeepScan][deepscan]][deepscan-url]
[![License][license]][license-url]

> ⚠️ **WARNING! Io-Gui is an experiment currently under development. Please be advised that this code is not production ready and documentation is outdated!**

Io-Gui is an experimental UI framework aimed at simplicity and performance. It lets you write fast and reactive custom elements that respond to state changes, data binding events and object mutations. It can also support entire applications with routing and code splitting.

The goal of this project is to provide a solid fundation for complex applications and tools such as 3D editors and debug tools for [threejs](https://threejs.org).

For a quick start, read about the [basic usage](https://iogui.dev/io/#path=docs,./docs/getting-started.md#usage), check out the built-in [elements](https://iogui.dev/io/#path=demos,elements) and <a href="https://github.com/io-gui/io/" target="_blank">source code</a>. Stay in touch on <a href="https://mastodon.gamedev.place/web/@aki" target="_blank">Mastodon</a>.

## Design system

Io-Gui includes a design system built with simple and effective runtime CSS framework that supports mixins and themes. Built-in element library includes editors for basic data types and **user input**, various types of **sliders**, **color editors**, configurable **object editors**, **menu systems**, **selectors** and **layout** elements.

## Reactive WebGL Elements

One of the unique features of Io-Gui is its ability to render custom elements in DOM using WebGL shaders. Elements such as sliders and color editors that extend the ```IoGl``` element have the ability to render their contents using GLSL shading language. Element properties and CSS theme variables are automatically mapped to shader uniforms.  

## Development

Io-Gui has no runtime dependencies and only a few development dependencies. Aside from typescript compiler, IoGui relies on very little tooling for development, linting and testing. In theory, you should be able to type `tsc` and off you go. But for the sake of ergonomics, it uses [nodejs](nodejs.org) and [yarn](yarnpkg.com) to run development scripts.

To download and develop Io-Gui locally:

```bash
git clone https://github.com/io-gui/io.git && cd io
yarn && yarn dev
```

This will install dev dependencies and start the typescript watch script. You will also need to **run a static file server** of your choice.

```bash
yarn build
```

To learn more about development setup read [contributing guide](https://github.com/io-gui/io/blob/main/.github/CONTRIBUTING.md).

To contribute to this project please read [code of conduct](https://github.com/io-gui/io/blob/main/.github/CODE_OF_CONDUCT.md), browse and submit [issues](https://github.com/io-gui/io/issues).

[npm]: https://img.shields.io/npm/v/io-gui
[npm-url]: https://www.npmjs.com/package/io-gui
[deepscan]: https://deepscan.io/api/teams/18863/projects/22152/branches/651706/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18863&pid=22152&bid=651706
[license]: https://img.shields.io/github/license/io-gui/io
[license-url]: https://github.com/io-gui/io/blob/main/LICENSE
