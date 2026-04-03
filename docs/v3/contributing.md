# Contributing

Contributions to jQuery Vertical Scroll are welcome and appreciated. For the full contributor guide with setup instructions, build commands, and project structure, see [CONTRIBUTING.md](https://github.com/vineethkrishnan/jquery.verticalScroll.js/blob/master/CONTRIBUTING.md) in the repository root.

---

## Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/<your-username>/jquery.verticalScroll.js.git
cd jquery.verticalScroll.js

# Install dependencies (requires Node >= 18)
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install chromium

# Build
npm run build

# Run tests
npm test
```

## Project Structure

```
src/
├── scss/                    # SCSS source (7-1 architecture)
│   ├── abstracts/           # Variables, mixins, functions
│   ├── base/                # :root CSS custom properties, reset
│   ├── components/          # Container, section, pagination, button, dot, tooltip
│   ├── themes/              # Default, light, dark, minimal
│   ├── animations/          # 10 pagination animations (one file each)
│   ├── responsive/          # Mobile, a11y, print media queries
│   └── main.scss            # Entry point
├── css/                     # Compiled CSS (auto-generated, do not edit)
└── js/                      # Plugin JavaScript source (ES modules)
    ├── constants.js         # Plugin name, data key, default options
    ├── utils.js             # Shared utility functions
    ├── core.js              # Constructor, init, destroy, WeakMap instance storage
    ├── navigation.js        # scrollToSection, scrollToId, next, prev
    ├── pagination.js        # Dot pagination rendering and updates
    ├── accessibility.js     # ARIA attributes, focus management
    ├── input.js             # Mouse wheel, keyboard, touch handlers
    ├── auto-scroll.js       # Timer-based auto-scrolling
    └── index.js             # Assembles prototype, registers jQuery plugin, exports

dist/                        # Build output (auto-generated, do not edit)
├── js/
│   ├── jquery.verticalscroll.min.js       # UMD (minified)
│   ├── jquery.verticalscroll.js           # UMD (unminified)
│   └── jquery.verticalscroll.esm.js       # ES module
├── css/
│   └── jquery.verticalscroll.min.css      # Minified CSS
└── types/
    └── jquery.verticalscroll.d.ts         # TypeScript declarations

tests/
├── unit/                    # Jest + jsdom (152 tests)
├── e2e/                     # Playwright browser tests
└── visual/                  # Screenshot regression tests
```

> **Important:** Never edit files in `dist/` or `src/css/` directly. They are auto-generated. Always edit files in `src/js/` or `src/scss/`.

## Build Pipeline

```
src/js/*.js  ──→  Rollup  ──→  dist/js/ (UMD min + UMD dev + ESM)

src/scss/    ──→  Sass    ──→  src/css/
             ──→  PostCSS (Autoprefixer + cssnano) ──→  dist/css/
```

| Command | Description |
|---------|-------------|
| `npm run build` | Full build (CSS + JS) |
| `npm run build:js` | JavaScript build only (Rollup) |
| `npm run build:css` | CSS build only (Sass + PostCSS) |
| `npm test` | Unit tests (builds JS first via `pretest`) |
| `npm run test:e2e` | E2E browser tests (Playwright) |
| `npm run test:visual` | Visual regression tests |
| `npm run docs:serve` | Local docs site on port 3000 |

### Rollup Configuration

The Rollup config (`rollup.config.mjs`) produces three output files from `src/js/index.js`:

1. **UMD minified** (`dist/js/jquery.verticalscroll.min.js`) -- for `<script>` tags and CDN
2. **UMD unminified** (`dist/js/jquery.verticalscroll.js`) -- for development and debugging
3. **ESM** (`dist/js/jquery.verticalscroll.esm.js`) -- for modern bundlers (Webpack, Vite, Rollup)

jQuery is configured as an external dependency in all builds.

## JavaScript Module Architecture

The plugin is split into 9 ES modules under `src/js/`. Each module exports a methods object that gets merged onto the `VerticalScroll` prototype in `index.js`:

```javascript
// index.js assembles the prototype
VerticalScroll.prototype = Object.assign(
    { constructor: VerticalScroll },
    coreMethods,
    utilsMethods,
    navigationMethods,
    paginationMethods,
    accessibilityMethods,
    inputMethods,
    autoScrollMethods
);
```

When adding new functionality:

1. Create a new module or add to the most relevant existing module
2. Export a methods object (e.g., `export var myMethods = { ... }`)
3. Import and merge it in `index.js`
4. If it is a public method, add it to the TypeScript declarations in `dist/types/jquery.verticalscroll.d.ts`

## SCSS Architecture

This project follows the [Sass Guidelines](https://sass-guidelin.es/) 7-1 pattern. The SCSS architecture is unchanged from v2:

- Uses modern `@use` / `@forward` (not deprecated `@import`)
- All variables prefixed with `$vs-` and use `!default`
- Themes defined in a SCSS map and generated via mixin
- Each animation in its own file
- Max nesting depth: 3 levels

### Adding a Theme

1. Add colors to `$vs-themes` map in `abstracts/_variables.scss`
2. Create `themes/_your-theme.scss` with `@include vs-theme(...)`
3. Import in `main.scss`

### Adding an Animation

1. Create `animations/_your-animation.scss` with keyframes
2. Import in `main.scss`
3. Update the JS option comment

## Testing

Tests run against the built output in `dist/`. The `pretest` script runs `npm run build:js` automatically before Jest.

| Type | Framework | Command |
|------|-----------|---------|
| Unit | Jest + jsdom | `npm test` |
| E2E | Playwright (3 browsers) | `npm run test:e2e` |
| Visual | Playwright screenshots | `npm run test:visual` |

## Pull Request Checklist

- [ ] Changes are in `src/js/` or `src/scss/` (not compiled files in `dist/` or `src/css/`)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (152 tests)
- [ ] New public methods have TypeScript declarations
- [ ] New features have tests
- [ ] Commit message follows conventional format (`feat:`, `fix:`, etc.)

## Commit Messages

```
type: brief description
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`, `ci`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
