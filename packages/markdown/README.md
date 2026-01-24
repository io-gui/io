# @io-gui/markdown

Markdown rendering component for Io-Gui with syntax highlighting and theme support.

All documentation for Io-Gui is written in markdown and rendered with IoMarkdown.

## Overview

```
IoMarkdown
├── Fetches markdown from src URL
├── Parses with Marked library
├── Highlights code with highlight.js
├── Sanitizes with DOMPurify
└── Renders HTML with theme-aware styling
```

## Usage

```typescript
import { IoMarkdown } from 'io-markdown'

// Basic usage
const md = new IoMarkdown({
  src: './docs/readme.md'
})

// With content stripping
const md = new IoMarkdown({
  src: './docs/guide.md',
  strip: ['<!-- SKIP -->', '<!-- /SKIP -->'],
  sanitize: true
})
```

## Element

### IoMarkdown

Fetches and renders markdown content from a URL.

```typescript
type IoMarkdownProps = {
  src?: string        // URL to markdown file
  strip?: string[]    // Patterns to remove from output
  loading?: boolean   // Loading state (auto-managed)
  sanitize?: boolean  // Enable DOMPurify (default: true)
}
```

**Properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | string | `''` | URL to markdown file |
| `strip` | string[] | `null` | Regex patterns to remove |
| `loading` | boolean | `false` | Shows spinner when true |
| `sanitize` | boolean | `true` | Sanitize HTML output |

## Features

### Syntax Highlighting

Code blocks are highlighted using highlight.js with automatic language detection:

````markdown
```typescript
const greeting = 'Hello, World!'
console.log(greeting)
```
````

Supported languages include JavaScript, TypeScript, HTML, CSS, Python, and many more via highlight.js.

### Theme Integration

Syntax highlighting themes automatically switch based on `ThemeSingleton.themeID`:

- **Light theme** - Light background code blocks
- **Dark theme** - Dark background code blocks

The theme is applied globally via a `<style id="io-highlight-theme">` element.

### Heading Data Attributes

All headings receive `data-heading` attributes for anchor linking:

```html
<!-- Input: ## Getting Started -->
<h2 data-heading="Getting Started">Getting Started</h2>
```

This enables integration with `IoSelector` for scroll-to-anchor navigation.

### Content Stripping

The `strip` property removes patterns from the rendered output:

```typescript
ioMarkdown({
  src: './readme.md',
  strip: [
    '<!-- TOC -->',           // Remove TOC markers
    '\\[!NOTE\\]',            // Remove GitHub note syntax
    '<badge[^>]*>[^<]*</badge>' // Remove custom elements
  ]
})
```

Patterns are treated as regular expressions with global flag.

### Responsive Code Sizing

Code block font size scales with element width:
- Minimum: 11px (narrow containers)
- Maximum: 14px (wide containers)
- Calculated as: `(width - 30) / 45`

### Security

When `sanitize: true` (default), all HTML is processed through DOMPurify to prevent XSS attacks. This removes potentially dangerous elements and attributes while preserving safe markup.

## Styling

IoMarkdown includes comprehensive CSS for common markdown elements:

| Element | Styling |
|---------|---------|
| `h1-h4` | Hierarchical sizing, `--io_colorStrong` |
| `a` | Blue color (`--io_colorBlue`), no underline |
| `code` | Light background (`--io_bgColorLight`) |
| `blockquote` | Left border, subtle background |
| `table` | Full width, bordered cells |
| `.videocontainer` | 16:9 aspect ratio iframe |

### CSS Variables Used

- `--io_color`, `--io_colorStrong`, `--io_colorBlue`
- `--io_bgColor`, `--io_bgColorLight`, `--io_bgColorStrong`
- `--io_border`, `--io_borderRadius`
- `--io_lineHeight`, `--io_fontSize`, `--io_spacing*`

## Loading State

While fetching content, `IoMarkdown`:
1. Sets `loading="true"` attribute
2. Clears existing innerHTML
3. Shows CSS spinner animation
4. Removes `loading` attribute when complete

```css
:host[loading]:after {
  /* Spinner animation */
  animation: spinner .6s linear infinite;
}
```

## Integration with Navigation

Combine with `IoSelector` for document navigation:

```typescript
ioNavigator({
  option: menuOption,
  elements: [
    ioMarkdown({ id: 'guide', src: './docs/guide.md' }),
    ioMarkdown({ id: 'api', src: './docs/api.md' }),
  ]
})
```

The `data-heading` attributes enable scroll-to-anchor when selecting menu items.

## Edge Cases

### Fetch Errors
Network errors during fetch are not caught - the loading spinner will persist. Consider wrapping in error handling for production use.

### Empty Source
Setting `src=""` clears the content but does not trigger loading state.

### Multiple Theme Changes
Theme changes are handled via event listener on `ThemeSingleton`. The highlight theme updates immediately without re-parsing markdown.

### Raw HTML in Markdown
With `sanitize: true`, raw HTML in markdown is filtered through DOMPurify. Some advanced HTML may be stripped. Set `sanitize: false` only for trusted content.
