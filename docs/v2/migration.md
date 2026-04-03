# Migration Guide: v1.x to v2.0

This guide covers everything you need to know to upgrade from jQuery Vertical Scroll v1.x to v2.0.0.

---

## Breaking Changes

### 1. Default Selector Changed

The default `selector` option changed from `'div'` to `'section'`.

**If your HTML uses `<section>` elements**, no change is needed.

**If your HTML uses `<div>` elements**, explicitly set the selector:

```javascript
// v1.x - divs were the default
$('#page').verticalScroll();

// v2.0 - explicitly use div selector
$('#page').verticalScroll({
  selector: 'div'
});
```

### 2. Option Renamed: `paginate` to `pagination`

```javascript
// v1.x
$('#page').verticalScroll({
  paginate: true
});

// v2.0
$('#page').verticalScroll({
  pagination: true
});
```

### 3. CSS Class Changes

All CSS classes have been renamed for consistency. If you have custom CSS targeting the old classes, update them:

| v1.x Class | v2.0 Class |
|------------|------------|
| `.vs-paginate` | `.vs-pagination` |
| `.vs-paginate li` | `.vs-pagination-item` |
| `.vs-paginate li a` | `.vs-pagination-button` |
| `.vs-active` | `.vs-pagination-active` |

### 4. Pagination HTML Structure

The pagination markup has been completely redesigned for better accessibility. If you have JavaScript or CSS that directly targets the old structure, it will need to be updated.

**v1.x structure:**

```html
<ul class="vs-paginate">
  <li><a href="#" class="vs-active">&nbsp;</a></li>
  <li><a href="#">&nbsp;</a></li>
</ul>
```

**v2.0 structure:**

```html
<nav class="vs-pagination" role="navigation" aria-label="Section navigation">
  <ul class="vs-pagination-list">
    <li class="vs-pagination-item">
      <button class="vs-pagination-button vs-pagination-active"
              data-vs-target="0"
              aria-label="Go to Home"
              aria-current="true">
        <span class="vs-pagination-dot"></span>
        <span class="vs-pagination-tooltip">Home</span>
      </button>
    </li>
    <li class="vs-pagination-item">
      <button class="vs-pagination-button"
              data-vs-target="1"
              aria-label="Go to About">
        <span class="vs-pagination-dot"></span>
        <span class="vs-pagination-tooltip">About</span>
      </button>
    </li>
  </ul>
</nav>
```

Key differences:
- Uses `<nav>` instead of `<ul>` as the root element.
- Uses `<button>` instead of `<a>` for better accessibility.
- Includes ARIA attributes (`role`, `aria-label`, `aria-current`).
- Includes tooltip `<span>` for hover labels.
- Uses `data-vs-target` instead of `href` for navigation.

---

## Upgrade Steps

### Step 1: Update the Plugin Files

Replace the old CSS and JS files with the v2.0 versions:

```html
<!-- Remove old files -->
<!-- <link rel="stylesheet" href="old/jquery.verticalScroll.css"> -->
<!-- <script src="old/jquery.verticalScroll.js"></script> -->

<!-- Add new files -->
<link rel="stylesheet" href="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/css/jquery.verticalscroll.min.css">
<script src="https://unpkg.com/@vineethnkrishnan/jquery.verticalscroll/dist/js/jquery.verticalscroll.min.js"></script>
```

### Step 2: Update Initialization Options

Rename `paginate` to `pagination` in your initialization code:

```javascript
// Before
$('#page').verticalScroll({
  paginate: true
});

// After
$('#page').verticalScroll({
  pagination: true
});
```

### Step 3: Update HTML (if using divs)

Either change your `<div>` elements to `<section>` elements, or set the `selector` option:

**Option A: Update HTML**

```html
<!-- Before -->
<div id="page">
  <div>Section 1</div>
  <div>Section 2</div>
</div>

<!-- After -->
<div id="page">
  <section>Section 1</section>
  <section>Section 2</section>
</div>
```

**Option B: Set selector option**

```javascript
$('#page').verticalScroll({
  selector: 'div'
});
```

### Step 4: Update Custom CSS

Search your CSS for any old class names and replace them:

```css
/* Before */
.vs-paginate { /* ... */ }
.vs-paginate li a { /* ... */ }
.vs-active { /* ... */ }

/* After */
.vs-pagination { /* ... */ }
.vs-pagination-button { /* ... */ }
.vs-pagination-active { /* ... */ }
```

### Step 5: Add Section Labels (Recommended)

Take advantage of the new tooltip and accessibility features by adding `data-vs-label` attributes:

```html
<section data-vs-label="Home">...</section>
<section data-vs-label="About">...</section>
<section data-vs-label="Contact">...</section>
```

### Step 6: Update JavaScript Targeting Pagination

If you had JavaScript that targeted the old pagination structure, update the selectors:

```javascript
// Before
$('.vs-paginate li a').on('click', function() { });

// After - not needed, the plugin handles this internally
// But if you have custom logic:
$('.vs-pagination-button').on('click', function() { });
```

---

## New Features to Adopt

After upgrading, consider adopting these new v2.0 features:

### Keyboard Navigation

Works out of the box with `keyboard: true` (the default). Arrow keys, Page Up/Down, Home, and End are all supported.

### Touch Support

Mobile swipe navigation is enabled by default with `touch: true`.

### Themes

Apply a visual theme to the pagination dots:

```javascript
$('#page').verticalScroll({ theme: 'dark' });
```

### CSS Variables

Customize colors and sizes without editing the source CSS:

```css
:root {
  --vs-dot-color: #ff6b6b;
  --vs-dot-active-color: #ffffff;
  --vs-dot-size: 14px;
}
```

### Callbacks and Events

React to navigation events:

```javascript
$('#page').verticalScroll({
  onSectionChange: function(index, $section) {
    console.log('Now viewing:', $section.attr('data-vs-label'));
  }
});
```

### Auto-Scroll

Create a carousel-style experience:

```javascript
$('#page').verticalScroll({
  autoScroll: true,
  autoScrollInterval: 5000,
  loop: true
});
```

### Public API Methods

Navigate and query programmatically:

```javascript
$('#page').verticalScroll('next');
$('#page').verticalScroll('scrollToId', 'contact');
var index = $('#page').verticalScroll('getCurrentIndex');
```

---

## Removed Features

The following v1.x internals have been removed in v2.0:

- **`setInterval` polling** for visibility detection has been replaced with proper event-driven updates.
- **`console.log` debug statements** have been removed from production code.
- **Global event binding** has been replaced with instance-scoped event namespacing, allowing multiple independent instances on the same page.

---

## Need Help?

If you encounter issues during migration, please [open an issue](https://github.com/vineethkrishnan/jquery.verticalScroll.js/issues) on GitHub with:

- Your v1.x configuration
- The error or unexpected behavior
- Browser and jQuery version
