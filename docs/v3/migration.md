# Migration Guide: v2 to v3

This guide covers everything you need to upgrade from jQuery Vertical Scroll v2 to v3. The good news: **there are no breaking API changes**. All options, methods, events, themes, and animations work exactly as before.

---

## What Changed

### Build System: Grunt to Rollup

The build toolchain was completely replaced:

| | v2 | v3 |
|---|---|---|
| **JS bundler** | Grunt (UglifyJS) | Rollup (`rollup.config.mjs`) |
| **CSS build** | Grunt (sass + cssmin) | sass CLI + PostCSS (Autoprefixer + cssnano) |
| **JS output** | 1 UMD file | 3 files: UMD min, UMD dev, ESM |
| **Source** | Single 1,105-line file | 9 ES modules |
| **Node requirement** | >=14 | >=18 |

### Source Code: Modular Architecture

The monolithic `jquery.verticalScroll.js` was split into focused ES modules:

```
src/js/
  constants.js      # Plugin name, data key, default options
  utils.js          # Shared utility functions
  core.js           # Constructor, init, destroy, WeakMap storage
  navigation.js     # scrollToSection, scrollToId, next, prev
  pagination.js     # Dot pagination rendering and updates
  accessibility.js  # ARIA attributes, focus management
  input.js          # Mouse wheel, keyboard, touch handlers
  auto-scroll.js    # Timer-based auto-scrolling
  index.js          # Assembles prototype, registers jQuery plugin
```

This is an internal change only. The public API is identical.

### New Output Files

The `dist/` directory now contains:

```
dist/
  js/
    jquery.verticalscroll.min.js      # UMD (minified) -- for <script> tags and CDN
    jquery.verticalscroll.min.js.map
    jquery.verticalscroll.js           # UMD (unminified) -- for debugging
    jquery.verticalscroll.js.map
    jquery.verticalscroll.esm.js       # ES module -- for Webpack, Vite, Rollup
    jquery.verticalscroll.esm.js.map
  css/
    jquery.verticalscroll.min.css
    jquery.verticalscroll.min.css.map
  types/
    jquery.verticalscroll.d.ts         # TypeScript declarations (NEW)
```

### New: TypeScript Declarations

v3 ships TypeScript declarations at `dist/types/jquery.verticalscroll.d.ts`. This provides full type safety for all options, methods, and callbacks without installing a separate `@types` package.

### New: WeakMap Instance Storage

Plugin instances are now stored in a `WeakMap` in addition to `$.data()`. This enables:

- **`getInstance(element)`** -- retrieve an instance without jQuery
- **Automatic garbage collection** when elements are removed from the DOM
- **Double-initialization prevention** -- calling `$('#page').verticalScroll({...})` twice on the same element logs a warning instead of creating a duplicate instance

### New: `package.json` Exports Map

The package now uses the `exports` field for precise module resolution:

```json
{
  "exports": {
    ".": {
      "import": "./dist/js/jquery.verticalscroll.esm.js",
      "require": "./dist/js/jquery.verticalscroll.min.js"
    },
    "./css": "./dist/css/jquery.verticalscroll.min.css",
    "./dist/*": "./dist/*"
  },
  "module": "dist/js/jquery.verticalscroll.esm.js",
  "types": "dist/types/jquery.verticalscroll.d.ts"
}
```

---

## Breaking Changes

### None for End Users

All options, methods, events, themes, and animations are **fully backward-compatible**. Your existing initialization code works without changes:

```javascript
// This works identically in v2 and v3
$('#page').verticalScroll({
  theme: 'dark',
  pagination: true,
  paginationAnimation: 'pulse',
  keyboard: true
});
```

### For Contributors: Node >=18 Required

The `engines` field now requires Node 18 or later for development (building, testing, contributing). This does **not** affect end users -- the distributed files run in any browser that supports jQuery 1.9.1+.

---

## Step-by-Step Upgrade

