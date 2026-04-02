# jQuery Vertical Scroll

A lightweight, customizable jQuery plugin for creating smooth full-page vertical scrolling experiences. Perfect for single-page applications, landing pages, and presentation-style websites.

---

## Why jQuery Vertical Scroll?

| Feature | Description |
|---------|-------------|
| **Lightweight** | Under 5KB minified and gzipped. No bloat, no unnecessary dependencies beyond jQuery. |
| **Multi-Input Navigation** | Mouse wheel, keyboard (arrow keys, Page Up/Down, Home/End), and touch/swipe support out of the box. |
| **Pagination Dots** | Beautiful, animated navigation dots with tooltips and configurable positioning. |
| **4 Built-in Themes** | Default, Light, Dark, and Minimal themes ready to use -- plus full CSS variable customization. |
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

**CDN**
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/css/jquery.verticalscroll.min.css">

<!-- JS (after jQuery) -->
<script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>
```

---

## Quick Start

```html
<div id="page">
  <section data-vs-label="Home">
    <h1>Welcome</h1>
  </section>
  <section data-vs-label="About">
    <h1>About Us</h1>
  </section>
  <section data-vs-label="Contact">
    <h1>Get in Touch</h1>
  </section>
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

> For a complete working example, see the [Quick Start guide](getting-started/quick-start.md).

---

## Explore the Docs

- **[Installation](getting-started/installation.md)** -- npm, yarn, CDN, or manual download
- **[Options Reference](configuration/options.md)** -- All 25+ configuration options explained
- **[Themes](configuration/themes.md)** -- Built-in themes and custom theming
- **[Methods](api/methods.md)** -- Navigate, query, and control the plugin programmatically
- **[Events & Callbacks](api/events.md)** -- React to scroll events and section changes
- **[Examples](examples/basic.md)** -- Working code examples for common use cases
- **[Accessibility](accessibility.md)** -- ARIA support, keyboard nav, and motion preferences
- **[Migration Guide](migration.md)** -- Upgrade from v1.x to v2.0

---

## Links

- [GitHub Repository](https://github.com/vineethkrishnan/jquery.verticalScroll.js)
- [npm Package](https://www.npmjs.com/package/@vineethnkrishnan/jquery.verticalscroll)
- [Live Demo](https://jquery-vertical-scroll.vineethnk.in)
- [Report an Issue](https://github.com/vineethkrishnan/jquery.verticalScroll.js/issues)
