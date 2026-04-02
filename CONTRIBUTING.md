# Contributing to jQuery Vertical Scroll

Thank you for your interest in contributing! Contributions from the community are welcome and appreciated.

## Prerequisites

- **Node.js** >= 14.0.0 (recommended: latest LTS)
- **npm** >= 7
- A modern browser for E2E testing (Playwright will install Chromium automatically)

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/jquery.verticalScroll.js.git
cd jquery.verticalScroll.js

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (for E2E tests)
npx playwright install chromium

# 4. Build the project
npm run build

# 5. Verify everything works
npm test
```

## Project Structure

```
jquery.verticalScroll.js/
├── src/
│   ├── scss/                          # SCSS source (7-1 architecture)
│   │   ├── abstracts/                 # Variables, mixins, functions (no CSS output)
│   │   │   ├── _variables.scss        # $vs-* prefixed config, theme map, !default
│   │   │   ├── _mixins.scss           # vs-transition, vs-theme, vs-respond-to
│   │   │   └── _functions.scss        # vs-theme-value() helper
│   │   ├── base/                      # :root custom properties, box-sizing reset
│   │   │   ├── _root.scss
│   │   │   └── _reset.scss
│   │   ├── components/                # UI component partials
│   │   │   ├── _container.scss        # .vs-container
│   │   │   ├── _section.scss          # .vs-section
│   │   │   ├── _pagination.scss       # .vs-pagination nav, list, item
│   │   │   ├── _button.scss           # .vs-pagination-button
│   │   │   ├── _dot.scss              # .vs-pagination-dot, active state
│   │   │   └── _tooltip.scss          # .vs-pagination-tooltip, arrows
│   │   ├── themes/                    # Theme overrides via CSS custom properties
│   │   │   ├── _default.scss
│   │   │   ├── _light.scss
│   │   │   ├── _dark.scss
│   │   │   └── _minimal.scss
│   │   ├── animations/                # Pagination dot animations (one per file)
│   │   │   ├── _pulse.scss
│   │   │   ├── _glow.scss
│   │   │   ├── _bounce.scss
│   │   │   ├── _ripple.scss
│   │   │   ├── _scale.scss
│   │   │   ├── _fade-ring.scss
│   │   │   ├── _rotate.scss
│   │   │   ├── _morph.scss
│   │   │   ├── _heartbeat.scss
│   │   │   └── _radar.scss
│   │   ├── responsive/                # Media queries
│   │   │   ├── _mobile.scss           # Hide pagination below breakpoint
│   │   │   ├── _a11y.scss             # prefers-reduced-motion, prefers-contrast
│   │   │   └── _print.scss            # Print styles
│   │   └── main.scss                  # Entry point (@use imports in order)
│   ├── css/
│   │   └── jquery.verticalScroll.css  # Compiled CSS (auto-generated from SCSS)
│   └── js/
│       └── jquery.verticalScroll.js   # Plugin source (UMD module)
├── dist/                              # Production build (auto-generated)
│   ├── css/jquery.verticalscroll.min.css
│   └── js/jquery.verticalscroll.min.js
├── tests/
│   ├── setup.js                       # Jest global setup (jQuery + plugin)
│   ├── unit/                          # Unit tests (Jest + jsdom)
│   │   ├── initialization.test.js
│   │   ├── navigation.test.js
│   │   ├── pagination.test.js
│   │   ├── keyboard.test.js
│   │   ├── options.test.js
│   │   ├── api.test.js
│   │   ├── events.test.js
│   │   ├── destroy.test.js
│   │   └── accessibility.test.js
│   ├── e2e/                           # E2E tests (Playwright)
│   │   ├── serve.js                   # Static dev server for tests
│   │   ├── fixtures/                  # Test HTML pages
│   │   ├── scroll.spec.js
│   │   └── accessibility.spec.js
│   └── visual/                        # Visual regression tests (Playwright)
│       └── themes.spec.js
├── docs/                              # Documentation site (Docsify)
├── demo/                              # Interactive demo site
├── .github/workflows/                 # CI/CD
│   ├── ci.yml                         # Lint, test, build on push/PR
│   └── release.yml                    # Release Please, npm publish, deploy
├── Gruntfile.js                       # Build task config
├── jest.config.js                     # Jest config
├── playwright.config.js               # Playwright config
├── postcss.config.js                  # Autoprefixer config
├── release-please-config.json         # Release automation config
├── .editorconfig                      # Editor formatting rules
└── package.json
```

## Build Pipeline

The build compiles SCSS to CSS, autoprefixes, minifies CSS, and uglifies JS:

```
SCSS (src/scss/) → Sass → CSS (src/css/) → Autoprefixer → CSSMin → dist/css/
                                        JS (src/js/) → UglifyJS → dist/js/
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Full build: SCSS + autoprefix + minify CSS + uglify JS |
| `npm run build:scss` | Compile SCSS to CSS only |
| `npm run build:grunt` | Run Grunt tasks only (sass + cssmin + uglify) |
| `npx grunt css` | SCSS compile + CSS minify |
| `npx grunt js` | JS minify only |

### Development Workflow

