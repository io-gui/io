
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

You will need tools [git](https://github.com/git-guides/install-git), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) in order to run commmands mentioned below. To install and develop Io-Gui locally:

```bash
git clone https://github.com/io-gui/io.git && cd io
yarn && yarn dev
```

This will start the typescript watch script. From this point rest of the dependencies will be present within folder [node_modules](node_modules). You will also need to **run a static web server** of your choice.

To create documentation:

```bash
yarn docs
```

To create build bundles and remove some of the unessery build data:

```bash
yarn build
yarn clean
```

To check code:

```bash
yarn lint
```

While writing the code often it is usefull to check the code, clean build files, and watch input files. You can do that with:

```bash
yarn dev
```

As you know yarn reads configration file [package.json](package.json), and more details about mentioned yarn commands can be found there. 


[npm]: https://img.shields.io/npm/v/io-gui
[npm-url]: https://www.npmjs.com/package/io-gui
[build-size]: https://badgen.net/bundlephobia/minzip/io-gui
[bundlephobia-url]: https://badgen.net/bundlephobia.com/result?p=io-gui
[deepscan]: https://deepscan.io/api/teams/18863/projects/22152/branches/651706/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=18863&pid=22152&bid=651706
[license]: https://img.shields.io/github/license/io-gui/io
[license-url]: https://github.com/io-gui/io/blob/main/LICENSE
