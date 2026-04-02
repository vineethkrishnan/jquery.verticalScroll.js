# Options Reference

All configuration options for jQuery Vertical Scroll. Pass these as an object when initializing the plugin.

```javascript
$('#page').verticalScroll({
  // your options here
});
```

---

## Complete Options Table

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | `string` | `'section'` | CSS selector for scrollable section elements within the container. |
| `pagination` | `boolean` | `true` | Show pagination dot navigation. |
| `paginationPosition` | `string` | `'right'` | Position of pagination dots: `'left'` or `'right'`. |
| `paginationOffset` | `number` | `20` | Distance in pixels from the edge of the container. |
| `animationDuration` | `number` | `800` | Duration of the scroll animation in milliseconds. |
| `easing` | `string` | `'swing'` | jQuery easing function name. Use `'linear'` for constant speed or include jQuery UI for additional easing options. |
| `scrollThreshold` | `number` | `50` | Minimum mouse wheel delta (in pixels) required to trigger a section change. Increase to reduce sensitivity. |
| `touchThreshold` | `number` | `50` | Minimum touch/swipe delta (in pixels) required to trigger a section change. |
| `mouseWheel` | `boolean` | `true` | Enable mouse wheel navigation. |
| `keyboard` | `boolean` | `true` | Enable keyboard navigation (Arrow Up/Down, Page Up/Down, Home, End). |
| `touch` | `boolean` | `true` | Enable touch/swipe navigation for mobile and tablet devices. |
| `loop` | `boolean` | `false` | When `true`, navigating past the last section wraps to the first, and vice versa. |
| `autoScroll` | `boolean` | `false` | Automatically advance to the next section at a fixed interval. |
| `autoScrollInterval` | `number` | `5000` | Time in milliseconds between auto-scroll transitions. |
| `pauseOnHover` | `boolean` | `true` | Pause auto-scrolling when the user hovers over the container. |
| `ariaLabels` | `boolean` | `true` | Add ARIA `role` and `aria-label` attributes for accessibility. |
| `focusOnSection` | `boolean` | `true` | Move focus to the target section after navigation for screen reader users. |
| `responsive` | `boolean` | `true` | Enable responsive behavior (disable plugin below `mobileBreakpoint`). |
| `mobileBreakpoint` | `number` | `768` | Viewport width in pixels below which the plugin disables itself. Only applies when `responsive` is `true`. |
| `theme` | `string` | `'default'` | Built-in theme name: `'default'`, `'light'`, `'dark'`, or `'minimal'`. |
| `onInit` | `function\|null` | `null` | Callback fired after the plugin initializes. |
| `onDestroy` | `function\|null` | `null` | Callback fired after the plugin is destroyed. |
| `onBeforeScroll` | `function\|null` | `null` | Callback fired before a scroll begins. Return `false` to cancel. |
| `onAfterScroll` | `function\|null` | `null` | Callback fired after scroll animation completes. |
| `onSectionChange` | `function\|null` | `null` | Callback fired when the active section changes. |
| `onResize` | `function\|null` | `null` | Callback fired on window resize. |

---

## Option Details

### Selector Options

```javascript
$('#page').verticalScroll({
  selector: 'section'   // Default: looks for <section> elements
});

// Use a custom selector
$('#page').verticalScroll({
  selector: '.slide'    // Look for elements with class "slide"
});

// Use divs (common when migrating from v1.x)
$('#page').verticalScroll({
  selector: 'div'
});
```

### Pagination Options

```javascript
$('#page').verticalScroll({
  pagination: true,            // Show dots
  paginationPosition: 'right', // 'left' or 'right'
  paginationOffset: 20         // 20px from the edge
});

// Left-side pagination with more spacing
$('#page').verticalScroll({
  pagination: true,
  paginationPosition: 'left',
  paginationOffset: 30
});

// No pagination
$('#page').verticalScroll({
  pagination: false
});
```

> Pagination labels are sourced from the `data-vs-label` attribute on each section element. If not set, `data-title` is used as a fallback, then `"Section N"`.

### Scroll Behavior Options

```javascript
$('#page').verticalScroll({
  animationDuration: 800,  // Slower, smoother scroll
  easing: 'swing',         // jQuery built-in easing
  scrollThreshold: 50,     // Mouse wheel sensitivity
  touchThreshold: 50       // Touch swipe sensitivity
});

// Fast, snappy transitions
$('#page').verticalScroll({
  animationDuration: 400,
  scrollThreshold: 30
});

// Instant (no animation)
$('#page').verticalScroll({
  animationDuration: 0
});
```

