# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0](https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v2.0.0...v2.1.0) (2026-04-02)


### Features

* add themes, animations, tests, docs, SCSS architecture, and CI/CD ([#5](https://github.com/vineethkrishnan/jquery.verticalScroll.js/issues/5)) ([9266b09](https://github.com/vineethkrishnan/jquery.verticalScroll.js/commit/9266b09ad5b8dffc46d8ec026dcb753edef2e684))


### Bug Fixes

* update Gruntfile to use base name for dist file paths ([d786117](https://github.com/vineethkrishnan/jquery.verticalScroll.js/commit/d786117f4f6a23bd60b359fff4d3e38aaabac64b))

## [Unreleased]

### Changed
- Package renamed to `@vineethnkrishnan/jquery.verticalscroll` (scoped package)
- Updated package.json with proper npm publishing configuration
- Updated README with scoped package installation instructions

### Added
- Added `.npmignore` for cleaner npm package
- Added CODE_OF_CONDUCT.md (Contributor Covenant)
- Added CONTRIBUTING.md with development guidelines
- Added `peerDependencies` for jQuery >=1.9.1
- Added `publishConfig` for public npm access
- Added CDN support fields (unpkg, jsdelivr)

### Fixed
- Fixed `main` entry point (was pointing to non-existent index.js)
- Fixed license field (ISC → MIT to match LICENSE file)
- Rebuilt outdated dist files

## [2.0.0] - 2024-12-15

### Added
- **Mouse wheel navigation** with configurable threshold
- **Keyboard navigation** support (Arrow keys, Page Up/Down, Home/End)
- **Touch/swipe navigation** for mobile devices
- **Multiple themes**: Default, Light, Dark, and Minimal
- **CSS Custom Properties** for easy theming
- **Auto-scroll functionality** with pause on hover
- **Loop option** to cycle through sections infinitely
- **Comprehensive callbacks**: onInit, onDestroy, onBeforeScroll, onAfterScroll, onSectionChange, onResize
- **jQuery events** for all callbacks (e.g., `verticalscroll:afterscroll`)
- **Promise-based navigation** methods
- **Public API methods**:
  - `scrollToSection(index)` - Navigate to specific section
  - `scrollToId(id)` - Navigate by section ID
  - `next()` / `prev()` - Navigate to adjacent sections
  - `getCurrentIndex()` - Get current section index
  - `getCurrentSection()` - Get current section jQuery element
  - `getSections()` - Get all section elements
  - `getSectionCount()` - Get total number of sections
  - `enable()` / `disable()` - Control plugin state
  - `refresh()` - Recalculate positions
  - `setOptions(options)` - Update options dynamically
  - `destroy()` - Clean up and remove plugin
- **Accessibility features**:
  - ARIA labels and roles
  - Focus management
  - Keyboard navigation
  - Support for `prefers-reduced-motion`
  - Support for `prefers-contrast`
- **Responsive design** with configurable mobile breakpoint
- **Pagination tooltips** with section labels
- **Instance management** - Multiple instances on same page
- **Debounced event handlers** for better performance
- **Source maps** for development debugging

### Changed
- **BREAKING**: Default selector changed from `div` to `section`
- **BREAKING**: Option `paginate` renamed to `pagination`
- **BREAKING**: Pagination HTML structure completely redesigned
- **BREAKING**: CSS class prefix changed from `.vs-` to consistent naming
- Rewrote entire codebase with modern JavaScript patterns
- Improved animation performance using jQuery's animation queue
- Better position calculation algorithm
- Enhanced CSS with CSS Custom Properties
- Updated Grunt build process with better minification
- Improved documentation with comprehensive examples

### Removed
- Removed `setInterval` polling for visibility detection
- Removed `console.log` statements from production code
- Removed global event binding (now instance-scoped)

### Fixed
- Fixed multiple instance conflicts
- Fixed event handler memory leaks
- Fixed position calculation on dynamic content
- Fixed animation interruption issues
- Fixed accessibility issues with pagination

### Security
- No external dependencies except jQuery
- Safe DOM manipulation practices

## [1.1.0] - 2016-XX-XX

### Added
- Initial pagination support
- Basic scroll animation

### Changed
- Minor bug fixes

## [1.0.0] - 2016-XX-XX

### Added
- Initial release
- Basic vertical scrolling functionality
- Pagination dots navigation

---

## Migration Guide: v1.x to v2.0

### Breaking Changes

#### 1. Option Renamed
```javascript
// Old (v1.x)
$('#page').verticalScroll({
    paginate: true
});

// New (v2.0)
$('#page').verticalScroll({
    pagination: true
});
```

#### 2. Default Selector Changed
```javascript
// Old default selector was 'div'
// New default selector is 'section'

// If you were using divs, explicitly set the selector:
$('#page').verticalScroll({
    selector: 'div'
});
```

#### 3. CSS Class Changes
If you had custom CSS targeting the old classes:

| Old Class | New Class |
|-----------|-----------|
| `.vs-paginate` | `.vs-pagination` |
| `.vs-paginate li` | `.vs-pagination-item` |
| `.vs-paginate li a` | `.vs-pagination-button` |
| `.vs-active` | `.vs-pagination-active` |

#### 4. HTML Structure
The pagination HTML has been redesigned for better accessibility:

```html
<!-- Old -->
<ul class="vs-paginate">
    <li><a href="#" class="vs-active">&nbsp;</a></li>
</ul>

<!-- New -->
<nav class="vs-pagination">
    <ul class="vs-pagination-list">
        <li class="vs-pagination-item">
            <button class="vs-pagination-button vs-pagination-active">
                <span class="vs-pagination-dot"></span>
                <span class="vs-pagination-tooltip">Section Label</span>
            </button>
        </li>
    </ul>
</nav>
```

### New Features to Leverage

After upgrading, you can take advantage of:

1. **Keyboard navigation** - Works out of the box
2. **Touch support** - Mobile-ready immediately
3. **Themes** - Add `theme: 'dark'` for dark mode
4. **Callbacks** - Add event handlers for tracking
5. **Auto-scroll** - Enable with `autoScroll: true`
6. **Section labels** - Add `data-vs-label` to sections

[Unreleased]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vineethkrishnan/jquery.verticalScroll.js/releases/tag/v1.0.0
