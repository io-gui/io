
# Io-Gui: Experimental JavaScript Framework

[![NPM Package][npm]][npm-url]
[![Build Size][build-size]][bundlephobia-url]
[![DeepScan][deepscan]][deepscan-url]
[![License][license]][license-url]

> ⚠️ **WARNING! Io-Gui is an experiment currently under development. Please be advised that this code is not production ready and documentation is outdated!**

Io-Gui is an experimental UI framework aimed at simplicity and performance. It lets you write fast and reactive custom elements that respond to state changes, data binding events and object mutations. It can also support entire applications with routing and code splitting.

For a quick start, read about the [basic usage](https://iogui.dev/io/#path=docs:./docs/getting-started.md#usage), check out the built-in [elements](https://iogui.dev/io/#path=demos:elements) and <a href="https://github.com/io-gui/io/" target="_blank">source code</a>. Stay in touch on <a href="https://twitter.com/ioguijs" target="_blank">Twitter</a>.

## Design system

Io-Gui includes a design system built with simple and effective runtime CSS framework that supports mixins and themes. Built-in element library includes editors for basic data types and **user input**, various types of **sliders**, **color editors**, configurable **object editors**, **menu systems**, **selectors** and **layout**.

## Reactive WebGL Elements

One of the unique features of Io-Gui is its ability to render custom elements in DOM using WebGL shaders. Elements such as sliders and color editors that extend the ```IoGl``` element have the ability to render their contents using GLSL shading language.

## Development

Io-Gui has no runtime dependencies and only a few development dependencies. Aside from typescript compiler, IoGui relies on very little tooling for development and testing. In theory, you should be able to type `tsc` and off you go. But for the sake of ergonomics, it uses [yarn](yarnpkg.com) to articulate some scripts.

To install and develop Io-Gui locally:

```bash
git clone https://github.com/io-gui/io.git && cd io
yarn && yarn dev
```

This will start the typescript watch script. You will also need to **run a static file server** of your choice.

To create documentation and build bundles:

```bash
yarn docs
yarn build
```


[npm]: https://img.shields.io/npm/v/io-gui
[npm-url]: https://www.npmjs.com/package/io-gui
[build-size]: https://badgen.net/bundlephobia/minzip/io-gui
[bundlephobia-url]: https://badgen.net/bundlephobia.com/result?p=io-gui
[deepscan]: https://deepscan.io/api/teams/18863/projects/22152/branches/651706/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18863&pid=22152&bid=651706
[license]: https://img.shields.io/github/license/io-gui/io
[license-url]: https://github.com/io-gui/io/blob/main/LICENSE