1. Edit SCSS files in `src/scss/` (never edit `src/css/` directly -- it's auto-generated)
2. Edit JavaScript in `src/js/jquery.verticalScroll.js`
3. Run `npm run build` to compile
4. Preview locally:
   ```bash
   # Demo site (uses local source files)
   npx http-server . --port 8281
   # Then open http://localhost:8281/demo/

   # Docs site (Docsify)
   npm run docs:serve
   # Then open http://localhost:3000
   ```

## SCSS Guidelines

This project follows the [Sass Guidelines](https://sass-guidelin.es/) 7-1 architecture pattern.

### Key Rules

- **Use `@use` and `@forward`**, not `@import` (deprecated in modern Sass)
- **Namespace all variables** with `$vs-` prefix
- **All SCSS variables use `!default`** so consumers can override them
- **Max nesting depth**: 3 levels
- **One component per file** -- keep files focused and under ~50 lines
- **Theme colors defined in a SCSS map** in `abstracts/_variables.scss`
- **Themes are generated** via the `@mixin vs-theme()` mixin
- **Each animation gets its own file** in `animations/`

### Adding a New Theme

1. Add the theme colors to the `$vs-themes` map in `src/scss/abstracts/_variables.scss`
2. Create `src/scss/themes/_your-theme.scss`:
   ```scss
   @use '../abstracts/variables' as *;
   @use '../abstracts/mixins' as *;

   @include vs-theme('your-theme', map-get($vs-themes, 'your-theme'));
   ```
3. Add `@use 'themes/your-theme';` to `src/scss/main.scss`
4. Add the theme name to the JS DEFAULTS comment in `src/js/jquery.verticalScroll.js`

### Adding a New Animation

1. Create `src/scss/animations/_your-animation.scss`:
   ```scss
   .vs-anim-your-animation .vs-pagination-button.vs-pagination-active .vs-pagination-dot {
       animation: vs-your-animation 2s ease infinite;
   }

   @keyframes vs-your-animation {
       0%   { /* start state */ }
       100% { /* end state */ }
   }
   ```
2. Add `@use 'animations/your-animation';` to `src/scss/main.scss`
3. Update the `paginationAnimation` option comment in `src/js/jquery.verticalScroll.js`

## Testing

### Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests (Jest) |
| `npm run test:verbose` | Unit tests with detailed output |
| `npm run test:e2e` | E2E tests in Chromium, Firefox, WebKit |
| `npm run test:visual` | Visual regression screenshot tests |
| `npm run test:visual:update` | Update visual regression baselines |
| `npm run test:playwright` | All Playwright tests (E2E + visual) |

### Writing Tests

- **Unit tests** go in `tests/unit/` and use Jest + jsdom
- **E2E tests** go in `tests/e2e/` and use Playwright
- **Visual tests** go in `tests/visual/` and use Playwright screenshots
- Always use `{ responsive: false }` in unit tests (jsdom has no viewport)
- Mock `$.fn.animate` to fire `complete` synchronously for navigation tests
- Clean up with `destroy()` in `afterEach`

### Running a Specific Test File

```bash
npx jest tests/unit/navigation.test.js
npx playwright test tests/e2e/scroll.spec.js --project=chromium
```

## How to Contribute

### Reporting Bugs

Before reporting, check the existing
[Issues](https://github.com/vineethkrishnan/jquery.verticalScroll.js/issues).

Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and jQuery version
- A minimal reproduction (CodePen / JSFiddle preferred)

### Suggesting Features

Open an issue with the `enhancement` label. Describe the use case, not just the solution.

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes in `src/` (SCSS and/or JS)
4. Run the build: `npm run build`
5. Run tests: `npm test`
6. Add tests for new functionality
7. Commit with a clear message (see below)
8. Push and open a Pull Request

### Code Style

- **SCSS**: Follow [Sass Guidelines](https://sass-guidelin.es/), 4 spaces, hyphenated names
- **JavaScript**: 4 spaces, single quotes, JSDoc on public methods
- **Tests**: Descriptive test names, one assertion per test where practical
- Maintain backward compatibility with jQuery >= 1.9.1

### Commit Message Format

```
type: brief description

Optional body explaining what and why.
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`, `ci`

Examples:
```
feat: add radar pagination animation
fix: pagination dots disappear on scroll
docs: update CONTRIBUTING with SCSS workflow
test: add unit tests for setOptions animation switching
```

## Deployment

Deployments are automated via GitHub Actions on push to `master`:

- **npm**: Published via `release-please` + `npm publish`
- **Docs site**: Deployed to Cloudflare Pages (`jquery-vertical-scroll-docs.vineethnk.in`)
- **Demo site**: Deployed to Cloudflare Pages (`jquery-vertical-scroll.vineethnk.in`)

### Required Secrets (for maintainers)

| Secret | Purpose |
|--------|---------|
| `APP_ID` | GitHub App ID for release-please |
| `APP_PRIVATE_KEY` | GitHub App private key |
| `NPM_TOKEN` | npm publishing token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

## Questions or Support

Open an issue or contact the maintainer at mail@vineethkrishnan.in

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
