# Installation

jQuery Vertical Scroll can be installed via a package manager, loaded from a CDN, or downloaded manually.

## Prerequisites

jQuery Vertical Scroll requires **jQuery 1.9.1 or later**. Make sure jQuery is loaded before the plugin script.

---

## npm

```bash
npm install @vineethnkrishnan/jquery.verticalscroll
```

## Yarn

```bash
yarn add @vineethnkrishnan/jquery.verticalscroll
```

---

## CDN

Any CDN that mirrors npm can serve this package. Below are the most popular options.

### jsDelivr (recommended)

The fastest global CDN for npm packages. Uses a multi-CDN architecture with Cloudflare, Fastly, and StackPath.

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/css/jquery.verticalscroll.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/js/jquery.verticalscroll.min.js"></script>
```

**Version pinning:**

| URL pattern | Resolves to |
|-------------|-------------|
| `@vineethnkrishnan/jquery.verticalscroll@3` | Latest 3.x.x (recommended) |
| `@vineethnkrishnan/jquery.verticalscroll@3.0.0` | Exact version 3.0.0 |
| `@vineethnkrishnan/jquery.verticalscroll@latest` | Latest version (may include breaking changes) |
| `@vineethnkrishnan/jquery.verticalscroll` | Same as `@latest` |

> jsDelivr also provides an ESM build via `https://esm.run/@vineethnkrishnan/jquery.verticalscroll` for use with `<script type="module">`.

### unpkg

Serves files directly from npm with no processing. Backed by Cloudflare.

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll@3/dist/css/jquery.verticalscroll.min.css">

<!-- JavaScript -->
<script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll@3/dist/js/jquery.verticalscroll.min.js"></script>
```

**Version pinning** uses the same `@version` syntax as jsDelivr (semver ranges supported).

> Tip: Add `?module` to the JS URL to get an ES module version: `https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll?module`

### cdnjs

One of the oldest and most trusted CDNs. Powered by Cloudflare. Packages must be submitted for inclusion -- once available, URLs follow this pattern:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.verticalscroll/3.0.0/css/jquery.verticalscroll.min.css">

<!-- JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.verticalscroll/3.0.0/js/jquery.verticalscroll.min.js"></script>
```

