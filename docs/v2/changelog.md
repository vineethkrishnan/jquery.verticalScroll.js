# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- Package renamed to `@vineethnkrishnan/jquery.verticalscroll` (scoped package).
- Updated package.json with proper npm publishing configuration.
- Updated README with scoped package installation instructions.

### Added
- Added `.npmignore` for cleaner npm package.
- Added CODE_OF_CONDUCT.md (Contributor Covenant).
- Added CONTRIBUTING.md with development guidelines.
- Added `peerDependencies` for jQuery >=1.9.1.
- Added `publishConfig` for public npm access.
- Added CDN support fields (unpkg, jsdelivr).

### Fixed
- Fixed `main` entry point (was pointing to non-existent index.js).
- Fixed license field (ISC to MIT to match LICENSE file).
- Rebuilt outdated dist files.

---

## [2.0.0] - 2024-12-15

### Added
- **Mouse wheel navigation** with configurable threshold.
- **Keyboard navigation** support (Arrow keys, Page Up/Down, Home/End).
- **Touch/swipe navigation** for mobile devices.
- **Multiple themes**: Default, Light, Dark, and Minimal.
- **CSS Custom Properties** for easy theming.
- **Auto-scroll functionality** with pause on hover.
- **Loop option** to cycle through sections infinitely.
- **Comprehensive callbacks**: onInit, onDestroy, onBeforeScroll, onAfterScroll, onSectionChange, onResize.
- **jQuery events** for all callbacks (e.g., `verticalscroll:afterscroll`).
- **Promise-based navigation** methods.
- **Public API methods**:
  - `scrollToSection(index)` -- Navigate to specific section.
  - `scrollToId(id)` -- Navigate by section ID.
  - `next()` / `prev()` -- Navigate to adjacent sections.
  - `getCurrentIndex()` -- Get current section index.
  - `getCurrentSection()` -- Get current section jQuery element.
  - `getSections()` -- Get all section elements.
  - `getSectionCount()` -- Get total number of sections.
  - `enable()` / `disable()` -- Control plugin state.
  - `refresh()` -- Recalculate positions.
  - `setOptions(options)` -- Update options dynamically.
  - `destroy()` -- Clean up and remove plugin.
- **Accessibility features**:
  - ARIA labels and roles.
  - Focus management.
  - Keyboard navigation.
  - Support for `prefers-reduced-motion`.
  - Support for `prefers-contrast`.
- **Responsive design** with configurable mobile breakpoint.
- **Pagination tooltips** with section labels.
- **Instance management** -- Multiple instances on same page.
- **Debounced event handlers** for better performance.
- **Source maps** for development debugging.

### Changed
- **BREAKING**: Default selector changed from `div` to `section`.
- **BREAKING**: Option `paginate` renamed to `pagination`.
- **BREAKING**: Pagination HTML structure completely redesigned.
- **BREAKING**: CSS class prefix changed to consistent naming.
- Rewrote entire codebase with modern JavaScript patterns.
- Improved animation performance using jQuery's animation queue.
- Better position calculation algorithm.
- Enhanced CSS with CSS Custom Properties.
- Updated Grunt build process with better minification.
- Improved documentation with comprehensive examples.

### Removed
- Removed `setInterval` polling for visibility detection.
- Removed `console.log` statements from production code.
- Removed global event binding (now instance-scoped).

### Fixed
- Fixed multiple instance conflicts.
- Fixed event handler memory leaks.
- Fixed position calculation on dynamic content.
- Fixed animation interruption issues.
- Fixed accessibility issues with pagination.

### Security
- No external dependencies except jQuery.
- Safe DOM manipulation practices.

---

## [1.1.0] - 2016

### Added
- Initial pagination support.
- Basic scroll animation.

### Changed
- Minor bug fixes.

---

## [1.0.0] - 2016

### Added
- Initial release.
- Basic vertical scrolling functionality.
- Pagination dots navigation.

---

[Unreleased]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/releases/tag/v1.0.0
