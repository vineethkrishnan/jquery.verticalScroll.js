# jQuery Vertical Scroll

[![npm version](https://img.shields.io/npm/v/@vineethnkrishnan/jquery.verticalscroll.svg)](https://www.npmjs.com/package/@vineethnkrishnan/jquery.verticalscroll)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![jQuery](https://img.shields.io/badge/jQuery-%3E%3D1.9.1-blue.svg)](https://jquery.com/)

A lightweight, customizable jQuery plugin for creating smooth full-page vertical scrolling experiences. Perfect for single-page applications, landing pages, and presentation-style websites.

## ✨ Features

- 🖱️ **Mouse wheel navigation** - Smooth section-by-section scrolling
- ⌨️ **Keyboard support** - Arrow keys, Page Up/Down, Home/End
- 📱 **Touch gestures** - Swipe up/down for mobile devices
- 🎯 **Pagination dots** - Visual navigation with tooltips
- 🎨 **Multiple themes** - Default, Light, Dark, and Minimal
- ♿ **Accessibility** - Full ARIA support and keyboard navigation
- 🔄 **Auto-scroll** - Optional automatic section cycling
- ⚡ **Lightweight** - No dependencies except jQuery
- 🛠️ **Highly configurable** - 25+ options for customization
- 📐 **Responsive** - Mobile breakpoint support

## 📦 Installation

### NPM

```bash
npm install @vineethnkrishnan/jquery.verticalscroll
```

### Yarn

```bash
yarn add @vineethnkrishnan/jquery.verticalscroll
```

### CDN (jsDelivr)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@2/dist/css/jquery.verticalscroll.min.css">

<!-- JavaScript (after jQuery) -->
<script src="https://cdn.jsdelivr.net/npm/@vineethnkrishnan/jquery.verticalscroll@2/dist/js/jquery.verticalscroll.min.js"></script>
```

### CDN (unpkg)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll@2/dist/css/jquery.verticalscroll.min.css">

<!-- JavaScript (after jQuery) -->
<script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll@2/dist/js/jquery.verticalscroll.min.js"></script>
```

### Manual Download

Download the latest release from the [releases page](https://github.com/vineethkrishnan/jquery.verticalScroll.js/releases) and include the files in your project.

## 🚀 Quick Start

### HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="dist/css/jquery.verticalscroll.min.css">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
        }
        #page {
            height: 100vh;
        }
        section {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div id="page">
        <section data-vs-label="Home">
            <h1>Welcome</h1>
        </section>
        <section data-vs-label="About">
            <h1>About Us</h1>
        </section>
        <section data-vs-label="Services">
            <h1>Our Services</h1>
        </section>
        <section data-vs-label="Contact">
            <h1>Contact Us</h1>
        </section>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="dist/js/jquery.verticalscroll.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#page').verticalScroll();
        });
    </script>
</body>
</html>
```

## ⚙️ Configuration Options

```javascript
$('#page').verticalScroll({
    // Selectors
    selector: 'section',              // Selector for scrollable sections

    // Navigation
    pagination: true,                 // Show pagination dots
    paginationPosition: 'right',      // Position: 'left' or 'right'
    paginationOffset: 20,             // Offset from edge in pixels

    // Scrolling behavior
    animationDuration: 800,           // Animation duration in ms
    easing: 'swing',                  // jQuery easing function
    scrollThreshold: 50,              // Min scroll delta to trigger
    touchThreshold: 50,               // Min touch delta to trigger

    // Input methods
    mouseWheel: true,                 // Enable mouse wheel navigation
    keyboard: true,                   // Enable keyboard navigation
    touch: true,                      // Enable touch/swipe navigation

    // Behavior
    loop: false,                      // Loop back to first/last section
    autoScroll: false,                // Enable auto-scrolling
    autoScrollInterval: 5000,         // Auto-scroll interval in ms
    pauseOnHover: true,               // Pause auto-scroll on hover

    // Accessibility
    ariaLabels: true,                 // Add ARIA labels
    focusOnSection: true,             // Focus section after navigation

    // Responsive
    responsive: true,                 // Enable responsive behavior
    mobileBreakpoint: 768,            // Disable below this width

    // Theming
    theme: 'default',                 // 'default', 'light', 'dark', 'minimal'

    // Callbacks
    onInit: function(index, $section) {},
    onDestroy: function() {},
    onBeforeScroll: function(targetIndex, $targetSection, currentIndex) {},
    onAfterScroll: function(index, $section, previousIndex) {},
    onSectionChange: function(index, $section, previousIndex) {},
    onResize: function(isEnabled) {}
});
```

## 🎨 Themes

The plugin includes four built-in themes:

```javascript
// Default theme - Dark dots on light backgrounds
$('#page').verticalScroll({ theme: 'default' });

// Light theme - Light dots for dark backgrounds
$('#page').verticalScroll({ theme: 'light' });

// Dark theme - Cyan accent color
$('#page').verticalScroll({ theme: 'dark' });

