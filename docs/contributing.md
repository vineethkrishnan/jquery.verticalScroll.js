# Contributing

Contributions to jQuery Vertical Scroll are welcome and appreciated. For the full contributor guide with setup instructions, build commands, and project structure, see [CONTRIBUTING.md](https://github.com/vineethkrishnan/jquery.verticalScroll.js/blob/master/CONTRIBUTING.md) in the repository root.

---

## Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/<your-username>/jquery.verticalScroll.js.git
cd jquery.verticalScroll.js

# Install dependencies
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
└── js/                      # Plugin JavaScript source (UMD)

tests/
├── unit/                    # Jest + jsdom (152 tests)
├── e2e/                     # Playwright browser tests
└── visual/                  # Screenshot regression tests
```

> **Important:** Never edit `src/css/jquery.verticalScroll.css` directly. It is auto-generated from the SCSS source. Always edit files in `src/scss/`.

## Build Pipeline

```
SCSS → Sass → CSS → Autoprefixer → CSSMin → dist/
                              JS → UglifyJS → dist/
```

| Command | Description |
|---------|-------------|
| `npm run build` | Full build (SCSS + autoprefix + minify) |
| `npm run build:scss` | SCSS compilation only |
| `npm test` | Unit tests |
| `npm run test:e2e` | E2E browser tests |
| `npm run docs:serve` | Local docs site on port 3000 |

## SCSS Architecture

This project follows the [Sass Guidelines](https://sass-guidelin.es/) 7-1 pattern:

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

| Type | Framework | Command |
|------|-----------|---------|
| Unit | Jest + jsdom | `npm test` |
| E2E | Playwright (3 browsers) | `npm run test:e2e` |
| Visual | Playwright screenshots | `npm run test:visual` |

## Pull Request Checklist

- [ ] Changes are in `src/scss/` or `src/js/` (not compiled files)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (152 tests)
- [ ] New features have tests
- [ ] Commit message follows conventional format (`feat:`, `fix:`, etc.)

## Commit Messages

```
type: brief description
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`, `ci`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
