# jQuery Vertical Scroll

A lightweight, customizable jQuery plugin for creating smooth full-page vertical scrolling experiences. Perfect for single-page applications, landing pages, and presentation-style websites.

---

## What's New in v3

| Feature | Description |
|---------|-------------|
| **Modular Architecture** | Source split into focused ES modules for better maintainability |
| **ESM Support** | Native ES module build for modern bundlers (Vite, Rollup, Webpack 5+) |
| **TypeScript Declarations** | Full `.d.ts` typings with IDE autocomplete and type safety |
| **Modern Build** | Rollup-based pipeline replacing Grunt — faster builds, smaller output |
| **WeakMap Instances** | `getInstance(element)` for clean, leak-free instance access |
| **Browser Targets** | Explicit `.browserslistrc` for predictable CSS prefixing |

> Upgrading from v2? See the [Migration Guide](/v3/migration.md).

---

## Why jQuery Vertical Scroll?

| Feature | Description |
|---------|-------------|
| **Lightweight** | Under 14KB minified. No bloat, no unnecessary dependencies beyond jQuery. |
| **Multi-Input Navigation** | Mouse wheel, keyboard (arrow keys, Page Up/Down, Home/End), and touch/swipe support out of the box. |
| **Pagination Dots** | Beautiful, animated navigation dots with tooltips and configurable positioning. |
| **13 Built-in Themes** | Default, Light, Dark, Minimal, Neon, Git Graph, Sound Wave, Diamond, Arrow, Pill, Electric, Line Connect, and Chain. |
| **Accessible** | ARIA roles and labels, focus management, keyboard navigation, `prefers-reduced-motion` and `prefers-contrast` support. |
| **Auto-Scroll** | Optional automatic section cycling with pause-on-hover behavior. |
| **Promise-Based API** | Navigation methods return jQuery Deferred promises for clean async workflows. |
| **Responsive** | Automatically disables on mobile viewports with a configurable breakpoint. |
| **25+ Options** | Fine-grained control over every aspect of scrolling behavior, animation, and appearance. |

---

## Quick Install

**npm**

```bash
npm install @vineethnkrishnan/jquery.verticalscroll
```

**ESM (modern bundlers)**

```javascript
import '@vineethnkrishnan/jquery.verticalscroll';
import '@vineethnkrishnan/jquery.verticalscroll/css';
```

**CDN**

```html
<!-- CSS -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/css/jquery.verticalscroll.min.css">

<!-- JS (after jQuery) -->
<script src="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/js/jquery.verticalscroll.min.js"></script>
```

---

## Quick Start

```html
<div id="page">
  <section data-vs-label="Home"><h1>Welcome</h1></section>
  <section data-vs-label="About"><h1>About Us</h1></section>
  <section data-vs-label="Contact"><h1>Get in Touch</h1></section>
</div>

<script>
$(document).ready(function() {
  $('#page').verticalScroll({
    theme: 'default',
    pagination: true,
    keyboard: true,
    touch: true
  });
});
</script>
```

> For a complete working example, see the [Quick Start guide](/v3/getting-started/quick-start.md).

---

## Explore the Docs

- **[Installation](/v3/getting-started/installation.md)** -- npm, yarn, CDN, ESM, or manual download
- **[Options Reference](/v3/configuration/options.md)** -- All 25+ configuration options explained
- **[Themes](/v3/configuration/themes.md)** -- Built-in themes and custom theming
- **[Methods](/v3/api/methods.md)** -- Navigate, query, and control the plugin programmatically
- **[Events & Callbacks](/v3/api/events.md)** -- React to scroll events and section changes
- **[Examples](/v3/examples/basic.md)** -- Working code examples for common use cases
- **[Accessibility](/v3/accessibility.md)** -- ARIA support, keyboard nav, and motion preferences
- **[Migration Guide](/v3/migration.md)** -- Upgrade from v2.x to v3.0

---

## Links

- [GitHub Repository](https://github.com/vineethkrishnan/jquery.verticalScroll.js)
- [npm Package](https://www.npmjs.com/package/@vineethnkrishnan/jquery.verticalscroll)
- [Live Demo](https://jquery-vertical-scroll.vineethnk.in)
- [Report an Issue](https://github.com/vineethkrishnan/jquery.verticalScroll.js/issues)