> **Tip:** If you include jQuery UI or a jQuery easing plugin, you can use additional easing functions like `'easeInOutCubic'`, `'easeOutBounce'`, etc.

### Input Method Options

```javascript
// Enable all input methods (default)
$('#page').verticalScroll({
  mouseWheel: true,
  keyboard: true,
  touch: true
});

// Keyboard and touch only (disable mouse wheel)
$('#page').verticalScroll({
  mouseWheel: false,
  keyboard: true,
  touch: true
});

// Mouse wheel only
$('#page').verticalScroll({
  mouseWheel: true,
  keyboard: false,
  touch: false
});
```

### Loop and Auto-Scroll Options

```javascript
// Enable infinite looping
$('#page').verticalScroll({
  loop: true
});

// Auto-scroll with looping
$('#page').verticalScroll({
  autoScroll: true,
  autoScrollInterval: 5000,  // 5 seconds between sections
  pauseOnHover: true,        // Pause when user hovers
  loop: true                 // Loop back to start
});

// Faster auto-scroll without pause
$('#page').verticalScroll({
  autoScroll: true,
  autoScrollInterval: 3000,
  pauseOnHover: false,
  loop: true
});
```

> When `autoScroll` is `true` and `loop` is `false`, auto-scrolling stops when the last section is reached.

### Accessibility Options

```javascript
$('#page').verticalScroll({
  ariaLabels: true,      // Add ARIA attributes
  focusOnSection: true   // Move focus after navigation
});

// Disable focus management (not recommended)
$('#page').verticalScroll({
  focusOnSection: false
});
```

### Responsive Options

```javascript
$('#page').verticalScroll({
  responsive: true,
  mobileBreakpoint: 768   // Disable below 768px
});

// Disable at a larger breakpoint (tablet)
$('#page').verticalScroll({
  responsive: true,
  mobileBreakpoint: 1024
});

// Always enabled (never disable on mobile)
$('#page').verticalScroll({
  responsive: false
});
```

> When the plugin is disabled on smaller viewports, the container reverts to normal browser scrolling and the pagination dots are hidden.

### Theme Options

```javascript
// Default theme - dark dots on light backgrounds
$('#page').verticalScroll({ theme: 'default' });

// Light theme - light dots for dark backgrounds
$('#page').verticalScroll({ theme: 'light' });

// Dark theme - cyan accent color
$('#page').verticalScroll({ theme: 'dark' });

// Minimal theme - simple border-only dots
$('#page').verticalScroll({ theme: 'minimal' });
```

> See the [Themes](configuration/themes.md) page for visual previews and the [CSS Variables](configuration/css-variables.md) page for full customization.

### Callback Options

```javascript
$('#page').verticalScroll({
  onInit: function(index, $section) {
    console.log('Plugin initialized at section', index);
  },
  onDestroy: function() {
    console.log('Plugin destroyed');
  },
  onBeforeScroll: function(targetIndex, $targetSection, currentIndex) {
    // Return false to cancel the scroll
    if (targetIndex === 2 && !isUnlocked) {
      alert('Complete the previous section first.');
      return false;
    }
  },
  onAfterScroll: function(index, $section, previousIndex) {
    console.log('Scrolled from section', previousIndex, 'to section', index);
  },
  onSectionChange: function(index, $section, previousIndex) {
    console.log('Active section is now:', $section.attr('data-vs-label'));
  },
  onResize: function(isEnabled) {
    console.log('Plugin is', isEnabled ? 'enabled' : 'disabled');
  }
});
```

> See the [Events & Callbacks](api/events.md) page for detailed signatures and jQuery event equivalents.

---

## Interactions Between Options

A few options interact with each other in important ways:

| Combination | Behavior |
|-------------|----------|
| `autoScroll: true` + `loop: false` | Auto-scrolling stops when the last section is reached. |
| `autoScroll: true` + `loop: true` | Auto-scrolling wraps from the last section back to the first. |
| `autoScroll: true` + `pauseOnHover: true` | Auto-scrolling pauses while the cursor is over the container. |
| `responsive: true` + `mobileBreakpoint: 768` | Plugin is disabled (normal scroll) when viewport is narrower than 768px. |
| `responsive: false` | `mobileBreakpoint` is ignored; plugin is always active. |
| `pagination: false` | `paginationPosition` and `paginationOffset` have no effect. |
| `animationDuration: 0` | Scroll happens instantly; `easing` has no visible effect. |
