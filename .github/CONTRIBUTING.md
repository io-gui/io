# Contributing to Io-Gui

## Introduction

Io-Gui is a reactive web UI framework that provides a consistent reactive foundation supporting multiple architectural patterns. It's organized as a monorepo with packages for different UI components and functionality.

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
5. In a separate terminal, start the development server:
   ```bash
   pnpm serve
   ```

## Project Structure

Io-Gui is organized as a monorepo with the following packages:

- **io-core** - Core framework (Node, IoElement, bindings, event system, Storage, Theme)
- **io-colors** - Color components and utilities
- **io-icons** - Icon component and default iconset
- **io-inputs** - Input components (buttons, fields, switches)
- **io-layout** - Layout components (panels, tabs, splits)
- **io-editors** - Universal property editors
- **io-markdown** - Markdown rendering component
- **io-menus** - Menu components and rich domain models
- **io-navigation** - Navigation and selection components
- **io-sliders** - Slider components
- **io-gui** - Combined package with all components

## Development Commands

### Essential Commands
- `pnpm dev` - Start watch mode for all packages (TypeScript compilation)
- `pnpm build` - Build all packages
- `pnpm bundle` - Bundle all packages with Rollup
- `pnpm lint` - Lint all packages (auto-fixes)
- `pnpm test` - Run tests with web-test-runner
- `pnpm test:watch` - Run tests in watch mode
- `pnpm serve` - Start @web/dev-server for development
- `pnpm clean` - Clean all build directories

### Package-Specific Commands
Each package can be built/linted individually:
- `pnpm build:core`, `pnpm build:colors`, `pnpm build:inputs`, etc.
- `pnpm lint:core`, `pnpm lint:colors`, `pnpm lint:inputs`, etc.
- `pnpm dev:core`, `pnpm dev:colors`, `pnpm dev:inputs`, etc.

## Development Workflow

### Making Changes
1. Create a new branch from the main branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate package(s) under `/packages/*/src/`

3. Test your changes:
   ```bash
   pnpm test
   pnpm lint
   ```

4. Build to ensure everything compiles correctly:
   ```bash
   pnpm build
   ```

## Code Style Guidelines

### Code Style
- Code should require minimal documentation: "Code is documentation"
- Use clear, descriptive, and easy-to-read variable/property names
- Don't solve problems by removing debug statements/checks
- Follow existing code style and linting patterns
- Minimal Tooling: Avoid complex tools and processes
- Use the Platform: Rely on native web features

### TypeScript Patterns
- Use decorators (`@Register`, `@ReactiveProperty`, `@Property`)
- Strong typing with interfaces and type definitions
- Avoid using `any` whenever possible
- ES modules with `.js` extensions in imports
- When importing from another package or a test file, use package name instead of full path

### Defining New Components
- Elements extend `IoElement` and use reactive properties
- Nodes extend `Node` for non-DOM reactive objects
- Nodes and elements require registration using `Register(IoClassConstructor)` or `@Register` decorator
- CSS styles defined in static `static get Style()` string
- CSS selectors have to start with `:host` selector which represents the host element
- Reactive properties defined in static `static get ReactiveProperties()` object or `@ReactiveProperty` decorators
- Non-reactive properties defined in static `static get Properties()` object or `@Property` decorators

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
- DOM mutations should be articulated by custom elements
- Reactive elements render and manage their own children
- Elements render content using virtual DOM for efficient updates

## Development
The framework has no runtime dependencies - only development dependencies. It uses `pnpm` as the package manager.
- Make changes to source files in `/packages/*/src/`
- TypeScript will compile to `/packages/*/build/`

### Monorepo Structure
The project is organized as a monorepo with packages in `/packages/`:

- **io-core** - Core framework (Node, IoElement, bindings, event system, Storage, Theme)
- **io-colors** - Color components and utilities
- **io-icons** - Icon component and default iconset
- **io-inputs** - Input components (buttons, fields, switches)
- **io-layout** - Layout components (panels, tabs, splits)
- **io-editors** - Universal property editors
- **io-markdown** - Markdown rendering component
- **io-menus** - Menu components and rich domain models
- **io-navigation** - Navigation and selection components
- **io-sliders** - Slider components
- **io-gui** - Combined package with all components

### Essential Commands
- `pnpm dev` - Start watch mode for all packages (tsc)
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages (auto-fixes)
- `pnpm test` - Run tests with web-test-runner
- `pnpm test:watch` - Run tests in watch mode
- `pnpm serve` - Start @web/dev-server for development
- `pnpm clean` - Clean all build directories

### Package-Specific Commands
Each package can be built/linted individually:
- `pnpm build:core`, `pnpm build:colors`, `pnpm build:inputs`, etc.
- `pnpm lint:core`, `pnpm lint:colors`, `pnpm lint:inputs`, etc.

### Build System
- Uses `wireit` for orchestrated builds with dependency management
- TypeScript compilation with `tsc`
- Rollup for bundling with tree-shaking
- ESLint for linting with auto-fix

### Testing
- Uses Vitest for testing
- Web Test Runner for browser-based tests
- Test files follow `*.test.ts` pattern

## Submitting Changes

1. Commit your changes with clear, descriptive commit messages
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request (PR) against the main branch
4. If your PR is not ready for review, [convert it to a draft PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request#converting-a-pull-request-to-a-draft)

## Important Notes

- **No build files**: Don't include build files in commits unless building a new release
- **Documentation**: Update documentation when making changes that affect APIs or behavior
- **Dependencies**: The framework has no runtime dependencies - only development dependencies
- **Minimal tooling**: The project emphasizes minimal tooling and relies on native web features
- **Platform usage**: Prefer native web features over complex abstractions

## Getting Help

- Browse and submit [issues](https://github.com/io-gui/io/issues)
- Read the [quick start guide](https://iogui.dev/io/#path=Docs,Quick%20Start) and [deep dive guide](https://iogui.dev/io/#path=Docs,Deep%20Dive)
- Check the [documentation website](https://iogui.dev) for examples and API reference

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/io-gui/io/blob/main/.github/CODE_OF_CONDUCT.md) when contributing to the project.