> cdnjs requires a [GitHub submission](https://github.com/cdnjs/packages) to be listed. Until then, use jsDelivr or unpkg.

### Skypack

Modern CDN optimized for ES modules and Deno:

```html
<script type="module">
  import 'https://cdn.skypack.dev/@vineethnkrishnan/jquery.verticalscroll@3';
</script>
```

### Full HTML Example with CDN

A complete working page using jsDelivr for both jQuery and the plugin:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>

  <!-- Plugin CSS (jsDelivr) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/css/jquery.verticalscroll.min.css">

  <style>
    html, body { margin: 0; padding: 0; height: 100%; }
    #page { height: 100vh; }
    section { height: 100vh; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <div id="page">
    <section data-vs-label="Home" style="background:#667eea;">
      <h1 style="color:#fff;">Welcome</h1>
    </section>
    <section data-vs-label="About" style="background:#f093fb;">
      <h1 style="color:#fff;">About Us</h1>
    </section>
    <section data-vs-label="Contact" style="background:#43e97b;">
      <h1 style="color:#fff;">Contact</h1>
    </section>
  </div>

  <!-- jQuery (jsDelivr) -->
  <script src="https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js"></script>

  <!-- Plugin JS (jsDelivr) -->
  <script src="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/js/jquery.verticalscroll.min.js"></script>

  <script>
    $('#page').verticalScroll({
      theme: 'default',
      paginationAnimation: 'pulse'
    });
  </script>
</body>
</html>
```

### CDN Comparison

| CDN | Global PoPs | npm mirror | SRI hashes | ESM support |
|-----|-------------|------------|------------|-------------|
| **jsDelivr** | 800+ | Yes (automatic) | Yes | Yes (esm.run) |
| **unpkg** | Cloudflare | Yes (automatic) | No | Yes (?module) |
| **cdnjs** | Cloudflare | Manual submission | Yes | No |
| **Skypack** | Cloudflare | Yes (automatic) | No | Yes (native) |

> **Recommendation:** Use **jsDelivr** with a major version pin (`@3`) for production. It auto-resolves to the latest compatible minor/patch release while preventing breaking changes.

---

## Manual Download

1. Download the latest release from the [GitHub Releases page](https://github.com/vineethkrishnan/jquery.verticalScroll.js/releases).
2. Extract the archive.
3. Copy the files from the `dist/` directory into your project.

The `dist/` folder contains:

```
dist/
  css/
    jquery.verticalscroll.min.css    # Minified CSS (with source map)
  js/
    jquery.verticalscroll.min.js     # UMD minified (for production)
    jquery.verticalscroll.js         # UMD unminified (for debugging)
    jquery.verticalscroll.esm.js     # ES module (for bundlers)
  types/
    jquery.verticalscroll.d.ts       # TypeScript declarations
```

---

## Including in HTML

Add the CSS in the `<head>` and the JavaScript before the closing `</body>` tag, after jQuery:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>

  <!-- jQuery Vertical Scroll CSS -->
  <link rel="stylesheet" href="path/to/jquery.verticalscroll.min.css">
</head>
<body>

  <div id="page">
    <section>Section 1</section>
    <section>Section 2</section>
    <section>Section 3</section>
  </div>

  <!-- jQuery (required) -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

  <!-- jQuery Vertical Scroll -->
  <script src="path/to/jquery.verticalscroll.min.js"></script>

  <script>
    $(document).ready(function() {
      $('#page').verticalScroll();
    });
  </script>
</body>
</html>
```

---

## ESM Import

> *New in v3.* The package ships a native ES module build that bundlers resolve automatically via the `exports` map.

```javascript
import $ from 'jquery';

// Import the plugin (registers $.fn.verticalScroll automatically)
import '@vineethnkrishnan/jquery.verticalscroll';

// Import the CSS (requires a CSS-capable bundler)
import '@vineethnkrishnan/jquery.verticalscroll/css';

$('#page').verticalScroll({
  theme: 'dark',
  pagination: true
});
```

The `import` condition in `package.json` resolves to the ESM build (`dist/js/jquery.verticalscroll.esm.js`), while `require` resolves to the UMD build. Your bundler picks the right one automatically.

### Named Exports

The ESM build also exports the constructor and utilities for advanced use cases:

```javascript
import { VerticalScroll, getInstance, DEFAULTS } from '@vineethnkrishnan/jquery.verticalscroll';

// Access an instance without jQuery
const element = document.getElementById('page');
const instance = getInstance(element);

// Read default options
console.log(DEFAULTS.animationDuration); // 800
```

---

## TypeScript

> *New in v3.* TypeScript declarations are included at `dist/types/jquery.verticalscroll.d.ts`. No separate `@types` package is needed.

```typescript
import $ from 'jquery';
import '@vineethnkrishnan/jquery.verticalscroll';
import type { VerticalScrollOptions } from '@vineethnkrishnan/jquery.verticalscroll/dist/types/jquery.verticalscroll';

const options: VerticalScrollOptions = {
  theme: 'dark',
  pagination: true,
  paginationAnimation: 'pulse',
  animationDuration: 600,
  onAfterScroll(index, section, oldIndex) {
    console.log(`Scrolled from section ${oldIndex} to ${index}`);
  }
};

$('#page').verticalScroll(options);

// All method calls are fully typed
const currentIndex: number = $('#page').verticalScroll('getCurrentIndex');
const $section: JQuery = $('#page').verticalScroll('getCurrentSection');
```

The declarations include overloads for every method, so your editor will provide autocompletion and type checking for method names and their arguments.

---

## Module Bundlers (Webpack, Vite, Rollup)

If you are using a module bundler, install via npm and import:

```javascript
// Import jQuery
import $ from 'jquery';

// Import the plugin CSS
import '@vineethnkrishnan/jquery.verticalscroll/css';

// Import the plugin (automatically registers $.fn.verticalScroll)
import '@vineethnkrishnan/jquery.verticalscroll';

// Use the plugin
$(document).ready(function() {
  $('#page').verticalScroll({
    theme: 'dark',
    pagination: true
  });
});
```

### Webpack Configuration Note

If jQuery is not already a global, you may need to expose it using Webpack's `ProvidePlugin`:

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
```

### Vite Configuration Note

Vite resolves the ESM build automatically. If jQuery needs to be global:

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      jquery: 'jquery/dist/jquery.min.js'
    }
  }
});
```

### Rollup Configuration Note

Add jQuery as an external dependency:

```javascript
// rollup.config.js
export default {
  external: ['jquery'],
  output: {
    globals: { jquery: 'jQuery' }
  }
};
```

---

## RequireJS / AMD

The plugin supports AMD module loading via the UMD build:

```javascript
require.config({
  paths: {
    jquery: 'https://code.jquery.com/jquery-3.7.1.min',
    verticalScroll: 'path/to/jquery.verticalscroll.min'
  }
});

require(['jquery', 'verticalScroll'], function($) {
  $(document).ready(function() {
    $('#page').verticalScroll({
      pagination: true,
      keyboard: true
    });
  });
});
```

---

## CommonJS / Node

For server-side rendering or testing environments:

```javascript
const $ = require('jquery');
require('@vineethnkrishnan/jquery.verticalscroll');

// Plugin is now available on $.fn.verticalScroll
```

---

## Next Steps

Once installed, head over to the [Quick Start](getting-started/quick-start.md) guide to create your first scrolling page.