### 1. Update the Package

```bash
npm install @vineethnkrishnan/jquery.verticalscroll@3
```

Or with Yarn:

```bash
yarn add @vineethnkrishnan/jquery.verticalscroll@3
```

### 2. Update CDN URLs

If you use a CDN, change the major version from `@2` to `@3`:

```html
<!-- Before (v2) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@2/dist/css/jquery.verticalscroll.min.css">
<script src="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@2/dist/js/jquery.verticalscroll.min.js"></script>

<!-- After (v3) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/css/jquery.verticalscroll.min.css">
<script src="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@3/dist/js/jquery.verticalscroll.min.js"></script>
```

The same applies to unpkg, Skypack, and any other npm-mirroring CDN.

### 3. Verify Your Code

Run your application. Since there are no API changes, everything should work. If you were relying on internal/private methods (those starting with `_`), check that they still exist -- internal structure was refactored.

### 4. Done

That's it. No code changes required for the upgrade itself.

---

## New Features to Adopt

These are optional improvements available in v3.

### ESM Imports

If you use a bundler (Webpack, Vite, Rollup), the package now resolves to the ESM build automatically:

```javascript
import $ from 'jquery';
import '@vineethnkrishnan/jquery.verticalscroll';
import '@vineethnkrishnan/jquery.verticalscroll/css';

$('#page').verticalScroll({ theme: 'dark' });
```

The `import` condition in the `exports` map points to the ESM build, so tree-shaking-aware bundlers get the optimal format.

### TypeScript Support

Add type-safe initialization and method calls with zero configuration:

```typescript
import $ from 'jquery';
import '@vineethnkrishnan/jquery.verticalscroll';
import type { VerticalScrollOptions } from '@vineethnkrishnan/jquery.verticalscroll/dist/types/jquery.verticalscroll';

const options: VerticalScrollOptions = {
  theme: 'dark',
  pagination: true,
  onAfterScroll(index, section, oldIndex) {
    console.log(`Navigated from ${oldIndex} to ${index}`);
  }
};

$('#page').verticalScroll(options);

// Method calls are fully typed
const index: number = $('#page').verticalScroll('getCurrentIndex');
```

### `getInstance()` for Framework Integration

Access the plugin instance without jQuery, useful for integration with React, Vue, or vanilla JS:

```javascript
import { getInstance } from '@vineethnkrishnan/jquery.verticalscroll';

// After initialization
const element = document.getElementById('page');
const instance = getInstance(element);

if (instance) {
  instance.next();
  console.log('Current index:', instance.getCurrentIndex());
}
```

Also available on the jQuery namespace:

```javascript
const instance = $.fn.verticalScroll.getInstance(document.getElementById('page'));
```

### Double-Initialization Protection

v3 prevents accidental double-initialization. If you call `.verticalScroll({...})` on an already-initialized element, it logs a warning instead of creating a broken duplicate:

```javascript
$('#page').verticalScroll({ theme: 'dark' });
$('#page').verticalScroll({ theme: 'light' }); // Warns: "Element is already initialized. Call destroy() first."
```

To reinitialize, destroy first:

```javascript
$('#page').verticalScroll('destroy');
$('#page').verticalScroll({ theme: 'light' });
```

---

## FAQ

**Q: Does v3 still support jQuery 1.9.1?**
Yes. The `peerDependency` is unchanged: `jquery >= 1.9.1`.

**Q: Do I need to change my Grunt build scripts?**
Only if you are a contributor building the plugin from source. If you consume the package via npm or CDN, no build changes are needed.

**Q: Is the unminified CSS still available?**
The v3 dist does not include an unminified CSS file. The compiled source CSS is at `src/css/jquery.verticalScroll.css` if you need it for debugging. The minified dist CSS includes a source map.

**Q: Can I still use `$.fn.verticalScroll.Constructor`?**
Yes, it is still exposed for advanced use cases like extending the prototype.