// Minimal theme - Simple border-only dots
$('#page').verticalScroll({ theme: 'minimal' });
```

### Custom Theming with CSS Variables

```css
:root {
    --vs-dot-color: #ff6b6b;
    --vs-dot-active-color: #ffffff;
    --vs-dot-border-color: #ff6b6b;
    --vs-dot-hover-color: #ee5a5a;
    --vs-tooltip-bg: #ff6b6b;
    --vs-tooltip-color: #ffffff;
    --vs-dot-size: 14px;
    --vs-dot-spacing: 16px;
    --vs-transition-duration: 0.4s;
}
```

## 📖 Methods

### Navigate to Section

```javascript
// By index (0-based)
$('#page').verticalScroll('scrollToSection', 2);

// By ID
$('#page').verticalScroll('scrollToId', 'contact');

// Next/Previous
$('#page').verticalScroll('next');
$('#page').verticalScroll('prev');
```

### Get Information

```javascript
// Get current section index
var index = $('#page').verticalScroll('getCurrentIndex');

// Get current section element
var $section = $('#page').verticalScroll('getCurrentSection');

// Get all sections
var $sections = $('#page').verticalScroll('getSections');

// Get total section count
var count = $('#page').verticalScroll('getSectionCount');
```

### Control Plugin

```javascript
// Enable/Disable
$('#page').verticalScroll('enable');
$('#page').verticalScroll('disable');

// Refresh (recalculate positions)
$('#page').verticalScroll('refresh');

// Update options
$('#page').verticalScroll('setOptions', {
    animationDuration: 1000,
    autoScroll: true
});

// Destroy
$('#page').verticalScroll('destroy');
```

## 🎯 Events

The plugin triggers custom events on the container element:

```javascript
$('#page')
    .on('verticalscroll:init', function(e, index, $section) {
        console.log('Initialized at section', index);
    })
    .on('verticalscroll:beforescroll', function(e, targetIndex, $targetSection, currentIndex) {
        // Return false to cancel scroll
        if (targetIndex === 2 && !userLoggedIn) {
            e.preventDefault();
            return false;
        }
    })
    .on('verticalscroll:afterscroll', function(e, index, $section, previousIndex) {
        console.log('Scrolled to section', index);
    })
    .on('verticalscroll:sectionchange', function(e, index, $section, previousIndex) {
        console.log('Active section changed to', index);
    })
    .on('verticalscroll:resize', function(e, isEnabled) {
        console.log('Plugin is', isEnabled ? 'enabled' : 'disabled');
    })
    .on('verticalscroll:destroy', function() {
        console.log('Plugin destroyed');
    });
```

## ♿ Accessibility

The plugin is built with accessibility in mind:

- **Keyboard Navigation**: Full support for arrow keys, Page Up/Down, Home/End
- **ARIA Labels**: Proper roles and labels for screen readers
- **Focus Management**: Sections receive focus after navigation
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **High Contrast**: Supports `prefers-contrast` media query

### Section Labels

Use `data-vs-label` attribute to provide meaningful labels for screen readers and tooltips:

```html
<section data-vs-label="About Our Company">
    <!-- content -->
</section>
```

## 📱 Responsive Design

The plugin automatically disables on mobile devices by default:

```javascript
$('#page').verticalScroll({
    responsive: true,
    mobileBreakpoint: 768  // Disable below 768px
});
```

When disabled, the container becomes normally scrollable.

## 🔧 Advanced Usage

### Promise-Based Navigation

All navigation methods return jQuery Deferred promises:

```javascript
$('#page').verticalScroll('scrollToSection', 3)
    .done(function() {
        console.log('Navigation complete');
    })
    .fail(function(reason) {
        console.log('Navigation failed:', reason);
    });
```

### Deep Linking

```javascript
// On page load, scroll to hash section
$(document).ready(function() {
    $('#page').verticalScroll({
        onInit: function() {
            if (window.location.hash) {
                $('#page').verticalScroll('scrollToId', window.location.hash);
            }
        },
        onAfterScroll: function(index, $section) {
            // Update URL hash
            var id = $section.attr('id');
            if (id) {
                history.replaceState(null, null, '#' + id);
            }
        }
    });
});
```

### Integration with Analytics

```javascript
$('#page').verticalScroll({
    onSectionChange: function(index, $section) {
        // Track in Google Analytics
        gtag('event', 'section_view', {
            'section_index': index,
            'section_id': $section.attr('id')
        });
    }
});
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (with jQuery 1.x/2.x)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## 👤 Author

**Vineeth Krishnan**

- Website: [vineethkrishnan.in](http://vineethkrishnan.in)
- GitHub: [@vineethkrishnan](https://github.com/vineethkrishnan)
- Twitter: [@way2vineeth](https://twitter.com/way2vineeth)

## ⭐ Support

If you find this plugin helpful, please consider giving it a star on GitHub!

## 🙏 Acknowledgements

- Inspired by fullPage.js and similar full-page scrolling libraries
- Pulse animation originally by [Daniel Eden](http://daneden.me/animate)
