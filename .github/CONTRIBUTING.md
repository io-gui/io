# Contributing to Io-Gui

## Introduction

Io-Gui is organized as a monorepo with packages for different UI components and functionality.

This guide assumes you have basic knowledge of TypeScript, HTML, CSS, and Git. If you need help getting started with Git, check out [GitHub's Git guide](https://help.github.com/en/github/using-git), and for Node.js, see the [Node.js getting started guide](https://nodejs.org/en/docs/guides/getting-started-guide/).

## Prerequisites

* Install [Git](https://git-scm.com/)
* Install [Node.js](https://nodejs.org/) (version 20 or higher recommended)
* Install [pnpm](https://pnpm.io/installation) (the project uses pnpm as package manager)

## Getting Started

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) the Io-Gui repository
2. Clone your forked repository:
   ```bash
   git clone https://github.com/[yourgithubname]/io.git
   cd io
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start development mode:
   ```bash
   pnpm dev
   ```

## Project Structure

Io-Gui is organized as a monorepo with the following packages:

- **io-core** - Core framework (ReactiveObject, ReactiveElement, bindings, event system, Storage, Theme)
- **io-colors** - Color components and utilities
- **io-icons** - Icon component and default iconset
- **io-inputs** - Input components (buttons, fields, switches)
- **io-layout** - Layout components (panels, tabs, splits)
- **io-editors** - Universal property editors
- **io-markdown** - Markdown rendering component
- **io-menus** - Menu components and rich domain models
- **io-navigation** - Navigation and selection components
- **io-sliders** - Slider components
- **io-three** - Three.js UI components and configurations

## Development Commands

### Essential Commands
- `pnpm dev` - Start Vite dev server and TypeScript watch mode (`tsc -b -w`) in parallel
- `pnpm build` - Build all packages
- `pnpm bundle` - Bundle all packages with Rollup
- `pnpm lint` - Lint all packages (auto-fixes)
- `pnpm test` - Run tests with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm bench` - Run all `*.bench.ts` benchmarks (Node); writes `benchmarks/results.json`. First run shows absolute numbers; later runs compare against the previous local run in the terminal. Optionally attach `benchmarks/results.json` to performance PRs.
- `pnpm clean` - Clean all build directories

## Development Workflow

### Making Changes
1. Create a new branch from the main branch:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/your-feature-name
  ```

2. Run development server:
  ```bash
  pnpm dev
  ```

3. Make your changes in the appropriate package(s) under `/packages/*/src/`

4. Test your changes:
  ```bash
  pnpm test
  pnpm lint
  ```

5. Build to ensure everything compiles correctly:
  ```bash
  pnpm bundle
  ```

6. Commit your changes under `/packages/*/src/`. Do not commit the build `/packages/*/dist/`

## Code Style Guidelines

### Code Style
- Code should require minimal documentation: "Code is documentation"
- Use clear, descriptive, and easy-to-read variable/property names
- Follow existing code style and linting patterns
- Minimal Tooling: Avoid complex tools and processes
- Use the Platform: Rely on native web features
- Don't add dependencies

### TypeScript Patterns
- Use decorators (`@Register`, `@Property`, `@Field`)
- Strong typing with interfaces and type definitions
- Avoid using `any` whenever possible
- Import modules with `.js` extensions if they are in the same package e.g. `import { ReactiveObject } from '../nodes/ReactiveObject.js'`
- Import modules from other package using scoped package name instead e.g. `import { ReactiveElement } from '@io-gui/core'`
- Virtual DOM factories for Elements are lower-cased. e.g. `ioMarkdown` is a virtual DOM factory for `IoMarkdown` element.

### Defining New Components
- Elements extend `ReactiveElement`
- Objects (non-DOM) extend `ReactiveObject`
- Objects and elements require registration using `Register(IoClassConstructor)` or `@Register` decorator
- CSS styles defined in static `static get Style()` string
- CSS selectors have to start with `:host` selector which represents the host element
- Reactive properties defined in static `static get Properties()` object or `@Property` decorators
- Non-reactive fields defined in static `static get Fields()` object or `@Field` decorators
- Objects and elements share one reactive graph (`_parents`/`_children`), wired by node-valued properties, `NodeArray` items, or explicit `addParent`/`removeParent`. This graph is independent of DOM placement, so a non-DOM model can parent and propagate to an element across the object/element boundary. Events and `io-mutation` bubble through this graph (and, for elements, the DOM tree) with a `visited` set that keeps multi-parent graphs and cycles loop-safe. See the deep dive's "Cross-Domain Reactivity" section before changing parenting or event propagation.

### Runtime Type Checking
- Use `debug: {}` labeled scoped blocks to write runtime debug code such as type checking etc
- Debug code should not alter the state in any way
- Debug code should display errors when encounters a breaking state
- Debug code should display warnings when encounters a non-breaking states
- Bundled build does not include debug blocks

### Styling
- Element's tagName is the primary CSS selector. It is defined as `:host` selector in element's source Style
- Properties reflected to attributes can be used to bridge property values to CSS state-selectors
- ThemeSingleton manages top-level CSS variables and can have multiple themes
- Prefer using custom element tag name as CSS selector when possible
- Use classes and id's as CSS selectors only when necessary

### DOM Structure
- Use minimal number of elements in the DOM tree
- Reactive elements render and manage their own children.
- Never alter children of an ReactiveElement from outside.
- Elements render content using virtual DOM for efficient updates

## Development
The framework has no runtime dependencies - only development dependencies. It uses `pnpm` as the package manager.
- Make changes to source files in `/packages/*/src/`
- TypeScript will compile to `/packages/*/dist/`

## Submitting Changes

1. Commit your changes with clear, descriptive commit messages
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request (PR) against the main branch
4. If your PR is not ready for review, [convert it to a draft PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request#converting-a-pull-request-to-a-draft)

## Getting Help

- Browse and submit [issues](https://github.com/io-gui/io/issues)
- Read the [quick start guide](https://iogui.dev/io/#path=Docs,Quick%20Start) and [deep dive guide](https://iogui.dev/io/#path=Docs,Deep%20Dive)
- Check the [documentation website](https://iogui.dev) for examples and API reference

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/io-gui/io/blob/main/.github/CODE_OF_CONDUCT.md) when contributing to the project.